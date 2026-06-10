/**
 * Quality scoring: 1-10 on four dimensions, derived from the QC report.
 */
import type { QualityScores, VariationContent, CampaignBrief } from "@/lib/db/schema";
import type { QcReport } from "./validator";

export function scoreVariation(
  report: QcReport,
  content: VariationContent,
  brief: CampaignBrief,
  brandWordsAvoided: string[] = []
): QualityScores {
  const failed = report.ruleResults.filter((r) => !r.passed);
  const failedRules = new Set(failed.map((r) => r.rule));

  // Clarity: sentence length, read-aloud, jargon, weak openers.
  let clarity = 10;
  for (const rule of [3, 8, 12, 17]) if (failedRules.has(rule)) clarity -= 1.5;

  // Persuasion: Draper Gate, benefits, proof flow, objections, CTA, P.S., guarantee.
  let persuasion = 10;
  for (const rule of [1, 5, 9, 10, 11, 14]) if (failedRules.has(rule)) persuasion -= 1.25;
  if (report.flags.some((f) => f.startsWith("Possible fabricated"))) persuasion -= 2;

  // Brand fit: voice rules + avoided words.
  let brandFit = 10;
  for (const rule of [2, 7]) if (failedRules.has(rule)) brandFit -= 2;
  const textLower = content.fullText.toLowerCase();
  const avoidedHits = brandWordsAvoided.filter((w) => w && textLower.includes(w.toLowerCase()));
  brandFit -= avoidedHits.length * 1.5;

  // Overall: weighted blend, minus completeness problems.
  const completenessPenalty = report.flags.filter((f) =>
    f.startsWith("Missing") || f.startsWith("Letter suspiciously") || f.startsWith("Possible placeholder") || f.startsWith("Word count")
  ).length;

  const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n * 10) / 10));
  const overall = clamp(
    clarity * 0.3 + persuasion * 0.4 + brandFit * 0.3 - completenessPenalty * 0.75
  );

  return {
    clarity: clamp(clarity),
    persuasion: clamp(persuasion),
    brandFit: clamp(brandFit),
    overall,
    flags: report.flags.length ? report.flags : undefined,
  };
}
