import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Campaign } from "@/lib/db/schema";

const STATUS_BADGE: Record<
  Campaign["status"],
  { label: string; variant: "default" | "ember" | "success" | "warning" | "outline" }
> = {
  draft: { label: "Draft", variant: "outline" },
  generating: { label: "Generating…", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  exported: { label: "Exported", variant: "ember" },
  archived: { label: "Archived", variant: "default" },
};

const TYPE_LABELS: Record<Campaign["campaignType"], string> = {
  sales_letter: "Sales Letter",
  postcard: "Postcard",
  email: "Email",
  social_ad: "Social Ad",
  landing_page: "Landing Page",
  cold_email: "Cold Email",
  lead_gen: "Lead Gen",
  followup: "Follow-up",
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const status = STATUS_BADGE[campaign.status];
  return (
    <Link href={`/campaigns/${campaign.id}`} className="block group">
      <Card className="p-5 h-full hover:border-fg/25 transition-colors">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="default">{TYPE_LABELS[campaign.campaignType]}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <h3 className="font-serif text-xl tracking-tight leading-snug mb-2 group-hover:text-ember transition-colors">
          {campaign.title}
        </h3>
        <p className="text-sm text-fg/55 line-clamp-2 mb-4">
          {campaign.brief?.offer}
        </p>
        <div className="text-xs text-fg/40">
          {new Date(campaign.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </Card>
    </Link>
  );
}
