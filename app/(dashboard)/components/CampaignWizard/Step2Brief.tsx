"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutTemplate, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { Badge } from "@/components/ui/badge";
import type { CampaignBrief, Template, BrandProfile } from "@/lib/db/schema";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-ember ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-fg/45 mt-1.5">{hint}</span>}
    </label>
  );
}

export default function Step2Brief({
  title,
  onTitleChange,
  brief,
  onBriefChange,
  brandProfiles,
  brandProfileId,
  onBrandProfileChange,
  templates,
  onApplyTemplate,
  appliedTemplateName,
}: {
  title: string;
  onTitleChange: (title: string) => void;
  brief: CampaignBrief;
  onBriefChange: (brief: CampaignBrief) => void;
  brandProfiles: BrandProfile[];
  brandProfileId: string | null;
  onBrandProfileChange: (id: string | null) => void;
  templates: Template[];
  onApplyTemplate: (template: Template) => void;
  appliedTemplateName: string | null;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const set = (patch: Partial<CampaignBrief>) =>
    onBriefChange({ ...brief, ...patch });

  const categories = Array.from(
    new Set(templates.map((t) => t.category).filter(Boolean))
  ) as string[];
  const visibleTemplates = categoryFilter
    ? templates.filter((t) => t.category === categoryFilter)
    : templates;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <h2 className="font-serif text-3xl tracking-tight">
          Tell us about the campaign
        </h2>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 text-sm border border-fg/15 px-4 py-2 rounded-full hover:bg-fg/5 transition-colors"
        >
          <LayoutTemplate className="h-4 w-4" />
          Use a template
        </button>
      </div>
      <p className="text-fg/55 mb-8">
        The more specific the brief, the sharper the letter. Three required
        fields — everything else makes it better.
      </p>

      {appliedTemplateName && (
        <div className="mb-6">
          <Badge variant="ember">Template: {appliedTemplateName}</Badge>
        </div>
      )}

      <div className="space-y-5">
        <Field label="Campaign title" required hint="Just for your dashboard — readers never see it.">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Spring HVAC Tune-Up Letter"
          />
        </Field>

        <Field
          label="What are you offering?"
          required
          hint="The product, service, or deal. Include the price if you want it mentioned."
        >
          <Textarea
            value={brief.offer}
            onChange={(e) => set({ offer: e.target.value })}
            placeholder="A $89 pre-summer air conditioning tune-up (normally $149) that includes a 21-point inspection…"
          />
        </Field>

        <Field
          label="Who is this for?"
          required
          hint="Paint the reader. Age, situation, neighborhood, what keeps them up at night."
        >
          <Textarea
            value={brief.audience}
            onChange={(e) => set({ audience: e.target.value })}
            placeholder="Homeowners in the Maple Grove area with systems 8+ years old who dread the first heat wave…"
          />
        </Field>

        <Field
          label="What's the main benefit?"
          required
          hint="The single biggest thing the reader gets. One idea beats five."
        >
          <Textarea
            value={brief.mainBenefit}
            onChange={(e) => set({ mainBenefit: e.target.value })}
            placeholder="Never sweat through a July breakdown — catch the failure in May for a tenth of the cost…"
          />
        </Field>

        <Field label="Pain points" hint="Press Enter after each one.">
          <TagInput
            value={brief.painPoints}
            onChange={(painPoints) => set({ painPoints })}
            placeholder="Emergency repair bills, week-long waits in peak season…"
          />
        </Field>

        <Field
          label="Proof elements"
          hint="Real testimonials, years in business, guarantees, review counts. Only real ones — the AI will never invent proof."
        >
          <TagInput
            value={brief.proofElements}
            onChange={(proofElements) => set({ proofElements })}
            placeholder="4.9 stars on Google (312 reviews), serving Maple Grove since 2009…"
          />
        </Field>

        <Field label="Competitors" hint="Who else is the reader considering?">
          <TagInput
            value={brief.competitors}
            onChange={(competitors) => set({ competitors })}
            placeholder="Big-box home warranty plans, the franchise chains…"
          />
        </Field>

        <Field label="Call to action" hint="Exactly what should the reader do?">
          <Input
            value={brief.cta}
            onChange={(e) => set({ cta: e.target.value })}
            placeholder="Call (555) 123-4567 or book online before May 31"
          />
        </Field>

        <Field label="Special requirements" hint="Anything to mention, avoid, or comply with.">
          <Textarea
            value={brief.specialRequirements}
            onChange={(e) => set({ specialRequirements: e.target.value })}
            placeholder="Must mention we're family-owned. Don't mention pricing for the repair side…"
          />
        </Field>

        <Field
          label="Brand voice"
          hint={
            brandProfiles.length === 0
              ? "No brand profiles yet — create one to make every campaign sound like you."
              : "Applies your saved tone, vocabulary, and example copy."
          }
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Select
                value={brandProfileId ?? ""}
                onChange={(e) => onBrandProfileChange(e.target.value || null)}
              >
                <option value="">No brand voice (neutral)</option>
                {brandProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.isDefault ? " (default)" : ""}
                  </option>
                ))}
              </Select>
            </div>
            <Link
              href="/brand"
              className="text-sm text-ember hover:underline underline-offset-4 whitespace-nowrap"
            >
              Create new
            </Link>
          </div>
        </Field>
      </div>

      {/* Template picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPickerOpen(false)}
          />
          <div className="relative bg-bg border border-fg/10 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-fg/10">
              <h3 className="font-serif text-2xl tracking-tight">
                Template library
              </h3>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
                className="h-9 w-9 rounded-full hover:bg-fg/5 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-3 border-b border-fg/10 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryFilter("")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!categoryFilter ? "border-ember text-ember bg-ember/5" : "border-fg/15 text-fg/60 hover:border-fg/30"}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${categoryFilter === c ? "border-ember text-ember bg-ember/5" : "border-fg/15 text-fg/60 hover:border-fg/30"}`}
                >
                  {c.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-6 grid sm:grid-cols-2 gap-3">
              {visibleTemplates.length === 0 ? (
                <p className="text-fg/50 text-sm col-span-2">
                  No templates available yet. Once the database is seeded
                  (npm run db:seed), 25 launch templates appear here.
                </p>
              ) : (
                visibleTemplates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onApplyTemplate(t);
                      setPickerOpen(false);
                    }}
                    className="text-left p-4 rounded-2xl border border-fg/10 bg-surface hover:border-ember/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-medium text-sm">{t.name}</span>
                    </div>
                    <p className="text-xs text-fg/55 leading-snug mb-2">
                      {t.description}
                    </p>
                    <div className="flex gap-1.5">
                      {t.category && (
                        <Badge variant="default" className="capitalize">
                          {t.category}
                        </Badge>
                      )}
                      {t.industry && (
                        <Badge variant="outline" className="capitalize">
                          {t.industry.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
