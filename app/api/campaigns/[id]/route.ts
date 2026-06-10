import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { getOwnedCampaign } from "@/lib/db/queries";
import { updateCampaignSchema } from "@/lib/utils/validation";
import { errorResponse } from "@/lib/utils/errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    const campaign = await getOwnedCampaign(session, id);

    const db = getDb();
    const variations = await db
      .select()
      .from(schema.campaignVariations)
      .where(eq(schema.campaignVariations.campaignId, campaign.id))
      .orderBy(asc(schema.campaignVariations.variationNumber));

    return NextResponse.json({ campaign, variations });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    await getOwnedCampaign(session, id);
    const input = updateCampaignSchema.parse(await req.json());

    const db = getDb();
    const [campaign] = await db
      .update(schema.campaigns)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(schema.campaigns.id, id))
      .returning();

    return NextResponse.json({ campaign });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    await getOwnedCampaign(session, id);

    const db = getDb();
    await db
      .update(schema.campaigns)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(schema.campaigns.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
