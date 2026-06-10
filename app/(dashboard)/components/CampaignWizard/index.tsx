"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Template, BrandProfile, CampaignBrief } from "@/lib/db/schema";
import StepIndicator from "./StepIndicator";
import Step1Type from "./Step1Type";
import Step2Brief from "./Step2Brief";
import Step3Tone from "./Step3Tone";
import Step4Review from "./Step4Review";
import { EMPTY_BRIEF, CAMPAIGN_TYPES, type CampaignType } from "./types";

export default function CampaignWizard({
  templates,
  brandProfiles,
  initialTemplateId,
}: {
  templates: Template[];
  brandProfiles: BrandProfile[];
  initialTemplateId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState<CampaignType>("sales_letter");
  const [title, setTitle] = useState("");
  const [titleEdited, setTitleEdited] = useState(false);
  const [brief, setBrief] = useState<CampaignBrief>(EMPTY_BRIEF);
  const defaultProfile = brandProfiles.find((p) => p.isDefault);
  const [brandProfileId, setBrandProfileId] = useState<string | null>(
    defaultProfile?.id ?? null
  );
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [appliedTemplateName, setAppliedTemplateName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Arriving from the template library (?template=ID) pre-applies it.
  const initialApplied = useRef(false);
  useEffect(() => {
    if (initialApplied.current || !initialTemplateId) return;
    const t = templates.find((tpl) => tpl.id === initialTemplateId);
    if (t) {
      initialApplied.current = true;
      applyTemplate(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateId, templates]);

  function autoTitle(type: CampaignType, offer: string): string {
    const label = CAMPAIGN_TYPES.find((t) => t.value === type)?.label ?? "Campaign";
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const offerWords = offer.trim().split(/\s+/).slice(0, 5).join(" ");
    return offerWords ? `${label}: ${offerWords}…` : `${label} — ${date}`;
  }

  function applyTemplate(t: Template) {
    const merged = { ...EMPTY_BRIEF, ...(t.briefTemplate ?? {}) };
    setBrief((prev) => ({
      ...merged,
      // Keep anything the user already typed over template defaults.
      offer: prev.offer || merged.offer,
      audience: prev.audience || merged.audience,
      mainBenefit: prev.mainBenefit || merged.mainBenefit,
    }));
    if (t.campaignType) setCampaignType(t.campaignType);
    setTemplateId(t.id);
    setAppliedTemplateName(t.name);
    if (!titleEdited) setTitle(t.name);
  }

  const step2Valid =
    title.trim() && brief.offer.trim() && brief.audience.trim() && brief.mainBenefit.trim();

  function next() {
    if (step === 1 && !titleEdited && !title) {
      setTitle(autoTitle(campaignType, brief.offer));
    }
    if (step === 2 && !step2Valid) {
      toast.error("Fill in the required fields: title, offer, audience, and main benefit.");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  }

  async function save(generateAfter: boolean) {
    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          campaignType,
          brief,
          brandProfileId,
          templateId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Could not save the campaign.");
        return;
      }
      const id = data.campaign.id;
      router.push(generateAfter ? `/campaigns/${id}?generate=1` : `/campaigns/${id}`);
    } catch {
      toast.error("Network error. Your inputs are still here — try again.");
    } finally {
      setSaving(false);
    }
  }

  const selectedProfile =
    brandProfiles.find((p) => p.id === brandProfileId) ?? null;

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1Type value={campaignType} onChange={setCampaignType} />
      )}
      {step === 2 && (
        <Step2Brief
          title={title}
          onTitleChange={(t) => {
            setTitle(t);
            setTitleEdited(true);
          }}
          brief={brief}
          onBriefChange={setBrief}
          brandProfiles={brandProfiles}
          brandProfileId={brandProfileId}
          onBrandProfileChange={setBrandProfileId}
          templates={templates}
          onApplyTemplate={applyTemplate}
          appliedTemplateName={appliedTemplateName}
        />
      )}
      {step === 3 && <Step3Tone brief={brief} onBriefChange={setBrief} />}
      {step === 4 && (
        <Step4Review
          title={title}
          campaignType={campaignType}
          brief={brief}
          brandProfile={selectedProfile}
        />
      )}

      <div className="flex items-center justify-between mt-10">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || saving}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < 4 ? (
          <Button onClick={next} size="lg">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => save(false)}
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              Save as draft
            </Button>
            <Button size="lg" onClick={() => save(true)} disabled={saving}>
              <Sparkles className="h-4 w-4" />
              {saving ? "Saving…" : "Generate 5 variations"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
