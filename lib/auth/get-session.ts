import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, type SessionPayload } from "./session";
import { SESSION_COOKIE } from "./cookies";

/** Read the session inside a server component. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requirePageSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}
