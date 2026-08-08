import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/content/CTASection";
import { cta } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Programs | Personalized Coaching Formats",
  description:
    "Explore GetAgeFit's personalized coaching formats — one-on-one and 1:2 training built around your goals, history, and pace. Investment discussed during your consultation.",
  alternates: { canonical: "/programs" },
};

const programs = [
  {
    name: "One-on-One Coaching",
    subtitle: "Fully personalized, one coach, every session",
    body: "The most individualized coaching experience GetAgeFit offers. Your program, your pace, your coach's full attention — every session built around where you are that day.",
    bullets: [
      "Programming built entirely around your goals and history",
      "Real-time coaching cues and form correction",
      "Session-by-session adjustments as you progress",
    ],
  },
  {
    name: "1:2 Coaching",
    subtitle: "Personalized programming, shared energy",
    body: "Train alongside one other client with a shared coach — still fully personalized programming, with the added motivation of training alongside someone else on their own journey.",
    bullets: [
      "Individualized programming within a shared session",
      "A natural accountability partner",
      "The same expert coaching, a shared rhythm",
    ],
  },
];

const included = [
  "Personalized strength programming",
  "Nutrition counseling",
  "Cardio & movement guidance",
  "InBody progress assessments",
  "Programming adapted to injuries & limitations",
  "Trainer accountability between sessions",
  "Access to the GetAgeFit community",
];

export default function ProgramsPage() {
  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Programs</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl md:text-5xl">
            Coaching formats built around how you want to train.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-600">
            Every GetAgeFit program includes the full coaching experience —
            training, nutrition, movement, and measurement. The format is
            what changes: how much of your coach&rsquo;s attention is yours
            alone, session by session.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.name}
              className="flex flex-col rounded-xl2 border border-ink-100 bg-sand-50 p-9 shadow-card"
            >
              <h2 className="mb-1 text-2xl">{program.name}</h2>
              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-sage-700">
                {program.subtitle}
              </p>
              <p className="mb-6 leading-relaxed text-ink-600">{program.body}</p>
              <ul className="mb-8 space-y-3 text-sm text-ink-600">
                {program.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700"
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button
                  href={cta.primary.href}
                  trackCta={cta.primary.label}
                  trackLocation={`programs-${program.name}`}
                >
                  {cta.primary.label}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow tone="plum">What&rsquo;s Always Included</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl">
              This isn&rsquo;t a workout. It&rsquo;s a complete experience.
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-700">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-plum-100 text-xs font-bold text-plum-600"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <PhotoPlaceholder label="Training session photo needed" />
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-5 text-3xl">
            Curious about the investment?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-ink-600">
            GetAgeFit is a premium, personalized coaching experience — and we
            believe the right investment conversation happens after we
            understand your goals, not before. Your coach will walk through
            program details and investment openly during your consultation.
          </p>
          <Button
            href={cta.qualify.href}
            variant="secondary"
            size="lg"
            trackCta={cta.qualify.label}
            trackLocation="programs-investment"
          >
            {cta.qualify.label}
          </Button>
        </div>
      </Section>

      <CTASection location="programs-page" />
    </>
  );
}
