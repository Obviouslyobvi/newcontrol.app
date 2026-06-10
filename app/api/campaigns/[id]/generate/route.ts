import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { getOwnedCampaign } from "@/lib/db/queries";
import { generateSchema } from "@/lib/utils/validation";
import { errorResponse, errors } from "@/lib/utils/errors";
import { checkRateLimit, RATE_LIMITS, rateLimitHeaders } from "@/lib/utils/rate-limit";
import {
  generateOneVariation,
  loadBrandProfile,
} from "@/lib/ai/generate-campaign";

export const maxDuration = 300; // AI generation needs the long lane
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

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
    if (!rl.allowed) throw errors.rateLimited("Generation limit reached for this hour. Try again soon.");

    const body = await req.json().catch(() => ({}));
    const { variationCount } = generateSchema.parse(body);

    const db = getDb();
    const brandProfile = await loadBrandProfile(campaign);

    // Regenerating replaces the existing set.
    await db
      .delete(schema.campaignVariations)
      .where(eq(schema.campaignVariations.campaignId, campaign.id));
    await db
      .update(schema.campaigns)
      .set({ status: "generating", updatedAt: new Date() })
      .where(eq(schema.campaigns.id, campaign.id));

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: object) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));

        try {
          for (let v = 1; v <= variationCount; v++) {
            send({ type: "progress", variation: v, status: "generating" });
            try {
              const variation = await generateOneVariation(campaign, brandProfile, v);
              send({ type: "variation_complete", variation: v, data: variation });
            } catch (err) {
              console.error(`Variation ${v} failed:`, err);
              send({
                type: "error",
                message:
                  err instanceof Error && err.name === "AiNotConfiguredError"
                    ? err.message
                    : `Variation ${v} failed to generate. The others will continue.`,
              });
            }
          }

          await db
            .update(schema.campaigns)
            .set({ status: "completed", updatedAt: new Date() })
            .where(eq(schema.campaigns.id, campaign.id));

          send({ type: "done" });
        } catch (err) {
          console.error("Generation stream failed:", err);
          send({ type: "error", message: "Generation failed. Please try again." });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        ...rateLimitHeaders(rl),
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
