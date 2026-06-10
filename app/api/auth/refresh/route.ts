import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/middleware";
import { createSessionToken } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/utils/errors";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const token = await createSessionToken(session);
    await setSessionCookie(token);
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
