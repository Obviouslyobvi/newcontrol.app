import { NextRequest } from "next/server";
import { verifySessionToken, type SessionPayload } from "./session";
import { SESSION_COOKIE } from "./cookies";
import { errors } from "@/lib/utils/errors";

/**
 * Resolve the authenticated session for an API route. The root middleware
 * already gates protected paths, but API handlers re-verify so they never
 * trust headers alone.
 */
export async function requireSession(
  req: NextRequest
): Promise<SessionPayload> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) throw errors.unauthorized();
  const session = await verifySessionToken(token);
  if (!session) throw errors.unauthorized("Session expired. Please sign in again.");
  return session;
}
