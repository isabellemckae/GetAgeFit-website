# Content Status — Review Before Launch

Per PROMPT §29–§30: this catalogs every piece of content as **VERIFIED
FACT**, **PROPOSED COPY**, or **PLACEHOLDER CONTENT**, so the GetAgeFit
team can review efficiently instead of hunting through code.

Search the codebase for the bracket patterns below to find every instance:
`[CONFIRM ...]`, `[INSERT ...]`, `[BUSINESS DECISION REQUIRED ...]`.

## ✅ VERIFIED FACTS (used as given in the master prompt)

These came directly from the business context in the master prompt and are
used as-is:

- Mission statement: *"Giving people independence through fitness and
  strength in every stage of life."*
- Core positioning: "Strength for every stage of life."
- Culture pillars: Love, Joy, Gratitude, Service.
- Service inclusions: 1:1 training, 1:2 training, personalized programming,
  nutrition counseling, cardio setup/guidance, InBody scans, trainer
  accountability, injury/limitation-adapted programming, boutique facility,
  community.
- Founder's first name: Theo.
- Target audience: adults ~40–80+.
- Location: Georgetown, Texas.
- Pricing policy: internal minimum is never published; investment is
  discussed after consultation. (Enforced — see "Pricing" below.)

## 🟡 PROPOSED COPY (needs review/approval, not fabricated facts)

Marketing copy, section framing, and the 6 Resource Center articles
(`src/content/articles.ts`) are proposed copy built from general,
widely-accepted strength-training and healthy-aging guidance — **no
GetAgeFit-specific statistics, client outcomes, trainer names, or medical
claims are asserted in them.** Each article carries a
`publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]"` placeholder and should be
reviewed/approved by an actual GetAgeFit trainer before publishing, per
PROMPT §14.

All homepage and interior-page section copy (hero, "Reframe," "Who We
Help," CTAs, FAQs on `/how-it-works`) is proposed copy written directly
from the strategic direction in the master prompt. Nothing in it asserts a
specific client outcome, statistic, or credential.

## 🔴 PLACEHOLDER CONTENT (must be replaced before launch)

Nothing in this list was invented — every placeholder is an explicit
bracketed marker in the source, per PROMPT §29's rule to never fill gaps
with assumptions.

### NAP / business identity — `src/lib/site-config.ts`
- Street address
- ZIP code
- Phone number
- Contact email
- Studio hours
- Social links (Instagram/Facebook handles)

### Trainers — `src/content/trainers.ts`
Two structural placeholder profiles (expand to the real trainer count).
Each needs: real name, role/title, certifications, specialties, coaching
philosophy (in their voice), personal story, and a photo. **None of the
current entries should be mistaken for real people.**

### Transformations — `src/content/transformations.ts`
Three structural placeholder case studies. Each needs a real client's
name/initials (with signed permission), age, starting point, goal,
challenges, training approach, measurable outcome, direct quote, and photo
(with permission). Prioritize stories about strength, independence, and
capability over purely aesthetic results, per PROMPT §12.

### About page — `src/app/about/page.tsx`
- Founder Theo's background/personal story
- Years in business / credentials for the public bio
- Facility description (layout, equipment highlights)
- Founder photo

### Legal — `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
Both are explicit placeholders pending counsel review. **Do not launch
with these as final** — they currently just describe what the final policy
needs to cover (form data collected, CRM/analytics sharing, retention,
deletion requests).

### How It Works FAQ
- Typical consultation length (`src/app/how-it-works/page.tsx` — not
  currently asked, but referenced as a placeholder in the
  `/resources/what-to-expect-at-your-first-consultation` article FAQ)

## 🚫 Pricing — enforced, not just proposed

The internal $899/mo minimum is **not referenced anywhere in this
codebase** — not in copy, metadata, schema, comments intended for public
consumption, or the qualification logic itself (`routeQualification()` in
`src/lib/qualification.ts` works entirely off qualitative signals, never a
dollar comparison). Verified via `grep -rn "899" src/` at the end of the
build — the only historical hit was in a code comment, which has since
been rewritten to describe the policy without repeating the figure.

If a future editor is tempted to add pricing anywhere public-facing,
that's a **business decision requiring Theo's explicit approval** — the
default in this codebase is "don't."

## Business decisions required (non-content)

- Which CRM/webhook endpoint to forward leads to (`CRM_WEBHOOK_URL`)
- Whether to use a booking tool (Calendly/Acuity/etc.) for direct
  self-scheduling on `/consultation`, or keep the human-confirmed request
  form
- GA4 property ID and Microsoft Clarity project ID
- Final legal review of `/privacy` and `/terms`
