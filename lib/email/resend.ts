import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL ?? "hello@newcontrol.app";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Send an email via Resend. When RESEND_API_KEY is missing the send is
 * logged and skipped so signup and other flows never break.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!isEmailConfigured()) {
    console.log(`[email skipped — RESEND_API_KEY not set] to=${opts.to} subject="${opts.subject}"`);
    return;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: `NewControl <${FROM_EMAIL}>`, ...opts });
  } catch (err) {
    // Email failures must never break the calling flow.
    console.error("Email send failed:", err);
  }
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  const first = name?.split(" ")[0];
  await sendEmail({
    to,
    subject: "Welcome to NewControl — your trial starts now",
    html: `
      <div style="font-family: Georgia, serif; max-width: 540px; margin: 0 auto; color: #0F0F0E;">
        <h1 style="font-size: 28px; font-weight: 400;">Welcome${first ? `, ${first}` : ""}.</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Your 14-day NewControl trial is live. Every plan feature is unlocked —
          unlimited campaigns, the full 22-step Letter Perfect framework, print-ready exports.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          The fastest way to see what it can do: create your first campaign.
          Fill in three fields about your offer and audience, and you'll have
          five complete sales letter variations in about 90 seconds.
        </p>
        <p style="margin: 32px 0;">
          <a href="https://newcontrol.app/campaigns/new"
             style="background: #0F0F0E; color: #FAF8F4; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-family: -apple-system, sans-serif; font-size: 15px;">
            Write your first letter
          </a>
        </p>
        <p style="font-size: 13px; color: #6B6B68;">
          P.S. The best first campaign is one you've already mailed. Recreate it,
          compare the five variations against your original, and you'll know in
          five minutes whether NewControl earns its keep.
        </p>
      </div>
    `,
  });
}
