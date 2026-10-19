"use client";

/**
 * Thin event-tracking layer.
 *
 * Every call sends a GA4 event via gtag("event", ...) (if GA4 is
 * configured) and a matching Clarity custom event + session tag, so
 * recordings can be filtered by funnel step and qualification result.
 *
 * KPIs this supports (see PROMPT §21): qualification starts/completion,
 * qualification result, lead capture, consultation booking, CTA clicks —
 * the inputs needed to compute qualified-lead rate, booking rate, and
 * eventually cost-per-qualified-lead once ad spend is connected.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | { name: "cta_click"; cta: string; location: string }
  | { name: "qualify_start" }
  | {
      name: "qualify_step_complete";
      step: string;
      stepIndex: number;
    }
  | {
      name: "qualify_complete";
      result: "high_intent" | "potential_fit" | "nurture" | "low_fit";
    }
  | { name: "lead_captured"; source: string }
  | { name: "consultation_requested"; source: string };

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  const { name, ...params } = event;

  // GA4 via gtag.js only reads commands queued as gtag(...) calls (pushed
  // as `arguments` objects). A plain {event: ...} object on dataLayer is
  // Google Tag Manager's format and gtag.js silently ignores it, which is
  // why custom events previously never reached GA4. If gtag.js hasn't
  // finished loading yet, this shim queues the call in the same format so
  // it is replayed once the library arrives.
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ??
    function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  gtag("event", name, params);

  // Clarity: a custom event (for filtering recordings by funnel step) plus a
  // session tag carrying the details (e.g. the qualification result).
  if (typeof window.clarity === "function") {
    window.clarity("event", name);
    window.clarity("set", name, JSON.stringify(params));
  }
}
