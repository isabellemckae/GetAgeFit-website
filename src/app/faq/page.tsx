import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { faqs } from "@/content/faq";

// New dedicated FAQ page (client-directed) — placed in primary nav rather
// than added to the homepage, per instruction to keep the homepage
// unchanged. Reuses the same FAQAccordion/faqJsonLd pattern already
// established on /how-it-works (see that page's own shorter FAQ), with a
// longer, more complete set of pre-consultation questions here.

export const metadata: Metadata = {
  title: "FAQ | Questions About Personal Training at GetAgeFit",
  description:
    "Answers to the questions adults 40+ most often ask before scheduling a free evaluation and consultation at GetAgeFit in Georgetown, Texas.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHero
        eyebrow="FAQ"
        heading="Questions before you get started."
        body="Honest answers to what adults 40+ most often want to know before scheduling a free evaluation and consultation."
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </Section>

      <CTASection location="faq-page" />
    </>
  );
}
