import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { errors } from "@/lib/utils/errors";
import type { SessionPayload } from "@/lib/auth/session";

/** Fetch a campaign scoped to the session's org, or throw 404. */
export async function getOwnedCampaign(session: SessionPayload, id: string) {
  const db = getDb();
  const [campaign] = await db
    .select()
    .from(schema.campaigns)
    .where(
      and(eq(schema.campaigns.id, id), eq(schema.campaigns.orgId, session.orgId))
    );
  if (!campaign) throw errors.notFound("Campaign not found");
  return campaign;
}

/** Fetch a brand profile scoped to the session's org, or null. */
export async function getOwnedBrandProfile(
  session: SessionPayload,
  id: string
) {
  const db = getDb();
  const [profile] = await db
    .select()
    .from(schema.brandProfiles)
    .where(
      and(
        eq(schema.brandProfiles.id, id),
        eq(schema.brandProfiles.orgId, session.orgId)
      )
    );
  return profile ?? null;
}
