import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact GetAgeFit",
  description:
    "Have a question before scheduling a consultation? Get in touch with the GetAgeFit team in Georgetown, Texas.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-2xl text-4xl md:text-5xl">
            Have a question first? We&rsquo;re happy to help.
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-600">
            If you&rsquo;re ready to talk fit and next steps, we&rsquo;d
            recommend starting with a consultation instead — but for anything
            else, reach out below.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="mb-4 text-2xl">Visit or reach us</h2>
            <address className="space-y-2 not-italic leading-relaxed text-ink-600">
              <p>{siteConfig.nap.legalName}</p>
              <p>{siteConfig.nap.streetAddress}</p>
              <p>
                {siteConfig.nap.addressLocality}, {siteConfig.nap.addressRegion}{" "}
                {siteConfig.nap.postalCode}
              </p>
              <p>{siteConfig.nap.phone}</p>
              <p>{siteConfig.nap.email}</p>
              <p className="pt-2 text-sm text-ink-400">
                Hours: {siteConfig.nap.hours}
              </p>
            </address>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
