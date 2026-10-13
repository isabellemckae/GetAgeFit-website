import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import { upsertGenericLead, PRODUCT_INTEREST_ESSENTIALS } from "@/lib/airtableClient";
import { syncWaitlistSubscriber } from "@/lib/klaviyoClient";

// This route can now make up to ~7 sequential/parallel external HTTP calls
// in one request (CRM webhook, Airtable lookup + create/update, and — for
// the waitlist source — Klaviyo's profile lookup plus its parallelized
// attribute/subscribe/event calls). Vercel's Node.js serverless default is
// too tight a margin for that once any one dependency is slow; this is a
// deliberate buffer, not a sign any single call is expected to take long.
// Has no effect beyond whatever ceiling the Vercel plan itself allows.
export const maxDuration = 15;

// Maps this route's `source` values (set by each form component's fetch
// call — see ContactForm.tsx and SupplementTeaser.tsx) to the exact
// "Source" single-select option configured on the Coaching OS Leads table,
// plus a human-readable "Source Detail". Keep in sync with that dropdown —
// see upsertGenericLead() in src/lib/airtableClient.ts.
const SOURCE_OPTIONS: Record<string, { source: string; detail: string }> = {
  contact_page: { source: "contact form", detail: "Contact Form" },
  supplement_waitlist: {
    source: "supp waitlist",
    detail: "GetAgeFit Essentials Waitlist",
  },
};
const DEFAULT_SOURCE_OPTION = { source: "website", detail: "Website Lead Form" };

// Practical email check: stricter than the old "contains @" test (requires
// a dot in the domain part), but not a full RFC 5322 parser — this only
// needs to catch obviously-malformed input before it reaches Airtable/CRM.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts common real-world phone formatting (spaces, dashes, dots,
// parens, a leading +) and requires 10–15 digits (covers a bare US number
// through a full E.164 international number). Deliberately does NOT
// reformat/normalize the value — it only decides valid vs. not, so the
// stored value is always exactly what the visitor typed.
const PHONE_ALLOWED_CHARS = /^[+\d\s().-]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

