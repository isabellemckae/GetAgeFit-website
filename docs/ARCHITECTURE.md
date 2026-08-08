# GetAgeFit Website — Architecture

This document covers Phase 1 (Audit) and Phase 2 (Architecture) of the
master build prompt, plus the technical decisions made while implementing
Phases 3–7.

## Phase 1 — Audit

**Update:** the repository this site was built in had zero commits at the
start of this build (confirmed via `git log`, `git branch -a`, and a fresh
`git fetch` against `origin`) — there was no existing GetAgeFit *codebase*
to migrate. However, three project reference documents were supplied
partway through the build and **do** contain a real audit of the live
getagefit.com site:

- *Get Age Fit — Current Website Master Reference* (Aug 8, 2026) — a
  page-by-page capture of the live site's positioning, offers, proof
  points, team roster, testimonials, and claims.
- *Get Age Fit — Digital Growth & Website Strategy* (Aug 8, 2026) — the
  strategic source document the master build prompt itself was derived
  from (confirms the sitemap, qualification logic, KPIs, and brand
  direction used in this build match the approved strategy).
- *Straight4ward Marketing Website Recommendations* — the agency email
  that prompted the refresh, recommending AI-visibility work, resource
  content, and Microsoft Clarity tracking (all already reflected in this
  build).

This audit's findings — what was preserved, what changed, and what's
flagged for re-verification — are now incorporated:

- **Preserved and reused directly:** studio NAP (address/phone/hours/email)
  now live in `src/lib/site-config.ts`; the full current trainer roster
  (16 people, names + real credentials) now lives in
  `src/content/trainers.ts`; founder Theo Thurston's qualitative
  story/motto/founding year on `/about`.
- **Preserved as reference, not republished as fact:** specific
  superlative statistics from the old site (35,000+ sessions, 98%
  retention, 8,000 sq ft, 18 trainers, etc.) are called out as
  **unverified legacy claims** — see "Legacy Site Baseline" in
  `docs/CONTENT-STATUS.md`. The old reference document itself flags these
  as claims to confirm before reuse, not confirmed facts.
- **Preserved as candidates pending approval, not republished:** the six
  named testimonials on the legacy site (Ben P., Carol D., Janine C.,
  Brad H., Veronica M., Sandy H.) and three named couple testimonials.
  The strategy document explicitly lists "testimonials/case studies
  approved for names, ages, photos, and metrics" as an **open decision**
  — so these are cataloged as reuse candidates in
  `docs/CONTENT-STATUS.md`, not inserted into `/transformations` without
  that sign-off.
- **Deliberately not carried forward:** the legacy site's specific program
  architecture (36-session package, 24-session alt package, $99/mo couples
  add-on, "Free Session" as the primary CTA). The approved strategy
  explicitly replaces "free session" conversion with a
  qualify-then-consult model, and the strategy doc lists "exact program
  names and offer architecture" as an **open decision** for Theo — so
  `/programs` describes the coaching *formats* (1:1, 1:2) and the
  complete-experience inclusions without inventing package sizes or
  pricing structure that hasn't been decided for the new site.

If additional legacy assets exist outside these three documents (real
photography, signed testimonial releases, a CRM/Airtable export), hand
them to the team so they can replace the remaining placeholders cataloged
in `docs/CONTENT-STATUS.md`.

## Phase 2 — Sitemap & User Flows

### Sitemap

```
/                       Home — the conversion engine
/why-getagefit          Differentiation: what GetAgeFit is / is not
/how-it-works           Process (consultation → plan → coaching → progress) + Complete Experience
/programs               1:1 and 1:2 coaching formats (no public pricing)
/transformations        Client case studies (strength/independence-first)
/trainers               Coach bios
/about                  Mission, founder, culture, studio
/resources              Article index (Resource Center)
/resources/[slug]       Individual articles (SEO + AI-search structured)
/contact                General inquiry form → CRM
/consultation           Consultation booking (embed or request form) → CRM
/qualify                Qualification Experience (multi-step) → CRM
/privacy, /terms        Legal (placeholders pending counsel review)
```

Every page other than legal/utility pages ends in the same CTA hierarchy
(`src/lib/site-config.ts`): **Schedule a Consultation** (primary), **Find
Out If GetAgeFit Is Right for You** (qualification), **See How It Works** /
**Explore Resources** (secondary). No page introduces a competing primary
CTA.

### Primary user journey (Attract → Convert → Measure)

```
Ad / organic / AI search / social
        │
        ▼
  Landing page (Home or an /resources article)
        │
        ├─── high-intent visitor ──► /consultation (direct booking)
        │
        └─── undecided visitor ──► /qualify (qualification funnel)
                        │
              routeQualification()
                        │
        ┌───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼
  HIGH_INTENT     POTENTIAL_FIT      NURTURE          LOW_FIT
  → /consultation → /consultation   → /resources     → /resources
  (book now)      (book, softer)    (email captured, (helpful pathway,
                                     nurture segment)  no aggressive sales)
```

Every branch of `/qualify` still POSTs the full answer set to
`/api/qualify`, which recomputes the routing server-side (never trusts the
client result) and forwards a normalized lead record to the CRM webhook —
so even LOW_FIT and NURTURE leads land in the CRM for segmentation, per
PROMPT §18.

### Qualification logic

Implemented in `src/lib/qualification.ts`. Three signals combine into four
outcomes:

