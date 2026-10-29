import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { FirstLetterEmphasis } from "@/components/ui/FirstLetterEmphasis";
import { RecognitionList } from "@/components/home/RecognitionList";
import { OutcomeAnchor } from "@/components/home/OutcomeAnchor";
import { FeaturedTestimonials } from "@/components/home/FeaturedTestimonials";
import { ObjectionFAQ } from "@/components/home/ObjectionFAQ";
import { ServicesSimpleList } from "@/components/home/ServicesSimpleList";
import { FounderHomeSection } from "@/components/home/FounderHomeSection";
import { outcomes } from "@/content/outcomes";
import { objectionsClosing } from "@/content/objections";
import { siteConfig, cta } from "@/lib/site-config";
import { pageOpenGraph } from "@/lib/seo";

// Demo #2 homepage. Rebuilt per the approved New Website Master Reference
// (§10, §11) and Prompt 3 — see docs/ARCHITECTURE.md for the full
// decision trail.
//
// Post-launch management batch 1 (EDIT 13): the primary CTA label used to
// be inlined here on purpose, separate from lib/site-config.ts's `cta`
// object, specifically so its wording wouldn't cascade to other pages
// before they'd been reviewed. Management has now directed one exact
// label sitewide ("Schedule your free consultation"), explicitly
// superseding that earlier wording — so this page now sources the label
// from `cta.primary.label` like every other consultation button, rather
// than keeping a second, separately-maintained copy of the same string.

const HOME_TITLE = "Personal Training for Adults 40+ in Georgetown, TX";
const HOME_DESCRIPTION =
  "Get Age Fit's 12-week transformation experience is healthy-aging personal training for brand-new clients 40 to 80+, built around strength, independence, and confidence for the years ahead.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  ...pageOpenGraph({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
};

const PRIMARY_CTA_LABEL = cta.primary.label;
const PRIMARY_CTA_SUPPORT_SHORT = "No cost. No obligation.";

