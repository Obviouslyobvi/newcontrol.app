import Link from "next/link";
import { and, eq, ne, desc } from "drizzle-orm";
import { PenLine } from "lucide-react";
import type { Metadata } from "next";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import type { Campaign } from "@/lib/db/schema";
import CampaignCard from "../components/CampaignCard";

export const metadata: Metadata = { title: "Campaigns — NewControl" };
export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const session = await requirePageSession();

  let campaigns: Campaign[] = [];
  let dbReady = isDatabaseConfigured();
  if (dbReady) {
    try {
      const db = getDb();
      campaigns = await db
        .select()
        .from(schema.campaigns)
        .where(
          and(
            eq(schema.campaigns.orgId, session.orgId),
            ne(schema.campaigns.status, "archived")
          )
        )
        .orderBy(desc(schema.campaigns.createdAt))
        .limit(50);
    } catch {
      dbReady = false;
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Campaigns</h1>
          <p className="text-fg/55 mt-1">
            Every letter, postcard, and email you&apos;ve written.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 bg-fg text-bg px-6 py-3 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
        >
          <PenLine className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {!dbReady ? (
        <div className="border border-dashed border-fg/20 rounded-3xl p-12 text-center">
          <h2 className="font-serif text-2xl tracking-tight mb-3">
            Database not connected yet
          </h2>
          <p className="text-fg/55 max-w-md mx-auto">
            Add <code className="text-ember">DATABASE_URL</code> to your
            environment to start saving campaigns. SETUP.md in the repo walks
            through it step by step.
          </p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="border border-dashed border-fg/20 rounded-3xl p-12 text-center">
          <div className="inline-flex h-14 w-14 rounded-full bg-ember/10 text-ember items-center justify-center mb-5">
            <PenLine className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl tracking-tight mb-3">
            Write your first campaign
          </h2>
          <p className="text-fg/55 max-w-md mx-auto mb-7">
            Answer a few questions about your offer and audience, and
            NewControl will write five complete variations using the 22-step
            Letter Perfect framework.
          </p>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-2 bg-fg text-bg px-7 py-3.5 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
          >
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}
