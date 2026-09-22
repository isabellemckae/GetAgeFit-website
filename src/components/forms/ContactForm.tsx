"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

type Status = "idle" | "submitting" | "success" | "needs_review" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact_page" }),
      });
      if (!res.ok) throw new Error("Request failed");
      const json: { airtableStatus?: string } = await res.json();
      // A duplicate-email collision means this submission was NOT recorded
      // in the CRM (see upsertGenericLead() in src/lib/airtableClient.ts) —
      // show a distinct state rather than the normal success message, so
      // nobody thinks the team already has this on file.
      if (json.airtableStatus === "skipped_duplicate") {
        setStatus("needs_review");
      } else {
        setStatus("success");
      }
      trackEvent({ name: "lead_captured", source: "contact_page" });
      form.reset();
    } catch {
      setStatus("error");
      setError(
        "Something went wrong sending your message. Please try again, or call us directly.",
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
          Message sent.
        </p>
        <p className="text-ink-600">
          Thank you for reaching out. A member of the GetAgeFit team will
          respond soon.
        </p>
      </div>
    );
  }

  if (status === "needs_review") {
    return (
      <div
        role="status"
        className="rounded-xl2 border border-plum-200 bg-plum-50 p-8 text-center"
      >
        <p className="mb-1 font-display text-xl text-plum-800">
          We received your message.
        </p>
        <p className="text-ink-600">
          We couldn&rsquo;t automatically match it to your record in our
          system, so please call us at{" "}
          <a
            href={`tel:${siteConfig.nap.phone.replace(/[^+\d]/g, "")}`}
            className="font-semibold text-plum-700 underline"
          >
            {siteConfig.nap.phone}
          </a>{" "}
          to make sure we have it, or a team member will follow up directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" required autoComplete="given-name" />
        <Field label="Last name" name="lastName" required autoComplete="family-name" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-ink-700">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
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
        className="inline-flex items-center justify-center rounded-full bg-sage-700 px-8 py-4 font-semibold text-sand-50 transition-colors hover:bg-sage-800 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-ink-700">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
      />
    </div>
  );
}
