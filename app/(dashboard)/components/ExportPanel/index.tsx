"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, File, FileType, Printer, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { Campaign, CampaignVariation } from "@/lib/db/schema";

type Format = "pdf_print" | "pdf_digital" | "docx" | "txt";

const FORMATS: {
  value: Format;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "pdf_print",
    label: "Print-ready PDF",
    description: "US Letter with proper margins and fold marks — hand it straight to your printer.",
    icon: Printer,
  },
  {
    value: "pdf_digital",
    label: "Digital PDF",
    description: "Clean PDF for email attachments, review, and approvals.",
    icon: FileText,
  },
  {
    value: "docx",
    label: "Word (DOCX)",
    description: "Editable Word document with proper styles for further work.",
    icon: FileType,
  },
  {
    value: "txt",
    label: "Plain text",
    description: "Just the words — paste anywhere.",
    icon: File,
  },
];

export default function ExportPanel({
  campaign,
  variations,
  initialVariationId,
}: {
  campaign: Campaign;
  variations: CampaignVariation[];
  initialVariationId?: string;
}) {
  const [variationId, setVariationId] = useState(
    initialVariationId && variations.some((v) => v.id === initialVariationId)
      ? initialVariationId
      : variations[0]?.id ?? ""
  );
  const [downloading, setDownloading] = useState<Format | "all" | null>(null);

  async function download(format: Format): Promise<boolean> {
    const res = await fetch(`/api/campaigns/${campaign.id}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variationId, format }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error?.message ?? "Export failed");
      return false;
    }
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const filename =
      disposition.match(/filename="([^"]+)"/)?.[1] ?? `export.${format}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }

  async function handleDownload(format: Format) {
    setDownloading(format);
    try {
      const ok = await download(format);
      if (ok) toast.success("Download started");
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setDownloading(null);
    }
  }

  async function handleExportAll() {
    setDownloading("all");
    try {
      for (const f of FORMATS) {
        const ok = await download(f.value);
        if (!ok) break;
      }
    } finally {
      setDownloading(null);
    }
  }

  if (variations.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center py-16">
        <h1 className="font-serif text-3xl tracking-tight mb-4">Nothing to export yet</h1>
        <p className="text-fg/55 mb-8">Generate variations first, then come back to export.</p>
        <Link
          href={`/campaigns/${campaign.id}`}
          className="inline-flex bg-fg text-bg px-6 py-3 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
        >
          Back to campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/campaigns/${campaign.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-fg/55 hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </Link>

      <h1 className="font-serif text-4xl tracking-tight mb-2">Export</h1>
      <p className="text-fg/55 mb-8">{campaign.title}</p>

      <div className="mb-8 max-w-sm">
        <span className="block text-sm font-medium mb-1.5">Variation</span>
        <Select value={variationId} onChange={(e) => setVariationId(e.target.value)}>
          {variations.map((v) => (
            <option key={v.id} value={v.id}>
              Variation {v.variationNumber}
              {v.isEdited ? " (edited)" : ""} — {(v.editedContent ?? v.content).headline.slice(0, 50)}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {FORMATS.map((f) => (
          <Card key={f.value} className="p-5 flex flex-col">
            <div className="inline-flex h-9 w-9 rounded-full bg-fg/8 text-fg/60 items-center justify-center mb-3">
              <f.icon className="h-4 w-4" />
            </div>
            <div className="font-medium mb-1">{f.label}</div>
            <p className="text-sm text-fg/55 leading-snug mb-4 flex-1">{f.description}</p>
            <button
              type="button"
              onClick={() => handleDownload(f.value)}
              disabled={downloading !== null}
              className="inline-flex items-center justify-center gap-2 text-sm bg-fg text-bg px-4 py-2.5 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading === f.value ? "Preparing…" : "Download"}
            </button>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleExportAll}
          disabled={downloading !== null}
          className="text-sm text-fg/55 hover:text-ember transition-colors underline-offset-4 hover:underline disabled:opacity-50"
        >
          {downloading === "all" ? "Exporting all formats…" : "Export this variation in all four formats"}
        </button>
      </div>
    </div>
  );
}
