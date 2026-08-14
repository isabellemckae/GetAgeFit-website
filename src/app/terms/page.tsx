import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <Section tone="white">
      <div className="mx-auto max-w-prose">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mb-6 text-3xl">Terms of Service</h1>
        <p className="mb-4 text-sm text-ink-400">Last updated: [CONFIRM DATE]</p>
        <p className="mb-6 leading-relaxed text-ink-600">
          [BUSINESS DECISION REQUIRED / CONTENT REQUIRED: This page is a
          placeholder. GetAgeFit&rsquo;s counsel should supply final terms of
          service, including website use terms and (separately) the
          membership/coaching agreement terms clients sign, which are out of
          scope for this public page.]
        </p>
      </div>
    </Section>
  );
}
