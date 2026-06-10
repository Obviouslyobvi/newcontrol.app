import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne, desc, asc, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { createCampaignSchema } from "@/lib/utils/validation";
import { errorResponse } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const db = getDb();
    const params = req.nextUrl.searchParams;

    const status = params.get("status");
    const sort = params.get("sort") === "title" ? schema.campaigns.title : schema.campaigns.createdAt;
    const order = params.get("order") === "asc" ? asc : desc;
    const page = Math.max(1, Number(params.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params.get("limit") ?? 20)));

    const where = and(
      eq(schema.campaigns.orgId, session.orgId),
      status
        ? eq(schema.campaigns.status, status as typeof schema.campaigns.status._.data)
        : ne(schema.campaigns.status, "archived")
    );

    const [campaigns, [{ count }]] = await Promise.all([
      db
        .select()
        .from(schema.campaigns)
        .where(where)
        .orderBy(order(sort))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.campaigns)
        .where(where),
    ]);

    return NextResponse.json({ campaigns, total: count, page });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const input = createCampaignSchema.parse(await req.json());
    const db = getDb();

    const [campaign] = await db
      .insert(schema.campaigns)
      .values({
        orgId: session.orgId,
        createdById: session.userId,
        title: input.title,
        campaignType: input.campaignType,
        brief: input.brief,
        brandProfileId: input.brandProfileId ?? null,
        templateId: input.templateId ?? null,
        status: "draft",
      })
      .returning();

    if (input.templateId) {
      await db
        .update(schema.templates)
        .set({ usageCount: sql`${schema.templates.usageCount} + 1` })
        .where(eq(schema.templates.id, input.templateId));
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
