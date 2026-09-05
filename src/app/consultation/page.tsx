import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { CalendlyEmbed } from "@/components/booking/CalendlyEmbed";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Schedule a Consultation",
  description:
    "Schedule your GetAgeFit consultation: a conversation about your goals, your history, and whether personalized coaching is the right fit for you.",
  alternates: { canonical: "/consultation" },
};

const covers = [
  "Understand your goals for strength, mobility, and independence",
  "Review your training and injury history",
  "Evaluate your current starting point",
  "Discuss the right coaching format for you",
  "Explain the investment clearly and honestly",
  "Determine (together) whether it's the right fit",
];

export default function ConsultationPage() {
  const hasExternalBooking =
    !!process.env.NEXT_PUBLIC_BOOKING_URL &&
    process.env.NEXT_PUBLIC_BOOKING_URL.startsWith("http");

  return (
    <>
      <section className="bg-mesh-hero py-20 md:py-28">
        <div className="blob -left-20 -top-16 h-64 w-64 bg-sage-400/20" />
        <div className="blob -right-16 bottom-0 h-72 w-72 bg-plum-400/15" />
        <div className="relative mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Consultation</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-2xl text-4xl md:text-5xl">
            Based on what you share, we&rsquo;ll help you see if
            it&rsquo;s the right fit.
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-lg leading-relaxed text-ink-600">
            No pressure, no scripted sales pitch, just an honest
            conversation about your goals and whether GetAgeFit is the right
            coaching partner for you.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {[
                "/images/trainers/maria-arellano.webp",
                "/images/trainers/jeff-venditte.webp",
                "/images/trainers/christy-wall.webp",
              ].map((photo) => (
                <ResponsiveImage
                  key={photo}
                  src={photo}
                  alt="A GetAgeFit trainer"
                  placeholderLabel="Trainer photo"
                  aspect="aspect-square"
                  className="w-10 !rounded-full ring-2 ring-sand-50"
                />
              ))}
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              You&rsquo;ll talk to a real coach, not a script
            </p>
          </div>
        </div>
      </section>

      {/* Alternating color-block treatment: a sage panel behind "what
          we'll cover" and a plum-accented card behind the form, for
          stronger section-to-section separation than the previous plain
          white background (Demo #4 Part 3). Same existing sage/plum
          system used elsewhere on the site — no new palette. */}
      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-xl2 bg-sage-50 p-8 md:p-10">
            <h2 className="mb-5 text-2xl">In your consultation, we&rsquo;ll</h2>
            <ul className="space-y-4">
              {covers.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-600">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-600 text-xs font-bold text-sand-50"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-500">
              Prefer to talk first? Call {siteConfig.nap.phone} or visit our{" "}
              <a href="/contact" className="font-medium text-sage-700 hover:text-sage-900">
                contact page
              </a>
              .
            </p>
          </div>

          <div>
            {hasExternalBooking ? (
              <div className="overflow-hidden rounded-xl2 border-t-4 border-plum-600 shadow-card">
                <CalendlyEmbed url={process.env.NEXT_PUBLIC_BOOKING_URL!} />
              </div>
            ) : (
              <div className="rounded-xl2 border-t-4 border-plum-600 bg-white p-8 shadow-card">
                <ConsultationForm />
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
