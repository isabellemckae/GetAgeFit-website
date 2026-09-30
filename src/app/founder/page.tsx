import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

import { CTASection } from "@/components/content/CTASection";

// Renamed from /about (Demo #6, client-directed). Old /about URLs redirect
// here — see next.config.mjs `redirects()`. Content/facts below are
// unchanged from the previous /about page (already fact-checked and
// approved); only the layout was reordered to lead with Theo's photo and
// founder story, per the same approval.

export const metadata: Metadata = {
  title: "Founder | Get Age Fit's Mission & Story",
  description:
    "Meet Theo Thurston, founder of GetAgeFit: why the studio exists, and its mission of giving people independence through fitness and strength in every stage of life.",
  alternates: { canonical: "/founder" },
};

const values = [
  {
    name: "Love",
    body: "For the people we coach and the work we do together.",
    photo: "/images/trainers/isa-lozano.webp",
  },
  {
    name: "Joy",
    body: "Training should feel good: challenging, but never grim.",
    photo: "/images/trainers/neon-luong.webp",
  },
  {
    name: "Gratitude",
    body: "For the trust clients place in us with their health and time.",
    photo: "/images/trainers/christy-wall.webp",
  },
  {
    name: "Service",
    body: "Especially service to our clients: their success is the point.",
    photo: "/images/trainers/will-roberts.webp",
  },
];

const teamStrip = [
  "/images/trainers/james-petersen.webp",
  "/images/trainers/maria-arellano.webp",
  "/images/trainers/robert-dolan.webp",
  "/images/trainers/tracie-stolle.webp",
  "/images/trainers/travis-strawser.webp",
];

export default function FounderPage() {
  return (
    <>
      {/* Founder moment, now leading the page (Demo #6): Theo's real photo
          (added since this content was first written) paired with the
          same approved founder story, instead of the old text-only
          pull-quote treatment. Stacks on mobile, side-by-side on desktop. */}
      <section className="relative overflow-hidden bg-plum-900 py-16 md:py-24">
        <div className="mx-auto grid max-w-content items-center gap-10 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <ResponsiveImage
            src="/images/founder/theo-thurston.webp"
            alt="Theo Thurston, founder of Get Age Fit"
            placeholderLabel="Theo Thurston portrait needed"
            aspect="aspect-[4/5]"
            imageClassName="object-top"
            className="mx-auto w-full max-w-sm shadow-soft lg:max-w-none"
          />
          <div className="text-center lg:text-left">
            <Eyebrow tone="light">Founder</Eyebrow>
            <p className="mb-8 font-display text-3xl italic leading-snug text-sand-50 md:text-4xl">
              &ldquo;Change your mind. Change your body. Change your
              life.&rdquo;
            </p>
            <h1 className="mb-6 text-sm font-semibold uppercase tracking-wide text-plum-200">
              Theo Thurston, Founder
            </h1>
            <div className="mx-auto max-w-2xl space-y-4 text-left leading-relaxed text-plum-100 lg:mx-0">
              <p>
                Theo&rsquo;s own fitness journey began later in life,
                starting a first structured transformation in his late 40s
                and discovering, firsthand, how differently training needs
                to be approached as the body changes with age. That
                experience became the reason GetAgeFit exists: a studio
                built specifically around the needs of adults who want to
                stay strong, capable, and independent, not a scaled-down
                version of a young person&rsquo;s gym.
              </p>
              <p>
                GetAgeFit opened in Georgetown in 2016 as a dedicated,
                supportive environment for that mission. Theo is a Cooper
                Institute Certified Personal Trainer.
              </p>
              <p className="text-sm text-plum-300">
                [CONFIRM before publishing, sourced from the previous
                getagefit.com site and not yet independently verified:
                35,000+ personal training sessions delivered; competed in
                drug-free bodybuilding, Masters 50 &amp; 60 divisions,
                2009–2019. See docs/CONTENT-STATUS.md.]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission statement, now second: same copy and team-photo strip as
          the previous top hero, unchanged. */}
      <section className="bg-sage-900 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <Eyebrow tone="light">Our Mission</Eyebrow>
          <h2 className="mb-10 text-4xl text-sand-50 md:text-5xl">
            Giving people independence through fitness and strength in every
            stage of life.
          </h2>
          <div className="flex justify-center -space-x-3">
            {teamStrip.map((photo) => (
              <ResponsiveImage
                key={photo}
                src={photo}
                alt="A GetAgeFit trainer"
                placeholderLabel="Trainer photo"
                aspect="aspect-square"
                className="w-14 !rounded-full ring-4 ring-sage-900 md:w-16"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Culture: each value paired with a real trainer photo — the people
          who make up "Love, Joy, Gratitude, Service" rather than four
          bare words on a flat background. */}
      <Section tone="white">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow tone="plum">Our Culture</Eyebrow>
          <h2 className="text-3xl md:text-4xl">
            Love. Joy. Gratitude. Service.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={v.name} className="text-center">
              <ResponsiveImage
                src={v.photo}
                alt="A GetAgeFit trainer"
                placeholderLabel="Trainer photo"
                aspect="aspect-square"
                className={`mx-auto mb-4 w-24 !rounded-full ring-4 ${i % 2 === 0 ? "ring-sage-100" : "ring-plum-100"}`}
              />
              <h3 className="mb-2 font-display text-xl text-ink-900">
                {v.name}
              </h3>
              <p className="text-sm leading-relaxed text-ink-500">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The Studio</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl">
              A roomy &amp; intimate space built for coaching, not crowds.
            </h2>
            <p className="mb-3 text-lg leading-relaxed text-ink-600">
              GetAgeFit trains out of a flagship Georgetown studio designed
              around one-on-one and 1:2 coaching rather than open gym floor
              access. You&rsquo;re with your trainer 100% of the time.
            </p>
            <p className="text-sm text-ink-400">
              [CONFIRM before publishing, the previous site described an
              8,000 sq. ft. flagship location with 150+ dedicated clients
              and 18 certified trainers. Confirm current figures and
              facility description with Theo/management.]
            </p>
          </div>
          <ResponsiveImage
            src="/images/training/coaching-session-leg-press.webp"
            alt="A GetAgeFit trainer coaching a client at the studio"
            placeholderLabel="Studio photo needed"
            aspect="aspect-[3/4]"
            imageClassName="object-[center_30%]"
            className="shadow-soft"
          >
            <div className="photo-tint-sage-diagonal" />
          </ResponsiveImage>
        </div>
      </Section>

      <CTASection location="founder-page" />
    </>
  );
}
