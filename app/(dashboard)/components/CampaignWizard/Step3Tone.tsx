"use client";

import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { CampaignBrief } from "@/lib/db/schema";
import { TONES, OPENING_ANGLES } from "./types";

const LENGTHS: {
  value: CampaignBrief["letterLength"];
  label: string;
  description: string;
}[] = [
  { value: "short", label: "Short", description: "1–2 pages. Quick read, single offer." },
  { value: "medium", label: "Medium", description: "About 4 pages. Room for story and proof." },
  { value: "long", label: "Long", description: "8+ pages. The full persuasion engine." },
];

export default function Step3Tone({
  brief,
  onBriefChange,
}: {
  brief: CampaignBrief;
  onBriefChange: (brief: CampaignBrief) => void;
}) {
  const set = (patch: Partial<CampaignBrief>) =>
    onBriefChange({ ...brief, ...patch });

  const isCustomTone = !TONES.includes(brief.tone as (typeof TONES)[number]);
  const toneSelectValue = isCustomTone ? "custom" : brief.tone;

  return (
    <div>
      <h2 className="font-serif text-3xl tracking-tight mb-2">
        Tone &amp; length
      </h2>
      <p className="text-fg/55 mb-8">
        How should it sound, and how long should it run?
      </p>

      <div className="mb-8">
        <span className="block text-sm font-medium mb-3">Tone</span>
        <div className="flex flex-wrap gap-2">
          {TONES.filter((t) => t !== "custom").map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => set({ tone })}
              className={cn(
                "px-4 py-2 rounded-full border text-sm capitalize transition-colors",
                brief.tone === tone
                  ? "border-ember text-ember bg-ember/5"
                  : "border-fg/15 text-fg/60 hover:border-fg/30"
              )}
            >
              {tone}
            </button>
          ))}
          <button
            type="button"
            onClick={() => set({ tone: isCustomTone ? brief.tone : "" })}
            className={cn(
              "px-4 py-2 rounded-full border text-sm transition-colors",
              toneSelectValue === "custom" && isCustomTone
                ? "border-ember text-ember bg-ember/5"
                : "border-fg/15 text-fg/60 hover:border-fg/30"
            )}
          >
            Custom…
          </button>
        </div>
        {(isCustomTone || brief.tone === "") && (
          <div className="mt-3">
            <Input
              value={brief.tone}
              onChange={(e) => set({ tone: e.target.value })}
              placeholder="Describe the tone in your own words — e.g. 'plainspoken Midwestern, a little dry humor'"
            />
          </div>
        )}
      </div>

      <div className="mb-8">
        <span className="block text-sm font-medium mb-3">Length</span>
        <div role="radiogroup" className="grid sm:grid-cols-3 gap-3">
          {LENGTHS.map((l) => (
            <button
              key={l.value}
              type="button"
              role="radio"
              aria-checked={brief.letterLength === l.value}
              onClick={() => set({ letterLength: l.value })}
              className={cn(
                "text-left p-4 rounded-2xl border transition-colors",
                brief.letterLength === l.value
                  ? "border-ember bg-ember/5 ring-2 ring-ember/20"
                  : "border-fg/10 bg-surface hover:border-fg/25"
              )}
            >
              <div className="font-medium mb-1">{l.label}</div>
              <div className="text-sm text-fg/55">{l.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium mb-1.5">
          Opening angle preference
        </span>
        <Select
          value={brief.openingAnglePreference ?? ""}
          onChange={(e) =>
            set({ openingAnglePreference: e.target.value || undefined })
          }
        >
          {OPENING_ANGLES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </Select>
        <span className="block text-xs text-fg/45 mt-1.5">
          By default each of the five variations opens from a different angle,
          so you can test what resonates.
        </span>
      </div>
    </div>
  );
}
