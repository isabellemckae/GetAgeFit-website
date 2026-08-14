import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <Section tone="white">
      <div className="mx-auto max-w-prose">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mb-6 text-3xl">Privacy Policy</h1>
        <p className="mb-4 text-sm text-ink-400">Last updated: [CONFIRM DATE]</p>
        <p className="mb-6 leading-relaxed text-ink-600">
          [BUSINESS DECISION REQUIRED / CONTENT REQUIRED: This page is a
          placeholder. GetAgeFit&rsquo;s counsel or a qualified privacy resource
          should supply the final privacy policy, covering (at minimum)
          what information is collected through the contact, consultation,
          and qualification forms; how it is used and shared (including with
          any CRM or analytics providers such as Google Analytics and
          Microsoft Clarity); data retention; and how visitors can request
          access to or deletion of their information.]
        </p>
      </div>
    </Section>
  );
}
