import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { requirePageSession } from "@/lib/auth/get-session";
import { PLANS, type PlanId } from "@/lib/payments";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Billing — NewControl" };
export const dynamic = "force-dynamic";

const PLAN_FEATURES: Record<PlanId, string[]> = {
  solo: ["Unlimited campaigns & exports", "1 brand profile", "1 team member", "PDF output", "Email support"],
  professional: ["Unlimited campaigns & exports", "3 brand profiles", "3 team members", "PDF + DOCX output", "Advanced voice training", "Priority support"],
  agency: ["Unlimited campaigns & exports", "10 brand profiles", "10 team members", "All output formats", "Advanced voice training", "Dedicated support"],
  enterprise: ["Unlimited everything", "Unlimited brand profiles & team", "Custom templates", "Custom onboarding", "Dedicated account manager"],
};

export default async function BillingPage() {
  const session = await requirePageSession();
  const onTrial = session.planTier === "free_trial";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-fg/55 hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Settings
      </Link>

      <h1 className="font-serif text-4xl tracking-tight mb-2">Billing</h1>
      <p className="text-fg/55 mb-8">
        {onTrial
          ? "You're on the free trial with Professional-level access. Pick a plan to continue after it ends."
          : "Your subscription."}
      </p>

      <div className="border border-ember/30 bg-ember/5 rounded-2xl p-5 mb-8 text-sm leading-relaxed">
        Online checkout isn&apos;t connected yet. When it goes live you&apos;ll be able
        to subscribe right here — your campaigns and settings carry over
        unchanged, and nothing you&apos;ve created is ever locked away.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(PLANS) as PlanId[]).map((planId) => {
          const plan = PLANS[planId];
          const highlight = planId === "professional";
          return (
            <Card
              key={planId}
              className={`p-5 flex flex-col ${highlight ? "border-ember ring-2 ring-ember/20" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{plan.name}</h3>
                {highlight && <Badge variant="ember">Popular</Badge>}
              </div>
              <div className="mb-4">
                <span className="font-serif text-3xl tracking-tight">
                  ${plan.priceCents / 100}
                </span>
                <span className="text-sm text-fg/50">/month</span>
              </div>
              <ul className="space-y-2 text-sm text-fg/70 flex-1">
                {PLAN_FEATURES[planId].map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 text-ember shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                className="mt-5 w-full text-sm border border-fg/15 px-4 py-2.5 rounded-full text-fg/40 cursor-not-allowed"
                title="Checkout coming soon"
              >
                Coming soon
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
