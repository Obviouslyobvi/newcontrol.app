"use client";

import {
  Mail,
  CreditCard,
  AtSign,
  Megaphone,
  PanelTop,
  Snowflake,
  Magnet,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CAMPAIGN_TYPES, type CampaignType } from "./types";

const ICONS: Record<CampaignType, React.ComponentType<{ className?: string }>> = {
  sales_letter: Mail,
  postcard: CreditCard,
  email: AtSign,
  social_ad: Megaphone,
  landing_page: PanelTop,
  cold_email: Snowflake,
  lead_gen: Magnet,
  followup: Repeat,
};

export default function Step1Type({
  value,
  onChange,
}: {
  value: CampaignType;
  onChange: (type: CampaignType) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl tracking-tight mb-2">
        What are we writing?
      </h2>
      <p className="text-fg/55 mb-8">
        Pick a format. Sales letters get the deepest treatment — that&apos;s
        where the 22-step framework runs at full strength.
      </p>
      <div
        role="radiogroup"
        aria-label="Campaign type"
        className="grid sm:grid-cols-2 gap-3"
      >
        {CAMPAIGN_TYPES.map((t) => {
          const Icon = ICONS[t.value];
          const selected = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(t.value)}
              className={cn(
                "text-left p-5 rounded-2xl border transition-colors",
                selected
                  ? "border-ember bg-ember/5 ring-2 ring-ember/20"
                  : "border-fg/10 bg-surface hover:border-fg/25"
              )}
            >
              <div
                className={cn(
                  "inline-flex h-9 w-9 rounded-full items-center justify-center mb-3",
                  selected ? "bg-ember/15 text-ember" : "bg-fg/8 text-fg/60"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="font-medium mb-1">{t.label}</div>
              <div className="text-sm text-fg/55 leading-snug">
                {t.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
