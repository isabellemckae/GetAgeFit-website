import { siteConfig } from "@/lib/site-config";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * LocalBusiness / HealthAndBeautyBusiness schema — PROMPT §15.
 * NAP fields pull from siteConfig and are flagged there for verification.
 * Intentionally omits any pricing (offers/priceRange) per PROMPT §2 —
 * pricing is discussed after a consultation, not published.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: siteConfig.nap.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.nap.phone,
    email: siteConfig.nap.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.nap.streetAddress,
      addressLocality: siteConfig.nap.addressLocality,
      addressRegion: siteConfig.nap.addressRegion,
      postalCode: siteConfig.nap.postalCode,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: "Georgetown, Texas",
    },
    // Verified against the business's own current hours (siteConfig.nap.hours
    // / FAQ "What are your studio hours?") — Sunday is "by appointment" only,
    // not a standing open period, so it's intentionally left out of this
    // structured list rather than asserting hours that aren't confirmed.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "05:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "06:00",
        closes: "16:00",
      },
    ],
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook].filter(
      Boolean,
    ),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Personal Training & Healthy-Aging Gym Coaching",
    provider: {
      "@type": "ExerciseGym",
      name: siteConfig.nap.legalName,
    },
    areaServed: "Georgetown, Texas",
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 40,
    },
    description:
      "One-on-one and small-group personal training at our Georgetown gym: strength coaching, nutrition counseling, and progress tracking for adults 40 and older.",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
