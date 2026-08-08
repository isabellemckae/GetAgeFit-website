import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/content/CTASection";
import { trainers } from "@/content/trainers";
import { cta } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Trainers | Meet the GetAgeFit Coaching Team",
  description:
    "Meet the coaches behind GetAgeFit's personalized healthy-aging training — expert, human, and invested in your independence.",
  alternates: { canonical: "/trainers" },
};

export default function TrainersPage() {
  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Trainers</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl md:text-5xl">
            Experts. And people you can trust.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-600">
            Every coach at GetAgeFit brings real expertise in coaching adult
            bodies — and just as importantly, a genuine investment in your
            progress.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="space-y-16">
          {trainers.map((trainer, index) => (
            <article
              key={trainer.slug}
              id={trainer.slug}
              className="scroll-mt-28 grid items-start gap-10 lg:grid-cols-[0.9fr_1.4fr]"
            >
              <PhotoPlaceholder
                label={trainer.photoLabel}
                className={index % 2 === 1 ? "lg:order-2" : ""}
              />
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <h2 className="mb-1 text-2xl">{trainer.name}</h2>
                <p className="mb-4 font-medium text-plum-600">{trainer.role}</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {trainer.credentials.map((c) => (
                    <Badge key={c} tone="sage">
                      {c}
                    </Badge>
                  ))}
                  {trainer.specialties.map((s) => (
                    <Badge key={s} tone="sand">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-4 text-ink-600">
                  <p>
                    <span className="font-semibold text-ink-800">
                      Coaching philosophy:{" "}
                    </span>
                    {trainer.philosophy}
                  </p>
                  <p>
                    <span className="font-semibold text-ink-800">
                      Why I coach:{" "}
                    </span>
                    {trainer.story}
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    href={cta.primary.href}
                    variant="secondary"
                    trackCta={cta.primary.label}
                    trackLocation={`trainer-${trainer.slug}`}
                  >
                    Train with {trainer.name.startsWith("[") ? "this coach" : trainer.name.split(" ")[0]}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTASection location="trainers-page" />
    </>
  );
}
