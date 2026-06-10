/**
 * 3-pass quality check.
 * Pass 1 — claim discipline. Pass 2 — 17 writing rules. Pass 3 — completeness.
 * Auto-fixes what it can, flags the rest, never blocks delivery.
 */
import type { VariationContent, CampaignBrief } from "@/lib/db/schema";
import { auditRules, type RuleResult } from "./rules";

export type QcReport = {
  content: VariationContent; // possibly auto-fixed
  flags: string[];
  ruleResults: RuleResult[];
};

export function runQualityCheck(
  content: VariationContent,
  brief: CampaignBrief
): QcReport {
  const flags: string[] = [];
  let fixed = { ...content };

  // ── Pass 1: Claim discipline ──
  // Price references must come from the brief.
  const briefText = [brief.offer, brief.cta, brief.specialRequirements, ...brief.proofElements].join(" ");
  const briefPrices = new Set(briefText.match(/\$[\d,]+(?:\.\d{2})?/g) ?? []);
  const letterPrices = fixed.fullText.match(/\$[\d,]+(?:\.\d{2})?/g) ?? [];
  const unknownPrices = letterPrices.filter((p) => !briefPrices.has(p));
  if (briefPrices.size > 0 && unknownPrices.length > letterPrices.length / 2) {
    flags.push(`Verify prices: letter mentions ${[...new Set(unknownPrices)].join(", ")} not found verbatim in the brief`);
  }

  // Quoted testimonials when the brief provided no proof.
  if (brief.proofElements.length === 0) {
    const quoted = fixed.fullText.match(/"[^"]{40,}"\s*[—–-]\s*[A-Z][a-z]+/g);
    if (quoted?.length) {
      flags.push("Possible fabricated testimonial detected (quoted praise with attribution, but brief provided no proof elements) — review before sending");
    }
  }

  // Absolute claims without proof.
  const absolutes = ["guaranteed to double", "100% success", "never fails", "always works", "the only company"];
  const absoluteHits = absolutes.filter((a) => fixed.fullText.toLowerCase().includes(a));
  if (absoluteHits.length) {
    flags.push(`Absolute claims to verify: ${absoluteHits.join("; ")}`);
  }

  // ── Pass 2: 17 writing rules ──
  const ruleResults = auditRules(fixed, brief);

  // Auto-fix: strip double spaces and stray markdown artifacts.
  fixed = mapStrings(fixed, (s) =>
    s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/[ \t]{2,}/g, " ").trim()
  );

  // Flags are user-visible quality notes — plain language only, no internal
  // rule numbering or framework terminology.
  for (const r of ruleResults.filter((r) => !r.passed)) {
    flags.push(`${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  }

  // ── Pass 3: Completeness ──
  if (!fixed.headline) flags.push("Missing headline");
  if (!fixed.fullText || fixed.fullText.length < 100) flags.push("Letter suspiciously short");
  if (/\[(?!Your Name)[^\]]*\]/.test(fixed.fullText.replace(/\[Your Name\]/g, ""))) {
    flags.push("Possible placeholder text remains (bracketed content)");
  }

  const wordCount = fixed.fullText.split(/\s+/).length;
  const targets: Record<CampaignBrief["letterLength"], [number, number]> = {
    short: [150, 800],
    medium: [600, 1800],
    long: [1500, 6000],
  };
  const [min, max] = targets[brief.letterLength];
  if (wordCount < min || wordCount > max) {
    flags.push(`Word count ${wordCount} outside ${brief.letterLength} target (${min}-${max})`);
  }

  return { content: fixed, flags, ruleResults };
}

function mapStrings(content: VariationContent, fn: (s: string) => string): VariationContent {
  return {
    envelopeTeaser: content.envelopeTeaser ? fn(content.envelopeTeaser) : null,
    johnsonBox: content.johnsonBox ? fn(content.johnsonBox) : null,
    headline: fn(content.headline),
    opening: fn(content.opening),
    body: fn(content.body),
    cta: fn(content.cta),
    guarantee: content.guarantee ? fn(content.guarantee) : null,
    ps: content.ps.map(fn),
    responseCard: content.responseCard ? fn(content.responseCard) : null,
    fullText: fn(content.fullText),
  };
}
