"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import type { CampaignVariation } from "@/lib/db/schema";
import VariationCard from "./VariationCard";
import VariationPreview from "./VariationPreview";

const TIPS = [
  "Five variations means five different openings — test them against each other before committing to a print run.",
  "The best-performing letter is rarely the one you'd have guessed. Let your market vote.",
  "Direct mail still earns 15-17% ROI for many businesses — several times typical digital ad returns.",
  "Mail a small test batch first. The winner becomes your control; then try to beat it.",
  "Your reader decides in seconds whether to keep reading. The opening carries the whole letter.",
  "Specifics sell. Check that your brief gave real numbers, real proof, and a real deadline.",
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
