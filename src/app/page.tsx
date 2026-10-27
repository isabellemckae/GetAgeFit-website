import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
const PRIMARY_CTA_SUPPORT_FULL =
  "No cost. No obligation. Just a chance to see what’s possible for YOU.";
const PRIMARY_CTA_SUPPORT_SHORT = "No cost. No obligation.";

export default function HomePage() {
  return (
    <>
      {/* 1. HERO — reusing the /how-it-works blurred/scrimmed full-bleed
          photo banner treatment (same markup pattern: absolutely-positioned
          fill photo + dark gradient overlay + light text on top), per
          Demo #4 Part 2.1. Same hero copy/CTA as before; only the container
          treatment changed. */}
      <section className="relative flex h-[720px] items-center overflow-hidden bg-plum-900 md:h-[600px]">
        {/* Management-directed (post-launch batch 1, EDIT 1; reverted to the
            site's standard dark purple in round 4): the Laura & James hero
            photo is removed in favor of a solid brand purple background;
            the photo itself is preserved and reused in the "Maybe You're
            Noticing…" section below instead (EDIT 2). The background was
            briefly lightened to bg-plum-500 only to offset that photo's
            darkness while it still lived here — now that the photo has
            moved, the dark bg-plum-900 (matching every other solid-color
            hero sitewide) returns so the hero text pops. */}
        <div className="relative z-10 mx-auto w-full max-w-content px-6 md:px-10">
          <Badge tone="plum">The 12-Week Transformation Experience</Badge>
          <h1 className="mb-6 mt-5 max-w-2xl text-sand-50">
            {/* Small supporting location label, not a headline — reduced
                from the original headline-scale treatment per direct
                follow-up correction. Kept inside the same <h1> as the
                actual headline below (rather than its own heading level)
                since it's a location identifier for local SEO, not a
                second page heading. */}
            <span className="mb-1 block text-[13px] leading-snug tracking-wide sm:text-[15px]">
              <FirstLetterEmphasis text="Gym in Georgetown, TX" emphasizeFirstLetter={false} />
            </span>
            <span className="block text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              <FirstLetterEmphasis
                text="Personal Training Personalized"
                highlightWords={["Personalized"]}
                highlightClassName="font-bold text-brand-lime-500"
              />
            </span>
          </h1>
          <p className="mb-9 max-w-xl text-lg leading-relaxed text-sand-100 sm:text-xl">
            Custom, age-appropriate workouts to look better, feel stronger,
            live longer.
          </p>
          <Button
            href="/consultation"
            size="lg"
            variant="primary"
            trackCta={PRIMARY_CTA_LABEL}
            trackLocation="homepage-hero"
          >
            {PRIMARY_CTA_LABEL}
          </Button>
          <p className="mt-4 text-sm text-sand-200/80">
            {PRIMARY_CTA_SUPPORT_FULL}
          </p>
        </div>
      </section>

      {/* 2. MAYBE YOU'RE NOTICING A FEW THINGS… */}
      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-10 text-3xl md:text-4xl">
            Maybe You&rsquo;re Noticing&hellip;
          </h2>
        </div>
        {/* Management-directed (post-launch batch 1, EDIT 2, recropped in
            round 2 EDIT 3): the photo previously used here is replaced with
            the original Laura & James photo freed up by EDIT 1, shown with
            natural colors (no tint/overlay). The source photo itself puts
            both people well to the right of a lot of empty purple
            background, so a plain centered crop pushed Laura's face to (or
            past) the frame edge on desktop and cut off both of their faces
            at the top on mobile -- object-position is tuned per breakpoint
            (mobile crops top-anchored since both faces sit in the top ~40%
            of that tall source frame; desktop crops to a narrower band
            shifted right, toward where the two of them actually stand) so
            both faces land centered in the visible frame with real margin
            around them, not the plain "center" default. */}
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
        <RecognitionList />
      </Section>

      {/* 3. THIS ISN'T YOUR TYPICAL GYM. — solid color block, no mesh/blob,
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

      {/* 4. GET STRONG / GET HEART HEALTHY / GET STEADY / GET YOUR LIFE BACK */}
      <Section tone="white">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome, index) => (
            <OutcomeAnchor key={outcome.anchor} outcome={outcome} index={index} />
          ))}
        </div>
      </Section>

      {/* 5. PEOPLE MAKE THE DIFFERENCE. */}
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

      {/* 6. REAL CLIENT STORIES (Demo #4 follow-up: heading reverted from
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

      {/* 7. THINKING ABOUT GETTING STARTED? */}
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

      {/* 8. EVERYTHING YOU NEED TO GET AGE FIT. */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-10 text-3xl md:text-4xl">
            Everything You Need to Get Age Fit.
          </h2>
          <ServicesSimpleList />
        </div>
      </Section>

      {/* 9. WHY I CREATED GET AGE FIT — THEO */}
      <Section tone="sand">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">
            Why I Created Get Age Fit
          </h2>
        </div>
        <FounderHomeSection />
      </Section>

      {/* 10. FOOTER — rendered globally by src/app/layout.tsx, not here. */}
    </>
  );
}
