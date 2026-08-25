import type { Metadata } from "next";
import { TransformationCard } from "@/components/content/TransformationCard";
import { CTASection } from "@/components/content/CTASection";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Eyebrow } from "@/components/ui/Section";
import { transformations } from "@/content/transformations";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Transformations | Real GetAgeFit Client Stories",
  description:
    "Strength, independence, and confidence: real 12-week transformation stories from GetAgeFit's healthy-aging coaching program in Georgetown, Texas.",
  alternates: { canonical: "/transformations" },
};

// No client-story photography exists yet for the case studies below (they
// remain honest placeholders — see src/content/transformations.ts). The
// real photography added to this repo is of GetAgeFit trainers, not
// clients, so it's used here only to illustrate the coaching relationship
// itself (hero + the strip below), never attached to a specific
// placeholder client story where it would misrepresent who that person is.
const coachStrip = [
  "/images/trainers/tish-strandboge.webp",
  "/images/trainers/keith-stolle.webp",
  "/images/trainers/ali-tabei.webp",
  "/images/trainers/robin-winkles.webp",
];

export default function TransformationsPage() {
  return (
    <>
      <section className="relative flex h-[380px] items-center overflow-hidden md:h-[440px]">
        <ResponsiveImage
          src="/images/training/coaching-session-leg-press.webp"
          alt="A GetAgeFit client working through a strength machine with a trainer"
          placeholderLabel="Transformations hero photo"
          aspect="aspect-auto"
          imageClassName="object-[75%_center]"
          className="!absolute !inset-0 !h-full !w-full !rounded-none"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-plum-950/85 via-plum-950/60 to-transparent" />
        </ResponsiveImage>
        <div className="relative z-10 mx-auto max-w-content px-6 md:px-10">
          <div className="max-w-xl">
            <Eyebrow tone="light">Transformations</Eyebrow>
            <h1 className="mb-6 text-4xl text-sand-50 md:text-5xl">
              More than a before and after.
            </h1>
            <p className="text-lg leading-relaxed text-plum-100">
              The stories that matter most to us aren&rsquo;t just
              aesthetic. They&rsquo;re about strength, independence,
              confidence, and getting back to the life clients want to
              live, starting with their 12-week transformation.
            </p>
          </div>
        </div>
      </section>

      <div className="border-b border-ink-100 bg-sand-50 py-8">
        <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-6 text-center md:flex-row md:justify-center md:px-10">
          <div className="flex -space-x-3">
            {coachStrip.map((photo) => (
              <ResponsiveImage
                key={photo}
                src={photo}
                alt="A GetAgeFit trainer"
                placeholderLabel="Trainer photo"
                aspect="aspect-square"
                className="w-12 !rounded-full ring-4 ring-sand-50"
              />
            ))}
          </div>
          <p className="text-sm text-ink-500">
            Every transformation starts with a real coach in your corner.
          </p>
        </div>
      </div>

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
