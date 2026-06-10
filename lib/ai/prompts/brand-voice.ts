/**
 * LAYER 3 — Brand voice, assembled per-user from their brand profile.
 */
import type { BrandProfile } from "@/lib/db/schema";

function toneDescription(value: number, low: string, high: string): string {
  if (value >= 0.75) return `strongly ${high}`;
  if (value >= 0.6) return `leaning ${high}`;
  if (value > 0.4) return `balanced between ${low} and ${high}`;
  if (value > 0.25) return `leaning ${low}`;
  return `strongly ${low}`;
}

export function buildBrandVoicePrompt(profile: BrandProfile | null): string {
  if (!profile) {
    return `BRAND VOICE: No brand profile provided. Write in the default NewControl kitchen-table voice: warm, plainspoken, specific, confident without bragging.`;
  }

  const parts: string[] = ["BRAND VOICE — write every word as this brand:"];

  parts.push(`Brand: ${profile.name}`);
  if (profile.description) {
    parts.push(`About the company: ${profile.description}`);
  }

  const tone = profile.toneSettings;
  if (tone) {
    const toneLines = [
      `• Formality: ${toneDescription(tone.formal, "casual", "formal")}`,
      `• Warmth: ${toneDescription(tone.friendly, "reserved", "friendly")}`,
      `• Authority: ${toneDescription(tone.authoritative, "peer-level", "authoritative")}`,
      `• Register: ${toneDescription(tone.casual, "buttoned-up", "casual")}`,
    ];
    if (tone.custom) toneLines.push(`• In their words: ${tone.custom}`);
    parts.push(`Tone settings:\n${toneLines.join("\n")}`);
  }

  if (profile.wordsToUse?.length) {
    parts.push(
      `Words and phrases to work in naturally (do not force): ${profile.wordsToUse.join(", ")}`
    );
  }
  if (profile.wordsToAvoid?.length) {
    parts.push(
      `Words and phrases that must NEVER appear: ${profile.wordsToAvoid.join(", ")}`
    );
  }

  if (profile.exampleCopy?.length) {
    const examples = profile.exampleCopy
      .slice(0, 3)
      .map((ex, i) => `EXAMPLE ${i + 1}:\n${ex}`)
      .join("\n\n");
    parts.push(
      `Copy this brand has written before — match its rhythm, vocabulary, and personality:\n\n${examples}`
    );
  }

  return parts.join("\n\n");
}
