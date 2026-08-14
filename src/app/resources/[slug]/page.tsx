import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd, articleJsonLd, faqJsonLd } from "@/components/JsonLd";
import { articles, getArticleBySlug } from "@/content/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/resources/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      {article.faqs && <JsonLd data={faqJsonLd(article.faqs)} />}

      <article>
        <header className="bg-sand-100 py-16 md:py-20">
          <Container className="max-w-prose">
            <Link
              href="/resources"
              className="mb-6 inline-block text-sm font-medium text-sage-700 hover:text-sage-900"
            >
              ← All Resources
            </Link>
            <Badge tone="plum">{article.category}</Badge>
            <h1 className="mb-4 mt-4 text-3xl md:text-4xl">{article.title}</h1>
            <p className="text-sm text-ink-400">
              {article.authorPlaceholder} · {article.readTime} ·{" "}
              {article.publishedLabel}
            </p>
          </Container>
        </header>

        <div className="py-14">
          <Container className="max-w-prose">
            <PhotoPlaceholder
              label="Article image needed"
              aspect="aspect-[16/9]"
              className="mb-10"
            />
            <div className="prose-content space-y-6">
              {article.sections.map((section, i) => {
                if (section.type === "h2") {
                  return (
                    <h2 key={i} className="pt-2 text-2xl">
                      {section.text}
                    </h2>
                  );
                }
                if (section.type === "list") {
                  return (
                    <ul key={i} className="list-disc space-y-2 pl-6 text-ink-600">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="leading-relaxed text-ink-600">
                    {section.text}
                  </p>
                );
              })}
            </div>

            {article.faqs && (
              <div className="mt-14">
                <h2 className="mb-6 text-2xl">Frequently Asked</h2>
                <FAQAccordion items={article.faqs} />
              </div>
            )}
          </Container>
        </div>
      </article>

      <Section tone="sand">
        <Eyebrow>Keep Reading</Eyebrow>
        <h2 className="mb-10 text-3xl">More from the Resource Center</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>

      <CTASection
        eyebrow="Put this into practice"
        heading="See what a personalized plan looks like for you."
        location={`article-${article.slug}`}
      />
    </>
  );
}
