"use client";

/**
 * Thin event-tracking layer.
 *
 * Every call pushes to window.dataLayer (GA4 via gtag.js, if configured) and
 * — because Clarity auto-captures session behavior — no separate Clarity
 * call is needed for standard events. Custom Clarity tags (for segmenting
 * qualification results in session recordings) go through window.clarity.
 *
 * KPIs this supports (see PROMPT §21): qualification starts/completion,
 * qualification result, lead capture, consultation booking, CTA clicks —
 * the inputs needed to compute qualified-lead rate, booking rate, and
 * eventually cost-per-qualified-lead once ad spend is connected.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
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

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: event.name, ...event });

  // Tag the Clarity session so recordings can be filtered by funnel outcome.
  if (typeof window.clarity === "function") {
    window.clarity("set", event.name, JSON.stringify(event));
  }
}
