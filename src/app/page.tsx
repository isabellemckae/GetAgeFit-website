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
      {/* 1. HERO */}
      <section className="bg-mesh-hero">
        <div className="blob -left-24 -top-16 h-72 w-72 bg-sage-400/25" />
        <div className="blob -right-20 bottom-0 h-80 w-80 bg-plum-400/20" />
        <div className="relative mx-auto grid w-full max-w-content items-center gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <Badge tone="plum">The 12-Week Transformation Experience</Badge>
            <h1 className="mb-6 mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              GET STRONG.{" "}
              <span className="bg-gradient-to-r from-sage-700 to-sage-500 bg-clip-text text-transparent">
                LIVE STRONG.
              </span>
            </h1>
            <p className="mb-4 max-w-xl text-lg leading-relaxed text-ink-700 sm:text-xl">
              You have a lot of life ahead of you. Let&rsquo;s make sure
              you&rsquo;re strong enough to enjoy it.
            </p>
            <p className="mb-9 max-w-xl text-lg leading-relaxed text-ink-600">
              A guided 12-week transformation built especially for brand-new
              clients, ages 40 to 80 and beyond: real strength, healthy
              aging, and independence you can feel in daily life.
            </p>
            <Button
              href="/consultation"
              size="lg"
              trackCta={PRIMARY_CTA_LABEL}
              trackLocation="homepage-hero"
            >
              {PRIMARY_CTA_LABEL}
            </Button>
            <p className="mt-4 text-sm text-ink-500">
              {PRIMARY_CTA_SUPPORT_FULL}
            </p>
          </div>
          <ResponsiveImage
            alt="A warm Get Age Fit trainer and client working together"
            placeholderLabel="Hero photo needed: warm trainer/client interaction"
            aspect="aspect-[4/5]"
            className="lg:aspect-[5/6]"
            priority
          />
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
          alt="A real Get Age Fit client working with a trainer"
          placeholderLabel="Recognition photo needed: real client working with trainer"
          aspect="aspect-[16/9]"
          className="mx-auto mb-12 max-w-2xl"
        />
        <RecognitionList />
      </Section>

      {/* 3. THIS ISN'T YOUR TYPICAL GYM. */}
      <section className="bg-mesh-dark py-20 md:py-28">
        <div className="blob -left-16 -top-16 h-64 w-64 bg-sage-500/25" />
        <div className="blob -right-20 -bottom-20 h-72 w-72 bg-plum-400/20" />
        <div className="relative mx-auto max-w-2xl px-6 text-center md:px-10">
          <h2 className="mb-8 text-3xl text-sand-50 md:text-4xl">
            This Isn&rsquo;t Your Typical Gym.
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-sand-200/90">
            <p>
              At Get Age Fit, you don&rsquo;t walk in and wonder what
              you&rsquo;re supposed to do. You have a trainer. You have a
              plan. And you have people who know you.
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
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ResponsiveImage
            alt="Get Age Fit trainers and clients together at the studio"
            placeholderLabel="Team photo needed: real Get Age Fit trainer/group photograph"
            aspect="aspect-[4/5]"
          />
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

      {/* 6. REAL CLIENT STORIES */}
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
            Why I Created Get Age Fit (Theo)
          </h2>
        </div>
        <FounderHomeSection />
      </Section>

      {/* 10. WHAT'S POSSIBLE FOR YOU? */}
      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="mb-6 text-3xl md:text-4xl">
              What&rsquo;s Possible for You?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-ink-700">
              You don&rsquo;t have to know exactly what you need. You
              certainly don&rsquo;t have to commit to anything today.
              Let&rsquo;s just have a conversation.
            </p>
            <Button
              href="/consultation"
              size="lg"
              trackCta={PRIMARY_CTA_LABEL}
              trackLocation="homepage-final-cta"
            >
              {PRIMARY_CTA_LABEL}
            </Button>
            <p className="mt-4 text-sm text-ink-500">
              {PRIMARY_CTA_SUPPORT_SHORT}
            </p>
          </div>
          <ResponsiveImage
            alt="A happy Get Age Fit client and trainer"
            placeholderLabel="Final CTA photo needed: real client/trainer interaction showing genuine happiness"
            aspect="aspect-[4/5]"
          />
        </div>
      </Section>

      {/* 11. FOOTER — rendered globally by src/app/layout.tsx, not here. */}
    </>
  );
}
