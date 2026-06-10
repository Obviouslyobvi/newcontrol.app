import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { getOwnedBrandProfile } from "@/lib/db/queries";
import { brandProfileSchema } from "@/lib/utils/validation";
import { errors, errorResponse } from "@/lib/utils/errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    const profile = await getOwnedBrandProfile(session, id);
    if (!profile) throw errors.notFound("Brand profile not found");
    return NextResponse.json({ profile });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    const existing = await getOwnedBrandProfile(session, id);
    if (!existing) throw errors.notFound("Brand profile not found");

    const input = brandProfileSchema.partial().parse(await req.json());
    const db = getDb();

    if (input.isDefault) {
      await db
        .update(schema.brandProfiles)
        .set({ isDefault: false })
        .where(eq(schema.brandProfiles.orgId, session.orgId));
    }

    const [profile] = await db
      .update(schema.brandProfiles)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(schema.brandProfiles.id, id))
      .returning();

    return NextResponse.json({ profile });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession(req);
    const { id } = await params;
    const existing = await getOwnedBrandProfile(session, id);
    if (!existing) throw errors.notFound("Brand profile not found");

    const db = getDb();
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.brandProfiles)
      .where(eq(schema.brandProfiles.orgId, session.orgId));
    if (count <= 1) {
      throw errors.conflict(
        "You can't delete your only brand profile. Create another one first."
      );
    }

    await db
      .delete(schema.brandProfiles)
      .where(
        and(
          eq(schema.brandProfiles.id, id),
          eq(schema.brandProfiles.orgId, session.orgId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
