import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { PillarCard } from "@/components/content/PillarCard";
import { TrainerCard } from "@/components/content/TrainerCard";
import { TransformationCard } from "@/components/content/TransformationCard";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CTASection } from "@/components/content/CTASection";
import { pillars } from "@/content/pillars";
import { trainers, featuredTrainerSlugs } from "@/content/trainers";
import { transformations } from "@/content/transformations";
import { articles } from "@/content/articles";
import { cta } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Personalized Strength Coaching for Healthy Aging in Georgetown, TX",
  description:
    "GetAgeFit is a boutique personal training studio for adults 40+ in Georgetown, Texas — personalized strength coaching built around your body, your history, and your independence.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden bg-sand-100">
        <div className="mx-auto grid w-full max-w-content items-center gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <Badge tone="sage">Georgetown, Texas · Boutique Coaching</Badge>
            <h1 className="mb-6 mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Strength for every stage of life.
            </h1>
            <p className="mb-9 max-w-xl text-lg leading-relaxed text-ink-600">
              Personalized strength coaching for adults 40 and beyond — built
              around your body, your history, and your goals. A boutique
              experience designed to help you stay capable, confident, and
              independent.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                href={cta.primary.href}
                size="lg"
                trackCta={cta.primary.label}
                trackLocation="hero"
              >
                {cta.primary.label}
              </Button>
              <Button
                href={cta.secondary.href}
                variant="secondary"
                size="lg"
                trackCta={cta.secondary.label}
                trackLocation="hero"
              >
                {cta.secondary.label}
              </Button>
            </div>
          </div>
          <PhotoPlaceholder
            label="Studio / coaching photo needed"
            aspect="aspect-[4/5]"
            className="lg:aspect-[5/6]"
          />
        </div>
      </section>

      {/* SECTION 2 — THE REFRAME */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The Reframe</Eyebrow>
          <h2 className="mb-6 text-3xl md:text-4xl">
            You don&rsquo;t need another gym. You need a plan built around
            you.
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-600">
            A gym membership gives you access to equipment and hopes you
            figure out the rest. GetAgeFit gives you a coach, a plan built
            around your history and goals, and a community that notices when
            you show up — and when you don&rsquo;t.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Personalization",
              body: "Programming built around your body, your goals, and your history — not a generic class plan.",
            },
            {
              title: "Accountability",
              body: "A coach who knows your name, your goals, and notices your progress.",
            },
            {
              title: "Expertise",
              body: "Coaching from trainers who understand how to program around the realities of adult bodies.",
            },
            {
              title: "Adaptation",
              body: "Training that adjusts around injuries, limitations, and how your body responds.",
            },
            {
              title: "Service",
              body: "A high-touch experience where your success is the entire point.",
            },
            {
              title: "Community",
              body: "A boutique studio built on relationships, not anonymous gym access.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl2 bg-sand-100 p-7">
              <h3 className="mb-2 font-display text-lg text-ink-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-500">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SECTION 3 — THE COMPLETE EXPERIENCE */}
      <Section tone="sand">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>The GetAgeFit Experience</Eyebrow>
          <h2 className="mb-6 text-3xl md:text-4xl">
            One integrated experience, not seven disconnected services.
          </h2>
          <p className="text-lg leading-relaxed text-ink-600">
            Every part of your coaching works together — training informs
            nutrition, progress tracking informs programming, and community
            keeps you consistent.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.key} pillar={pillar} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            href="/how-it-works"
            variant="secondary"
            size="lg"
            trackCta="See How It Works"
            trackLocation="complete-experience"
          >
            See How It Works
          </Button>
        </div>
      </Section>

      {/* SECTION 4 — WHO WE HELP */}
      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow tone="plum">Who We Help</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl">
              You&rsquo;re not too old to get stronger. You&rsquo;re at the
              stage where strength matters more than ever.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-ink-600">
              GetAgeFit is built for adults 40 to 80 and beyond who want to
              move through life with more strength, confidence, and
              independence — whether you&rsquo;re just getting started or
              picking training back up after time away.
            </p>
            <ul className="space-y-3 text-ink-700">
              {[
                "Want to get stronger, at any starting point",
                "Value long-term independence over quick fixes",
                "Have struggled to find their footing in traditional gyms",
                "Are training around an injury or physical limitation",
                "Want expert guidance and real accountability",
                "Are ready for a coaching relationship, not just a workout",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700"
                  >
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <PhotoPlaceholder label="Client coaching moment photo needed" />
        </div>
      </Section>

      {/* INJURY & LIMITATION POSITIONING */}
      <Section tone="sage">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoPlaceholder
            label="Adaptive training / coaching photo needed"
            className="order-2 lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <Eyebrow tone="light">Your History Matters</Eyebrow>
            <h2 className="mb-6 text-3xl text-sand-50 md:text-4xl">
              Maybe you don&rsquo;t have to give up.
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-sage-100">
              A past injury, a surgery, a joint that doesn&rsquo;t move the
              way it used to — none of that means the door is closed. Our
              coaches program around your history and current ability, so
              training moves you forward instead of around what you can no
              longer do.
            </p>
            <p className="mb-8 text-sm text-sage-200">
              This is coaching, not medical treatment or rehabilitation — we
              work alongside your medical guidance, not in place of it.
            </p>
            <Button
              href="/how-it-works"
              variant="light"
              trackCta="See How It Works"
              trackLocation="injury-positioning"
            >
              See How Training Adapts to You
            </Button>
          </div>
        </div>
      </Section>

      {/* PROOF — TRANSFORMATIONS PREVIEW */}
      <Section tone="sand">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Real Results</Eyebrow>
            <h2 className="text-3xl md:text-4xl">
              Strength, independence, and confidence — in their words.
            </h2>
          </div>
          <Button
            href="/transformations"
            variant="secondary"
            trackCta="View All Transformations"
            trackLocation="transformations-preview"
          >
            View All Transformations
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {transformations.slice(0, 3).map((story) => (
            <TransformationCard key={story.slug} story={story} />
          ))}
        </div>
      </Section>

      {/* TRAINERS PREVIEW */}
      <Section tone="white">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="plum">Your Coaches</Eyebrow>
            <h2 className="text-3xl md:text-4xl">
              Experts who see the person, not just the program.
            </h2>
          </div>
          <Button
            href="/trainers"
            variant="secondary"
            trackCta="Meet the Trainers"
            trackLocation="trainers-preview"
          >
            Meet the Trainers
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trainers
            .filter((trainer) => featuredTrainerSlugs.includes(trainer.slug))
            .map((trainer) => (
              <TrainerCard key={trainer.slug} trainer={trainer} />
            ))}
        </div>
      </Section>

      {/* RESOURCES PREVIEW */}
      <Section tone="sand">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Resources</Eyebrow>
            <h2 className="text-3xl md:text-4xl">
              Expertise you can use — before you ever become a client.
            </h2>
          </div>
          <Button
            href="/resources"
            variant="secondary"
            trackCta={cta.resources.label}
            trackLocation="resources-preview"
          >
            {cta.resources.label}
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <CTASection location="homepage-final-cta" />
    </>
  );
}
