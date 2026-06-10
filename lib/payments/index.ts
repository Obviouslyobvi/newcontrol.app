/**
 * Payment provider adapter. Stripe or LemonSqueezy plugs in behind this
 * interface later — nothing else in the app should import a provider SDK.
 */

export type SubscriptionInfo = {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date | null;
};

export type WebhookEvent = {
  type: string;
  customerId?: string;
  subscriptionId?: string;
  status?: string;
  currentPeriodEnd?: Date;
};

export interface PaymentProvider {
  createCustomer(email: string, name?: string): Promise<string>;
  createSubscription(customerId: string, planId: string): Promise<{ subscriptionId: string; status: string }>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  getSubscription(subscriptionId: string): Promise<SubscriptionInfo>;
  handleWebhook(body: string, signature: string): Promise<WebhookEvent>;
}

export type PlanId = "solo" | "professional" | "agency" | "enterprise";

export const PLANS: Record<
  PlanId,
  { name: string; priceCents: number; brandProfiles: number | null; teamMembers: number | null }
> = {
  solo: { name: "Solo", priceCents: 4900, brandProfiles: 1, teamMembers: 1 },
  professional: { name: "Professional", priceCents: 14900, brandProfiles: 3, teamMembers: 3 },
  agency: { name: "Agency", priceCents: 29900, brandProfiles: 10, teamMembers: 10 },
  enterprise: { name: "Enterprise", priceCents: 99700, brandProfiles: null, teamMembers: null },
};

/** No provider connected yet — every method explains the situation. */
class NotConfiguredProvider implements PaymentProvider {
  private fail(): never {
    throw new Error(
      "No payment provider is connected. Implement the PaymentProvider interface in lib/payments and set the provider env vars."
    );
  }
  async createCustomer(): Promise<string> { this.fail(); }
  async createSubscription(): Promise<{ subscriptionId: string; status: string }> { this.fail(); }
  async cancelSubscription(): Promise<void> { this.fail(); }
  async getSubscription(): Promise<SubscriptionInfo> { this.fail(); }
  async handleWebhook(): Promise<WebhookEvent> { this.fail(); }
}

export function isPaymentConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY || process.env.LEMONSQUEEZY_API_KEY);
}

export function getPaymentProvider(): PaymentProvider {
  // Swap in StripeProvider / LemonSqueezyProvider here when connected.
  return new NotConfiguredProvider();
}
