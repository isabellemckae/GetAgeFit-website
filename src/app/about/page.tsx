import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { CTASection } from "@/components/content/CTASection";

export const metadata: Metadata = {
  title: "About GetAgeFit | Our Mission & Founder",
  description:
    "GetAgeFit's mission is giving people independence through fitness and strength in every stage of life. Meet the team behind the studio.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    name: "Love",
    body: "For the people we coach and the work we do together.",
  },
  {
    name: "Joy",
    body: "Training should feel good — challenging, but never grim.",
  },
  {
    name: "Gratitude",
    body: "For the trust clients place in us with their health and time.",
  },
  {
    name: "Service",
    body: "Especially service to our clients — their success is the point.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Our Mission</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl md:text-5xl">
            Giving people independence through fitness and strength in every
            stage of life.
          </h1>
        </div>
      </section>

      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoPlaceholder label="Founder photo needed" />
          <div>
            <Eyebrow tone="plum">Founder</Eyebrow>
            <h2 className="mb-4 text-3xl">Meet Theo</h2>
            <p className="mb-4 leading-relaxed text-ink-600">
              [INSERT VERIFIED FOUNDER STORY — Theo&rsquo;s background, why
              GetAgeFit was started, and the experience that shaped its
              approach to healthy aging and strength coaching.]
            </p>
            <p className="leading-relaxed text-ink-600">
              [CONFIRM YEARS IN BUSINESS / RELEVANT CREDENTIALS FOR PUBLIC
              BIO]
            </p>
          </div>
        </div>
      </Section>

      <Section tone="sage">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow tone="light">Our Culture</Eyebrow>
          <h2 className="text-3xl text-sand-50 md:text-4xl">
            Love. Joy. Gratitude. Service.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.name} className="text-center">
              <h3 className="mb-2 font-display text-xl text-sand-50">
                {v.name}
              </h3>
              <p className="text-sm leading-relaxed text-sage-100">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The Studio</Eyebrow>
          <h2 className="mb-6 text-3xl md:text-4xl">
            A boutique space built for coaching, not crowds.
          </h2>
          <p className="text-lg leading-relaxed text-ink-600">
            [INSERT VERIFIED FACILITY DESCRIPTION — layout, equipment
            highlights, and what makes the space feel different from a
            typical gym floor.]
          </p>
        </div>
      </Section>

      <CTASection location="about-page" />
    </>
  );
}
