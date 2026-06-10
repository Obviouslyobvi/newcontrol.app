import type { Metadata } from "next";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { LayoutTemplate } from "lucide-react";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import type { Template } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Templates — NewControl" };
export const dynamic = "force-dynamic";

const CATEGORY_ORDER = [
  "acquisition",
  "retention",
  "winback",
  "upsell",
  "seasonal",
  "event",
  "announcement",
  "referral",
];

const CATEGORY_LABELS: Record<string, string> = {
  acquisition: "Acquisition",
  retention: "Retention",
  winback: "Win-back",
  upsell: "Upsell",
  seasonal: "Seasonal",
  event: "Events",
  announcement: "Announcements",
  referral: "Referral",
};

export default async function TemplatesPage() {
  await requirePageSession();

  let templates: Template[] = [];
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      templates = await db
        .select()
        .from(schema.templates)
        .where(eq(schema.templates.isPublic, true))
        .orderBy(desc(schema.templates.usageCount));
    } catch {
      // Empty state covers it.
    }
  }

  const grouped = new Map<string, Template[]>();
  for (const t of templates) {
    const cat = t.category ?? "other";
    grouped.set(cat, [...(grouped.get(cat) ?? []), t]);
  }
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl tracking-tight">Templates</h1>
        <p className="text-fg/55 mt-1">
          Proven campaign starting points. Pick one and the brief fills itself in.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="border border-dashed border-fg/20 rounded-3xl p-12 text-center">
          <div className="inline-flex h-14 w-14 rounded-full bg-ember/10 text-ember items-center justify-center mb-5">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl tracking-tight mb-3">
            Templates aren&apos;t loaded yet
          </h2>
          <p className="text-fg/55 max-w-md mx-auto">
            Once the database is connected, run{" "}
            <code className="text-ember">npm run db:seed</code> to load the 25
            launch templates.
          </p>
        </div>
      ) : (
        orderedCategories.map((cat) => (
          <section key={cat} className="mb-10">
            <h2 className="font-serif text-2xl tracking-tight mb-4">
              {CATEGORY_LABELS[cat] ?? cat}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped.get(cat)!.map((t) => (
                <Link key={t.id} href={`/campaigns/new?template=${t.id}`} className="group">
                  <Card className="p-5 h-full hover:border-fg/25 transition-colors">
                    <h3 className="font-medium mb-1.5 group-hover:text-ember transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-sm text-fg/55 leading-snug mb-3">
                      {t.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {t.campaignType && (
                        <Badge variant="default" className="capitalize">
                          {t.campaignType.replace("_", " ")}
                        </Badge>
                      )}
                      {t.industry && (
                        <Badge variant="outline" className="capitalize">
                          {t.industry.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
