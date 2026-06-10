"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, RefreshCw, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Campaign, CampaignVariation, VariationContent } from "@/lib/db/schema";
import SectionEditor from "./SectionEditor";

type SectionKey = "headline" | "opening" | "body" | "cta" | "ps";

function assembleFullText(c: VariationContent): string {
  return [
    c.headline,
    c.opening,
    c.body,
    c.cta,
    c.guarantee ?? "",
    "Sincerely,\n[Your Name]",
    c.ps.map((p, i) => `${i === 0 ? "P.S." : "P.P.S."} ${p}`).join("\n\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export default function Editor({
  campaign,
  variation,
}: {
  campaign: Campaign;
  variation: CampaignVariation;
}) {
  const [content, setContent] = useState<VariationContent>(
    variation.editedContent ?? variation.content
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState<SectionKey | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  const update = useCallback((patch: Partial<VariationContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      next.fullText = assembleFullText(next);
      return next;
    });
    setDirty(true);
  }, []);

  const save = useCallback(async (silent = false) => {
    setSaving(true);
    try {
      const res = await fetch(
        `/api/campaigns/${campaign.id}/variations/${variation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ editedContent: contentRef.current }),
        }
      );
      if (res.ok) {
        setDirty(false);
        setLastSaved(new Date());
        if (!silent) toast.success("Saved");
      } else if (!silent) {
        toast.error("Could not save changes");
      }
    } catch {
      if (!silent) toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  }, [campaign.id, variation.id]);

  // Auto-save every 10 seconds while there are unsaved changes.
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyRef.current) save(true);
    }, 10_000);
    return () => clearInterval(interval);
  }, [save]);

  async function regenerate(section: SectionKey) {
    setRegenerating(section);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variationId: variation.id, section }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Regeneration failed");
        return;
      }
      const fresh: VariationContent =
        data.variation.editedContent ?? data.variation.content;
      setContent(fresh);
      setDirty(false);
      toast.success("Section rewritten");
    } catch {
      toast.error("Network error during regeneration");
    } finally {
      setRegenerating(null);
    }
  }

  const preview = useMemo(() => content, [content]);

  function SectionHeader({ label, section }: { label: string; section: SectionKey }) {
    return (
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-fg/45 font-medium">
          {label}
        </span>
        <button
          type="button"
          onClick={() => regenerate(section)}
          disabled={regenerating !== null}
          className="inline-flex items-center gap-1 text-xs text-fg/50 hover:text-ember transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3 w-3 ${regenerating === section ? "animate-spin" : ""}`}
          />
          {regenerating === section ? "Rewriting…" : "Rewrite this section"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href={`/campaigns/${campaign.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-fg/55 hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to variations
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: editor */}
        <div className="space-y-6">
          <h1 className="font-serif text-3xl tracking-tight">
            Edit variation {variation.variationNumber}
          </h1>

          <div>
            <SectionHeader label="Headline" section="headline" />
            <Input
              value={content.headline}
              onChange={(e) => update({ headline: e.target.value })}
            />
          </div>

          {content.johnsonBox !== null && (
            <div>
              <span className="block text-xs uppercase tracking-wider text-fg/45 font-medium mb-1.5">
                Johnson box
              </span>
              <Textarea
                value={content.johnsonBox ?? ""}
                onChange={(e) => update({ johnsonBox: e.target.value || null })}
                className="min-h-[64px]"
              />
            </div>
          )}

          <div>
            <SectionHeader label="Opening" section="opening" />
            <SectionEditor
              value={content.opening}
              onChange={(opening) => update({ opening })}
              placeholder="The scene that pulls the reader in…"
            />
          </div>

          <div>
            <SectionHeader label="Body" section="body" />
            <SectionEditor
              value={content.body}
              onChange={(body) => update({ body })}
              placeholder="The case for your offer…"
            />
          </div>

          <div>
            <SectionHeader label="Call to action" section="cta" />
            <SectionEditor
              value={content.cta}
              onChange={(cta) => update({ cta })}
              placeholder="Exactly what to do next…"
            />
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wider text-fg/45 font-medium mb-1.5">
              Guarantee
            </span>
            <Textarea
              value={content.guarantee ?? ""}
              onChange={(e) => update({ guarantee: e.target.value || null })}
              className="min-h-[72px]"
            />
          </div>

          <div>
            <SectionHeader label="P.S." section="ps" />
            {content.ps.map((ps, i) => (
              <div key={i} className="mb-2">
                <Textarea
                  value={ps}
                  onChange={(e) => {
                    const next = [...content.ps];
                    next[i] = e.target.value;
                    update({ ps: next });
                  }}
                  className="min-h-[60px]"
                />
              </div>
            ))}
            {content.ps.length === 0 && (
              <button
                type="button"
                onClick={() => update({ ps: [""] })}
                className="text-sm text-ember hover:underline underline-offset-4"
              >
                + Add a P.S.
              </button>
            )}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="lg:sticky lg:top-24">
          <div className="text-xs uppercase tracking-wider text-fg/45 font-medium mb-2">
            Live preview
          </div>
          <div className="bg-white text-neutral-900 rounded-lg shadow-xl px-8 py-10 md:px-12 md:py-12 max-h-[75vh] overflow-y-auto">
            {preview.johnsonBox && (
              <div className="border-2 border-neutral-800 px-4 py-3 mb-6 text-center font-semibold text-sm leading-relaxed">
                {preview.johnsonBox}
              </div>
            )}
            <h2 className="font-serif text-xl md:text-2xl leading-snug mb-5">
              {preview.headline}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              {preview.opening.split("\n\n").filter(Boolean).map((p, i) => (
                <p key={`o${i}`}>{p}</p>
              ))}
              {preview.body.split("\n\n").filter(Boolean).map((p, i) => (
                <p key={`b${i}`}>{p}</p>
              ))}
              <p className="font-medium">{preview.cta}</p>
              {preview.guarantee && (
                <p className="border-l-4 border-neutral-300 pl-3 italic">
                  {preview.guarantee}
                </p>
              )}
              <p>
                Sincerely,
                <br />
                [Your Name]
              </p>
              {preview.ps.filter(Boolean).map((ps, i) => (
                <p key={`ps${i}`}>
                  <span className="font-semibold">{i === 0 ? "P.S." : "P.P.S."}</span>{" "}
                  {ps}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 mt-10 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-bg/90 backdrop-blur-md border-t border-fg/10 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-fg/45">
          {saving
            ? "Saving…"
            : dirty
              ? "Unsaved changes (auto-saves every 10s)"
              : lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString()}`
                : "No changes yet"}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => save()} disabled={saving || !dirty}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Link
            href={`/campaigns/${campaign.id}/export?variation=${variation.id}`}
            className="inline-flex items-center gap-2 bg-fg text-bg px-5 py-2.5 rounded-full text-sm font-medium hover:bg-ember hover:text-cream transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </Link>
        </div>
      </div>
    </div>
  );
}
