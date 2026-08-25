import type { Metadata } from "next";
import { TransformationCard } from "@/components/content/TransformationCard";
import { CTASection } from "@/components/content/CTASection";
import { PageHero } from "@/components/layout/PageHero";
import { transformations } from "@/content/transformations";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Transformations | Real GetAgeFit Client Stories",
  description:
    "Strength, independence, and confidence: real 12-week transformation stories from GetAgeFit's healthy-aging coaching program in Georgetown, Texas.",
  alternates: { canonical: "/transformations" },
};

export default function TransformationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Transformations"
        heading="More than a before and after."
        tone="meshPlum"
        body={
          <>
            The stories that matter most to us aren&rsquo;t just aesthetic.
            They&rsquo;re about strength, independence, confidence, and
            getting back to the life clients want to live, starting with
            their 12-week transformation.
          </>
        }
      />

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
