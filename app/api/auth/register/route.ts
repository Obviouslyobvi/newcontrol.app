import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { hashPassword } from "@/lib/auth/hash";
import { createSessionToken } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";
import { registerSchema } from "@/lib/utils/validation";
import { errors, errorResponse } from "@/lib/utils/errors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import { sendWelcomeEmail } from "@/lib/email/resend";

const TRIAL_DAYS = 14;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth.limit, RATE_LIMITS.auth.windowMs);
    if (!rl.allowed) throw errors.rateLimited();

    const { email, password, name } = registerSchema.parse(await req.json());
    const db = getDb();

    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email));
    if (existing.length > 0) {
      throw errors.conflict("An account with this email already exists. Try signing in.");
    }

    const passwordHash = await hashPassword(password);
    const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const [user] = await db
      .insert(schema.users)
      .values({ email, passwordHash, name: name ?? null, planTier: "free_trial", trialEndsAt })
      .returning();

    const [org] = await db
      .insert(schema.organizations)
      .values({
        name: name ? `${name}'s workspace` : "My workspace",
        ownerId: user.id,
        planTier: "free_trial",
        subscriptionStatus: "trialing",
        currentPeriodEnd: trialEndsAt,
      })
      .returning();

    await db
      .insert(schema.orgMemberships)
      .values({ orgId: org.id, userId: user.id, role: "owner" });

    const token = await createSessionToken({
      userId: user.id,
      orgId: org.id,
      role: "owner",
      planTier: "free_trial",
    });
    await setSessionCookie(token);

    await sendWelcomeEmail(email, name);

    return NextResponse.json(
      {
        user: { id: user.id, email: user.email, name: user.name, planTier: user.planTier, trialEndsAt: user.trialEndsAt },
        organization: { id: org.id, name: org.name, planTier: org.planTier },
      },
      { status: 201 }
    );
  } catch (err) {
    return errorResponse(err);
  }
}
