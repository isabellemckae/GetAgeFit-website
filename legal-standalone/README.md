# Standalone Mobile Terms page — not deployed

This folder is a deliberately separate, minimal static page (`index.html`),
kept outside `src/` so it is never touched by the main Next.js app's build,
`tsc`, or `next lint`. It exists for one reason: the main site's only
current Vercel deployments (preview and the default `.vercel.app` domain)
sit behind Vercel Authentication (SSO), so none of them are publicly
reachable today. The Mobile Messaging Terms need a genuinely public URL —
with no Vercel login prompt — to use as the Terms URL in Klaviyo's SMS
registration.

**This has not been published anywhere.** No Vercel project has been
created for it yet.

## Before publishing

Legal entity name ("Get Age Fit, LLC") and business address ("3626 Williams
Dr, Floor 2, Georgetown, TX 78628") are now confirmed and filled in.
Resolve every remaining item in the "Internal review notice" at the top of
`index.html` — support-inbox monitoring, linked Privacy Policy content
(unverified; outbound web access from this session is blocked, see below),
and the effective-date placeholder. The same items are flagged in the
`src/app/mobile-terms/page.tsx` version in the main app, so keep both in
sync if either changes. Get explicit approval to publish before doing
anything below.

Note on the linked Privacy Policy: this content review could not confirm
whether `https://getagefit.com/privacy` and `https://getagefit.com/terms`
are live and adequate — outbound requests to arbitrary external domains
are blocked by this session's network policy (confirmed against a
known-public test domain, so this isn't specific to getagefit.com). Verify
directly before publishing.

## How to turn this into a public page (once approved)

This repo already contains the one file needed — no separate GitHub repo
required. To publish it as its own, independently-protected Vercel project:

1. In the Vercel dashboard, **Add New Project**, and import this same
   GitHub repo (`isabellemckae/GetAgeFit-website`) again as a *second*,
   distinct project (Vercel allows multiple projects from one repo).
2. Set that new project's **Root Directory** to `legal-standalone`.
3. Set **Framework Preset** to "Other" (plain static — no build command
   needed; `index.html` is served as-is).
4. Leave Deployment Protection at its default (off) for this new project —
   do NOT copy the main project's SSO setting over. This is the whole
   point of a separate project: its protection settings are independent.
5. Deploy. The resulting public URL will be
   `https://<the-project-name-you-chose>.vercel.app/` — e.g. naming it
   `getagefit-mobile-terms` gives
   `https://getagefit-mobile-terms.vercel.app/`.
6. Optionally attach a real subdomain you control (e.g.
   `legal.getagefit.com`) to this new project afterward for a branded URL —
   not required for Klaviyo's registration, which accepts any public HTTPS
   URL.

Once deployed, delete the "Internal review notice" block from
`index.html` (it's a reviewer-only note, not part of the legal text) and
redeploy before actually submitting the URL to Klaviyo or any carrier.
