"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  LayoutTemplate,
  Palette,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/campaigns", label: "Campaigns", icon: Mail },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/brand", label: "Brand", icon: Palette },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  planLabel,
  trialNote,
}: {
  planLabel: string;
  trialNote: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
              active
                ? "bg-fg/8 text-fg font-medium"
                : "text-fg/60 hover:text-fg hover:bg-fg/5"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const planFooter = (
    <div className="px-6 py-4 border-t border-fg/10">
      <div className="text-sm font-medium">{planLabel}</div>
      {trialNote && <div className="text-xs text-fg/50 mt-0.5">{trialNote}</div>}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full bg-fg text-bg flex items-center justify-center shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-bg border-r border-fg/10 flex flex-col">
            <div className="h-16 px-6 flex items-center justify-between border-b border-fg/10">
              <Link href="/campaigns" className="font-serif text-xl tracking-tight">
                NewControl
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="h-8 w-8 rounded-full hover:bg-fg/5 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {nav}
            {planFooter}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-fg/10 min-h-screen sticky top-0 max-h-screen">
        <div className="h-16 px-6 flex items-center border-b border-fg/10">
          <Link href="/campaigns" className="font-serif text-xl tracking-tight">
            NewControl
          </Link>
        </div>
        {nav}
        {planFooter}
      </aside>
    </>
  );
}
