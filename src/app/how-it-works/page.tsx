import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PillarCard } from "@/components/content/PillarCard";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { CTASection } from "@/components/content/CTASection";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { pillars } from "@/content/pillars";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "How It Works | The GetAgeFit Process",
  description:
    "From consultation to your 12-week transformation: see exactly how GetAgeFit's healthy-aging coaching process works for brand-new clients, step by step.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    step: "01",
    title: "Schedule a consultation",
    body: "A conversation, not a workout. We learn about your goals, your history, and what you're hoping to change, and introduce the 12-week transformation experience if you're new to GetAgeFit.",
  },
  {
    step: "02",
    title: "Evaluation & starting point",
    body: "Your coach evaluates your current strength, mobility, and any limitations, including an InBody assessment where appropriate.",
  },
  {
    step: "03",
    title: "Your 12-week transformation begins",
    body: "New clients start with a focused 12-week arc: personalized training, nutrition guidance, and cardio strategy built around your specific goals and history.",
  },
  {
    step: "04",
    title: "Coaching, every session",
    body: "One-on-one or 1:2 sessions with a coach who adjusts your program as you get stronger and your life changes.",
  },
  {
    step: "05",
    title: "Track real progress",
    body: "Ongoing measurement (from InBody scans to strength benchmarks) so you always know what's working, week over week.",
  },
  {
    step: "06",
    title: "Keep going, for the long run",
    body: "After your 12 weeks, you become part of a lasting community built on relationships, encouragement, and mutual accountability.",
  },
];

const faqs = [
  {
    question: "Do I need to be in good shape to start?",
    answer:
      "No. Your coach meets you at your current starting point (whatever that is) and builds from there.",
  },
  {
    question: "What if I have an injury or health condition?",
    answer:
      "Tell us about it during your consultation. Programming is adapted around your history and current ability, in coordination with your medical guidance when appropriate.",
  },
  {
    question: "Is this one-on-one, or a class?",
    answer:
      "GetAgeFit is built around one-on-one and 1:2 coaching (not large group classes) so your program stays personalized.",
  },
  {
    question: "How do I know if it's the right investment for me?",
    answer:
      "That's exactly what the consultation is for. Your coach will walk you through the experience and the investment honestly, with no pressure to decide on the spot.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero
        eyebrow="How It Works"
        heading="A clear path from first conversation to your 12-week transformation."
        body={
          <>
            No guesswork, no confusing sign-up process: a straightforward
            path built for brand-new clients, and just as relevant whether
            you&rsquo;re 40 or 80 and beyond.
          </>
        }
      />

      <Section tone="white">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step}>
              <p className="mb-3 font-display text-4xl text-sage-200">
                {s.step}
              </p>
              <h2 className="mb-2 text-xl">{s.title}</h2>
              <p className="text-[0.95rem] leading-relaxed text-ink-500">
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button
            href={cta.primary.href}
            size="lg"
            trackCta={cta.primary.label}
            trackLocation="how-it-works-steps"
          >
            {cta.primary.label}
          </Button>
        </div>
      </Section>

      <Section tone="sand">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow tone="plum">The Complete Experience</Eyebrow>
          <h2 className="text-3xl md:text-4xl">
            Seven pillars, working as one experience.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.key} pillar={pillar} index={index} />
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <Eyebrow>Common Questions</Eyebrow>
            <h2 className="text-3xl md:text-4xl">Good to know</h2>
          </div>
          <FAQAccordion items={faqs} />
        </div>
      </Section>

      <CTASection location="how-it-works-page" />
    </>
  );
}
