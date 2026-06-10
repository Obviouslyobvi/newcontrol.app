/**
 * LAYER 4 — Campaign brief, assembled per-campaign.
 */
import type { Campaign, CampaignBrief } from "@/lib/db/schema";

const TYPE_LABELS: Record<Campaign["campaignType"], string> = {
  sales_letter: "Direct mail sales letter",
  postcard: "Direct mail postcard",
  email: "Direct response email",
  social_ad: "Social media ad (Facebook/Instagram/LinkedIn)",
  landing_page: "Landing page copy",
  cold_email: "Cold outreach email",
  lead_gen: "Lead generation letter (free report / consultation offer)",
  followup: "Follow-up letter to a prior contact",
};

const LENGTH_GUIDANCE: Record<CampaignBrief["letterLength"], string> = {
  short: "Short: roughly 300-600 words (1-2 printed pages).",
  medium: "Medium: roughly 900-1,400 words (about 4 printed pages).",
  long: "Long: 2,000+ words (8+ printed pages). Full persuasion engine — every step developed.",
};

export function buildCampaignBriefPrompt(
  campaignType: Campaign["campaignType"],
  brief: CampaignBrief
): string {
  const lines: string[] = [
    "CAMPAIGN BRIEF — everything you write must trace back to this:",
    "",
    `FORMAT: ${TYPE_LABELS[campaignType]}`,
    `THE OFFER: ${brief.offer}`,
    `THE AUDIENCE: ${brief.audience}`,
    `MAIN BENEFIT (the one idea this letter drives home): ${brief.mainBenefit}`,
  ];

  if (brief.painPoints.length) {
    lines.push(`PAIN POINTS (use the sharpest, in the reader's language): ${brief.painPoints.join("; ")}`);
  }
  if (brief.proofElements.length) {
    lines.push(`PROOF ELEMENTS (the ONLY proof you may use — never invent more): ${brief.proofElements.join("; ")}`);
  } else {
    lines.push("PROOF ELEMENTS: none provided. Do NOT invent testimonials, statistics, or credentials. Build belief through specificity, mechanism, and risk reversal.");
  }
  if (brief.competitors.length) {
    lines.push(`COMPETITIVE CONTEXT (position against, never attack by name): ${brief.competitors.join("; ")}`);
  }
  if (brief.cta) {
    lines.push(`CALL TO ACTION (use this, verbatim where natural): ${brief.cta}`);
  }
  if (brief.specialRequirements) {
    lines.push(`SPECIAL REQUIREMENTS (binding): ${brief.specialRequirements}`);
  }

  lines.push(`TONE: ${brief.tone || "warm"}`);
  lines.push(`TARGET LENGTH: ${LENGTH_GUIDANCE[brief.letterLength]}`);

  return lines.join("\n");
}
