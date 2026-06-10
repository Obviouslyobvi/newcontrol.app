import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Team — NewControl" };
export const dynamic = "force-dynamic";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export default async function TeamPage() {
  const session = await requirePageSession();

  let members: Member[] = [];
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const rows = await db
        .select({
          id: schema.orgMemberships.id,
          role: schema.orgMemberships.role,
          name: schema.users.name,
          email: schema.users.email,
        })
        .from(schema.orgMemberships)
        .innerJoin(schema.users, eq(schema.orgMemberships.userId, schema.users.id))
        .where(eq(schema.orgMemberships.orgId, session.orgId));
      members = rows;
    } catch {
      // Render empty.
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-fg/55 hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Settings
      </Link>

      <h1 className="font-serif text-4xl tracking-tight mb-2">Team</h1>
      <p className="text-fg/55 mb-8">People with access to this workspace.</p>

      <Card className="divide-y divide-fg/8">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ember/10 text-ember flex items-center justify-center text-sm font-medium">
                {(m.name ?? m.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium">{m.name ?? m.email}</div>
                {m.name && <div className="text-xs text-fg/50">{m.email}</div>}
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {m.role}
            </Badge>
          </div>
        ))}
        {members.length === 0 && (
          <div className="p-5 text-sm text-fg/50">No members found.</div>
        )}
      </Card>

      <p className="text-sm text-fg/45 mt-6">
        Team invitations are coming with the collaboration release. Your plan&apos;s
        seat count applies once invitations open.
      </p>
    </div>
  );
}
