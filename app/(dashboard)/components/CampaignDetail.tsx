"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Campaign, CampaignVariation } from "@/lib/db/schema";
import { useGeneration } from "@/lib/hooks/use-generation";
import ResultsViewer from "./ResultsViewer";

const TYPE_LABELS: Record<string, string> = {
  sales_letter: "Sales Letter",
  postcard: "Postcard",
  email: "Email",
  social_ad: "Social Ad",
  landing_page: "Landing Page",
  cold_email: "Cold Email",
  lead_gen: "Lead Gen",
  followup: "Follow-up",
};

export default function CampaignDetail({
  campaign,
  initialVariations,
}: {
  campaign: Campaign;
  initialVariations: CampaignVariation[];
}) {
  const router = useRouter();
  const search = useSearchParams();
  const {
    generate,
    isGenerating,
    progress,
    currentVariation,
    variations: streamed,
    error,
  } = useGeneration(campaign.id);

  const autoStarted = useRef(false);
  const [deleting, setDeleting] = useState(false);

  // Wizard hands off with ?generate=1 to start immediately.
  useEffect(() => {
    if (
      search.get("generate") === "1" &&
      !autoStarted.current &&
      initialVariations.length === 0
    ) {
      autoStarted.current = true;
      generate(5);
    }
  }, [search, generate, initialVariations.length]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const variations = streamed.length > 0 ? streamed : initialVariations;
  const hasResults = variations.length > 0;

  async function handleDelete() {
    if (!confirm("Archive this campaign? You can't undo this from the app yet.")) return;
    setDeleting(true);
    const res = await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/campaigns");
      router.refresh();
    } else {
      toast.error("Could not archive the campaign.");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-fg/55 hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All campaigns
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="ember">
              {TYPE_LABELS[campaign.campaignType] ?? campaign.campaignType}
            </Badge>
            <Badge variant="default" className="capitalize">
              {campaign.brief.tone} · {campaign.brief.letterLength}
            </Badge>
          </div>
          <h1 className="font-serif text-4xl tracking-tight">
            {campaign.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Archive campaign"
            title="Archive campaign"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {!isGenerating && (
            <Button onClick={() => generate(5)} size="lg">
              <Sparkles className="h-4 w-4" />
              {hasResults ? "Regenerate all 5" : "Generate 5 variations"}
            </Button>
          )}
        </div>
      </div>

      {!hasResults && !isGenerating && (
        <Card className="p-8 mb-8">
          <h2 className="font-serif text-2xl tracking-tight mb-4">The brief</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-fg/45 mb-1">Offer</dt>
              <dd className="leading-relaxed">{campaign.brief.offer}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-fg/45 mb-1">Audience</dt>
              <dd className="leading-relaxed">{campaign.brief.audience}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-fg/45 mb-1">Main benefit</dt>
              <dd className="leading-relaxed">{campaign.brief.mainBenefit}</dd>
            </div>
            {campaign.brief.cta && (
              <div>
                <dt className="text-xs uppercase tracking-wider text-fg/45 mb-1">Call to action</dt>
                <dd className="leading-relaxed">{campaign.brief.cta}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      <ResultsViewer
        campaignId={campaign.id}
        variations={variations}
        isGenerating={isGenerating}
        progress={progress}
        currentVariation={currentVariation}
      />
    </div>
  );
}
