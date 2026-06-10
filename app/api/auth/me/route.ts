import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/middleware";
import { errorResponse, errors } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const db = getDb();

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (!user) throw errors.unauthorized();

    const [org] = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.id, session.orgId));

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planTier: user.planTier,
        trialEndsAt: user.trialEndsAt,
      },
      organization: org
        ? {
            id: org.id,
            name: org.name,
            planTier: org.planTier,
            subscriptionStatus: org.subscriptionStatus,
            currentPeriodEnd: org.currentPeriodEnd,
          }
        : null,
      role: session.role,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