function isValidPhone(value: string): boolean {
  if (!PHONE_ALLOWED_CHARS.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 10 && digitCount <= 15;
}

function logLeadWriteFailure(input: {
  source: string;
  status: string;
  reason?: string;
  crmForwarded: boolean;
}) {
  // Structured, PII-free failure log: which integration failed (Airtable
  // is the only thing that can land in this branch), the general error
  // category (status/reason — internal codes, never a secret or token),
  // and that the submission was NOT persisted. Deliberately omits
  // email/phone/name — Airtable's own client already logs those alongside
  // record IDs for the specific failures that need manual follow-up (see
  // src/lib/airtableClient.ts), so this line doesn't need to repeat them.
  console.error(
    `[LeadSubmission] integration=airtable status=${input.status} reason=${input.reason ?? "n/a"} persisted=false source=${input.source} crmForwarded=${input.crmForwarded}`,
  );
}

// Same structured-log convention as logLeadWriteFailure above, for the
// Klaviyo sync specifically. Klaviyo is additive/fire-and-forget relative
// to the Airtable write (see the call site): this log is the only signal
// an operator gets when Airtable succeeds but Klaviyo didn't, or vice
// versa — the HTTP response to the browser never reports Klaviyo status
// as if it were guaranteed, and a Klaviyo failure never changes what the
// browser is told about the Airtable write.
function logKlaviyoOutcome(input: { status: string; reason?: string; airtableStatus: string }) {
  if (input.status === "synced") return;
  console.error(
    `[LeadSubmission] integration=klaviyo status=${input.status} reason=${input.reason ?? "n/a"} airtableStatus=${input.airtableStatus}`,
  );
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName = asString(body.firstName)?.trim();
  const lastName = asString(body.lastName)?.trim();
  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First and last name are required" },
      { status: 400 },
    );
  }

  const email = asString(body.email)?.trim() ?? "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const phone = asString(body.phone)?.trim();
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
  }

  // SMS consent without a phone number is meaningless (there's nothing to
  // text), and was never possible via the approved form UI — but this is
  // the API boundary, so it's validated here rather than trusted from the
  // client. Checked against the request's own smsConsent value, before
  // that value is gated to the supplement waitlist below, so this rule
  // holds regardless of source.
  if (body.smsConsent === true && !phone) {
    return NextResponse.json(
      { error: "A phone number is required to opt in to text updates" },
      { status: 400 },
    );
  }

  const rawSourceInput = typeof body.source === "string" ? body.source : undefined;
  if (rawSourceInput !== undefined && !(rawSourceInput in SOURCE_OPTIONS)) {
    return NextResponse.json({ error: "Unrecognized lead source" }, { status: 400 });
  }
  // Preserves the historic fallback for a request that sends no `source`
  // at all (falls through to DEFAULT_SOURCE_OPTION below, unchanged).
  const rawSource = rawSourceInput ?? "contact_form";

  const message = asString(body.message);
  const submittedAt = new Date().toISOString();

  const { forwarded } = await forwardToCrm({
    leadSource: rawSource,
    firstName,
    lastName,
    email,
    phone,
    message,
    submittedAt,
  });

  // Communication-consent + product-interest: only the supplement
  // waitlist form asks about these today, so only that source gets a
  // defined value here. Any other source (e.g. the Contact form) passes
  // `undefined` for all three, which upsertGenericLead() treats as "this
  // submission never asked" and leaves any existing Airtable value
  // untouched rather than overwriting it — see that function's doc
  // comment on GenericLeadInput.
  const isSupplementWaitlist = rawSource === "supplement_waitlist";

  // Submitting the "Notify Me" form is itself the email opt-in (matches
  // the approved copy: "we will use it to communicate with you... you
  // can unsubscribe from emails... at any time") — there's no separate
  // email checkbox and none is needed. SMS is different: it requires its
  // own explicit, affirmative checkbox, so it's read from the request
  // body instead of assumed. A submission that leaves that box unchecked
  // still writes `false` (a real "no"), not "unanswered" — and a phone
  // number being present never implies consent by itself.
  const emailConsent = isSupplementWaitlist ? true : undefined;
  const smsConsent = isSupplementWaitlist
    ? typeof body.smsConsent === "boolean"
      ? body.smsConsent
      : false
    : undefined;
  const productInterest = isSupplementWaitlist ? PRODUCT_INTEREST_ESSENTIALS : undefined;

  // Direct Airtable (Coaching OS) Lead upsert — additive alongside the
  // generic CRM forward above, same pattern already used by /api/qualify
  // and /api/consultation. Never allowed to throw or block the response.
  const { source, detail } = SOURCE_OPTIONS[rawSource] ?? DEFAULT_SOURCE_OPTION;
  const airtableResult = await upsertGenericLead({
    firstName,
    lastName,
    email,
    phone,
    source,
    sourceDetail: detail,
    message,
    submittedAt,
    emailConsent,
    smsConsent,
    productInterest,
  });

  // Klaviyo sync — supplement waitlist only (never Contact-form or any
  // other source; consultation/Calendly leads are never synced to Klaviyo
  // at all, per explicit direction). Fire-and-forget relative to the
  // Airtable write above: Airtable stays the sole system of record and
  // the sole determinant of the HTTP response below. A Klaviyo failure is
  // logged, never surfaced to the visitor as if their Airtable-recorded
  // signup had failed, and never silently reported as a success either —
  // see klaviyoStatus in each response branch below.
  const klaviyoResult = isSupplementWaitlist
    ? await syncWaitlistSubscriber({
        firstName,
        lastName,
        email,
        phone,
        emailConsent: emailConsent ?? false,
        smsConsent: smsConsent ?? false,
        productInterest: productInterest ?? PRODUCT_INTEREST_ESSENTIALS,
        sourceDetail: detail,
        submittedAt,
      })
    : null;
  if (klaviyoResult) {
    logKlaviyoOutcome({
      status: klaviyoResult.status,
      reason: "reason" in klaviyoResult ? klaviyoResult.reason : undefined,
      airtableStatus: airtableResult.status,
    });
  }

  // Only "created" and "updated" mean the signup actually landed in
  // Airtable. Every other status — including "unavailable" (Airtable
  // unconfigured or unreachable) and "error" (a failed API call) — must
  // NOT be reported to the browser as a success: that was the exact
  // silent-failure bug this fix addresses. "skipped_duplicate" is its own
  // case: it's not a confirmed success, but it's also not a server error
  // needing a retry — the frontend already has a distinct "needs review"
  // state for it, so it still gets a 200.
  if (airtableResult.status === "created" || airtableResult.status === "updated") {
    return NextResponse.json({
      ok: true,
      forwarded,
      airtableWrite: true,
      airtableStatus: airtableResult.status,
      klaviyoStatus: klaviyoResult?.status ?? "not_applicable",
    });
  }

  if (airtableResult.status === "skipped_duplicate") {
    return NextResponse.json({
      ok: true,
      forwarded,
      airtableWrite: false,
      airtableStatus: "skipped_duplicate",
      klaviyoStatus: klaviyoResult?.status ?? "not_applicable",
    });
  }

  // "unavailable" or "error": the submission was NOT persisted. Respond
  // with a non-2xx status so the browser's existing `!res.ok` handling
  // (already present in both NotifyMeForm and ContactForm) shows their
  // existing error state — no frontend change needed for this to work.
  // The response body stays generic on purpose (requirement: never return
  // backend error details — Airtable status codes, reasons, etc. — to a
  // website visitor); the real detail goes only to the server log below.
  logLeadWriteFailure({
    source: rawSource,
    status: airtableResult.status,
    reason: airtableResult.reason,
    crmForwarded: forwarded,
  });
  return NextResponse.json(
    { ok: false, error: "We couldn't save your submission. Please try again shortly." },
    { status: 502 },
  );
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