- **Investment mindset** (the exact non-price-anchored question from
  PROMPT §17, options A–D)
- **Personalized-coaching importance** (not important → essential)
- **Long-term readiness** (exploring → few months → ready now)

Routing rules (see inline comments in the source for the authoritative
logic):

1. Option **A** ("lowest-cost way to exercise") → `low_fit`, always — never
   inferred from score, per PROMPT §18's explicit instruction not to
   aggressively sell low-fit prospects.
2. Option **D** ("not sure yet") → `nurture`, always — readiness to buy
   isn't established yet, regardless of the other two answers.
3. Options **B/C** + `ready_now` + importance `very`/`essential` →
   `high_intent`.
4. Any other combination of B/C with a positive combined score →
   `potential_fit`.
5. Otherwise → `nurture`.

The **$-figure investment threshold is never encoded, compared, or
referenced anywhere in this logic** — routing is entirely signal-based, in
keeping with PROMPT §2 and §17.

## Data architecture (CRM-ready)

No bespoke CRM was built — per PROMPT §20's explicit instruction not to
duplicate one. Instead, three API routes (`/api/lead`, `/api/consultation`,
`/api/qualify`) each normalize their form's submission into the shared
`CrmLeadPayload` shape (`src/lib/crm.ts`) and POST it to `CRM_WEBHOOK_URL`
— a generic webhook endpoint that can point at a CRM's native webhook, or
at a Zapier/Make/n8n catcher that fans out to the real CRM, HubSpot forms
API, etc. Until that URL is configured, submissions still succeed (forms
work end-to-end) and are logged server-side so nothing is lost during
development.

`CrmLeadPayload` carries every field PROMPT §20 asks for that this site can
capture client-side: lead source, name, email, phone, age range, primary
goal, training frequency, personalized-coaching importance, investment
mindset, injury/limitation indicator + detail, readiness, and computed
qualification status. Downstream-only fields — consultation booked/attended,
purchased, program purchased, revenue/MRR — belong to the CRM and sales
process once a lead reaches a human, and are intentionally out of scope for
a static marketing site to fabricate.

**Business decision required:** which CRM/webhook receiver GetAgeFit
actually uses. Once known, set `CRM_WEBHOOK_URL` (and `CRM_WEBHOOK_SECRET`
if the receiver requires auth) in the deployment environment — no code
changes needed.

## Analytics architecture

`src/lib/analytics.ts` pushes a typed set of events to `window.dataLayer`
(consumed by GA4 via `gtag.js`) and tags Microsoft Clarity sessions with the
same event so session recordings can be filtered by funnel outcome. Events
map directly to the KPIs in PROMPT §21:

| Event | KPI it supports |
|---|---|
| `cta_click` | Which CTAs actually drive movement, by page/section |
| `qualify_start` / `qualify_step_complete` | Qualification funnel drop-off, by step |
| `qualify_complete` (with result) | Qualified-lead rate, segmented by outcome |
| `lead_captured` | Lead capture rate by source |
| `consultation_requested` | Consultation booking rate |

GA4 and Clarity are both no-ops until `NEXT_PUBLIC_GA4_ID` /
`NEXT_PUBLIC_CLARITY_ID` are set (`src/components/AnalyticsScripts.tsx`),
so the site builds and runs cleanly before those IDs are issued. Revenue,
consultation-show, and lead-to-client conversion tracking depend on
CRM/analytics integration downstream of form submission and are noted as
a technical follow-up, not fabricated here.

## Technical decisions made without escalation

Per PROMPT §38, these were treated as engineering calls within the
established brand system rather than open questions:

- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS —
  server-rendered/statically generated for SEO and Core Web Vitals, with
  API routes for form handling. No external CMS wired up yet; content
  lives in typed files under `src/content/` so it's easy to review and,
  later, easy to move into a CMS if GetAgeFit wants trainers editing
  articles directly.
- **Typography:** system serif/sans font stacks rather than a web-font
  fetch, so builds don't depend on network access to a font CDN. Swapping
  in a licensed display serif (e.g. via `next/font`) is a config-only
  change in `tailwind.config.ts` whenever the team picks one.
- **Photography:** every image slot uses an on-brand abstract placeholder
  (`PhotoPlaceholder` component) rather than stock photography or
  AI-generated imagery, per PROMPT §6's explicit direction to avoid both.
  Swap for real photography by replacing the component usage with
  `next/image`.
- **Next.js version:** pinned to the latest patched 14.2.x release rather
  than jumping to Next 15/16, to avoid an App Router breaking-change churn
  mid-build. `npm audit` still flags several Next.js advisories that are
  only fully resolved in the 16.x line (mostly around self-hosted
  middleware/image-optimizer edge cases this site doesn't currently use).
  **Follow-up recommended post-launch:** evaluate a Next 15/16 upgrade.
- **Booking:** `/consultation` renders an embedded iframe if
  `NEXT_PUBLIC_BOOKING_URL` is set (e.g. a Calendly/Acuity link), otherwise
  falls back to a request form that emails/CRMs the lead for manual
  scheduling. Business decision: whether GetAgeFit wants direct
  self-scheduling or a human-confirmed booking flow.

## Business decisions still required

See `docs/CONTENT-STATUS.md` for the full, itemized list. Highlights:

- Studio address, phone, email, hours (public NAP)
- Whether/how to connect a booking tool for direct self-scheduling
- Which CRM the site should forward leads to
- Final privacy policy and terms of service (counsel review)
