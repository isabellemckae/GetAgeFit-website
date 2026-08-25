import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
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
      {/* Compact intro strip rather than a full hero — distinct from every
          other page, since this is a small utility page, not a landing
          moment. */}
      <div className="border-b border-ink-100 bg-white py-14 md:py-16">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="max-w-xl text-3xl md:text-4xl">
            Have a question first? We&rsquo;re happy to help.
          </h1>
          <p className="mt-4 max-w-lg text-ink-600">
            If you&rsquo;re ready to talk fit and next steps, we&rsquo;d
            recommend starting with a consultation instead, but for
            anything else, reach out below.
          </p>
        </Container>
      </div>

      {/* Photo-as-background info panel + form — a different composition
          from the "hero then centered section" pattern used elsewhere. */}
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden">
          <ResponsiveImage
            src="/images/trainers/jeff-venditte.webp"
            alt="A GetAgeFit trainer"
            placeholderLabel="Studio photo"
            aspect="aspect-auto"
            imageClassName="object-top"
            className="!absolute !inset-0 !h-full !w-full !rounded-none"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-sage-950/95 via-sage-950/50 to-sage-900/10" />
          </ResponsiveImage>
          <div className="relative flex h-full min-h-[420px] flex-col justify-end p-8 md:p-12">
            <h2 className="mb-4 text-2xl text-sand-50">Visit or reach us</h2>
            <address className="space-y-2 not-italic leading-relaxed text-sand-100">
              <p>{siteConfig.nap.legalName}</p>
              <p>{siteConfig.nap.streetAddress}</p>
              <p>
                {siteConfig.nap.addressLocality}, {siteConfig.nap.addressRegion}{" "}
                {siteConfig.nap.postalCode}
              </p>
              <p>{siteConfig.nap.phone}</p>
              <p>{siteConfig.nap.email}</p>
              <p className="pt-2 text-sm text-sand-200/70">
                Hours: {siteConfig.nap.hours}
              </p>
            </address>
          </div>
        </div>
        <div className="bg-white p-8 md:p-14">
          <div className="mx-auto max-w-lg">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
