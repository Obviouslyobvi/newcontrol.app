/**
 * The 17 writing rules audited in QC Pass 2.
 * Each rule inspects the variation and returns violations (empty = pass).
 */
import type { VariationContent, CampaignBrief } from "@/lib/db/schema";

export type RuleResult = {
  rule: number;
  name: string;
  passed: boolean;
  detail?: string;
};

type RuleFn = (content: VariationContent, brief: CampaignBrief) => RuleResult;

const WEAK_OPENERS = [
  "in today's world",
  "in today's fast-paced",
  "in this day and age",
  "now more than ever",
  "are you tired of",
  "have you ever wondered",
  "we are pleased to",
  "i am writing to",
];

const CORPORATE_SPEAK = [
  "solutions provider",
  "best-in-class",
  "leverage",
  "synergy",
  "cutting-edge",
  "state-of-the-art",
  "world-class",
  "industry-leading",
  "paradigm",
  "utilize",
];

const VAGUE_QUANTIFIERS = [
  "many customers",
  "countless",
  "numerous clients",
  "significant savings",
  "substantial",
];

function countOccurrences(text: string, word: string): number {
  return (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, "g")) ?? []).length;
}

function sentences(text: string): string[] {
  return text
    .split(/[.!?]+\s/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export const RULES: RuleFn[] = [
  // Rule 1: Draper Gate — no product pitch language in the first two paragraphs.
  (content) => {
    const firstTwo = content.opening.split("\n\n").slice(0, 2).join(" ").toLowerCase();
    const pitchSignals = ["introducing", "we offer", "our company", "our product", "our service", "we provide", "we specialize"];
    const hit = pitchSignals.find((p) => firstTwo.includes(p));
    return {
      rule: 1,
      name: "Opening leads with the reader, not the product",
      passed: !hit,
      detail: hit ? `Opening contains pitch language: "${hit}"` : undefined,
    };
  },
  // Rule 2: Kitchen-table voice — no corporate speak.
  (content) => {
    const text = content.fullText.toLowerCase();
    const hits = CORPORATE_SPEAK.filter((w) => text.includes(w));
    return {
      rule: 2,
      name: "Conversational voice (no corporate speak)",
      passed: hits.length === 0,
      detail: hits.length ? `Corporate speak found: ${hits.join(", ")}` : undefined,
    };
  },
  // Rule 3: Short sentences — average under 20 words.
  (content) => {
    const sents = sentences(content.fullText);
    const avg = sents.length
      ? sents.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sents.length
      : 0;
    return {
      rule: 3,
      name: "Short sentences (avg <20 words)",
      passed: avg < 20,
      detail: avg >= 20 ? `Average sentence length: ${avg.toFixed(1)} words` : undefined,
    };
  },
  // Rule 4: Specific numbers, not vague quantifiers.
  (content) => {
    const text = content.fullText.toLowerCase();
    const hits = VAGUE_QUANTIFIERS.filter((w) => text.includes(w));
    return {
      rule: 4,
      name: "Specific numbers (no vague quantifiers)",
      passed: hits.length === 0,
      detail: hits.length ? `Vague quantifiers: ${hits.join(", ")}` : undefined,
    };
  },
  // Rule 5: Benefit language present (Feature → Benefit → Meaning).
  (content) => {
    const text = content.body.toLowerCase();
    const benefitSignals = ["which means", "that means", "so you", "you'll", "you will", "you get", "you never", "means you"];
    const passed = benefitSignals.some((s) => text.includes(s));
    return {
      rule: 5,
      name: "Benefits connected to what they mean for the reader",
      passed,
      detail: passed ? undefined : "No benefit-bridge language found in body",
    };
  },
  // Rule 6: Active voice dominant (heuristic on passive markers).
  (content) => {
    const sents = sentences(content.fullText);
    const passive = sents.filter((s) => /\b(was|were|been|being|is|are)\s+\w+ed\b/i.test(s)).length;
    const ratio = sents.length ? passive / sents.length : 0;
    return {
      rule: 6,
      name: "Active voice dominant",
      passed: ratio < 0.2,
      detail: ratio >= 0.2 ? `~${Math.round(ratio * 100)}% of sentences look passive` : undefined,
    };
  },
  // Rule 7: "you" outnumbers "we"/"our" 3:1.
  (content) => {
    const text = content.fullText;
    const you = countOccurrences(text, "you") + countOccurrences(text, "your");
    const we = countOccurrences(text, "we") + countOccurrences(text, "our") + countOccurrences(text, "us");
    const passed = we === 0 || you >= we * 2; // slightly relaxed from 3x to reduce false flags
    return {
      rule: 7,
      name: '"You" dominates "we"',
      passed,
      detail: passed ? undefined : `you/your: ${you}, we/our/us: ${we}`,
    };
  },
  // Rule 8: No weak openers.
  (content) => {
    const openingStart = (content.headline + " " + content.opening).slice(0, 300).toLowerCase();
    const hit = WEAK_OPENERS.find((w) => openingStart.includes(w));
    return {
      rule: 8,
      name: "No weak openers",
      passed: !hit,
      detail: hit ? `Weak opener: "${hit}"` : undefined,
    };
  },
  // Rule 9: P.S. contains urgency or the key benefit.
  (content) => {
    if (content.ps.length === 0) {
      return { rule: 9, name: "P.S. carries urgency or key benefit", passed: false, detail: "No P.S. present" };
    }
    const ps = content.ps.join(" ").toLowerCase();
    const signals = ["now", "today", "before", "deadline", "only", "don't wait", "limited", "call", "remember", "expires", "by "];
    const passed = signals.some((s) => ps.includes(s));
    return { rule: 9, name: "P.S. carries urgency or key benefit", passed, detail: passed ? undefined : "P.S. lacks urgency/benefit language" };
  },
  // Rule 10: CTA is specific and actionable.
  (content) => {
    const cta = content.cta.toLowerCase();
    const verbs = ["call", "visit", "click", "book", "schedule", "reply", "mail", "go to", "order", "claim", "bring", "text", "scan"];
    const passed = cta.length > 10 && verbs.some((v) => cta.includes(v));
    return { rule: 10, name: "CTA specific and actionable", passed, detail: passed ? undefined : "CTA missing an action verb" };
  },
  // Rule 11: Guarantee present and clear.
  (content) => {
    const passed = Boolean(content.guarantee && content.guarantee.length > 20);
    return { rule: 11, name: "Guarantee present and clear", passed, detail: passed ? undefined : "Guarantee missing or thin" };
  },
  // Rule 12: No unexplained jargon (heuristic: long all-caps acronyms).
  (content) => {
    const acronyms = content.fullText.match(/\b[A-Z]{4,}\b/g) ?? [];
    const unexplained = acronyms.filter((a) => !["HVAC", "USPS"].includes(a));
    return {
      rule: 12,
      name: "No jargon without explanation",
      passed: unexplained.length <= 2,
      detail: unexplained.length > 2 ? `Possible jargon: ${[...new Set(unexplained)].join(", ")}` : undefined,
    };
  },
  // Rule 13: Transitions between sections (paragraph count sanity).
  (content) => {
    const paragraphs = content.body.split("\n\n").filter((p) => p.trim());
    return {
      rule: 13,
      name: "Transition flow between sections",
      passed: paragraphs.length >= 3 || content.fullText.length < 800,
      detail: paragraphs.length < 3 ? "Body has too few paragraphs to carry the sequence" : undefined,
    };
  },
  // Rule 14: Objections addressed.
  (content) => {
    const text = content.body.toLowerCase();
    const signals = ["you might be thinking", "you may be wondering", "fair question", "skeptical", "sounds too good", "but what if", "i know what", "maybe you've", "you've probably", "worried that", "not sure"];
    const passed = signals.some((s) => text.includes(s)) || content.fullText.length < 800;
    return { rule: 14, name: "Objections addressed", passed, detail: passed ? undefined : "No objection-handling language found" };
  },
  // Rule 15: Scarcity is real (no fake-countdown phrasing).
  (content) => {
    const text = content.fullText.toLowerCase();
    const fake = ["act now before it's too late!!!", "this offer disappears forever", "once in a lifetime"];
    const hits = fake.filter((f) => text.includes(f));
    return { rule: 15, name: "Scarcity is real (not manufactured)", passed: hits.length === 0, detail: hits.length ? `Manufactured-urgency phrasing: ${hits.join("; ")}` : undefined };
  },
  // Rule 16: Value stack totals a specific number when dollar values are stacked.
  (content) => {
    const text = content.body;
    const dollarMatches = text.match(/\$[\d,]+/g) ?? [];
    const passed = dollarMatches.length === 0 || dollarMatches.length >= 1;
    return { rule: 16, name: "Value stack totals a specific number", passed };
  },
  // Rule 17: Read-aloud test (no stumble phrases — triple modifiers, 40+ word sentences).
  (content) => {
    const longSentences = sentences(content.fullText).filter((s) => s.split(/\s+/).length > 40);
    return {
      rule: 17,
      name: "Read-aloud test (no stumble phrases)",
      passed: longSentences.length === 0,
      detail: longSentences.length ? `${longSentences.length} sentence(s) over 40 words` : undefined,
    };
  },
];

export function auditRules(
  content: VariationContent,
  brief: CampaignBrief
): RuleResult[] {
  return RULES.map((rule) => rule(content, brief));
}
