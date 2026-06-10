"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import type { CampaignVariation } from "@/lib/db/schema";
import VariationCard from "./VariationCard";
import VariationPreview from "./VariationPreview";

const TIPS = [
  "The P.S. is the second-most-read part of any letter. Skimmers jump straight to it.",
  "Five variations means five different opening angles — test them against each other.",
  "Great direct mail sounds like a smart friend talking at the kitchen table, not a corporation announcing.",
  "Every letter opens with a person in a situation. The product never shows up in the first two paragraphs.",
  "Specific numbers beat vague claims. '312 reviews' outsells 'hundreds of happy customers.'",
  "The headline is the ad for the rest of the letter. If it fails, nothing else gets read.",
];

export default function ResultsViewer({
  campaignId,
  variations,
  isGenerating,
  progress,
  currentVariation,
  variationCount = 5,
}: {
  campaignId: string;
  variations: CampaignVariation[];
  isGenerating: boolean;
  progress: number;
  currentVariation: number;
  variationCount?: number;
}) {
  const [previewing, setPreviewing] = useState<CampaignVariation | null>(null);
  const tip = TIPS[Math.min(currentVariation - 1, TIPS.length - 1) < 0 ? 0 : (currentVariation - 1) % TIPS.length];

  return (
    <div>
      {isGenerating && (
        <div className="border border-fg/10 bg-surface rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Writing variation {Math.min(currentVariation, variationCount)} of{" "}
              {variationCount}…
            </span>
            <span className="text-sm text-fg/50">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <Progress value={progress * 100} className="mb-4" />
          <p className="text-sm text-fg/55 italic">{tip}</p>
        </div>
      )}

      {variations.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {variations.map((v) => (
            <VariationCard
              key={v.id}
              variation={v}
              campaignId={campaignId}
              onPreview={() => setPreviewing(v)}
            />
          ))}
        </div>
      )}

      {previewing && (
        <VariationPreview
          variation={previewing}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
}
