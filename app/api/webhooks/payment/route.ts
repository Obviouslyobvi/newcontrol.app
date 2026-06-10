import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider, isPaymentConfigured } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Payment webhook receiver. Inert until a provider is plugged into
 * lib/payments — then this verifies the signature and updates the org's
 * subscription state.
 */
export async function POST(req: NextRequest) {
  if (!isPaymentConfigured()) {
    return NextResponse.json(
      { error: { code: "SETUP_REQUIRED", message: "No payment provider configured" } },
      { status: 503 }
    );
  }

  try {
    const body = await req.text();
    const signature =
      req.headers.get("stripe-signature") ??
      req.headers.get("x-signature") ??
      "";
    const event = await getPaymentProvider().handleWebhook(body, signature);
    // TODO when a provider lands: update organizations.subscription_status,
    // plan_tier, and current_period_end based on event.type.
    console.log("Payment webhook received:", event.type);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid webhook" } },
      { status: 400 }
    );
  }
}
