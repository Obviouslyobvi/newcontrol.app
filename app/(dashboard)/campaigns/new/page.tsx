import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import type { Template, BrandProfile } from "@/lib/db/schema";
import CampaignWizard from "../../components/CampaignWizard";

export const metadata: Metadata = { title: "New campaign — NewControl" };
export const dynamic = "force-dynamic";

export default async function NewCampaignPage() {
  const session = await requirePageSession();

  let templates: Template[] = [];
  let brandProfiles: BrandProfile[] = [];

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      [templates, brandProfiles] = await Promise.all([
        db
          .select()
          .from(schema.templates)
          .where(eq(schema.templates.isPublic, true))
          .orderBy(desc(schema.templates.usageCount)),
        db
          .select()
          .from(schema.brandProfiles)
          .where(eq(schema.brandProfiles.orgId, session.orgId)),
      ]);
    } catch {
      // Wizard still works without templates or profiles.
    }
  }

  return (
    <CampaignWizard templates={templates} brandProfiles={brandProfiles} />
  );
}
