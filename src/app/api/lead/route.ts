import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import {
  upsertGenericLead,
  appendKlaviyoReconciliationNote,
  PRODUCT_INTEREST_ESSENTIALS,
} from "@/lib/airtableClient";
import { syncWaitlistSubscriber } from "@/lib/klaviyoClient";

// This route can now make up to ~9 sequential/parallel external HTTP calls
// in one request (CRM webhook, Airtable lookup + create/update, and — for
// the waitlist source — Klaviyo's profile lookup plus its parallelized
// attribute/SMS/event calls, one of which — the email channel — is itself
// a short sequential subscribe→confirm→list-add chain bounded to ~3.4s of
// added latency; see confirmEmailMarketingSubscribed in klaviyoClient.ts).
// Vercel's Node.js serverless default is too tight a margin for that once
// any one dependency is slow; this is a deliberate buffer, not a sign any
// single call is expected to take long. Has no effect beyond whatever
// ceiling the Vercel plan itself allows.
export const maxDuration = 25;

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
//
// Since email/SMS subscribe failures are now independent (see
// klaviyoClient.ts), an overall "synced" result can still carry a
// channel-level "error" in emailAction/smsAction — that must still be
// logged even though the top-level status looks healthy, so a one-channel
// failure is never silently invisible to an operator.
function logKlaviyoOutcome(input: {
  status: string;
  reason?: string;
  airtableStatus: string;
  emailAction?: string;
  smsAction?: string;
}) {
  const channelFailed =
    input.emailAction === "error" ||
    input.emailAction === "pending_confirmation" ||
    input.smsAction === "error" ||
    // A valid, consented SMS opt-in that couldn't be honored because the
    // phone number already belongs to a different profile (see
    // klaviyoClient.ts's 2026-10-19 doc comment) — email enrollment is
    // unaffected, but this still needs an operator's eyes since the
    // visitor's SMS consent was never actually recorded anywhere.
    input.smsAction === "skipped_phone_conflict";
  if (input.status === "synced" && !channelFailed) return;
  console.error(
    `[LeadSubmission] integration=klaviyo status=${input.status} reason=${input.reason ?? "n/a"} airtableStatus=${input.airtableStatus} emailAction=${input.emailAction ?? "n/a"} smsAction=${input.smsAction ?? "n/a"}`,
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

  // SMS consent without a phone number can't actually be honored (there's
  // nothing to text) — but that is a reason to skip the SMS subscribe, not
  // a reason to reject the whole submission. syncWaitlistSubscriber already
  // handles exactly this case gracefully (normalizeToE164 returns null for
  // a missing/unparseable phone, reported as the "skipped_invalid_phone"
  // channel action — see klaviyoClient.ts), leaving email enrollment
  // completely unaffected. A hard 400 here used to block email too, which
  // made SMS a de facto requirement for a subset of waitlist signups —
  // exactly what this form must never do (see SMS/email consent
  // independence audit, 2026-10-19).

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
        // Durable Klaviyo-side reconciliation marker — see
        // WaitlistSyncInput.airtableStatus in klaviyoClient.ts.
        airtableStatus: airtableResult.status,
      })
    : null;
  const emailAction = klaviyoResult && "emailAction" in klaviyoResult ? klaviyoResult.emailAction : undefined;
  const smsAction = klaviyoResult && "smsAction" in klaviyoResult ? klaviyoResult.smsAction : undefined;

  // "Enrolled" is the one signal the website is allowed to present as
  // waitlist success: klaviyoClient.ts now actually polls Klaviyo's own
  // profile-lookup endpoint and confirms the email consent write has
  // committed — not merely that the request was accepted — before it
  // ever reports "subscribed" (see resolveEmailEnrollment /
  // confirmEmailMarketingSubscribed there, added after the 2026-10-17
  // incident where an accepted-but-uncommitted consent write raced the
  // "Added to List" flow trigger). "subscribed" here always means
  // genuinely confirmed, including the idempotent already-subscribed
  // case (a duplicate/resubmitted signup gets the same, accurate "you're
  // on the list" answer without re-requesting consent).
  // "Suppressed" is the other legitimate non-error outcome: Klaviyo
  // correctly declined to subscribe someone who had previously
  // unsubscribed — this must never be reported as enrollment, and must
  // never be silently treated as a generic failure either. A third,
  // equally legitimate outcome — emailAction "pending_confirmation" —
  // falls through to neither enrolled nor suppressed below, which is
  // exactly right: the existing "pending" frontend copy ("we're finishing
  // up your email confirmation now...") already describes this case
  // honestly without any further changes needed here.
  const enrolled = isSupplementWaitlist && klaviyoResult?.status === "synced" && emailAction === "subscribed";
  const suppressed =
    isSupplementWaitlist && klaviyoResult?.status === "synced" && emailAction === "skipped_previously_unsubscribed";

  if (klaviyoResult) {
    logKlaviyoOutcome({
      status: klaviyoResult.status,
      reason: "reason" in klaviyoResult ? klaviyoResult.reason : undefined,
      airtableStatus: airtableResult.status,
      emailAction,
      smsAction,
    });

    // Durable Airtable-side reconciliation marker, complementing the
    // Klaviyo-side one above: fires whenever there's a real recordId to
    // annotate — either the matched/created Lead, or (since duplicate
    // collisions now create their own traceable review record — see
    // upsertGenericLead in airtableClient.ts) that review record — AND a
    // specific Klaviyo channel failed to subscribe. The note is a short,
    // closed-set message — never a raw Klaviyo error body — so nothing
    // about Klaviyo's account configuration can leak into Airtable.
    // Best-effort: its own failure is logged and never affects the
    // response already being sent to the visitor.
    const annotatableRecordId =
      airtableResult.status === "created" || airtableResult.status === "updated"
        ? airtableResult.recordId
        : airtableResult.status === "skipped_duplicate"
          ? airtableResult.reviewRecordId
          : undefined;
    if (
      annotatableRecordId &&
      (emailAction === "error" ||
        emailAction === "pending_confirmation" ||
        smsAction === "error" ||
        smsAction === "skipped_phone_conflict")
    ) {
      const emailIssue =
        emailAction === "error"
          ? "email"
          : emailAction === "pending_confirmation"
            ? "email (consent not yet confirmed as of this request — check Klaviyo before resolving)"
            : null;
      const smsIssue =
        smsAction === "error"
          ? "SMS"
          : smsAction === "skipped_phone_conflict"
            ? "SMS (requested, but the phone number is already on a different Klaviyo profile — not subscribed anywhere this submission)"
            : null;
      const failedChannels = [emailIssue, smsIssue].filter(Boolean).join(" and ");
      const noteResult = await appendKlaviyoReconciliationNote(
        annotatableRecordId,
        `[${submittedAt}] Klaviyo sync note: ${failedChannels} subscription needs reconciliation (see Klaviyo profile for the waitlist-signup event and current consent state).`,
      );
      if (noteResult.status === "error") {
        console.error(
          `[LeadSubmission] integration=airtable-reconciliation-note status=error reason=${noteResult.reason} recordId=${annotatableRecordId}`,
        );
      }
    }
  }

  const airtableCaptured = airtableResult.status === "created" || airtableResult.status === "updated";

  // Report success whenever EITHER system durably captured this
  // submission: the normal Airtable Lead write/update, the duplicate-
  // review record (still a real, traceable Airtable row), or — new per
  // explicit direction — a confirmed Klaviyo enrollment on its own. That
  // last case means a genuine Airtable outage/error is no longer shown to
  // the visitor as a technical CRM failure once Klaviyo has confirmed
  // they're on the waitlist; it's still logged below exactly like any
  // other Airtable failure, so it stays fully visible to an operator.
  if (airtableCaptured || airtableResult.status === "skipped_duplicate" || enrolled) {
    if (!airtableCaptured && airtableResult.status !== "skipped_duplicate") {
      logLeadWriteFailure({
        source: rawSource,
        status: airtableResult.status,
        reason: airtableResult.reason,
        crmForwarded: forwarded,
      });
    }
    return NextResponse.json({
      ok: true,
      forwarded,
      airtableWrite: airtableCaptured,
      airtableStatus: airtableResult.status,
      klaviyoStatus: klaviyoResult?.status ?? "not_applicable",
      enrolled,
      suppressed,
    });
  }

  // Neither system captured this submission: Airtable is "unavailable" or
  // "error" AND Klaviyo did not confirm enrollment either. Respond with a
  // non-2xx status so the browser's existing `!res.ok` handling (already
  // present in both NotifyMeForm and ContactForm) shows their existing
  // error state — no frontend change needed for this to work. The
  // response body stays generic on purpose (requirement: never return
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
