import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

const SESSION_COOKIE = "nc_session";

const PUBLIC_PAGE_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/pricing",
  "/blog",
  "/sample",
];

const PUBLIC_API_PREFIXES = ["/api/auth", "/api/webhooks"];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (PUBLIC_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return true;
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isApi = pathname.startsWith("/api");
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isApi) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }
    const signIn = new URL("/sign-in", req.url);
    if (pathname !== "/") signIn.searchParams.set("next", pathname);
    const res = NextResponse.redirect(signIn);
    if (token) res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  const headers = new Headers(req.headers);
  headers.set("x-user-id", session.userId);
  headers.set("x-org-id", session.orgId);
  headers.set("x-plan-tier", session.planTier);
  headers.set("x-user-role", session.role);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    /*
     * Protect everything except static assets and public files. Public
     * pages/APIs are allowed inside the middleware itself.
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|templates|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
