import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

import { CTASection } from "@/components/content/CTASection";
import { pageOpenGraph } from "@/lib/seo";

// Restored as its own page (client-directed): About and Founder were split
// back apart after being merged into one /founder page. This page is
// GetAgeFit the business — mission, culture, and studio identity — not
// Theo's personal story, which now lives on /founder exclusively.
// Content below is the historical About page content (commit 59383fd, the
// last version before the merge), unchanged except "The Studio" -> "Our
// Studio" (client-directed copy fix) and dropping the Founder pull-quote
// block, which now lives only on /founder so the two pages don't duplicate
// the same content.

const ABOUT_TITLE = "About GetAgeFit | Our Mission & Culture";
const ABOUT_DESCRIPTION =
  "GetAgeFit's mission is giving people independence through fitness and strength in every stage of life. Meet the culture and studio behind the coaching.";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  ...pageOpenGraph({ title: ABOUT_TITLE, description: ABOUT_DESCRIPTION, path: "/about" }),
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

export default function AboutPage() {
  return (
    <>
      {/* Solid color hero, distinct from the photo-forward heroes on other
          pages: the mission statement carries the section on typography
          alone, with a strip of real team photos underneath rather than
          one dedicated hero image. */}
      <section className="bg-sage-900 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <Eyebrow tone="light">Our Mission</Eyebrow>
          <h1 className="mb-10 text-4xl text-sand-50 md:text-5xl">
            Giving people independence through fitness and strength in every
            stage of life.
          </h1>
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
            <Eyebrow>Our Studio</Eyebrow>
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
            src="/images/trainers/paula-jones.webp"
            alt="Paula Jones, GetAgeFit personal trainer"
            placeholderLabel="Studio photo needed"
            aspect="aspect-[3/4]"
            imageClassName="object-top"
            className="shadow-soft"
          >
            <div className="photo-tint-sage-diagonal" />
          </ResponsiveImage>
        </div>
      </Section>

      <CTASection location="about-page" />
    </>
  );
}
