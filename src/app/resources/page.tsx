import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CTASection } from "@/components/content/CTASection";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { articles, articleCategories } from "@/content/articles";

export const metadata: Metadata = {
  title: "Resources | Healthy Aging & Strength Training Guides",
  description:
    "Practical, expert guidance on strength training after 40, healthy aging, nutrition, mobility, and injury-aware training from the GetAgeFit coaching team.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      {/* Asymmetric hero — text + accent photo, rather than the centered
          block used elsewhere. */}
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
        <div className="mb-10 flex flex-wrap gap-2">
          {articleCategories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-ink-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500"
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Section>

      <CTASection location="resources-page" />
    </>
  );
}
