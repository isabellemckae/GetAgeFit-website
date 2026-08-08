import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { CTASection } from "@/components/content/CTASection";

export const metadata: Metadata = {
  title: "Why GetAgeFit | Boutique Healthy-Aging Coaching",
  description:
    "See what sets GetAgeFit apart from traditional gyms and generic personal training — personalized coaching built for adults 40+ in Georgetown, Texas.",
  alternates: { canonical: "/why-getagefit" },
};

const notList = [
  "A low-cost gym you navigate alone",
  "A young, high-intensity “bro gym” culture",
  "Generic personal training with rotating trainers",
  "A clinical rehabilitation facility",
  "A cold, exclusive luxury club",
  "A stereotypical “senior fitness” program",
];

const isList = [
  {
    title: "Personalized, not generic",
    body: "Your program is built around your body, your goals, and your history — reviewed and adjusted by your coach as you progress.",
  },
  {
    title: "High-touch, not hands-off",
    body: "One-on-one and 1:2 coaching means your trainer knows your name, your goals, and your progress — every session.",
  },
  {
    title: "Boutique, not big-box",
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
    body: "We're focused on your capability and independence over years, not a 12-week transformation photo.",
  },
];

export default function WhyGetAgeFitPage() {
  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Why GetAgeFit</Eyebrow>
            <h1 className="mb-6 text-4xl md:text-5xl">
              This is different. This might be exactly what you&rsquo;ve been
              looking for.
            </h1>
            <p className="text-lg leading-relaxed text-ink-600">
              GetAgeFit sits at the intersection of premium hospitality,
              expert coaching, and genuine community — built specifically for
              adults who want to stay strong, capable, and independent.
            </p>
          </div>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl">GetAgeFit is not…</h2>
            <ul className="space-y-4">
              {notList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-600">
                  <span aria-hidden="true" className="mt-1 text-ink-300">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-400">
              We say this not to put down other options — different people
              need different things. We say it so you know exactly what
              you&rsquo;re walking into here.
            </p>
          </div>
          <div>
            <h2 className="mb-6 text-2xl">GetAgeFit is…</h2>
            <div className="space-y-6">
              {isList.map((item) => (
                <div key={item.title}>
                  <h3 className="mb-1 font-semibold text-sage-800">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoPlaceholder label="Studio hospitality photo needed" />
          <div>
            <Eyebrow tone="plum">The Feeling</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl">
              Premium because it&rsquo;s thoughtful — not because it&rsquo;s
              intimidating.
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-ink-600">
              Think Four Seasons hospitality meets expert personal training —
              warm, human, and sophisticated, without ever feeling exclusive
              or out of reach.
            </p>
            <p className="text-lg leading-relaxed text-ink-600">
              Our culture is built on love, joy, gratitude, and service —
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
