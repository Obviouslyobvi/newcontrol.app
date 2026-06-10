"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md text-center py-24">
      <h1 className="font-serif text-3xl tracking-tight mb-4">
        Something went sideways
      </h1>
      <p className="text-fg/55 mb-8 leading-relaxed">
        That wasn&apos;t supposed to happen. Your work is saved — try again,
        and if it keeps up, sign out and back in.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/campaigns"
          className="text-sm border border-fg/15 px-5 py-2.5 rounded-full hover:bg-fg/5 transition-colors"
        >
          Back to campaigns
        </Link>
      </div>
    </div>
  );
}
