"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Palette, Pencil, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BrandProfile } from "@/lib/db/schema";
import BrandProfileForm from "./BrandProfileForm";

export default function BrandProfileList({
  profiles,
}: {
  profiles: BrandProfile[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<BrandProfile | null>(null);
  const [creating, setCreating] = useState(false);

  async function remove(profile: BrandProfile) {
    if (!confirm(`Delete the "${profile.name}" brand voice?`)) return;
    const res = await fetch(`/api/brand-profiles/${profile.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data?.error?.message ?? "Could not delete the profile");
      return;
    }
    toast.success("Profile deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Brand voice</h1>
          <p className="text-fg/55 mt-1">
            Teach NewControl how your company sounds, so every campaign sounds like you.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-fg text-bg px-6 py-3 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
        >
          <Plus className="h-4 w-4" />
          New brand voice
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="border border-dashed border-fg/20 rounded-3xl p-12 text-center">
          <div className="inline-flex h-14 w-14 rounded-full bg-ember/10 text-ember items-center justify-center mb-5">
            <Palette className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl tracking-tight mb-3">
            No brand voice yet
          </h2>
          <p className="text-fg/55 max-w-md mx-auto mb-7">
            Set the tone, the vocabulary, and a few writing samples once —
            every campaign after that comes out sounding like your company,
            not like an AI.
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 bg-fg text-bg px-7 py-3.5 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
          >
            Create your brand voice
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Card key={p.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="inline-flex h-9 w-9 rounded-full bg-ember/10 text-ember items-center justify-center">
                  <Palette className="h-4 w-4" />
                </div>
                {p.isDefault && <Badge variant="ember">Default</Badge>}
              </div>
              <h3 className="font-serif text-xl tracking-tight mb-1">{p.name}</h3>
              <p className="text-sm text-fg/55 line-clamp-2 mb-4 flex-1">
                {p.description || "No description"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(p)}
                  className="inline-flex items-center gap-1.5 text-sm border border-fg/15 px-3.5 py-2 rounded-full hover:bg-fg/5 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  aria-label={`Delete ${p.name}`}
                  className="inline-flex items-center gap-1.5 text-sm text-fg/45 px-3 py-2 rounded-full hover:text-ember hover:bg-ember/5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <BrandProfileForm
          profile={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
