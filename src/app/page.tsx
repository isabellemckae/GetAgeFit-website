import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { RecognitionList } from "@/components/home/RecognitionList";
import { OutcomeAnchor } from "@/components/home/OutcomeAnchor";
import { TestimonialQuote } from "@/components/home/TestimonialQuote";
import { ObjectionFAQ } from "@/components/home/ObjectionFAQ";
import { ServicesSimpleList } from "@/components/home/ServicesSimpleList";
import { FounderHomeSection } from "@/components/home/FounderHomeSection";
import { outcomes } from "@/content/outcomes";
import { testimonials } from "@/content/testimonials";
import { objectionsClosing } from "@/content/objections";
import { siteConfig } from "@/lib/site-config";

// Demo #2 homepage. Rebuilt per the approved New Website Master Reference
// (§10, §11) and Prompt 3 — see docs/ARCHITECTURE.md for the full
// decision trail. Primary CTA copy is inlined on this page deliberately
// (not sourced from lib/site-config.ts's `cta` object), so this rebuild
// doesn't cascade the new CTA wording onto secondary pages that haven't
// been reviewed yet — that propagation is planned for Phase 4/5.

export const metadata: Metadata = {
  title: "Personal Training for Adults 40+ in Georgetown, TX",
  description:
    "Get Age Fit's 12-week transformation experience is healthy-aging personal training for brand-new clients 40 to 80+, built around strength, independence, and confidence for the years ahead.",
  alternates: { canonical: "/" },
};

const PRIMARY_CTA_LABEL = "Schedule Your Free Evaluation & Consultation";
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
      <section className="relative flex h-[720px] items-center overflow-hidden md:h-[600px]">
        <ResponsiveImage
          src="/images/training/coaching-session-leg-press.webp"
          alt="A GetAgeFit trainer coaching a client through a leg-press machine at the studio"
          placeholderLabel="Hero photo needed: warm trainer/client interaction"
          aspect="aspect-auto"
          imageClassName="object-center"
          className="!absolute !inset-0 !h-full !w-full !rounded-none"
          priority
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/70 to-plum-900/60" />
        </ResponsiveImage>
        <div className="relative z-10 mx-auto w-full max-w-content px-6 md:px-10">
          <Badge tone="plum">The 12-Week Transformation Experience</Badge>
          <h1 className="mb-6 mt-5 max-w-2xl text-4xl leading-[1.08] text-sand-50 sm:text-5xl lg:text-[3.4rem]">
            GET STRONG.{" "}
            <span className="font-bold text-sage-400">LIVE STRONG.</span>
          </h1>
          <p className="mb-4 max-w-xl text-lg leading-relaxed text-sand-100 sm:text-xl">
            You have a lot of life ahead of you. Let&rsquo;s make sure
            you&rsquo;re strong enough to enjoy it.
          </p>
          <p className="mb-9 max-w-xl text-lg leading-relaxed text-sand-200/90">
            A guided 12-week transformation built especially for brand-new
            clients, ages 40 to 80 and beyond: real strength, healthy
            aging, and independence you can feel in daily life.
          </p>
          <Button
            href="/consultation"
            size="lg"
            variant="light"
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
        <ResponsiveImage
          src="/images/training/coaching-session-leg-press.webp"
          alt="A real Get Age Fit client working with a trainer"
          placeholderLabel="Recognition photo needed: real client working with trainer"
          aspect="aspect-[16/9]"
          imageClassName="object-[35%_35%]"
          className="mx-auto mb-12 max-w-2xl shadow-soft"
        >
          <div className="photo-tint-sage" />
        </ResponsiveImage>
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
          Client Stories" better fits the brand voice. Everything below
          the heading — the three reviews, star presentation, and the
          "Explore 150+ Five-Star Reviews" link — is unchanged.) */}
      <Section tone="white">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">Real Client Stories</h2>
        </div>
        {/* Permission/results disclaimer intentionally cut in the Phase 4
            editorial reduction pass — it wasn't approved-source copy, and
            all three testimonials are still placeholders, so there's no
            live claim to caveat yet. Reinstate once real, permitted
            testimonials replace the placeholders below. */}
        <div className="grid gap-12 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialQuote key={testimonial.slug} testimonial={testimonial} />
          ))}
        </div>
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
