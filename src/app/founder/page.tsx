import type { Metadata } from "next";
import Image from "next/image";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { SupplementTeaser } from "@/components/home/SupplementTeaser";

import { CTASection } from "@/components/content/CTASection";

// Split back out from the combined About/Founder page (client-directed):
// this page is now Theo's personal story exclusively — the business/
// mission/culture/studio content that used to follow it on this page now
// lives on /about instead, so the two pages don't duplicate each other.
//
// Quote and biography paragraph below are newly approved exact copy
// (client-directed) replacing the previous versions. The old "Our
// Mission" card that used to sit here is gone — replaced by the
// bodybuilding photo gallery, per direction — and the supplement teaser
// (moved from the homepage) now lives below it.

export const metadata: Metadata = {
  title: "Founder | Theo Thurston's Story",
  description:
    "Meet Theo Thurston, founder of GetAgeFit: his own fitness journey, his bodybuilding background, and why he built a studio dedicated to healthy aging.",
  alternates: { canonical: "/founder" },
};

export default function FounderPage() {
  return (
    <>
      {/* Founder moment: Theo's photo paired with his story. Stacks on
          mobile, side-by-side on desktop. */}
      <section className="relative overflow-hidden bg-plum-900 py-16 md:py-24">
        <div className="mx-auto grid max-w-content items-center gap-10 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <ResponsiveImage
            src="/images/founder/theo-thurston.webp"
            alt="Theo Thurston, founder of Get Age Fit"
            placeholderLabel="Theo Thurston portrait needed"
            aspect="aspect-[4/5]"
            imageClassName="object-top"
            className="mx-auto w-full max-w-sm shadow-soft lg:max-w-none"
          />
          <div className="text-center lg:text-left">
            <Eyebrow tone="light">Founder</Eyebrow>
            <p className="mb-8 font-display text-3xl italic leading-snug text-sand-50 md:text-4xl">
              &ldquo;Think stronger. Live stronger. Age stronger.&rdquo;
            </p>
            <h1 className="mb-6 text-sm font-semibold uppercase tracking-wide text-plum-200">
              Theo Thurston, Founder
            </h1>
            <div className="mx-auto max-w-2xl space-y-4 text-left leading-relaxed text-plum-100 lg:mx-0">
              <p>
                Theo&rsquo;s own fitness journey began later in life,
                starting a first structured transformation in his late 40s
                and discovering, firsthand, how differently training needs
                to be approached as the body changes with age. That
                experience became the reason GetAgeFit exists: a studio
                built specifically around the needs of adults who want to
                stay strong, capable, and independent, not a scaled-down
                version of a young person&rsquo;s gym.
              </p>
              <p>
                GetAgeFit opened in Georgetown in 2016 as a dedicated,
                supportive environment for that mission. Theo is a Cooper
                Institute Certified Personal Trainer and was a national
                drug-free bodybuilder from 2009 to 2019. Now, at the age of
                73, he is focusing exclusively on helping our older clients
                regain their strength, health, energy, and independence.
              </p>
              <p className="text-sm text-plum-300">
                [CONFIRM before publishing, sourced from the previous
                getagefit.com site and not yet independently verified:
                35,000+ personal training sessions delivered; competed in
                drug-free bodybuilding, Masters 50 &amp; 60 divisions. See
                docs/CONTENT-STATUS.md.]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bodybuilding gallery, replacing the former "Our Mission" card on
          this page (that content now lives on /about). Three supplied
          photos at their own native proportions — no cropping/distortion
          — in a responsive 3-up row that stacks on mobile. */}
      <Section tone="white">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow tone="plum">Bodybuilding</Eyebrow>
          <h2 className="text-3xl md:text-4xl">
            A National Drug-Free Bodybuilder, 2009&ndash;2019
          </h2>
        </div>
        <div className="grid items-center gap-6 sm:grid-cols-3">
          <Image
            src="/images/founder/bodybuilding-1.webp"
            alt="Theo Thurston with a supporter backstage at a bodybuilding competition"
            width={1096}
            height={1071}
            sizes="(min-width: 640px) 33vw, 100vw"
            className="h-auto w-full rounded-xl2 shadow-card"
          />
          <Image
            src="/images/founder/bodybuilding-2.webp"
            alt="Theo Thurston (center) posing on stage in a bodybuilding lineup"
            width={1087}
            height={786}
            sizes="(min-width: 640px) 33vw, 100vw"
            className="h-auto w-full rounded-xl2 shadow-card"
          />
          <Image
            src="/images/founder/bodybuilding-3.webp"
            alt="Theo Thurston flexing during a bodybuilding pose"
            width={1206}
            height={1191}
            sizes="(min-width: 640px) 33vw, 100vw"
            className="h-auto w-full rounded-xl2 shadow-card"
          />
        </div>
      </Section>

      {/* Supplement teaser, moved here from the homepage (client-directed)
          — same component/popup/submission logic, now presented as its
          own section rather than a line tucked under the founder blurb. */}
      <Section tone="sand">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Eyebrow tone="plum">What&rsquo;s Next</Eyebrow>
          <h2 className="text-3xl md:text-4xl">
            Theo&rsquo;s Next Chapter: GetAgeFit Essentials
          </h2>
        </div>
        <div className="mx-auto max-w-3xl">
          <SupplementTeaser />
        </div>
      </Section>

      <CTASection location="founder-page" />
    </>
  );
}
