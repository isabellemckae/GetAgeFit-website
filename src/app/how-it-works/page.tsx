import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PillarCard } from "@/components/content/PillarCard";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { CTASection } from "@/components/content/CTASection";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
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
    body: "We learn about your goals, your history, and what you're hoping to change, and you get to learn exactly what we offer and if it's a good fit for you.",
    photo: "/images/trainers/neon-luong.webp",
    photoAlt: "Neon Luong, GetAgeFit personal trainer",
  },
  {
    step: "02",
    title: "Evaluation & starting point",
    body: "Your coach evaluates your current strength, mobility, and any limitations, including an InBody assessment where appropriate.",
  },
  {
    step: "03",
    title: "Your 12-week transformation begins",
    body: "New clients start with a focused 12-week arc: personalized training, nutrition guidance, and cardio strategy built around your current physical abilities.",
    photo: "/images/trainers/maria-arellano.webp",
    photoAlt: "Maria Arellano, GetAgeFit personal trainer",
  },
  {
    step: "04",
    title: "Coaching, every session",
    body: "One-on-one or 1:2 sessions with a coach who gradually adjusts your program as you get stronger and your life changes.",
  },
  {
    step: "05",
    title: "Track real progress",
    body: "Optional ongoing measurement (from InBody scans to strength benchmarks) so your trainer always knows what's working, month over month.",
    photo: "/images/trainers/jeff-venditte.webp",
    photoAlt: "Jeff Venditte, GetAgeFit personal trainer",
  },
  {
    step: "06",
    title: "Keep going, for the long run",
    body: "After your 12 weeks, you and your trainer will go through an evaluation process and decide on your next steps for your health and fitness journey.",
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

      {/* Cinematic full-bleed photo hero — distinct from why-getagefit's
          split-panel hero and the homepage's mesh-gradient hero. */}
      <section className="relative flex h-[420px] items-center overflow-hidden md:h-[480px]">
        <ResponsiveImage
          src="/images/training/coaching-session-leg-press.webp"
          alt="A GetAgeFit trainer coaching a client through a strength machine"
          placeholderLabel="How it works hero photo"
          aspect="aspect-auto"
          imageClassName="object-center"
          className="!absolute !inset-0 !h-full !w-full !rounded-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/70 to-plum-900/60" />
        </ResponsiveImage>
        <div className="relative z-10 mx-auto max-w-content px-6 md:px-10">
          <Eyebrow tone="light">How It Works</Eyebrow>
          <h1 className="mb-6 max-w-2xl text-4xl text-sand-50 md:text-5xl">
            A clear path from first conversation to your 12-week
            transformation.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-sand-200/90">
            No guesswork, no confusing sign-up process: a straightforward
            path built for brand-new clients, and just as relevant whether
            you&rsquo;re 40 or 80 and beyond.
          </p>
        </div>
      </section>

      {/* Alternating photo/text timeline instead of a uniform 3-col grid. */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl space-y-14">
          {steps.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={s.step}
                className={`flex flex-col items-start gap-6 sm:flex-row ${reverse ? "sm:flex-row-reverse" : ""}`}
              >
                <div className="flex shrink-0 flex-col items-center gap-4 sm:w-32">
                  <p
                    className={`font-display text-5xl ${i % 2 === 0 ? "text-sage-300" : "text-plum-300"}`}
                  >
                    {s.step}
                  </p>
                  {s.photo && (
                    <ResponsiveImage
                      src={s.photo}
                      alt={s.photoAlt ?? ""}
                      placeholderLabel="Trainer photo"
                      aspect="aspect-square"
                      className="w-20 !rounded-full ring-4 ring-sand-100 sm:w-24"
                    />
                  )}
                </div>
                <div className="pt-2">
                  <h2 className="mb-2 text-xl">{s.title}</h2>
                  <p className="text-[0.95rem] leading-relaxed text-ink-500">
                    {s.body}
                  </p>
                </div>
              </div>
            );
          })}
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

      {/* Bold color band behind the pillar cards for stronger contrast
          than the previous flat "sand" tone. */}
      <section className="bg-plum-900 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow tone="light">The Complete Experience</Eyebrow>
            <h2 className="text-3xl text-sand-50 md:text-4xl">
              Seven pillars, working as one experience.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <PillarCard key={pillar.key} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <ResponsiveImage
            src="/images/trainers/isa-lozano.webp"
            alt="Isa Lozano, GetAgeFit personal trainer"
            placeholderLabel="Coach portrait"
            aspect="aspect-[4/5]"
            imageClassName="object-top"
            className="hidden shadow-soft lg:block"
          >
            <div className="photo-tint-sage" />
          </ResponsiveImage>
          <div>
            <div className="mb-10">
              <Eyebrow>Common Questions</Eyebrow>
              <h2 className="text-3xl md:text-4xl">Good to know</h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </Section>

      <CTASection location="how-it-works-page" />
    </>
  );
}
