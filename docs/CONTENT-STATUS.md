# Content Status — Review Before Launch

Per PROMPT §29–§30: this catalogs every piece of content as **VERIFIED
FACT**, **PROPOSED COPY**, **LEGACY CLAIM (needs re-verification)**, or
**PLACEHOLDER CONTENT**, so the GetAgeFit team can review efficiently
instead of hunting through code.

Search the codebase for the bracket patterns below to find every instance:
`[CONFIRM ...]`, `[INSERT ...]`.

Three source documents inform this file — see `docs/ARCHITECTURE.md` →
"Phase 1 — Audit" for what each one is:
1. *Get Age Fit — Current Website Master Reference* (Aug 8, 2026)
2. *Get Age Fit — Digital Growth & Website Strategy* (Aug 8, 2026)
3. *Straight4ward Marketing Website Recommendations*

## ✅ VERIFIED FACTS (used as-is)

From the master build prompt / owner-approved strategy:

- Mission statement: *"Giving people independence through fitness and
  strength in every stage of life."*
- Core positioning: "Strength for every stage of life."
- Culture pillars: Love, Joy, Gratitude, Service.
- Service inclusions: 1:1 training, 1:2 training, personalized programming,
  nutrition counseling, cardio setup/guidance, InBody scans, trainer
  accountability, injury/limitation-adapted programming, boutique facility,
  community, protein, pre-workout drinks, water.
- Founder: Theo Thurston.
- Target audience: adults ~40–80+.
- Location: Georgetown, Texas.
- Pricing policy: internal minimum is never published; investment is
  discussed after consultation. (Enforced — see "Pricing" below.)
- Qualification investment-mindset question and its four answer options
  (verbatim from the strategy doc, used verbatim in `/qualify`).

From the legacy site capture — operational facts, not performance claims,
so used directly in `src/lib/site-config.ts`:
- Address: 3626 Williams Drive, Suite 200, Georgetown, TX 78628
- Phone: (512) 591-7923 · Email: info@getagefit.com
- Hours: Mon–Fri 5:00am–8:00pm · Sat 7:00am–4:00pm · Sun by appointment

**⚠️ Reconfirm before launch** that this NAP is still current — it was
captured from the live site August 2026 and could have changed since.

## 🟢 Trainer roster (sourced from the live site, mostly usable as-is)

`src/content/trainers.ts` now carries the full 16-person roster with real
names, roles, and credentials as listed on the current getagefit.com team
page (e.g. James Petersen — NASM CPT/Nutrition Coach/Senior Fitness
Specialist; Robert Dolan, MD — NYU School of Medicine, NASM CPT; full list
in the source file). This is real, sourced content, not invented.

**Still missing per trainer** (needs each trainer's own input, per PROMPT
§29's rule against writing in someone's voice for them):
- Coaching philosophy, in their own words
- Personal story / why they coach
- Headshot

**Reconfirm before launch:** the roster may have changed (new hires,
departures) since capture — the legacy reference notes Theo had already
requested 2 new trainers be added.

## 🟡 Founder story — now grounded, one detail still open

`/about` now uses Theo's real, sourced story: fitness journey began later
in life (transformation in his late 40s), GetAgeFit founded in Georgetown
in 2016, Cooper Institute Certified Personal Trainer, motto "Change your
mind. Change your body. Change your life."

