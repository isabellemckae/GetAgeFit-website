import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { CTASection } from "@/components/content/CTASection";

export const metadata: Metadata = {
  title: "Why GetAgeFit | Healthy-Aging Coaching Built Around You",
  description:
    "See what sets GetAgeFit apart from traditional gyms and generic personal training: personalized, healthy-aging coaching built for adults 40+ in Georgetown, Texas.",
  alternates: { canonical: "/why-getagefit" },
};

const notList = [
  "A low-cost gym you navigate alone",
  "A young, high-intensity “bro gym” culture",
  "Generic personal training with rotating trainers",
  "A clinical rehabilitation facility",
  "A cold, exclusive luxury club",
  "A stereotypical “senior fitness” program",
  "A franchise",
];

const isList = [
  {
    title: "Personalized, not generic",
    body: "Your program is built around your body, your goals, and your history, reviewed and adjusted by your coach as you progress.",
  },
  {
    title: "High-touch, not hands-off",
    body: "One-on-one and 1:2 coaching means your trainer knows your name, your goals, and your progress, every session.",
  },
  {
    title: "Personal, not big-box",
    body: "A smaller, intentional environment designed for real coaching relationships, not a warehouse of equipment.",
  },
  {
    title: "Adaptive, not rigid",
    body: "Programming that respects injuries and limitations rather than ignoring them or routing you elsewhere.",
  },
  {
    title: "Warm, not intimidating",
    body: "Premium doesn't mean unwelcoming. Our culture is built on love, joy, gratitude, and service to our clients.",
  },
  {
    title: "A long-term partner, not a quick fix",
    body: "Your 12-week transformation is the start. We stay focused on your capability and independence for years beyond it, not a single before-and-after photo.",
  },
  {
    title: "Locally owned, not a franchise",
    body: "A small, locally owned business in Georgetown, Texas, since 2016, not a corporate chain following a national script.",
  },
];

export default function WhyGetAgeFitPage() {
  return (
    <>
      {/* Split hero: solid color block + real photo, diagonal seam —
          distinct from the homepage's mesh-gradient hero. */}
      <section className="relative overflow-hidden bg-sage-900">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10 px-6 py-20 md:px-10 md:py-28 lg:py-32">
            <Eyebrow tone="light">Why GetAgeFit</Eyebrow>
            <h1 className="mb-6 max-w-xl text-4xl text-sand-50 md:text-5xl">
              This is different. This might be exactly what you&rsquo;ve
              been looking for.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-sage-100">
              GetAgeFit sits at the intersection of premium hospitality,
              expert healthy-aging coaching, and genuine community, built
              specifically for adults who want to stay strong, capable, and
              independent.
            </p>
          </div>
          <div
            className="relative h-64 overflow-hidden md:h-80 lg:h-auto lg:min-h-[520px]"
            style={{
              clipPath:
                "polygon(0 8%, 100% 0, 100% 100%, 0 92%)",
            }}
          >
            <ResponsiveImage
              src="/images/trainers/will-roberts.webp"
              alt="Will Roberts, GetAgeFit coach"
              placeholderLabel="Studio hospitality photo needed"
              aspect="aspect-auto"
              imageClassName="object-top"
              className="!absolute !inset-0 !h-full !w-full !rounded-none"
            >
              <div className="photo-tint-sage-diagonal" />
            </ResponsiveImage>
          </div>
        </div>
      </section>

      {/* Asymmetric 3-column: photo + not-list + is-list, instead of a
          plain symmetric 2-column text grid. */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr_1fr] lg:items-start">
          <ResponsiveImage
            src="/images/trainers/christy-wall.webp"
            alt="Christy Wall, GetAgeFit personal trainer"
            placeholderLabel="Coach portrait"
            aspect="aspect-[3/4]"
            imageClassName="object-top"
            className="hidden shadow-soft lg:block"
          >
            <div className="photo-tint-plum-diagonal" />
          </ResponsiveImage>
          <div>
            <h2 className="mb-3 text-2xl">GetAgeFit is NOT&hellip;</h2>
            <div className="mb-6 h-1.5 w-16 rounded-full bg-plum-500" />
            <ul className="space-y-4">
              {notList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-600">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 text-xl font-bold leading-none text-plum-400"
                  >
                    •
                  </span>
                  <span className="text-[1.05rem]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-400">
              We say this not to put down other options. Different people
              need different things. We say it so you know exactly what
              you&rsquo;ll experience here.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-2xl">GetAgeFit is&hellip;</h2>
            <div className="mb-6 h-1.5 w-16 rounded-full bg-sage-500" />
            <div className="space-y-6">
              {isList.map((item, i) => (
                <div
                  key={item.title}
                  className={`border-l-4 pl-5 ${i % 2 === 0 ? "border-sage-500" : "border-plum-500"}`}
                >
                  <h3 className="mb-1 text-lg font-bold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-ink-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Bold color band — a single punchy statement, no photo, no card:
          pure section-to-section contrast. */}
      <section className="clip-diagonal-both -my-10 bg-plum-800 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center md:px-10">
          <p className="font-display text-2xl italic leading-snug text-sand-50 md:text-3xl">
            &ldquo;Premium doesn&rsquo;t mean unwelcoming. It means
            thoughtful.&rdquo;
          </p>
        </div>
      </section>

      <Section tone="sand">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ResponsiveImage
            src="/images/training/coaching-session-leg-press.webp"
            alt="A GetAgeFit trainer coaching a client at the studio"
            placeholderLabel="Studio hospitality photo needed"
            aspect="aspect-[4/3]"
            className="shadow-soft"
          >
            <div className="photo-tint-sage" />
          </ResponsiveImage>
          <div>
            <Eyebrow tone="plum">The Feeling</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl">
              Premium because it&rsquo;s thoughtful, not because it&rsquo;s
              intimidating.
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-ink-600">
              Think Four Seasons hospitality meets expert personal training:
              warm, human, and sophisticated, without ever feeling exclusive
              or out of reach.
            </p>
            <p className="text-lg leading-relaxed text-ink-600">
              Our culture is built on love, joy, gratitude, and service,
              especially service to the people who trust us with their
              health.
            </p>
          </div>
        </div>
      </Section>

      <CTASection location="why-getagefit-page" />
    </>
  );
}
