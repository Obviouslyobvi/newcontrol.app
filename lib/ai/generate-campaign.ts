/**
 * Main generation orchestrator: assembles the 5-layer prompt stack, calls
 * Claude once per variation, parses, QCs, scores, and persists each result.
 */
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import type {
  Campaign,
  BrandProfile,
  CampaignVariation,
  VariationContent,
} from "@/lib/db/schema";
import { generateCompletion, isAiConfigured } from "./anthropic-client";
import { SYSTEM_PROMPT } from "./prompts/system";
import { LETTER_PERFECT_PROMPT } from "./prompts/letter-perfect";
import { AAA_ARCHITECTURE_PROMPT } from "./prompts/aaa-architecture";
import { DRAPER_GATE_PROMPT } from "./prompts/draper-gate";
import { buildBrandVoicePrompt } from "./prompts/brand-voice";
import { buildCampaignBriefPrompt } from "./prompts/campaign-brief";
import {
  buildVariationPrompt,
  angleForVariation,
  type OpeningAngle,
} from "./prompts/variation";
import { parseVariationResponse } from "./parsers/response-parser";
import { runQualityCheck } from "./quality/validator";
import { scoreVariation } from "./quality/scorer";

export function buildSystemPrompt(): string {
  return [
    SYSTEM_PROMPT,
    DRAPER_GATE_PROMPT,
    AAA_ARCHITECTURE_PROMPT,
    LETTER_PERFECT_PROMPT,
  ].join("\n\n═══════════════\n\n");
}

export function buildUserPrompt(
  campaign: Campaign,
  brandProfile: BrandProfile | null,
  variationNumber: number,
  angle: OpeningAngle
): string {
  return [
    buildBrandVoicePrompt(brandProfile),
    buildCampaignBriefPrompt(campaign.campaignType, campaign.brief),
    buildVariationPrompt(variationNumber, angle, campaign.brief.openingAnglePreference),
    "Write the complete piece now. Respond with ONLY the JSON object.",
  ].join("\n\n═══════════════\n\n");
}

export async function generateOneVariation(
  campaign: Campaign,
  brandProfile: BrandProfile | null,
  variationNumber: number
): Promise<CampaignVariation> {
  const db = getDb();
  const angle = angleForVariation(
    variationNumber,
    campaign.brief.openingAnglePreference
  );
  const startedAt = Date.now();

  let content: VariationContent;
  let parseFlag: string | null = null;
  let modelUsed: string;
  let inputTokens = 0;
  let outputTokens = 0;

  if (isAiConfigured()) {
    const result = await generateCompletion({
      system: buildSystemPrompt(),
      prompt: buildUserPrompt(campaign, brandProfile, variationNumber, angle),
    });
    const parsed = parseVariationResponse(result.text);
    content = parsed.content;
    parseFlag = parsed.parseFlag;
    modelUsed = result.model;
    inputTokens = result.inputTokens;
    outputTokens = result.outputTokens;
  } else {
    content = buildSampleVariation(campaign, variationNumber, angle);
    modelUsed = "sample-mode";
  }

  const qc = runQualityCheck(content, campaign.brief);
  if (parseFlag) qc.flags.unshift(`Parser note: ${parseFlag}`);
  if (modelUsed === "sample-mode") {
    qc.flags.unshift(
      "SAMPLE MODE: ANTHROPIC_API_KEY is not configured. This is placeholder copy demonstrating the structure — add your API key for real generation."
    );
  }
  const scores = scoreVariation(qc, qc.content, campaign.brief, brandProfile?.wordsToAvoid ?? []);

  const [variation] = await db
    .insert(schema.campaignVariations)
    .values({
      campaignId: campaign.id,
      variationNumber,
      content: qc.content,
      openingAngle: angle,
      qualityScores: scores,
      modelUsed,
      inputTokens,
      outputTokens,
      generationTimeMs: Date.now() - startedAt,
    })
    .returning();

  await db.insert(schema.usageLog).values({
    orgId: campaign.orgId,
    userId: campaign.createdById,
    action: "generate",
    campaignId: campaign.id,
    tokensUsed: inputTokens + outputTokens,
    // Approximate Sonnet-class pricing; refine when billing lands.
    costCents: Math.ceil((inputTokens * 0.0003 + outputTokens * 0.0015) / 10),
  });

  return variation;
}

export async function loadBrandProfile(
  campaign: Campaign
): Promise<BrandProfile | null> {
  if (!campaign.brandProfileId) return null;
  const db = getDb();
  const [profile] = await db
    .select()
    .from(schema.brandProfiles)
    .where(eq(schema.brandProfiles.id, campaign.brandProfileId));
  return profile ?? null;
}

/**
 * Sample-mode output: clearly labeled, structurally faithful, so the product
 * is fully explorable before any API key exists.
 */
function buildSampleVariation(
  campaign: Campaign,
  variationNumber: number,
  angle: OpeningAngle
): VariationContent {
  const offer = campaign.brief.offer || "your offer";
  const headlines: Record<OpeningAngle, string> = {
    fear: "[SAMPLE] The Call You Don't Want to Make Next July",
    aspiration: "[SAMPLE] Picture the First Hot Day of Summer — Handled",
    story: "[SAMPLE] What Happened on Cedar Lane Last March",
    "problem-agitate": "[SAMPLE] You Already Know Something's Wrong. Here's What It's Costing You.",
    curiosity: "[SAMPLE] The $40 Part That Decides Whether This Costs You $89 or $4,000",
  };
  const opening =
    "This is sample output. NewControl is running without an Anthropic API key, so instead of a real letter you're seeing placeholder copy in the shape of one.\n\nIn a real generation, this opening would pull your reader into the letter before any selling begins — written specifically for the audience you described in your brief.";
  const body =
    `Your brief said the offer is: ${offer}.\n\nA real variation would develop your message here: the problem your reader feels, your offer as the answer, the benefits that matter to them, the proof you provided, and an honest reason to act now.\n\nEach of the five variations opens from a different angle, so you can test which message your market answers.`;
  const cta = campaign.brief.cta || "Add ANTHROPIC_API_KEY in your environment, then click Regenerate to write the real thing.";

  const fullText = [headlines[angle], opening, body, cta, "P.S. This sample exists so you can explore previews, editing, and exports before connecting the AI. Everything works — the words just aren't written yet."].join("\n\n");

  return {
    envelopeTeaser: campaign.campaignType === "sales_letter" ? "[SAMPLE] Open before summer prices go up" : null,
    johnsonBox: campaign.campaignType === "sales_letter" ? "[SAMPLE] A demonstration of the letter structure NewControl generates" : null,
    headline: headlines[angle],
    opening,
    body,
    cta,
    guarantee: "[SAMPLE] A risk-reversal guarantee from your brief would appear here.",
    ps: ["This sample exists so you can explore previews, editing, and exports before connecting the AI. Everything works — the words just aren't written yet."],
    responseCard: null,
    fullText,
  };
}
