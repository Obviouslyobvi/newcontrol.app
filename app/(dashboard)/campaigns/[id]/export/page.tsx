import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, schema } from "@/lib/db";
import { getOwnedCampaign } from "@/lib/db/queries";
import ExportPanel from "../../../components/ExportPanel";

export const metadata: Metadata = { title: "Export — NewControl" };
export const dynamic = "force-dynamic";

export default async function ExportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variation?: string }>;
}) {
  const session = await requirePageSession();
  const { id } = await params;
  const { variation } = await searchParams;

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

  return (
    <ExportPanel
      campaign={campaign}
      variations={variations}
      initialVariationId={variation}
    />
  );
}
