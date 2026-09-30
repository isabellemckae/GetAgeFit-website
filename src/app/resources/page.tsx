import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { CTASection } from "@/components/content/CTASection";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

// Demo #6 (client-directed): the previous article listing here was
// unpublished, review-pending copy (src/content/articles.ts, still
// "PROPOSED COPY" with bracketed author/review-date placeholders) — never
// actually approved for publishing. Cleared rather than left live, so the
// page doesn't imply articles already exist. Isa will write and publish
// the first three articles later; no placeholder articles or authors are
// invented here in the meantime. The /resources/[slug] article route and
// its content model were removed along with the listing — see the
// summary this edit produced for what else depended on them.

export const metadata: Metadata = {
  title: "Resources | Coming Soon",
  description:
    "GetAgeFit's resource center — practical guidance on strength, healthy aging, and independence from our coaching team — is coming soon.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-mesh-hero py-16 md:py-24">
        <div className="relative mx-auto grid max-w-content items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Eyebrow>Resources</Eyebrow>
            <h1 className="mb-5 max-w-xl text-4xl md:text-5xl">
              Expertise on strength, healthy aging, and independence.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-ink-600">
              Written by the GetAgeFit coaching team to answer real
              questions, useful whether or not you ever become a client.
            </p>
          </div>
          <ResponsiveImage
            src="/images/trainers/tish-strandboge.webp"
            alt="Tish Strandboge, GetAgeFit personal trainer"
            placeholderLabel="Coach portrait"
            aspect="aspect-[3/4]"
            imageClassName="object-top"
            className="hidden shadow-soft md:block"
          >
            <div className="photo-tint-sage-diagonal" />
          </ResponsiveImage>
        </div>
      </section>

      <Section tone="white">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow tone="plum">Coming Soon</Eyebrow>
          <h2 className="mb-4 text-3xl md:text-4xl">
            Our first articles are on the way.
          </h2>
          <p className="text-lg leading-relaxed text-ink-600">
            The GetAgeFit team is putting together practical guidance on
            strength, healthy aging, and independence. Check back soon for
            our first pieces.
          </p>
        </div>
      </Section>

      <CTASection location="resources-page" />
    </>
  );
}
