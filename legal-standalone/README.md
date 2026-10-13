# Standalone legal pages — not deployed

This folder is a deliberately separate, minimal static site (`index.html` +
`privacy/index.html`), kept outside `src/` so it is never touched by the
main Next.js app's build, `tsc`, or `next lint`. It exists for one reason:
the main site's only current Vercel deployments (preview and the default
`.vercel.app` domain) sit behind Vercel Authentication (SSO), so none of
them are publicly reachable today. The Mobile Messaging Terms and Privacy
Policy both need a genuinely public URL — with no Vercel login prompt — to
use in Klaviyo's SMS registration.

- `index.html` — Mobile Messaging Terms of Service (serves at `/`).
- `privacy/index.html` — Privacy Policy (serves at `/privacy`), linked from
  the Mobile Terms' Section 8.

**Both pages are finalized**: internal reviewer banners removed,
placeholders filled (legal entity name "Get Age Fit, LLC", business
address "3626 Williams Dr, Floor 2, Georgetown, TX 78628", effective date
October 13, 2026). **Still not deployed anywhere** — no Vercel project has
been created for this folder yet.

## Open items — not page placeholders, but still real business decisions

These aren't blank fields left in the page text; they're operational/legal
questions the published pages are honest about but don't resolve:

- **Support inbox monitoring**: both pages list `info@getagefit.com` as the
  contact for SMS opt-out/HELP and privacy requests. Confirm it's actively
  monitored with a response time appropriate for consumer requests.
- **Data retention / data-rights procedure** (Privacy Policy, Sections 6 and
  8): the published text accurately states that no fixed retention period
  and no formal access/deletion process exist today — it does not invent
  either. If a formal policy or process is wanted (e.g. for state privacy
  law compliance), that's a business/legal decision for later, and these
  sections would need a deliberate update at that point, not a quiet edit.
- **Cookies/analytics** (Privacy Policy, Section 5): Google Analytics 4 and
  Microsoft Clarity exist in the main site's code but are not configured or
  active anywhere today; the policy says so. If either is ever turned on, a
  cookie-consent mechanism and this section both need revisiting together.
- **CRM webhook / Calendly-to-Airtable automation** (Privacy Policy, Section
  4): both exist in code, neither has credentials configured anywhere, so
  neither is currently receiving data — stated as such, not as active.

None of the above blocks publishing a page that's honest about current
practice — they're flagged here as things to revisit later, not things
required before these specific pages can go out.

## How to turn this into a public page (once approved)

This repo already contains the two files needed — no separate GitHub repo
required. To publish them as their own, independently-protected Vercel
project:

1. In the Vercel dashboard, **Add New Project**, and import this same
   GitHub repo (`isabellemckae/GetAgeFit-website`) again as a *second*,
   distinct project (Vercel allows multiple projects from one repo).
2. Set that new project's **Root Directory** to `legal-standalone`.
3. Set **Framework Preset** to "Other" (plain static — no build command
   needed; both `index.html` files are served as-is).
4. Leave Deployment Protection at its default (off) for this new project —
   do NOT copy the main project's SSO setting over. This is the whole
   point of a separate project: its protection settings are independent.
5. Deploy. The resulting public URLs will be
   `https://<the-project-name-you-chose>.vercel.app/` (Mobile Terms) and
   `.../privacy` (Privacy Policy).
6. Once that real URL is known, go back and replace the
   `[STANDALONE LEGAL SITE URL]/privacy` placeholder in
   `src/app/mobile-terms/page.tsx` (the main-app copy, still unpublished)
   with the real link.
7. Optionally attach a real subdomain you control (e.g.
   `legal.getagefit.com`) to this new project afterward for a branded URL —
   not required for Klaviyo's registration, which accepts any public HTTPS
   URL.
