/**
 * LAYER 5 — Variation control: assigns each of the five variations a distinct
 * opening angle and emotional register so the set is genuinely testable.
 */

export type OpeningAngle =
  | "fear"
  | "aspiration"
  | "story"
  | "problem-agitate"
  | "curiosity";

export const ANGLE_SEQUENCE: OpeningAngle[] = [
  "fear",
  "aspiration",
  "story",
  "problem-agitate",
  "curiosity",
];

const ANGLE_INSTRUCTIONS: Record<OpeningAngle, string> = {
  fear: `OPENING ANGLE — FEAR / LOSS: Open inside the moment when the problem strikes and it's too late to prevent. What the reader stands to lose — money, comfort, safety, standing — made vivid and immediate. Emotional register: protective urgency. The rescue arrives as relief from a danger the reader now feels. Keep it honest: dramatize real consequences from the brief, never manufactured catastrophe.`,
  aspiration: `OPENING ANGLE — ASPIRATION: Open inside the life the reader wants — the morning everything works, the moment they're proud, the result already achieved. Present tense, sensory, theirs. Emotional register: warm forward pull. The letter then bridges: between you and that morning stands one decision. The offer is the bridge.`,
  story: `OPENING ANGLE — STORY: Open with a specific person in a specific moment — a customer-like figure the reader recognizes as themselves. Named, timestamped, concrete ("Last March, a homeowner on Cedar Lane..."). Build from real-feeling, brief-supported circumstances; frame composites honestly as typical, never as fabricated testimony. Emotional register: narrative immersion. The story carries the problem and the discovery; the letter steps out of it to make the offer.`,
  "problem-agitate": `OPENING ANGLE — PROBLEM-AGITATE: Open by naming the pain harder and more precisely than the reader has ever heard it named — the thing they mutter about, in their own words. Then agitate: what it costs per month, what it ruins, how it compounds. Emotional register: recognition turning to resolve. The reader must nod twice before the solution appears.`,
  curiosity: `OPENING ANGLE — CURIOSITY: Open with an unexpected fact, question, or contradiction the reader can't leave unresolved — drawn honestly from the brief's subject matter ("There's a $40 part inside your air conditioner that decides whether your summer costs you $89 or $4,000."). Emotional register: itch that demands scratching. The body must fully pay off the curiosity — never bait without the switch.`,
};

export function buildVariationPrompt(
  variationNumber: number,
  angle: OpeningAngle,
  preferredAngle?: string
): string {
  const lines = [
    `VARIATION ${variationNumber} OF 5.`,
    ANGLE_INSTRUCTIONS[angle],
    `DIFFERENTIATION: This variation must be a genuinely different letter, not a paraphrase. Different opening scene, different headline structure, different lead benefit ordering, different P.S. Two variations from this set should never feel interchangeable when read back to back.`,
  ];
  if (preferredAngle && preferredAngle === angle) {
    lines.push(
      `NOTE: The user specifically requested this opening angle — make it the strongest expression of it.`
    );
  }
  return lines.join("\n\n");
}

export function angleForVariation(
  variationNumber: number,
  preferredAngle?: string
): OpeningAngle {
  // A preferred angle takes slot 1; remaining slots cycle through the others.
  if (preferredAngle && ANGLE_SEQUENCE.includes(preferredAngle as OpeningAngle)) {
    const preferred = preferredAngle as OpeningAngle;
    if (variationNumber === 1) return preferred;
    const rest = ANGLE_SEQUENCE.filter((a) => a !== preferred);
    return rest[(variationNumber - 2) % rest.length];
  }
  return ANGLE_SEQUENCE[(variationNumber - 1) % ANGLE_SEQUENCE.length];
}
