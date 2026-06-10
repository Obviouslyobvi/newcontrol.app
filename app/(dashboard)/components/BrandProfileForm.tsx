"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import type { BrandProfile, ToneSettings } from "@/lib/db/schema";

const DEFAULT_TONE: ToneSettings = {
  formal: 0.5,
  friendly: 0.5,
  authoritative: 0.5,
  casual: 0.5,
};

function Slider({
  label,
  low,
  high,
  value,
  onChange,
}: {
  label: string;
  low: string;
  high: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-fg/45 mb-1">
        <span>{low}</span>
        <span className="font-medium text-fg/70">{label}</span>
        <span>{high}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full accent-[#DD3B0B]"
        aria-label={label}
      />
    </div>
  );
}

export default function BrandProfileForm({
  profile,
  onClose,
}: {
  profile: BrandProfile | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile?.name ?? "");
  const [description, setDescription] = useState(profile?.description ?? "");
  const [tone, setTone] = useState<ToneSettings>(profile?.toneSettings ?? DEFAULT_TONE);
  const [customTone, setCustomTone] = useState(profile?.toneSettings?.custom ?? "");
  const [wordsToUse, setWordsToUse] = useState<string[]>(profile?.wordsToUse ?? []);
  const [wordsToAvoid, setWordsToAvoid] = useState<string[]>(profile?.wordsToAvoid ?? []);
  const [exampleCopy, setExampleCopy] = useState<string[]>(
    profile?.exampleCopy?.length ? profile.exampleCopy : [""]
  );
  const [docUrls, setDocUrls] = useState<string[]>(profile?.uploadedDocUrls ?? []);
  const [isDefault, setIsDefault] = useState(profile?.isDefault ?? false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Upload failed");
        return;
      }
      setDocUrls((prev) => [...prev, data.url]);
      toast.success(`Uploaded ${data.filename}`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!name.trim()) {
      toast.error("Give the brand profile a name");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        description,
        toneSettings: { ...tone, custom: customTone || undefined },
        wordsToUse,
        wordsToAvoid,
        exampleCopy: exampleCopy.map((e) => e.trim()).filter(Boolean),
        uploadedDocUrls: docUrls,
        isDefault,
      };
      const res = await fetch(
        profile ? `/api/brand-profiles/${profile.id}` : "/api/brand-profiles",
        {
          method: profile ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Could not save the profile");
        return;
      }
      toast.success(profile ? "Profile updated" : "Brand profile created");
      onClose();
      router.refresh();
    } catch {
      toast.error("Network error — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative my-8 w-full max-w-2xl bg-bg border border-fg/10 rounded-3xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-fg/10">
          <h2 className="font-serif text-2xl tracking-tight">
            {profile ? "Edit brand voice" : "New brand voice"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 rounded-full hover:bg-fg/5 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <label className="block">
            <span className="block text-sm font-medium mb-1.5">
              Name <span className="text-ember">*</span>
            </span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Plumbing — main voice"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium mb-1.5">About the company</span>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Family-owned plumbing company serving the metro area since 1998. We answer our own phones…"
            />
          </label>

          <div>
            <span className="block text-sm font-medium mb-3">Tone</span>
            <div className="space-y-4">
              <Slider label="Formality" low="Casual" high="Formal" value={tone.formal} onChange={(formal) => setTone({ ...tone, formal })} />
              <Slider label="Warmth" low="Reserved" high="Friendly" value={tone.friendly} onChange={(friendly) => setTone({ ...tone, friendly })} />
              <Slider label="Authority" low="Peer-level" high="Authoritative" value={tone.authoritative} onChange={(authoritative) => setTone({ ...tone, authoritative })} />
              <Slider label="Register" low="Buttoned-up" high="Casual" value={tone.casual} onChange={(casual) => setTone({ ...tone, casual })} />
            </div>
            <div className="mt-3">
              <Input
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="Describe your voice in your own words (optional)"
              />
            </div>
          </div>

          <label className="block">
            <span className="block text-sm font-medium mb-1.5">Words & phrases to use</span>
            <TagInput value={wordsToUse} onChange={setWordsToUse} placeholder="neighborly, honest pricing, done right…" />
          </label>

          <label className="block">
            <span className="block text-sm font-medium mb-1.5">Words & phrases to avoid</span>
            <TagInput value={wordsToAvoid} onChange={setWordsToAvoid} placeholder="cheap, deal, synergy…" />
          </label>

          <div>
            <span className="block text-sm font-medium mb-1.5">Example copy</span>
            <p className="text-xs text-fg/45 mb-2">
              Paste writing that sounds like you — past letters, emails, your website. The engine matches its rhythm.
            </p>
            {exampleCopy.map((ex, i) => (
              <div key={i} className="relative mb-2">
                <Textarea
                  value={ex}
                  onChange={(e) => {
                    const next = [...exampleCopy];
                    next[i] = e.target.value;
                    setExampleCopy(next);
                  }}
                  className="min-h-[90px] pr-10"
                  placeholder={`Example ${i + 1}`}
                />
                {exampleCopy.length > 1 && (
                  <button
                    type="button"
                    aria-label="Remove example"
                    onClick={() => setExampleCopy(exampleCopy.filter((_, j) => j !== i))}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full hover:bg-fg/5 flex items-center justify-center text-fg/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            {exampleCopy.length < 3 && (
              <button
                type="button"
                onClick={() => setExampleCopy([...exampleCopy, ""])}
                className="text-sm text-ember hover:underline underline-offset-4"
              >
                + Add another example
              </button>
            )}
          </div>

          <div>
            <span className="block text-sm font-medium mb-1.5">Brand documents</span>
            <p className="text-xs text-fg/45 mb-2">
              Upload brand guides or past materials (PDF, DOCX, TXT — max 10MB).
            </p>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = "";
              }}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 text-sm border border-fg/15 px-4 py-2 rounded-full hover:bg-fg/5 transition-colors disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading…" : "Upload document"}
              </button>
              {docUrls.map((url) => (
                <span key={url} className="inline-flex items-center gap-1.5 bg-fg/8 rounded-full px-3 py-1.5 text-xs">
                  {url.split("/").pop()?.replace(/^\d+-/, "")}
                  <button
                    type="button"
                    aria-label="Remove document"
                    onClick={() => setDocUrls(docUrls.filter((u) => u !== url))}
                    className="hover:text-ember"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-[#DD3B0B]"
            />
            <span className="text-sm">Use as the default voice for new campaigns</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-fg/10">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : profile ? "Save changes" : "Create profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
