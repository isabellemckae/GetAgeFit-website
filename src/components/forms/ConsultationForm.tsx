"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm({ source = "consultation_page" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent({ name: "consultation_requested", source });
      form.reset();
    } catch {
      setStatus("error");
      setError(
        "We couldn't submit your request. Please try again, or call us directly.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl2 border border-sage-200 bg-sage-50 p-8 text-center"
      >
        <p className="mb-1 font-display text-xl text-sage-800">
          Request received.
        </p>
        <p className="text-ink-600">
          A member of the GetAgeFit team will reach out shortly to confirm
          your consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-firstName" className="mb-2 block text-sm font-semibold text-ink-700">
            First name *
          </label>
          <input
            id="c-firstName"
            name="firstName"
            required
            autoComplete="given-name"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
        <div>
          <label htmlFor="c-lastName" className="mb-2 block text-sm font-semibold text-ink-700">
            Last name *
          </label>
          <input
            id="c-lastName"
            name="lastName"
            required
            autoComplete="family-name"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="mb-2 block text-sm font-semibold text-ink-700">
            Email *
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
        <div>
          <label htmlFor="c-phone" className="mb-2 block text-sm font-semibold text-ink-700">
            Phone *
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
          />
        </div>
      </div>
      <div>
        <label htmlFor="c-goal" className="mb-2 block text-sm font-semibold text-ink-700">
          What are you hoping to work on?
        </label>
        <textarea
          id="c-goal"
          name="goal"
          rows={4}
          className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-sage-700 px-8 py-4 font-semibold text-sand-50 transition-colors hover:bg-sage-800 disabled:opacity-50 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Request My Consultation"}
      </button>
    </form>
  );
}
