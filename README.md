# GetAgeFit Website

The new GetAgeFit marketing site and lead-generation system — a boutique
healthy-aging personal training studio in Georgetown, Texas. Built as a
conversion engine, not just a brochure: attract → qualify → convert to
consultation → measure.

**Start here:**
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — sitemap, user flows,
  qualification funnel logic, data architecture, and technical decisions
- [`docs/CONTENT-STATUS.md`](docs/CONTENT-STATUS.md) — everything that
  needs GetAgeFit's review before launch (verified facts vs. proposed copy
  vs. placeholders)

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values as they're confirmed
npm run dev
```

Visit `http://localhost:3000`.

## Scripts

- `npm run dev` — local development server
- `npm run build` — production build (also runs type checking + linting)
- `npm run start` — run a production build locally
- `npm run lint` — lint only

## Environment variables

See `.env.example` for the full list and inline explanations. Nothing in
this repo requires them to be set — every integration (GA4, Clarity, CRM
webhook, booking embed) degrades gracefully to a working no-op/fallback
until configured, so the site is fully functional out of the box.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap, JSON-LD |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID |
| `CRM_WEBHOOK_URL` / `CRM_WEBHOOK_SECRET` | Where lead/qualification/consultation submissions are forwarded |
| `NEXT_PUBLIC_BOOKING_URL` | Optional scheduling tool URL embedded on `/consultation` |

## What's here

- **Homepage** and 10 core pages (`docs/ARCHITECTURE.md` has the full
  sitemap), built as reusable design-system components rather than
  one-off page markup.
- **Qualification funnel** (`/qualify`) — a 5-step quiz that routes
  prospects into high-intent / potential-fit / nurture / low-fit without
  ever exposing GetAgeFit's internal pricing (`src/lib/qualification.ts`).
- **Resource Center** — 6 SEO- and AI-search-structured articles
  (`src/content/articles.ts`), semantic HTML, `FAQPage`/`Article` schema.
- **CRM-ready API routes** (`/api/lead`, `/api/consultation`,
  `/api/qualify`) that normalize submissions and forward them to a
  configurable webhook — no bespoke CRM built, per the brief.
- **Analytics** — GA4 + Microsoft Clarity, with a typed event layer
  tracking the funnel KPIs the business actually cares about (qualified
  leads, consultation requests, CTA engagement — not vanity page views).
- **Accessibility** — semantic landmarks, skip link, labeled form fields,
  keyboard-operable accordion/quiz, visible focus states,
  `prefers-reduced-motion` support.

## What's intentionally not here yet

Every gap is itemized in `docs/CONTENT-STATUS.md`, but in short: real
trainer bios/photos, real client transformation stories, the studio's
public address/phone/hours, and a connected CRM/booking tool. Nothing was
invented to fill these gaps — they're explicit `[CONFIRM ...]` /
`[INSERT ...]` placeholders throughout the code and content files.
