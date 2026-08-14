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
    "Meet the coaches behind GetAgeFit's personalized healthy-aging training in Georgetown, Texas: expert, human, and invested in your independence.",
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
            Every coach at GetAgeFit brings real, credentialed expertise in
            coaching adult bodies, and just as importantly, a genuine
            investment in your progress. Led by founder Theo Thurston (see{" "}
            <a href="/about" className="font-medium text-sage-700 hover:text-sage-900">
              his story
            </a>
            ), the team below trains clients across every stage of the
            GetAgeFit experience.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trainers.map((trainer) => (
            <article
              key={trainer.slug}
              id={trainer.slug}
              className="scroll-mt-28 overflow-hidden rounded-xl2 border border-ink-100 bg-sand-50 shadow-card"
            >
              <PhotoPlaceholder label={trainer.photoLabel} aspect="aspect-[4/5]" />
              <div className="p-6">
                <h2 className="mb-1 text-lg font-display text-ink-900">
                  {trainer.name}
                </h2>
                <p className="mb-3 text-sm font-medium text-plum-600">
                  {trainer.role}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {trainer.credentials.map((c) => (
                    <Badge key={c} tone="sage">
                      {c}
                    </Badge>
                  ))}
                </div>
                {trainer.specialties.length > 0 && (
                  <p className="mt-3 text-xs leading-relaxed text-ink-500">
                    {trainer.specialties.join(" · ")}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-ink-400">
          Roster and credentials sourced from the current GetAgeFit team page.
          Please confirm this list is still accurate before publishing.
          Coaching philosophies and personal stories are being collected
          directly from each trainer.
        </p>
        <div className="mt-8 text-center">
          <Button
            href={cta.primary.href}
            trackCta={cta.primary.label}
            trackLocation="trainers-page"
          >
            {cta.primary.label}
          </Button>
        </div>
      </Section>

      <CTASection location="trainers-page" />
    </>
  );
}
