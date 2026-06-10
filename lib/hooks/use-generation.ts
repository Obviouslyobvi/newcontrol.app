"use client";

import { useCallback, useRef, useState } from "react";
import type { CampaignVariation } from "@/lib/db/schema";

export type GenerationEvent =
  | { type: "progress"; variation: number; status: string }
  | { type: "variation_complete"; variation: number; data: CampaignVariation }
  | { type: "error"; message: string }
  | { type: "done" };

/**
 * Streams campaign generation over SSE from POST /api/campaigns/[id]/generate.
 * Variations arrive one at a time; progress moves as each completes.
 */
export function useGeneration(campaignId: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [currentVariation, setCurrentVariation] = useState(0);
  const [variations, setVariations] = useState<CampaignVariation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (variationCount = 5) => {
      setIsGenerating(true);
      setProgress(0.02);
      setCurrentVariation(1);
      setVariations([]);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`/api/campaigns/${campaignId}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variationCount }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error?.message ?? "Generation failed. Please try again.");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by a blank line.
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const dataLine = chunk
              .split("\n")
              .find((l) => l.startsWith("data: "));
            if (!dataLine) continue;
            let event: GenerationEvent;
            try {
              event = JSON.parse(dataLine.slice(6));
            } catch {
              continue;
            }

            if (event.type === "progress") {
              setCurrentVariation(event.variation);
              setProgress(
                Math.max(0.05, (event.variation - 1) / variationCount)
              );
            } else if (event.type === "variation_complete") {
              setVariations((prev) => [...prev, event.data]);
              setProgress(event.variation / variationCount);
            } else if (event.type === "error") {
              setError(event.message);
            } else if (event.type === "done") {
              setProgress(1);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Connection lost during generation. Refresh to see saved variations.");
        }
      } finally {
        setIsGenerating(false);
        abortRef.current = null;
      }
    },
    [campaignId]
  );

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  return {
    generate,
    cancel,
    isGenerating,
    progress,
    currentVariation,
    variations,
    error,
  };
}
