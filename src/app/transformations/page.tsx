import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { TransformationCard } from "@/components/content/TransformationCard";
import { CTASection } from "@/components/content/CTASection";
import { transformations } from "@/content/transformations";

export const metadata: Metadata = {
  title: "Transformations | Real GetAgeFit Client Stories",
  description:
    "Strength, independence, and confidence: real client stories from GetAgeFit's boutique healthy-aging coaching program in Georgetown, Texas.",
  alternates: { canonical: "/transformations" },
};

export default function TransformationsPage() {
  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Transformations</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl md:text-5xl">
            More than a before and after.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-600">
            The stories that matter most to us aren&rsquo;t just aesthetic.
            They&rsquo;re about strength, independence, confidence, and
            getting back to the life clients want to live.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((story) => (
            <TransformationCard key={story.slug} story={story} />
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-ink-400">
          Client stories are shared with permission. Individual results vary
          and are not guaranteed.
        </p>
      </Section>

      <CTASection
        heading="Ready to write your own story?"
        location="transformations-page"
      />
    </>
  );
}
