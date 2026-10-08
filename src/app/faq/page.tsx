import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { faqs } from "@/content/faq";
import { pageOpenGraph } from "@/lib/seo";

// New dedicated FAQ page (client-directed) — placed in primary nav rather
// than added to the homepage, per instruction to keep the homepage
// unchanged. Reuses the same FAQAccordion/faqJsonLd pattern already
// established on /how-it-works (see that page's own shorter FAQ), with a
// longer, more complete set of pre-consultation questions here.

const FAQ_TITLE = "FAQ | Questions About Personal Training at GetAgeFit";
const FAQ_DESCRIPTION =
  "Answers to the questions adults 40+ most often ask before scheduling a free evaluation and consultation at GetAgeFit in Georgetown, Texas.";

export const metadata: Metadata = {
  title: FAQ_TITLE,
  description: FAQ_DESCRIPTION,
  alternates: { canonical: "/faq" },
  ...pageOpenGraph({ title: FAQ_TITLE, description: FAQ_DESCRIPTION, path: "/faq" }),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHero
        eyebrow="FAQ"
        heading="Frequently asked questions"
        body="Getting started with personal training should feel exciting, not intimidating. We want you to feel welcome, comfortable, and confident from your very first visit. Here are answers to some of the questions we hear most often."
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </Section>

      <CTASection
        location="faq-page"
        heading="Ready to experience GetAgeFit?"
        body="Whether you want to regain strength, improve your energy, feel more confident, or simply stay active as you age, we'd love to meet you. Start with a complimentary consultation and personal training experience. No pressure, no obligation, just a warm welcome."
      />
    </>
  );
}
