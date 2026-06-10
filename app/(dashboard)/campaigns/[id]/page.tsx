import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, schema } from "@/lib/db";
import { getOwnedCampaign } from "@/lib/db/queries";
import CampaignDetail from "../../components/CampaignDetail";

export const metadata: Metadata = { title: "Campaign — NewControl" };
export const dynamic = "force-dynamic";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requirePageSession();
  const { id } = await params;

  let campaign;
  try {
    campaign = await getOwnedCampaign(session, id);
  } catch {
    notFound();
  }

  const db = getDb();
  const variations = await db
    .select()
    .from(schema.campaignVariations)
    .where(eq(schema.campaignVariations.campaignId, campaign.id))
    .orderBy(asc(schema.campaignVariations.variationNumber));

  return <CampaignDetail campaign={campaign} initialVariations={variations} />;
}
