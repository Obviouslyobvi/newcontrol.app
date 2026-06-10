import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { CreditCard, Users, ChevronRight } from "lucide-react";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Settings — NewControl" };
export const dynamic = "force-dynamic";

const PLAN_LABELS: Record<string, string> = {
  free_trial: "Free Trial",
  solo: "Solo",
  professional: "Professional",
  agency: "Agency",
  enterprise: "Enterprise",
};

export default async function SettingsPage() {
  const session = await requirePageSession();

  let email = "";
  let name: string | null = null;
  let orgName = "";
  let trialEndsAt: Date | null = null;

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, session.userId));
      const [org] = await db.select().from(schema.organizations).where(eq(schema.organizations.id, session.orgId));
      if (user) {
        email = user.email;
        name = user.name;
        trialEndsAt = user.trialEndsAt;
      }
      if (org) orgName = org.name;
    } catch {
      // Render with what we have.
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-4xl tracking-tight mb-8">Settings</h1>

      <Card className="p-6 mb-4">
        <h2 className="font-serif text-xl tracking-tight mb-4">Account</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg/50">Name</dt>
            <dd>{name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg/50">Email</dt>
            <dd>{email || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg/50">Workspace</dt>
            <dd>{orgName || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <dt className="text-fg/50">Plan</dt>
            <dd className="flex items-center gap-2">
              <Badge variant="ember">{PLAN_LABELS[session.planTier] ?? session.planTier}</Badge>
              {trialEndsAt && session.planTier === "free_trial" && (
                <span className="text-xs text-fg/45">
                  trial ends {trialEndsAt.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      <Link href="/settings/billing" className="block group mb-4">
        <Card className="p-6 flex items-center justify-between group-hover:border-fg/25 transition-colors">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-10 w-10 rounded-full bg-fg/8 text-fg/60 items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Billing & subscription</div>
              <div className="text-sm text-fg/55">Manage your plan</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-fg/40" />
        </Card>
      </Link>

      <Link href="/settings/team" className="block group">
        <Card className="p-6 flex items-center justify-between group-hover:border-fg/25 transition-colors">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-10 w-10 rounded-full bg-fg/8 text-fg/60 items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Team</div>
              <div className="text-sm text-fg/55">People in your workspace</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-fg/40" />
        </Card>
      </Link>
    </div>
  );
}
