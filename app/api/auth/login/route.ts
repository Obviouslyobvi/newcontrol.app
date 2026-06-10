import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/hash";
import { createSessionToken } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/utils/validation";
import { errors, errorResponse } from "@/lib/utils/errors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth.limit, RATE_LIMITS.auth.windowMs);
    if (!rl.allowed) throw errors.rateLimited();

    const { email, password } = loginSchema.parse(await req.json());
    const db = getDb();

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    const valid = user && (await verifyPassword(password, user.passwordHash));
    if (!valid) throw errors.unauthorized("Invalid credentials");

    const [membership] = await db
      .select()
      .from(schema.orgMemberships)
      .where(eq(schema.orgMemberships.userId, user.id));
    if (!membership) throw errors.unauthorized("Invalid credentials");

    const [org] = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.id, membership.orgId));

    const token = await createSessionToken({
      userId: user.id,
      orgId: membership.orgId,
      role: membership.role,
      planTier: org?.planTier ?? user.planTier,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, planTier: user.planTier, trialEndsAt: user.trialEndsAt },
      organization: org ? { id: org.id, name: org.name, planTier: org.planTier } : null,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
