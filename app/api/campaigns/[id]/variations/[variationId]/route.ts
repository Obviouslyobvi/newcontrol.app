import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import type { VariationContent } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/middleware";
import { getOwnedCampaign } from "@/lib/db/queries";
import { errors, errorResponse } from "@/lib/utils/errors";

type Params = { params: Promise<{ id: string; variationId: string }> };

const contentSchema = z.object({
  envelopeTeaser: z.string().nullable(),
  johnsonBox: z.string().nullable(),
  headline: z.string(),
  opening: z.string(),
  body: z.string(),
  cta: z.string(),
  guarantee: z.string().nullable(),
  ps: z.array(z.string()),
  responseCard: z.string().nullable(),
  fullText: z.string(),
});

const updateSchema = z.object({
  editedContent: contentSchema.optional(),
  isSelected: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id, variationId } = await params;
    const campaign = await getOwnedCampaign(session, id);
    const input = updateSchema.parse(await req.json());

    const db = getDb();
    const [existing] = await db
      .select()
      .from(schema.campaignVariations)
      .where(
        and(
          eq(schema.campaignVariations.id, variationId),
          eq(schema.campaignVariations.campaignId, campaign.id)
        )
      );
    if (!existing) throw errors.notFound("Variation not found");

    const updates: Partial<typeof schema.campaignVariations.$inferInsert> = {};
    if (input.editedContent) {
      updates.editedContent = input.editedContent as VariationContent;
      updates.isEdited = true;
    }
    if (typeof input.isSelected === "boolean") {
      if (input.isSelected) {
        await db
          .update(schema.campaignVariations)
          .set({ isSelected: false })
          .where(eq(schema.campaignVariations.campaignId, campaign.id));
      }
      updates.isSelected = input.isSelected;
    }

    const [variation] = await db
      .update(schema.campaignVariations)
      .set(updates)
      .where(eq(schema.campaignVariations.id, variationId))
      .returning();

    return NextResponse.json({ variation });
  } catch (err) {
    return errorResponse(err);
  }
}
