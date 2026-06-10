import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { and, eq, asc } from "drizzle-orm";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, schema } from "@/lib/db";
import { getOwnedCampaign } from "@/lib/db/queries";
import Editor from "../../../components/Editor";

export const metadata: Metadata = { title: "Edit — NewControl" };
export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variation?: string }>;
}) {
  const session = await requirePageSession();
  const { id } = await params;
  const { variation: variationId } = await searchParams;

  let campaign;
  try {
    campaign = await getOwnedCampaign(session, id);
  } catch {
    notFound();
  }

  const db = getDb();
  let variation;
  if (variationId) {
    [variation] = await db
      .select()
      .from(schema.campaignVariations)
      .where(
        and(
          eq(schema.campaignVariations.id, variationId),
          eq(schema.campaignVariations.campaignId, campaign.id)
        )
      );
  } else {
    [variation] = await db
      .select()
      .from(schema.campaignVariations)
      .where(eq(schema.campaignVariations.campaignId, campaign.id))
      .orderBy(asc(schema.campaignVariations.variationNumber))
      .limit(1);
  }

  if (!variation) redirect(`/campaigns/${campaign.id}`);

  return <Editor campaign={campaign} variation={variation} />;
}
