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

**This has not been published anywhere.** No Vercel project has been
created for it yet.

## Before publishing

Legal entity name ("Get Age Fit, LLC") and business address ("3626 Williams
Dr, Floor 2, Georgetown, TX 78628") are confirmed and filled in on both
pages. The getagefit.com/privacy and /terms URLs are confirmed 404 (checked
directly in a browser) — the Mobile Terms' Privacy Policy link now points
to the sibling `/privacy` page here instead.

Resolve every remaining item in each page's own "Internal review notice"
before publishing:

- **Mobile Terms** (`index.html`): support-inbox monitoring, the effective-
  date placeholder.
- **Privacy Policy** (`privacy/index.html`): this draft was built from a
  direct audit of the actual codebase (every form and every third-party
  integration, checked against what's actually configured in Vercel today,
  not just what exists in code) — see the commit message for the full
  audit. Still needs business/legal input on: data retention period
  (none implemented today), security claims (only HTTPS-in-transit is
  stated; nothing further), a formal data subject access/deletion
  procedure (none implemented beyond emailing support today), and the
  same support-inbox monitoring question as the Mobile Terms.

The same items are flagged in the `src/app/mobile-terms/page.tsx` version
in the main app, so keep both in sync if either changes. Get explicit
approval to publish before doing anything below.

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
   `.../privacy` (Privacy Policy) — e.g. naming it `getagefit-mobile-terms`
   gives `https://getagefit-mobile-terms.vercel.app/` and
   `https://getagefit-mobile-terms.vercel.app/privacy`. Confirm the
   `/privacy` path resolves correctly once deployed (it should, by Vercel's
   standard static directory-index convention, but verify rather than
   assume before submitting it anywhere).
6. Once that real URL is known, go back and replace the
   `[STANDALONE LEGAL SITE URL]/privacy` placeholder in
   `src/app/mobile-terms/page.tsx` with the real link.
7. Optionally attach a real subdomain you control (e.g.
   `legal.getagefit.com`) to this new project afterward for a branded URL —
   not required for Klaviyo's registration, which accepts any public HTTPS
   URL.

Once deployed, delete the "Internal review notice" block from both
`index.html` and `privacy/index.html` (reviewer-only notes, not part of
the legal text) and redeploy before actually submitting either URL to
Klaviyo or any carrier.
