"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CampaignBrief, BrandProfile } from "@/lib/db/schema";
import { CAMPAIGN_TYPES, type CampaignType } from "./types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-fg/8 last:border-0">
      <div className="text-xs uppercase tracking-wider text-fg/45 mb-1">
        {label}
      </div>
      <div className="text-sm leading-relaxed">{value}</div>
    </div>
  );
}

export default function Step4Review({
  title,
  campaignType,
  brief,
  brandProfile,
}: {
  title: string;
  campaignType: CampaignType;
  brief: CampaignBrief;
  brandProfile: BrandProfile | null;
}) {
  const typeLabel =
    CAMPAIGN_TYPES.find((t) => t.value === campaignType)?.label ?? campaignType;

  return (
    <div>
      <h2 className="font-serif text-3xl tracking-tight mb-2">
        Ready to write
      </h2>
      <p className="text-fg/55 mb-8">
        Five variations, five different opening angles, each following the
        22-step Letter Perfect framework. Generation takes about 90 seconds.
      </p>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="ember">{typeLabel}</Badge>
          <Badge variant="default" className="capitalize">
            {brief.tone || "warm"} tone
          </Badge>
          <Badge variant="default" className="capitalize">
            {brief.letterLength} length
          </Badge>
          {brandProfile && (
            <Badge variant="outline">Voice: {brandProfile.name}</Badge>
          )}
        </div>
        <Row label="Title" value={title} />
        <Row label="Offer" value={brief.offer} />
        <Row label="Audience" value={brief.audience} />
        <Row label="Main benefit" value={brief.mainBenefit} />
        <Row
          label="Pain points"
          value={brief.painPoints.length ? brief.painPoints.join(" · ") : null}
        />
        <Row
          label="Proof elements"
          value={
            brief.proofElements.length ? brief.proofElements.join(" · ") : null
          }
        />
        <Row
          label="Competitors"
          value={brief.competitors.length ? brief.competitors.join(" · ") : null}
        />
        <Row label="Call to action" value={brief.cta} />
        <Row label="Special requirements" value={brief.specialRequirements} />
        <Row
          label="Opening angle preference"
          value={brief.openingAnglePreference}
        />
      </Card>
    </div>
  );
}
