import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import type { BrandProfile } from "@/lib/db/schema";
import BrandProfileList from "../components/BrandProfileList";

export const metadata: Metadata = { title: "Brand voice — NewControl" };
export const dynamic = "force-dynamic";

export default async function BrandPage() {
  const session = await requirePageSession();

  let profiles: BrandProfile[] = [];
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      profiles = await db
        .select()
        .from(schema.brandProfiles)
        .where(eq(schema.brandProfiles.orgId, session.orgId))
        .orderBy(desc(schema.brandProfiles.isDefault), desc(schema.brandProfiles.createdAt));
    } catch {
      // Empty state covers it.
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <BrandProfileList profiles={profiles} />
    </div>
  );
}
