import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { errorResponse } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    await requireSession(req);
    const db = getDb();
    const params = req.nextUrl.searchParams;

    const conditions = [eq(schema.templates.isPublic, true)];
    const category = params.get("category");
    const industry = params.get("industry");
    const type = params.get("type");
    if (category) conditions.push(eq(schema.templates.category, category));
    if (industry) conditions.push(eq(schema.templates.industry, industry));
    if (type)
      conditions.push(
        eq(
          schema.templates.campaignType,
          type as typeof schema.templates.campaignType._.data
        )
      );

    const templates = await db
      .select()
      .from(schema.templates)
      .where(and(...conditions))
      .orderBy(desc(schema.templates.usageCount));

    return NextResponse.json({ templates });
  } catch (err) {
    return errorResponse(err);
  }
}