export default function HomePage() {
  return (
    <>
      {/* 1. WELCOME TO GETAGEFIT / MAYBE YOU'RE NOTICING A FEW THINGS…
          Round 7 (Theo, direct request): the purple "Personal Training
          Personalized" hero that used to open the homepage is removed
          entirely — this section (first built in round 4, previously
          second) is now the first thing visitors see beneath the global
          nav. The page's one H1 moves here with it: "Gym in Georgetown,
          TX" (the exact small supporting label the old hero used, reused
          verbatim rather than inventing new copy) sits as its own visible
          eyebrow line, and "Welcome to [GetAgeFit logo]" becomes the
          actual <h1> — an <img> with real alt text inside an <h1> is
          valid, visible, crawlable markup, not hidden text. This keeps
          exactly one meaningful H1 on the page (the old hero's H1 is
          gone with it) while keeping the Georgetown location identifier
          as plain visible text, per the SEO requirements for this round.
          The Laura & James photo and the "Maybe You're Noticing…"
          heading/copy below are unchanged from round 4. */}
      <Section tone="white">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
            <FirstLetterEmphasis text="Gym in Georgetown, TX" emphasizeFirstLetter={false} />
          </p>
          <h1 className="flex flex-col items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              Welcome to
            </span>
            <Image
              src="/images/brand/getagefit-logo.png"
              alt="Get Age Fit"
              width={630}
              height={81}
              className="mx-auto h-10 w-auto md:h-12"
            />
          </h1>
        </div>
        {/* Management-directed (post-launch batch 1, EDIT 2, recropped in
            round 2 EDIT 3; background recolored in round 4 from a flat
            purple cutout to the same warm studio grey as the trainer
            headshots, per Theo's direct request): the photo previously
            used here is replaced with the original Laura & James photo
            freed up by EDIT 1, shown with natural colors (no tint/overlay).
            The source photo itself puts both people well to the right of a
            lot of empty background, so a plain centered crop pushed
            Laura's face to (or past) the frame edge on desktop and cut off
            both of their faces at the top on mobile -- object-position is
            tuned per breakpoint (mobile crops top-anchored since both faces
            sit in the top ~40% of that tall source frame; desktop crops to
            a narrower band shifted right, toward where the two of them
            actually stand) so both faces land centered in the visible
            frame with real margin around them, not the plain "center"
            default. */}
        <ResponsiveImage
          src="/images/training/hero-strength-duo-mobile.jpg"
          alt="Laura and James, GetAgeFit clients celebrating their strength gains"
          placeholderLabel="Recognition photo"
          aspect="aspect-[4/3]"
          imageClassName="object-[center_8%]"
          className="mx-auto mb-12 max-w-2xl shadow-soft md:hidden"
        />
        <ResponsiveImage
          src="/images/training/hero-strength-duo.webp"
          alt="Laura and James, GetAgeFit clients celebrating their strength gains"
          placeholderLabel="Recognition photo"
          aspect="aspect-[3/2]"
          imageClassName="object-[85%_center]"
          className="mx-auto mb-12 hidden max-w-2xl shadow-soft md:block"
        />
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-10 text-3xl md:text-4xl">
            Maybe You&rsquo;re Noticing&hellip;
          </h2>
        </div>
        <RecognitionList />
      </Section>

      {/* 2. THIS ISN'T YOUR TYPICAL GYM. — solid color block, no mesh/blob,
          for a bolder, flatter contrast moment. */}
      <section className="bg-sage-950 py-20 md:py-28">
        <div className="relative mx-auto max-w-2xl px-6 text-center md:px-10">
          <h2 className="mb-8 text-3xl text-sand-50 md:text-4xl">
            This Isn&rsquo;t Your Typical Gym.
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-sand-200/90">
            <p>
              At Get Age Fit, you don&rsquo;t walk in and wonder what
              you&rsquo;re supposed to do. You have a trainer. You have a
              plan. And you have people who know, appreciate, and support
              you.
            </p>
            <p>
              Your training is built around your body, your goals, and
              where you are today, and it changes as you get stronger.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GET STRONG / GET HEART HEALTHY / GET STEADY / GET YOUR LIFE BACK */}
      <Section tone="white">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome, index) => (
            <OutcomeAnchor key={outcome.anchor} outcome={outcome} index={index} />
          ))}
        </div>
      </Section>

      {/* 4. PEOPLE MAKE THE DIFFERENCE. */}
      <Section tone="sand">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <ResponsiveImage
              src="/images/trainers/james-petersen.webp"
              alt="James Petersen, GetAgeFit personal trainer"
              placeholderLabel="Team photo needed: real Get Age Fit trainer/group photograph"
              aspect="aspect-[4/5]"
              className="shadow-soft"
            />
            <div className="absolute -bottom-10 -left-10 w-2/5 -rotate-6 overflow-hidden rounded-xl2 border-4 border-sand-50 shadow-soft">
              <ResponsiveImage
                src="/images/trainers/isa-lozano.webp"
                alt="Isa Lozano, GetAgeFit personal trainer"
                placeholderLabel="Trainer photo"
                aspect="aspect-[4/5]"
              />
            </div>
            <div className="absolute -top-8 -right-8 w-2/5 rotate-6 overflow-hidden rounded-xl2 border-4 border-sand-50 shadow-soft">
              <ResponsiveImage
                src="/images/trainers/robert-dolan.webp"
                alt="Dr. Robert Dolan, GetAgeFit personal trainer"
                placeholderLabel="Trainer photo"
                aspect="aspect-[4/5]"
              />
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-3xl md:text-4xl">
              People Make the Difference.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-ink-700">
              Our trainers aren&rsquo;t here to put you through a workout.
              They&rsquo;re here to get to know you, and celebrate your
              progress.
            </p>
            <Button
              href="/trainers"
              variant="secondary"
              trackCta="Meet Our Trainers"
              trackLocation="homepage-trust"
            >
              Meet Our Trainers
            </Button>
          </div>
        </div>
      </Section>

      {/* 5. REAL CLIENT STORIES (Demo #4 follow-up: heading reverted from
          "Five-Star Reviews" — these are real client reviews, and "Real
          Client Stories" better fits the brand voice. Client-directed
          three-review redesign: the single-column five-up stack (see
          TestimonialQuote.tsx's doc comment for that version's history)
          is replaced with FeaturedTestimonials.tsx, showing exactly three
          — see src/content/testimonials.ts's `featuredTestimonialSlugs`.
          The heading and the "Explore 150+ Five-Star Reviews" link are
          unchanged.) */}
      <Section tone="white">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">Real Client Stories</h2>
        </div>
        <FeaturedTestimonials />
        <div className="mt-12 text-center">
          {siteConfig.social.googleReviews ? (
            <a
              href={siteConfig.social.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-semibold text-sage-700 underline decoration-2 underline-offset-4 hover:text-sage-900"
            >
              Explore 150+ Five-Star Reviews →
            </a>
          ) : (
            // TODO(Demo #4 Part 2.5): wire up once the verified Google
            // Business Profile reviews URL is supplied — see
            // siteConfig.social.googleReviews. Not guessed/invented.
            <span
              className="inline-flex cursor-not-allowed items-center gap-2 text-lg font-semibold text-sage-700/50 underline decoration-2 underline-offset-4"
              title="Google reviews URL not yet configured"
              aria-disabled="true"
            >
              Explore 150+ Five-Star Reviews →
            </span>
          )}
        </div>
      </Section>

      {/* 6. THINKING ABOUT GETTING STARTED? */}
      <Section tone="sand">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">
            Thinking About Getting Started?
          </h2>
        </div>
        <ObjectionFAQ />
        <div className="mx-auto mt-14 max-w-xl text-center">
          <p className="mb-6 text-lg font-medium text-ink-800">
            {objectionsClosing}
          </p>
          <Button
            href="/consultation"
            size="lg"
            trackCta={PRIMARY_CTA_LABEL}
            trackLocation="homepage-objections"
          >
            {PRIMARY_CTA_LABEL}
          </Button>
          <p className="mt-4 text-sm text-ink-500">
            {PRIMARY_CTA_SUPPORT_SHORT}
          </p>
        </div>
      </Section>

      {/* 7. EVERYTHING YOU NEED TO GET AGE FIT. */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-10 text-3xl md:text-4xl">
            Everything You Need to Get Age Fit.
          </h2>
          <ServicesSimpleList />
        </div>
      </Section>

      {/* 8. WHY I CREATED GET AGE FIT — THEO */}
      <Section tone="sand">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">
            Why I Created Get Age Fit
          </h2>
        </div>
        <FounderHomeSection />
      </Section>

      {/* 9. FOOTER SEO COPY — Theo's exact approved wording (round 7),
          reused verbatim, not rewritten. Rendered here, directly above
          where the global Footer renders, rather than inside
          Footer.tsx itself: Footer.tsx is a shared component rendered
          on every page (src/app/layout.tsx), and this copy is
          homepage-specific per Theo's instructions, so it's added as
          homepage-only markup instead of sitewide. Styled to match the
          Footer's own dark-mesh background exactly (`bg-mesh-dark`) so
          there's no visible seam between this block and the footer
          immediately below it — visually it reads as one continuous
          footer area, structurally it's a sibling section. Heading
          hierarchy: this follows the homepage's one <h1> (round 7,
          above) and every other <h2> section heading on the page, so
          "The 12-Week Transformation Experience" is an <h2>, same
          level as the rest, not a second <h1>. "Gym in Georgetown, TX"
          here is the same short location label already shown near the
          top of the page (not a new, separate SEO paragraph) — per
          Theo's exact copy, which repeats it intentionally, the same
          way a business's name/location commonly appears near both the
          top and bottom of a page. */}
      <div className="bg-mesh-dark py-14">
        <div className="mx-auto max-w-2xl px-6 text-center md:px-10">
          <h2 className="mb-2 text-xl text-sand-50 md:text-2xl">
            The 12-Week Transformation Experience
          </h2>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sand-200/70">
            Gym in Georgetown, TX
          </p>
          <p className="text-sm leading-relaxed text-sand-200/80">
            Custom, age-appropriate workouts with your certified trainer
            designed to develop functional strength and muscle tone, reduce
            body fat, increase energy and improve balance and
            flexibility&hellip; resulting in independence you can feel in
            daily life.
          </p>
        </div>
      </div>

      {/* 10. FOOTER — rendered globally by src/app/layout.tsx, not here. */}
    </>
  );
}