**Still needed:** a founder photo, and confirmation that the qualitative
story above is accurate and approved for public use (it's drawn from the
legacy site's About/Founder page, not independently re-interviewed).

## 🔴 Legacy claims — NOT republished, flagged for confirmation instead

The legacy reference document itself is explicit that these are **current
website claims, not independently verified facts**, and instructs
confirming each with Theo/management before reuse. They are **not** in any
live page copy as bald claims — only as `[CONFIRM ...]` placeholders on
`/about`, pre-filled with the legacy figure so the team can quickly
approve or correct rather than starting from a blank field:

- 35,000+ personal training sessions delivered
- 98% first-session client retention
- Clients report feeling stronger/more confident within three weeks
- 30,000 training hours · 10,000 clients transformed · 7 years in service
  to Georgetown
- 8,000 sq. ft. flagship facility · 150+ dedicated clients · 18 certified
  trainers
- Founder detail: 35,000+ one-on-one/couples sessions coached over 23
  years; competed in drug-free bodybuilding, Masters 50 & 60 divisions,
  2009–2019; first transformation result of −14 lb body fat / +17 lb lean
  muscle

**Business decision required:** confirm which (if any) of these to
publish, with current/accurate figures, and where (About page "by the
numbers," homepage proof section, etc.).

## 🔴 Legacy testimonials — candidates pending explicit permission

The strategy document lists *"testimonials/case studies approved for
names, ages, photos, and metrics"* as an **open decision**, not something
already cleared for reuse. So these are **not** inserted into
`/transformations` — the page still uses honest `[INSERT ...]` case-study
placeholders. Listed here as a shortlist so the team can fast-track
whichever ones have (or can get) client permission to republish on the new
site, ideally as full structured case studies rather than short quotes:

- **Ben P.** — described a life-changing 12-month experience; praised
  staff as professional, encouraging, and fun.
- **Carol D.** — praised the environment, Theo's knowledge/professionalism,
  and training value.
- **Janine C.** — praised Theo's ability to deliver hard work and
  transformation.
- **Brad H.** — praised one-on-one instructors, personalized plans,
  private sessions, and pricing.
- **Veronica M.** — reported losing 6 lb fat and gaining 0.5 lb muscle in
  four weeks. *(Specific metric — needs re-verification if reused.)*
- **Sandy H.** — praised customized plans and a small, intimate,
  no-judgment gym.
- Couple testimonials: **Rob & Sue**, **Jim & Jennifer**, **Robert &
  Diane** (details not captured beyond names).
- Additional named social proof from the conversion page: **Gina A.**,
  **Michael J.**

For each: get (or confirm existing) signed permission for name/age/photo
use, verify the specific outcome is still accurate, and — ideally —
expand into the full case-study shape already defined in
`src/content/transformations.ts` (starting point, approach, outcome,
direct quote) rather than a short pull-quote, per PROMPT §12's preference
for strength/independence/capability stories over purely aesthetic ones.

## 🟡 Legacy program structure — reference only, not carried forward

The legacy site's specific package architecture (36-session package,
alternate 24-session package with 2 private + 1 group session/week, $99/mo
couples add-on, complimentary InBody270 baseline scan, free 45-minute
trial session, rollover session minutes) is captured here for reference
only. The strategy doc explicitly lists "exact program names and offer
architecture," "exact 1:1/1:2 structure," and "rules/economics for 2-for-1
promotions" as **open decisions** for the new site — and the new
qualify-then-consult funnel intentionally replaces "free session" as the
primary conversion action with "consultation/evaluation" (see
`docs/ARCHITECTURE.md`). `/programs` therefore describes coaching formats
and complete-experience inclusions in general terms and does not assert
any of the specific package sizes or promotions above.

**Business decision required:** finalize new-site program names/structure,
then update `/programs` accordingly.

## 🟡 PROPOSED COPY (needs review/approval, not fabricated facts)

The 6 Resource Center articles (`src/content/articles.ts`) are proposed
copy built from general, widely-accepted strength-training and
healthy-aging guidance — **no GetAgeFit-specific statistics, client
outcomes, trainer names, or medical claims are asserted in them.** Each
carries a `publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]"` placeholder
and should be reviewed/approved by an actual GetAgeFit trainer before
publishing, per PROMPT §14.

All homepage and interior-page section copy (hero, "Reframe," "Who We
Help," CTAs, FAQs on `/how-it-works`) is proposed copy written from the
approved strategic direction. Nothing in it asserts a specific client
outcome, statistic, or credential.

## 🔴 PLACEHOLDER CONTENT still outstanding

### Transformations — `src/content/transformations.ts`
Three structural placeholder case studies, pending the permission/
verification pass on the legacy testimonial shortlist above.

### Legal — `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
Both are explicit placeholders pending counsel review.

### How It Works FAQ
Typical consultation length — referenced as a placeholder in the
`/resources/what-to-expect-at-your-first-consultation` article FAQ.

## 🚫 Pricing — enforced, not just proposed

The internal $899/mo minimum is **not referenced anywhere in this
codebase** — not in copy, metadata, schema, comments intended for public
consumption, or the qualification logic itself (`routeQualification()` in
`src/lib/qualification.ts` works entirely off qualitative signals, never a
dollar comparison). Also not carried forward: the legacy site's $99/mo
couples add-on price, since the new site's direction is no public pricing
at all pending Theo's approval otherwise.

## Business decisions required (non-content)

- Confirm the legacy stats and testimonials above (which to publish, with
  what current figures/permissions)
- Finalize new-site program names/architecture (`/programs`)
- Which CRM/webhook endpoint to forward leads to (`CRM_WEBHOOK_URL`) —
  strategy doc notes this should align with the existing GetAgeFit
  CRM/Airtable setup rather than duplicating it
- Whether to use a booking tool (Calendly/Acuity/etc.) for direct
  self-scheduling on `/consultation`, or keep the human-confirmed request
  form
- GA4 property ID and Microsoft Clarity project ID (Clarity was already
  recommended by Straight4ward at no cost)
- Final legal review of `/privacy` and `/terms`
