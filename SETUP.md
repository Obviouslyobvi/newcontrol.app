# NewControl — Setup Guide

The app is built so **everything runs even before these steps** — sign-up
shows a friendly "almost ready" message without a database, generation runs
in a labeled sample mode without an AI key, exports download directly without
file storage, and emails are simply skipped without an email key.

Do these four steps (about 30 minutes total) to turn everything on. Each one
is: create an account → copy a value → paste it into Vercel.

> **Where values go:** [vercel.com](https://vercel.com) → your `newcontrol-app`
> project → **Settings → Environment Variables**. Add each variable for
> *Production*, *Preview*, and *Development*, then **redeploy** (Deployments →
> ⋯ on the latest → Redeploy).

---

## Step 1 — Database (required first) · Neon, free tier

Accounts, campaigns, and letters live here.

1. Go to [neon.tech](https://neon.tech) and sign up (GitHub login is easiest).
2. Create a project — name it `newcontrol`.
3. On the project dashboard, find **Connection string** and copy it
   (it starts with `postgresql://`).
4. In Vercel, add:
   - `DATABASE_URL` = the connection string

Also generate a session secret while you're here:

5. Run `openssl rand -hex 32` in any terminal — or just type 64 random
   characters — and add:
   - `JWT_SECRET` = that random string

**Then create the tables and load the 25 templates.** On your computer, in
the project folder:

```bash
npm install
echo 'DATABASE_URL=postgresql://...your-string...' > .env.local
npm run db:push    # creates the tables
npm run db:seed    # loads the 25 launch templates
```

✅ Test: sign up at newcontrol.app/sign-up — you should land in the dashboard.

---

## Step 2 — AI generation (required for real letters) · Anthropic

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign up.
2. Add billing (Settings → Billing). A typical letter campaign (5 variations)
   costs roughly $0.50–$1.00 in API usage.
3. Create an API key (Settings → API Keys → Create Key) and copy it
   (starts with `sk-ant-`).
4. In Vercel, add:
   - `ANTHROPIC_API_KEY` = the key

Optional knobs (defaults are fine):
- `ANTHROPIC_MODEL` (default `claude-sonnet-4-6`)
- `ANTHROPIC_MAX_TOKENS` (default `8192`)

✅ Test: create a campaign and generate — you should get five real letters,
not the "[SAMPLE]" placeholders.

---

## Step 3 — File storage (optional) · Cloudflare R2

Without it, exports still work — they download straight to the user's
computer. With it, exports and brand-document uploads are also stored.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → R2 → create a
   bucket named `newcontrol-uploads`.
2. R2 → Manage API Tokens → Create token with **Object Read & Write** on that
   bucket.
3. In Vercel, add:
   - `S3_ENDPOINT` = `https://<your-account-id>.r2.cloudflarestorage.com`
   - `S3_ACCESS_KEY_ID` = from the token
   - `S3_SECRET_ACCESS_KEY` = from the token
   - `S3_BUCKET_NAME` = `newcontrol-uploads`
   - `S3_PUBLIC_URL` = your bucket's public URL (enable public access or
     connect a custom domain like `files.newcontrol.app` in R2 settings)

---

## Step 4 — Email (optional) · Resend

Sends the welcome email on sign-up. Skipped silently when not configured.

1. Go to [resend.com](https://resend.com), sign up, and add + verify your
   domain `newcontrol.app` (they show you two DNS records to add).
2. Create an API key.
3. In Vercel, add:
   - `RESEND_API_KEY` = the key
   - `FROM_EMAIL` = `hello@newcontrol.app`

---

## Later — Payments

Billing is built behind a plug-in interface (`lib/payments/`). Until a
provider is connected, every new account gets a 14-day free trial with
Professional-level access, and the billing page shows plans as "coming soon."
When you're ready, implement the `PaymentProvider` interface with Stripe or
LemonSqueezy and set its env vars — no other code changes needed.

## Security checklist (already done in code, listed for your awareness)

- Repository should be **private** (GitHub → Settings → Danger Zone) — the
  AI prompt framework is your IP.
- Passwords: bcrypt-hashed, never logged. Sessions: httpOnly secure cookies.
- All database access is parameterized (Drizzle ORM); all input validated (Zod).
- Rate limits on auth, generation, exports, and uploads.
- Secrets live only in environment variables; `.env.local` is git-ignored.
