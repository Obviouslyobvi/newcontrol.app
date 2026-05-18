# NewControl

The marketing site for NewControl. Built with Next.js 15, React 19, Tailwind CSS 3, and TypeScript.

## What's inside

```
newcontrol/
├── app/
│   ├── components/        ← every section is its own file. Edit text here.
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustStrip.tsx
│   │   ├── Framework.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── WithoutWith.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   ├── globals.css        ← CSS variables for light/dark colors
│   ├── layout.tsx         ← page metadata, fonts, theme-init script
│   └── page.tsx           ← assembles all the sections
├── tailwind.config.ts     ← color palette, fonts, dark mode setup
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## To run locally (one-time setup)

You need Node.js 20 or newer. Install from https://nodejs.org if you don't have it.

```bash
cd newcontrol
npm install
npm run dev
```

Open http://localhost:3000.

## To edit copy

Every section of the page is a separate file in `app/components/`. To change wording, open the section's file in any text editor (or directly on GitHub.com), edit the text inside the JSX, save, push. Vercel will redeploy automatically.

Quick reference of what lives where:
- Headline + subhead: `Hero.tsx`
- The 22 step labels: `Framework.tsx` (top of file, `steps` array)
- The six feature cards: `Features.tsx` (top of file, `features` array)
- Three steps in How It Works: `HowItWorks.tsx`
- WITHOUT / WITH bullet lists: `WithoutWith.tsx`
- Final headline + email form: `FinalCTA.tsx`
- Logo wordmark, nav links: `Nav.tsx`

## To deploy to Vercel (free, auto-deploys on git push)

1. Push this project to your repo `github.com/Obviouslyobvi/newcontrol.app`. From the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Obviouslyobvi/newcontrol.app.git
   git push -u origin main
   ```

2. Go to https://vercel.com/new and sign in with GitHub.

3. Click "Import" next to your `newcontrol.app` repo.

4. Vercel auto-detects Next.js. Don't change any settings. Click "Deploy".

5. First deploy finishes in about a minute. You'll get a URL like `newcontrol-xyz.vercel.app`.

6. To point your custom domain `newcontrol.app` at it:
   - In Vercel: Project Settings → Domains → Add `newcontrol.app`.
   - Vercel will show you the DNS records to add at your domain registrar (usually an `A` record pointing to `76.76.21.21`, or a `CNAME` pointing to `cname.vercel-dns.com`).
   - Add those records at your registrar. DNS propagates in 5 to 60 minutes.

After that, every `git push` to the `main` branch redeploys the site automatically.

## To collect emails from the form

The form in `FinalCTA.tsx` currently posts to a placeholder Formspree URL (`https://formspree.io/f/your_form_id`). Two easy options:

- **Formspree** (free tier): Sign up at https://formspree.io, create a new form, copy the form ID, paste it into `action="https://formspree.io/f/YOUR_REAL_ID"` in `FinalCTA.tsx`.
- **ConvertKit, Mailchimp, Klaviyo, or any list tool**: Each has an embeddable form. Replace the entire `<form>` element in `FinalCTA.tsx` with their embed.

## Theme

The site supports light and dark. The toggle is in the nav. Choice is saved in the browser. First-time visitors get whichever mode matches their OS setting.

To change the default colors, edit `app/globals.css`:
- `:root` sets light mode colors
- `.dark` sets dark mode colors

Values are space-separated RGB triples so Tailwind can apply opacity (`text-fg/70` for 70% opacity foreground, etc.).
