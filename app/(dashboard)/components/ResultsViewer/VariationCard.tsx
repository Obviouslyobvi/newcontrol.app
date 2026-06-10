"use client";

import Link from "next/link";
import { Eye, Pencil, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CampaignVariation } from "@/lib/db/schema";

const ANGLE_LABELS: Record<string, string> = {
  fear: "Fear / loss",
  aspiration: "Aspiration",
  story: "Story",
  "problem-agitate": "Problem-agitate",
  curiosity: "Curiosity",
};

export default function VariationCard({
  variation,
  campaignId,
  onPreview,
}: {
  variation: CampaignVariation;
  campaignId: string;
  onPreview: () => void;
}) {
  const content = variation.editedContent ?? variation.content;
  const preview = content.fullText
    ? content.fullText.split(/\s+/).slice(0, 60).join(" ") + "…"
    : content.opening?.split(/\s+/).slice(0, 60).join(" ") + "…";
  const score = variation.qualityScores?.overall;

  return (
    <Card className="p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-fg text-bg text-sm font-medium flex items-center justify-center">
            {variation.variationNumber}
          </span>
          {variation.openingAngle && (
            <Badge variant="ember">
              {ANGLE_LABELS[variation.openingAngle] ?? variation.openingAngle}
            </Badge>
          )}
          {variation.isEdited && <Badge variant="outline">Edited</Badge>}
        </div>
        {typeof score === "number" && (
          <span
            className="text-sm font-medium text-fg/60"
            title="Quality score"
          >
            {score.toFixed(1)}
            <span className="text-fg/35">/10</span>
          </span>
        )}
      </div>

      <h3 className="font-serif text-lg leading-snug mb-2">
        {content.headline}
      </h3>
      <p className="text-sm text-fg/55 leading-relaxed line-clamp-4 mb-4 flex-1">
        {preview}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 text-sm border border-fg/15 px-3.5 py-2 rounded-full hover:bg-fg/5 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
        <Link
          href={`/campaigns/${campaignId}/edit?variation=${variation.id}`}
          className="inline-flex items-center gap-1.5 text-sm border border-fg/15 px-3.5 py-2 rounded-full hover:bg-fg/5 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <Link
          href={`/campaigns/${campaignId}/export?variation=${variation.id}`}
          className="inline-flex items-center gap-1.5 text-sm bg-fg text-bg px-3.5 py-2 rounded-full hover:bg-ember hover:text-cream transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Link>
      </div>
    </Card>
  );
}
