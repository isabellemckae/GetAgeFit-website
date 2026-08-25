import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PageHero } from "@/components/layout/PageHero";
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
    body: "Training should feel good: challenging, but never grim.",
  },
  {
    name: "Gratitude",
    body: "For the trust clients place in us with their health and time.",
  },
  {
    name: "Service",
    body: "Especially service to our clients: their success is the point.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Mission"
        heading="Giving people independence through fitness and strength in every stage of life."
      />

      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoPlaceholder label="Founder photo needed" />
          <div>
            <Eyebrow tone="plum">Founder</Eyebrow>
            <h2 className="mb-4 text-3xl">Meet Theo Thurston</h2>
            <p className="mb-4 leading-relaxed text-ink-600">
              Theo&rsquo;s own fitness journey began later in life, starting
              a first structured transformation in his late 40s and
              discovering, firsthand, how differently training needs to be
              approached as the body changes with age. That experience became
              the reason GetAgeFit exists: a studio built specifically around
              the needs of adults who want to stay strong, capable, and
              independent, not a scaled-down version of a young person&rsquo;s
              gym.
            </p>
            <p className="mb-4 leading-relaxed text-ink-600">
              GetAgeFit opened in Georgetown in 2016 as a dedicated,
              supportive environment for that mission. Theo is a Cooper
              Institute Certified Personal Trainer, and his guiding motto sums
              up the approach he coaches by:{" "}
              <span className="italic">
                &ldquo;Change your mind. Change your body. Change your
                life.&rdquo;
              </span>
            </p>
            <p className="text-sm text-ink-400">
              [CONFIRM before publishing, sourced from the previous
              getagefit.com site and not yet independently verified: 35,000+
              personal training sessions delivered; competed in drug-free
              bodybuilding, Masters 50 &amp; 60 divisions, 2009–2019. See
              docs/CONTENT-STATUS.md.]
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
            An intimate space built for coaching, not crowds.
          </h2>
          <p className="mb-3 text-lg leading-relaxed text-ink-600">
            GetAgeFit trains out of a flagship Georgetown studio designed
            around one-on-one and small-group coaching rather than open gym
            floor access.
          </p>
          <p className="text-sm text-ink-400">
            [CONFIRM before publishing, the previous site described an
            8,000 sq. ft. flagship location with 150+ dedicated clients and
            18 certified trainers. Confirm current figures and facility
            description with Theo/management.]
          </p>
        </div>
      </Section>

      <CTASection location="about-page" />
    </>
  );
}
