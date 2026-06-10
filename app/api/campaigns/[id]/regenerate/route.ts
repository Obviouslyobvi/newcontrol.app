import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import type { VariationContent } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/middleware";
import { getOwnedCampaign } from "@/lib/db/queries";
import { regenerateSchema } from "@/lib/utils/validation";
import { errors, errorResponse } from "@/lib/utils/errors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import { generateCompletion, isAiConfigured } from "@/lib/ai/anthropic-client";
import {
  buildSystemPrompt,
  buildUserPrompt,
  loadBrandProfile,
  generateOneVariation,
} from "@/lib/ai/generate-campaign";
import { parseVariationResponse } from "@/lib/ai/parsers/response-parser";
import { runQualityCheck } from "@/lib/ai/quality/validator";
import { scoreVariation } from "@/lib/ai/quality/scorer";
import type { OpeningAngle } from "@/lib/ai/prompts/variation";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const SECTION_FIELDS: Record<string, (keyof VariationContent)[]> = {
  headline: ["headline", "johnsonBox", "envelopeTeaser"],
  opening: ["opening"],
  body: ["body"],
  cta: ["cta", "guarantee", "responseCard"],
  ps: ["ps"],
};

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    const campaign = await getOwnedCampaign(session, id);

    const limits =
      session.planTier === "free_trial"
        ? RATE_LIMITS.generationTrial
        : RATE_LIMITS.generation;
    const rl = checkRateLimit(`gen:${session.orgId}`, limits.limit, limits.windowMs);
    if (!rl.allowed) throw errors.rateLimited();

    const { variationId, section } = regenerateSchema.parse(await req.json());

    const db = getDb();
    const [existing] = await db
      .select()
      .from(schema.campaignVariations)
      .where(
        and(
          eq(schema.campaignVariations.id, variationId),
          eq(schema.campaignVariations.campaignId, campaign.id)
        )
      );
    if (!existing) throw errors.notFound("Variation not found");

    const brandProfile = await loadBrandProfile(campaign);

    // Full regeneration: replace this variation in place.
    if (section === "full") {
      await db
        .delete(schema.campaignVariations)
        .where(eq(schema.campaignVariations.id, variationId));
      const variation = await generateOneVariation(
        campaign,
        brandProfile,
        existing.variationNumber
      );
      return NextResponse.json({ variation });
    }

    if (!isAiConfigured()) {
      throw errors.validation(
        "Add ANTHROPIC_API_KEY to your environment to regenerate sections (see SETUP.md)."
      );
    }

    const baseContent = existing.editedContent ?? existing.content;
    const angle = (existing.openingAngle ?? "story") as OpeningAngle;

    const prompt = [
      buildUserPrompt(campaign, brandProfile, existing.variationNumber, angle),
      `REGENERATION TASK: The letter below is already written. Rewrite ONLY the "${section}" portion — keep everything else verbatim. Return the complete JSON object with the same schema, where only the ${SECTION_FIELDS[section].join(", ")} field(s) and fullText (re-assembled) change.`,
      `CURRENT LETTER JSON:\n${JSON.stringify(baseContent)}`,
    ].join("\n\n═══════════════\n\n");

    const result = await generateCompletion({
      system: buildSystemPrompt(),
      prompt,
    });
    const { content } = parseVariationResponse(result.text);

    // Defensive merge: only accept the requested fields plus fullText.
    const merged: VariationContent = { ...baseContent };
    for (const field of SECTION_FIELDS[section]) {
      (merged as Record<string, unknown>)[field] = content[field];
    }
    merged.fullText = content.fullText || merged.fullText;

    const qc = runQualityCheck(merged, campaign.brief);
    const scores = scoreVariation(qc, qc.content, campaign.brief, brandProfile?.wordsToAvoid ?? []);

    const [variation] = await db
      .update(schema.campaignVariations)
      .set({
        content: qc.content,
        editedContent: existing.editedContent ? qc.content : null,
        qualityScores: scores,
        isEdited: existing.isEdited,
        modelUsed: result.model,
        inputTokens: (existing.inputTokens ?? 0) + result.inputTokens,
        outputTokens: (existing.outputTokens ?? 0) + result.outputTokens,
      })
      .where(eq(schema.campaignVariations.id, variationId))
      .returning();

    await db.insert(schema.usageLog).values({
      orgId: campaign.orgId,
      userId: session.userId,
      action: "regenerate_section",
      campaignId: campaign.id,
      tokensUsed: result.inputTokens + result.outputTokens,
    });

    return NextResponse.json({ variation });
  } catch (err) {
    return errorResponse(err);
  }
}
