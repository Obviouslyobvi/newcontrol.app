# NewControl

AI-powered direct response copywriting platform. Built with Next.js 15,
React 19, TypeScript, Tailwind CSS 3, Drizzle ORM (Neon PostgreSQL), and the
Anthropic API.

**New here? Read [`SETUP.md`](./SETUP.md)** — it walks through connecting the
database, the AI key, file storage, and email in plain English.

## What's inside

```
newcontrol.app/
├── app/
│   ├── (marketing)/        Public site: landing page, /pricing, /sample
│   ├── (auth)/             /sign-in and /sign-up
│   ├── (dashboard)/        The product (behind auth): campaigns, wizard,
│   │                       results, editor, exports, templates, brand, settings
│   └── api/                Auth, campaigns, generation (SSE), exports,
│                           brand profiles, templates, uploads, webhooks
├── lib/
│   ├── ai/                 Generation engine: prompt layers (the core IP),
│   │                       Anthropic client, parser, 3-pass quality check
│   ├── db/                 Drizzle schema, client, seed (25 templates)
│   ├── auth/               JWT sessions (jose) + bcrypt hashing
│   ├── pdf/                PDF (Puppeteer/Chromium), DOCX, TXT exporters
│   ├── storage/            R2/S3 uploads
│   ├── email/              Resend transactional email
│   ├── payments/           Plug-in interface (Stripe/LemonSqueezy later)
│   └── utils/              Validation (Zod), rate limiting, errors
├── components/ui/          Shared UI primitives
├── middleware.ts           Route protection
└── SETUP.md                Step-by-step service setup
```

## Run locally

You need Node.js 20 or newer (https://nodejs.org).

```bash
npm install
cp .env.example .env.local   # fill in at least DATABASE_URL and JWT_SECRET
npm run db:push              # create tables
npm run db:seed              # load the 25 launch templates
npm run dev
```

Open http://localhost:3000. Without `ANTHROPIC_API_KEY` the app runs in a
clearly-labeled sample mode; without storage/email keys those features
degrade gracefully. See SETUP.md.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at localhost:3000 |
| `npm run build` | Production build (run before pushing) |
| `npm run db:push` | Sync the Drizzle schema to the database |
| `npm run db:seed` | Load the 25 launch templates (safe to re-run) |

## Editing marketing copy

Every section of the landing page is its own file in
`app/(marketing)/components/`:

- Headline + subhead: `Hero.tsx`
- Agency comparison: `AgencyMath.tsx`
- The six feature cards: `Features.tsx`
- How It Works steps: `HowItWorks.tsx`
- WITHOUT / WITH lists: `WithoutWith.tsx`
- Testimonials (placeholders to replace): `SocialProof.tsx`
- Plans + prices: `Pricing.tsx`
- FAQ entries: `FAQ.tsx`
- Final headline + email form: `FinalCTA.tsx`
- Logo wordmark, nav links: `Nav.tsx`
- Sample letter page: `app/(marketing)/sample/page.tsx`

## Theme

Light/dark toggle in the nav, saved in the browser. Default colors live in
`app/globals.css` (`:root` for light, `.dark` for dark) as space-separated
RGB triples so Tailwind opacity modifiers work (`text-fg/70`).

## Deploying

Pushes to `main` auto-deploy via Vercel. Environment variables are managed in
Vercel → Project → Settings → Environment Variables (see SETUP.md for the
full list).
