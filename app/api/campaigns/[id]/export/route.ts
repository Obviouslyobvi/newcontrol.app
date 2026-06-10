import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { getOwnedCampaign } from "@/lib/db/queries";
import { exportSchema } from "@/lib/utils/validation";
import { errors, errorResponse } from "@/lib/utils/errors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import { generatePdf } from "@/lib/pdf/generator";
import { generateDocx, generateTxt } from "@/lib/pdf/docx-generator";
import { uploadFile } from "@/lib/storage/s3";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const CONTENT_TYPES: Record<string, string> = {
  pdf_print: "application/pdf",
  pdf_digital: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain; charset=utf-8",
};

const EXTENSIONS: Record<string, string> = {
  pdf_print: "print.pdf",
  pdf_digital: "pdf",
  docx: "docx",
  txt: "txt",
};

/**
 * Generates the file and streams it back as a download. When R2/S3 is
 * configured the file is also stored and the URL recorded.
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    const campaign = await getOwnedCampaign(session, id);

    const rl = checkRateLimit(
      `export:${session.orgId}`,
      RATE_LIMITS.export.limit,
      RATE_LIMITS.export.windowMs
    );
    if (!rl.allowed) throw errors.rateLimited("Export limit reached for this hour.");

    const { variationId, format } = exportSchema.parse(await req.json());

    const db = getDb();
    const [variation] = await db
      .select()
      .from(schema.campaignVariations)
      .where(
        and(
          eq(schema.campaignVariations.id, variationId),
          eq(schema.campaignVariations.campaignId, campaign.id)
        )
      );
    if (!variation) throw errors.notFound("Variation not found");

    const content = variation.editedContent ?? variation.content;

    let file: Buffer;
    if (format === "pdf_print" || format === "pdf_digital") {
      file = await generatePdf(campaign.campaignType, content, format);
    } else if (format === "docx") {
      file = await generateDocx(content);
    } else {
      file = generateTxt(content);
    }

    const slug = campaign.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);
    const filename = `${slug || "campaign"}-v${variation.variationNumber}.${EXTENSIONS[format]}`;
    const storageKey = `exports/${campaign.orgId}/${campaign.id}/${Date.now()}-${filename}`;

    const fileUrl = await uploadFile(storageKey, file, CONTENT_TYPES[format]);

    await db.insert(schema.campaignExports).values({
      campaignId: campaign.id,
      variationId: variation.id,
      exportedById: session.userId,
      exportType: format,
      fileUrl,
      fileSizeBytes: file.length,
    });

    if (campaign.status === "completed") {
      await db
        .update(schema.campaigns)
        .set({ status: "exported", updatedAt: new Date() })
        .where(eq(schema.campaigns.id, campaign.id));
    }

    await db.insert(schema.usageLog).values({
      orgId: campaign.orgId,
      userId: session.userId,
      action: "export",
      campaignId: campaign.id,
    });

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": CONTENT_TYPES[format],
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(file.length),
        ...(fileUrl ? { "X-File-Url": fileUrl } : {}),
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
