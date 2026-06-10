import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  userId: string;
  orgId: string;
  role: string;
  planTier: string;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Generate one with `openssl rand -hex 32` and add it to your environment (see SETUP.md)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.orgId !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      orgId: payload.orgId,
      role: typeof payload.role === "string" ? payload.role : "member",
      planTier:
        typeof payload.planTier === "string" ? payload.planTier : "free_trial",
    };
  } catch {
    return null;
  }
}
