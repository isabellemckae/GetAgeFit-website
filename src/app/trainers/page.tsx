import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/content/CTASection";
import { TrainersGrid } from "@/components/content/TrainersGrid";
import { PageHero } from "@/components/layout/PageHero";
import { trainers } from "@/content/trainers";
import { cta } from "@/lib/site-config";
import { pageOpenGraph } from "@/lib/seo";

const TRAINERS_TITLE = "Trainers | Meet the GetAgeFit Coaching Team";
const TRAINERS_DESCRIPTION =
  "Meet the coaches behind GetAgeFit's personalized healthy-aging training in Georgetown, Texas: expert, human, and invested in your independence.";

export const metadata: Metadata = {
  title: TRAINERS_TITLE,
  description: TRAINERS_DESCRIPTION,
  alternates: { canonical: "/trainers" },
  ...pageOpenGraph({ title: TRAINERS_TITLE, description: TRAINERS_DESCRIPTION, path: "/trainers" }),
};

export default function TrainersPage() {
  return (
    <>
      <PageHero
        eyebrow="Trainers"
        heading="Experts. And people you can trust."
        body={
          <>
            Every coach at GetAgeFit brings real, credentialed expertise in
            healthy-aging coaching, and just as importantly, a genuine
            investment in your progress. Led by founder Theo Thurston (see{" "}
            <a href="/founder" className="font-medium text-sage-700 hover:text-sage-900">
              his story
            </a>
            ), the team below guides clients through every stage of the
            GetAgeFit experience, from your first 12-week transformation
            onward.
          </>
        }
      />

      <Section tone="white">
        <TrainersGrid trainers={trainers} />
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
