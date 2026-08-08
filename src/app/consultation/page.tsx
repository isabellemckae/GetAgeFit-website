import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Schedule a Consultation",
  description:
    "Schedule your GetAgeFit consultation — a conversation about your goals, your history, and whether personalized coaching is the right fit for you.",
  alternates: { canonical: "/consultation" },
};

const covers = [
  "Understand your goals for strength, mobility, and independence",
  "Review your training and injury history",
  "Evaluate your current starting point",
  "Discuss the right coaching format for you",
  "Explain the investment clearly and honestly",
  "Determine — together — whether it's the right fit",
];

export default function ConsultationPage() {
  const hasExternalBooking =
    !!process.env.NEXT_PUBLIC_BOOKING_URL &&
    process.env.NEXT_PUBLIC_BOOKING_URL.startsWith("http");

  return (
    <>
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <Eyebrow>Consultation</Eyebrow>
          <h1 className="mx-auto mb-6 max-w-2xl text-4xl md:text-5xl">
            Based on what you share, we&rsquo;ll help you see if
            it&rsquo;s the right fit.
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-600">
            No pressure, no scripted sales pitch — just an honest
            conversation about your goals and whether GetAgeFit is the right
            coaching partner for you.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="mb-5 text-2xl">In your consultation, we&rsquo;ll</h2>
            <ul className="space-y-4">
              {covers.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-600">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-400">
              Prefer to talk first? Call {siteConfig.nap.phone} or visit our{" "}
              <a href="/contact" className="font-medium text-sage-700 hover:text-sage-900">
                contact page
              </a>
              .
            </p>
          </div>

          <div>
            {hasExternalBooking ? (
              <div className="overflow-hidden rounded-xl2 border border-ink-100 shadow-card">
                <iframe
                  title="Schedule a consultation"
                  src={process.env.NEXT_PUBLIC_BOOKING_URL}
                  className="h-[720px] w-full"
                />
              </div>
            ) : (
              <div className="rounded-xl2 border border-ink-100 bg-sand-50 p-8 shadow-card">
                <ConsultationForm />
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
