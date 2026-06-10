"use client";

import { X } from "lucide-react";
import type { CampaignVariation } from "@/lib/db/schema";

/** Full letter preview, styled like a printed page. */
export default function VariationPreview({
  variation,
  onClose,
}: {
  variation: CampaignVariation;
  onClose: () => void;
}) {
  const content = variation.editedContent ?? variation.content;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative my-8 w-full max-w-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute -top-3 -right-3 z-10 h-10 w-10 rounded-full bg-fg text-bg flex items-center justify-center shadow-lg hover:bg-ember hover:text-cream transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {/* Printed page look — intentionally light in both themes */}
        <div className="bg-white text-neutral-900 rounded-lg shadow-2xl px-10 py-12 md:px-16 md:py-16">
          {content.johnsonBox && (
            <div className="border-2 border-neutral-800 px-5 py-4 mb-8 text-center font-semibold leading-relaxed">
              {content.johnsonBox}
            </div>
          )}
          <h2 className="font-serif text-2xl md:text-3xl leading-snug mb-6">
            {content.headline}
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed">
            {content.opening.split("\n\n").map((p, i) => (
              <p key={`o${i}`}>{p}</p>
            ))}
            {content.body.split("\n\n").map((p, i) => (
              <p key={`b${i}`}>{p}</p>
            ))}
            <p className="font-medium">{content.cta}</p>
            {content.guarantee && (
              <p className="border-l-4 border-neutral-300 pl-4 italic">
                {content.guarantee}
              </p>
            )}
          </div>
          {content.ps.length > 0 && (
            <div className="mt-8 space-y-3 text-[15px] leading-relaxed">
              {content.ps.map((ps, i) => (
                <p key={`ps${i}`}>
                  <span className="font-semibold">
                    {i === 0 ? "P.S." : `P.P.S.`}
                  </span>{" "}
                  {ps.replace(/^P\.?P?\.?S\.?:?\s*/i, "")}
                </p>
              ))}
            </div>
          )}
          {content.responseCard && (
            <div className="mt-10 border border-dashed border-neutral-400 px-5 py-4 text-sm leading-relaxed">
              {content.responseCard}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
