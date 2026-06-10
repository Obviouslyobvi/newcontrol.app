import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { brandProfileSchema } from "@/lib/utils/validation";
import { errorResponse } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const db = getDb();
    const profiles = await db
      .select()
      .from(schema.brandProfiles)
      .where(eq(schema.brandProfiles.orgId, session.orgId))
      .orderBy(desc(schema.brandProfiles.isDefault), desc(schema.brandProfiles.createdAt));
    return NextResponse.json({ profiles });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const input = brandProfileSchema.parse(await req.json());
    const db = getDb();

    if (input.isDefault) {
      await db
        .update(schema.brandProfiles)
        .set({ isDefault: false })
        .where(eq(schema.brandProfiles.orgId, session.orgId));
    }

    const [profile] = await db
      .insert(schema.brandProfiles)
      .values({ ...input, orgId: session.orgId })
      .returning();

    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
