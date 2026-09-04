"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { trackEvent } from "@/lib/analytics";

/**
 * Homepage §9 follow-up — a colorful, bold-but-not-overpowering teaser
 * line under the founder copy, opening a popup on click (same open/close
 * pattern as TrainerBioModal.tsx: backdrop click, Escape, and an X button
 * all close it; same widen-and-scroll treatment for long content).
 *
 * Body copy below is Theo's own verbatim message for GETAGEFIT
 * ESSENTIALS™ (ageLIFT™ pre-workout and ageFUEL™ meal replacement),
 * supplied directly by the client. Only light punctuation cleanup was
 * applied (a couple of run-on hyphens tightened into commas) — no
 * wording, claims, or ingredient/timeline details were added or changed.
 */
export function SupplementTeaser() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="mt-6 flex items-center gap-2 rounded-lg border-l-4 border-plum-500 bg-gradient-to-r from-plum-50 to-sage-50 px-4 py-3 text-left text-sm font-bold text-plum-700 transition-colors hover:from-plum-100 hover:to-sage-100 sm:text-base"
      >
        <span>
          Did you know that Theo has created a GetAgeFit supplement line to
          enhance your training &amp; life?
        </span>
        <span aria-hidden="true" className="shrink-0 text-sage-600">
          →
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="GetAgeFit Essentials"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl2 bg-white shadow-soft">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="overflow-y-auto p-6 sm:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-plum-600">
                Coming Early 2027
              </p>
              <h2 className="mb-5 font-display text-2xl leading-tight text-ink-900 sm:text-3xl">
                Train Better. Fuel Better. Age Stronger.
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-ink-600 sm:text-base">
                <p>
                  The supplement industry has traditionally created products
                  for a much younger consumer, many containing excessive
                  stimulants, ineffective proprietary blends, synthetic
                  fillers, and artificial flavorings, colors and
                  preservatives.
                </p>
                <p>
                  So I decided to create the most essential, highest-quality,
                  age-appropriate products that can have the greatest impact
                  on health, performance and convenience.
                </p>
                <p>
                  I&rsquo;m starting with the two most important products
                  I&rsquo;ve been using in my own training, nutrition and
                  healthy-aging protocol. Only now, I&rsquo;m making them
                  more widely available so others can enjoy the same
                  benefits I&rsquo;m experiencing in my own life.
                </p>
              </div>

              <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-wide text-sage-700">
                Introducing GetAgeFit Essentials&trade;
              </p>

              <Image
                src="/images/products/getagefit-essentials.png"
                alt="GetAgeFit Essentials: ageLIFT pre-workout and ageFUEL meal replacement"
                width={664}
                height={554}
                className="mb-5 h-auto w-full rounded-xl2 border border-ink-100"
              />

              <div className="space-y-5">
                <div className="rounded-xl2 border border-plum-100 bg-plum-50/40 p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg text-ink-900">
                      ageLIFT&trade;
                    </h3>
                    <Badge tone="plum">Pre-Workout</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-600">
                    A clean pre-workout formula containing efficacious
                    amounts of high-quality natural ingredients to support
                    energy, focus, strength and training performance,
                    without the usual high-caffeine jitters.
                  </p>
                </div>

                <div className="rounded-xl2 border border-sage-100 bg-sage-50/40 p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg text-ink-900">
                      ageFUEL&trade;
                    </h3>
                    <Badge tone="sage">Meal Replacement</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-600">
                    A convenient whey protein isolate meal replacement
                    featuring real-food ingredients like micro-filtered
                    sweet potato powder, designed to provide an ideal
                    protein-to-carbohydrate balance, along with essential
                    vitamins and other quality ingredients to support your
                    training and recovery.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-ink-800">
                  Both follow the same philosophy:
                </p>
                <ul className="space-y-2 text-sm text-ink-600">
                  {[
                    "No proprietary blends.",
                    "No artificial sweeteners or colors.",
                    "No unnecessary ingredients.",
                    "Transparent amounts of every active ingredient, with links to the science behind why I chose them.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-600 text-xs font-bold text-sand-50"
                      >
                        &#10003;
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-600 sm:text-base">
                <p>
                  I created these products for myself, and now I want to
                  make them available to you.
                </p>
                <p>
                  We&rsquo;re targeting early 2027 for our first production
                  run following third-party testing, compliance review, and
                  manufacturing. I&rsquo;ve hired an independent, 25-year
                  veteran of supplement quality and compliance to help
                  ensure these products meet rigorous standards for quality
                  and that what it says on the label is actually what&rsquo;s
                  in the bottle.
                </p>
              </div>

              <div className="mt-8 rounded-xl2 border-t-4 border-plum-500 bg-sand-100 p-6">
                <p className="mb-4 text-sm leading-relaxed text-ink-700 sm:text-base">
                  If you&rsquo;d like to be notified when ageLIFT&trade; and
                  ageFUEL&trade; become available in early 2027, leave your
                  email and/or cell number below and we&rsquo;ll send you a
                  link to order with a special introductory offer!
                </p>
                <NotifyMeForm />
              </div>

              <div className="mt-8 border-t border-ink-100 pt-5 text-sm text-ink-500">
                <p className="font-semibold text-ink-800">Theo Thurston</p>
                <p>Founder, Get Age Fit</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-400">
                  GetAgeFit Essentials&trade;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Reuses the existing, unmodified /api/lead endpoint (see
 * ContactForm.tsx for the same pattern) with a distinct `source` so
 * these show up in the CRM as their own lead type rather than mixed in
 * with contact-page or qualify-quiz leads. No new backend code — the
 * route already reads firstName/lastName/email/phone from the body.
 *
 * The endpoint requires a valid email on every submission (see
 * src/app/api/lead/route.ts), so email is required here even though
 * Theo's copy says "email and/or cell number" — phone is offered as an
 * optional add-on rather than an alternative. Flagged for the client:
 * if phone-only signups are wanted, the API route itself would need to
 * change.
 */
function NotifyMeForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "supplement_waitlist" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent({ name: "lead_captured", source: "supplement_waitlist" });
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="text-sm font-semibold text-sage-800">
        You&rsquo;re on the list. We&rsquo;ll email you when ageLIFT&trade;
        and ageFUEL&trade; are ready to order.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="supplement-first-name" className="sr-only">
            First name
          </label>
          <input
            id="supplement-first-name"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="First name"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
        <div>
          <label htmlFor="supplement-last-name" className="sr-only">
            Last name
          </label>
          <input
            id="supplement-last-name"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Last name"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="supplement-email" className="sr-only">
            Email
          </label>
          <input
            id="supplement-email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
        <div>
          <label htmlFor="supplement-phone" className="sr-only">
            Cell number (optional)
          </label>
          <input
            id="supplement-phone"
            name="phone"
            type="tel"
            placeholder="Cell number (optional)"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-plum-600 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-plum-700 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Notify Me"}
      </button>
    </form>
  );
}
