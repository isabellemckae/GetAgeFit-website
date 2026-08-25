import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CTASection } from "@/components/content/CTASection";
import { cta } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Programs | The 12-Week Transformation Experience",
  description:
    "GetAgeFit specializes in the 12-week transformation experience for brand-new clients 40 to 80+, plus ongoing one-on-one and 1:2 healthy-aging coaching. Investment discussed during your consultation.",
  alternates: { canonical: "/programs" },
};

const transformationBullets = [
  "A clear, structured 12-week starting point, not an open-ended guess",
  "Personalized training, nutrition guidance, and cardio strategy from day one",
  "Built for brand-new clients, and just as effective at 40, 60, or 80+",
];

const programs = [
  {
    name: "One-on-One Coaching",
    subtitle: "Fully personalized, one coach, every session",
    body: "The most individualized coaching experience GetAgeFit offers. Your program, your pace, your coach's full attention, every session built around where you are that day.",
    bullets: [
      "Programming built entirely around your goals and history",
      "Real-time coaching cues and form correction",
      "Session-by-session adjustments as you progress",
    ],
    photos: ["/images/trainers/james-petersen.webp"],
  },
  {
    name: "1:2 Coaching",
    subtitle: "Personalized programming, shared energy",
    body: "Train alongside one other client with a shared coach, still fully personalized programming, with the added motivation of training alongside someone else on their own journey.",
    bullets: [
      "Individualized programming within a shared session",
      "A natural accountability partner",
      "The same expert coaching, a shared rhythm",
    ],
    photos: [
      "/images/trainers/chip-collerain.webp",
      "/images/trainers/paula-jones.webp",
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
      {/* Bold solid-color typographic hero — no photo, deliberately
          distinct from why-getagefit's split panel and how-it-works'
          full-bleed photo. */}
      <section className="bg-plum-900 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <Eyebrow tone="light">Programs</Eyebrow>
          <h1 className="mb-6 text-4xl text-sand-50 md:text-5xl">
            Start with a 12-week transformation. Stay for the long run.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-plum-100">
            Every GetAgeFit program includes the full coaching experience:
            training, nutrition, movement, and measurement. Brand-new
            clients begin with a focused 12-week transformation, then choose
            the ongoing coaching format that&rsquo;s right for them.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="mb-14 overflow-hidden rounded-xl2 bg-mesh-dark p-9 md:p-12">
          <div className="blob -right-16 -top-16 h-64 w-64 bg-sage-500/25" />
          <div className="blob -bottom-20 -left-10 h-56 w-56 bg-plum-400/20" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge tone="plum">Start Here</Badge>
              <h2 className="mb-4 mt-4 text-2xl text-sand-50 md:text-3xl">
                The 12-Week Transformation Experience
              </h2>
              <p className="mb-6 leading-relaxed text-sand-200/90">
                Our flagship experience for brand-new clients: a focused,
                12-week arc that builds real strength, mobility, and
                confidence, whatever your starting point. Just as relevant
                at 40 as it is at 80 and beyond.
              </p>
              <ul className="mb-8 space-y-3 text-sm text-sand-100">
                {transformationBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sand-50/15 text-xs font-bold text-sand-50"
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button
                href={cta.primary.href}
                variant="light"
                trackCta={cta.primary.label}
                trackLocation="programs-12-week"
              >
                {cta.primary.label}
              </Button>
            </div>
            <div>
              <ResponsiveImage
                src="/images/trainers/keith-stolle.webp"
                alt="Keith Stolle, a GetAgeFit transformation graduate turned trainer"
                placeholderLabel="12-week transformation photo needed"
                aspect="aspect-[4/5]"
                imageClassName="object-top"
              >
                <div className="photo-tint-plum-diagonal" />
              </ResponsiveImage>
              <p className="mt-3 text-center text-xs text-sand-200/70">
                Keith Stolle — GetAgeFit transformation graduate, now a
                trainer
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <Eyebrow tone="sage">After Your 12 Weeks</Eyebrow>
          <h2 className="text-2xl md:text-3xl">Ongoing coaching formats</h2>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.name}
              className="flex flex-col rounded-xl2 border border-ink-100 bg-sand-50 p-9 shadow-card"
            >
              <div className="mb-6 flex -space-x-4">
                {program.photos.map((photo) => (
                  <ResponsiveImage
                    key={photo}
                    src={photo}
                    alt="GetAgeFit trainer"
                    placeholderLabel="Trainer photo"
                    aspect="aspect-square"
                    className="w-16 !rounded-full ring-4 ring-sand-50"
                  />
                ))}
              </div>
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
          <ResponsiveImage
            src="/images/trainers/robin-winkles.webp"
            alt="Robin Winkles, GetAgeFit personal trainer"
            placeholderLabel="Training session photo needed"
            aspect="aspect-[4/3]"
            className="shadow-soft"
          >
            <div className="photo-tint-plum" />
          </ResponsiveImage>
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-5 text-3xl">
            Curious about the investment?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-ink-600">
            GetAgeFit is a premium, personalized coaching experience, and we
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
