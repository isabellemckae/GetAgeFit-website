import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CTASection } from "@/components/content/CTASection";
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
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Resources</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl md:text-5xl">
            Expertise on strength, aging, and independence.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-600">
            Written by the GetAgeFit coaching team to answer real questions,
            useful whether or not you ever become a client.
          </p>
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
