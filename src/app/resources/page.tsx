import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CTASection } from "@/components/content/CTASection";
import { PageHero } from "@/components/layout/PageHero";
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
      <PageHero
        eyebrow="Resources"
        heading="Expertise on strength, healthy aging, and independence."
        body="Written by the GetAgeFit coaching team to answer real questions, useful whether or not you ever become a client."
      />

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
