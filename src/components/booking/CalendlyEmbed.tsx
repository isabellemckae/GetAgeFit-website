"use client";

import Script from "next/script";
import { useState } from "react";

/**
 * Native consultation-booking embed for /consultation.
 *
 * Demo #5 — Theo changed the desired customer journey: visitors book
 * directly via Calendly instead of filling out the GetAgeFit consultation
 * form first (see src/app/consultation/page.tsx for the branch that picks
 * this over <ConsultationForm />, unchanged).
 *
 * Uses Calendly's own inline-widget embed (their official
 * assets/external/widget.js enhancing a `calendly-inline-widget` div)
 * rather than a raw <iframe>, since that's Calendly's own recommended
 * integration: it manages its own internal scrolling/sizing and is what
 * Calendly actually tests against, so it behaves better on mobile than a
 * bare iframe does. A lightweight spinner covers the gap between the page
 * rendering and the widget script finishing its own load.
 *
 * If NEXT_PUBLIC_BOOKING_URL is set to something that isn't a calendly.com
 * link (e.g. Acuity, per the original docs/ARCHITECTURE.md comment), this
 * falls back to the previous plain-iframe behavior rather than assuming
 * Calendly's widget script applies to a different booking tool.
 */
export function CalendlyEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const isCalendly = /(^|\.)calendly\.com$/.test(safeHostname(url));

  if (!isCalendly) {
    return (
      <iframe
        title="Schedule a consultation"
        src={url}
        className="h-[760px] w-full rounded-xl2"
      />
    );
  }

  return (
    <div className="relative">
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-xl2 bg-sand-100"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-300 border-t-sage-700" />
        </div>
      )}
      <div
        className="calendly-inline-widget h-[760px] w-full min-w-[280px] rounded-xl2"
        data-url={url}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// Tiny helper so a malformed URL never throws during render — falls back
// to treating it as "not calendly" rather than crashing the page.
function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
