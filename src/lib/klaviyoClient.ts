/**
 * Klaviyo sync for the GetAgeFit Essentials supplement waitlist —
 * server-side only. Mirrors the graceful-degradation / never-throw
 * contract already established by src/lib/airtableClient.ts: every
 * exported function degrades to a logged no-op if KLAVIYO_PRIVATE_API_KEY
 * is unset, and never throws, so a Klaviyo outage or misconfiguration can
 * never break the waitlist form or block the Airtable write that already
 * runs alongside it.
 *
 * Scope, deliberately narrow: this file exists ONLY to sync supplement
 * waitlist signups. It is not called for the Contact form, the
 * qualification funnel, or consultation/Calendly leads — per explicit
 * direction, consultation leads are never added to Klaviyo.
 *
 * Consent model (the part of this file that actually matters):
 * Klaviyo's own subscription model has three states per channel —
 * SUBSCRIBED, UNSUBSCRIBED, NEVER_SUBSCRIBED. A naive "call Subscribe
 * Profiles every time someone submits the form" would silently flip an
 * UNSUBSCRIBED profile back to SUBSCRIBED on a repeat signup — exactly
 * the "silently reverse a previous unsubscribe" failure mode this
 * integration must not have. So before ever calling Subscribe Profiles,
 * this looks up the profile's CURRENT consent for that channel and skips
 * the subscribe call entirely if it's already UNSUBSCRIBED. The profile's
 * attributes (name, phone, product interest) are still updated either
 * way — only the marketing consent action is withheld.
 *
 * API shape here follows Klaviyo's documented Profiles/Subscribe-Profiles/
 * Events endpoints as researched during integration planning. It has been
 * verified with mocked-fetch unit tests only (see klaviyoClient.test.ts) —
 * NOT against a live Klaviyo account, since no KLAVIYO_PRIVATE_API_KEY
 * exists yet in any environment this code has run in. Treat the exact
 * request/response shapes as "implemented per documentation, pending a
 * real sandbox call" until that's been done.
 *
 * Phone numbers: Airtable keeps whatever the visitor typed, verbatim —
 * that's a separate write this file never touches (see upsertGenericLead
 * in airtableClient.ts). Klaviyo is different: it expects E.164
 * (+15125551234), and this module normalizes a SEPARATE copy of the
 * number for Klaviyo's wire format only, via libphonenumber-js (a
 * maintained port of Google's libphonenumber — not a hand-rolled regex).
 * "US" is used as the assumed region only when the input has no explicit
 * country code, matching this form's real, current audience; a number
 * that still doesn't parse as valid is never guessed at further — SMS
 * subscription is simply skipped for that submission (see
 * normalizeToE164 below), and that never blocks the email side or the
 * Airtable write.
 *
 * Channel independence: email and SMS are subscribed via two SEPARATE
 * Subscribe Profiles calls (subscribeEmail/subscribeSms below), not one
 * shared call. This matters because Klaviyo validates a Subscribe
 * Profiles job atomically — a live account-side SMS rejection (e.g. no
 * sending number configured for the phone's region) would otherwise fail
 * the entire job, taking the unrelated email subscription down with it.
 * Each channel's outcome is tracked and reported independently
 * (ChannelAction, including a dedicated "error" value for a channel-level
 * subscribe failure), and the overall sync is still reported as "synced"
 * as long as the profile attribute upsert itself succeeded — a failure
 * subscribing one channel never masks or blocks the other.
 *
 * Reconciliation: every profile upsert also writes a durable
 * `airtable_sync_status` property (the caller's already-computed, closed-
 * set Airtable result status — never a raw error body) so a Klaviyo
 * profile can be cross-checked against Airtable from within Klaviyo itself
 * (segments/exports), without depending on ephemeral server logs. The
 * complementary direction — flagging a Klaviyo channel failure back onto
 * the Airtable Lead — is handled by the caller via
 * appendKlaviyoReconciliationNote() in airtableClient.ts, not from here.
 *
 * Consent-before-list-add sequencing (2026-10-17 incident): a live signup
 * (missisakae@gmail.com) got a confirmed Klaviyo email subscription and
 * list membership, but the "Added to List"-triggered welcome flow never
 * fired. Root cause, confirmed from Klaviyo's own event timeline: the old
 * code requested email consent AND list membership in ONE Subscribe
 * Profiles bulk job call. Klaviyo processes a bulk job's consent-write and
 * list-write as separate internal sub-steps, and the "Added to List" event
 * (which the flow trigger evaluates against) can fire before the same
 * job's consent sub-step has actually committed — a race, not a
 * deterministic failure, which is why an earlier test of this same flow
 * had worked. Separately confirmed: the plain "add profile to list"
 * endpoint used here is effectively synchronous, while the bulk subscribe
 * job's consent commit was observed taking anywhere from ~65 seconds to
 * ~4 minutes in this account — so issuing the two calls back-to-back
 * without confirming the first one actually landed does not fix the race,
 * it just changes its odds.
 *
 * The fix: subscribeEmail() now requests ONLY consent (no list
 * relationship). confirmEmailMarketingSubscribed() then polls the
 * profile's own subscription state — the one thing Klaviyo's API actually
 * exposes to confirm a write has committed, there being no job-status
 * endpoint for this job type — with a short, bounded retry schedule (see
 * EMAIL_CONFIRM_RETRY_DELAYS_MS below). Only once that confirms SUBSCRIBED
 * does addProfileToList() ever run, so the "Added to List" event can only
 * fire once the flow's own entry filter (email consent subscribed) is
 * already true.
 *
 * This bounded wait (a few seconds) is far shorter than the multi-minute
 * commit times observed live, so it will often time out rather than
 * confirm — by design: per explicit instruction, this code must never
 * report a pending consent as a completed enrollment, and must never run
 * indefinitely inside a Vercel function. A timeout is reported as the
 * "pending_confirmation" ChannelAction (synced overall, honestly
 * unconfirmed for email) and the profile is deliberately NOT added to the
 * list in that request — exactly the race this fix removes, now simply
 * deferred rather than resolved.
 *
 * Essentials Waitlist Welcome v2 (planned, pending separate Klaviyo-side
 * approval): the durable fix is a new flow triggered on Klaviyo's own
 * "Subscribed to Email Marketing" metric instead of "Added to List" — that
 * event only fires once consent is actually committed, so there is no race
 * to bound a wait against at all. That flow's entry filter also checks the
 * `product_interest` profile property (to scope it to Essentials signups
 * only, since the metric itself is account-wide). For that filter to be
 * race-free against the SAME metric event, the attribute upsert — which
 * writes `product_interest` — is awaited and confirmed OK before the email
 * consent request is even issued (see the sequencing in
 * syncWaitlistSubscriber below): the attribute write is a plain, synchronous
 * profile write, not an async bulk job, so a successful response from it
 * means the property has already committed, long before the slow
 * consent-commit step even begins.
 */

import { parsePhoneNumberFromString } from "libphonenumber-js";

const KLAVIYO_API_ROOT = "https://a.klaviyo.com/api";
// Pinned, not "latest" — an API revision change should be a deliberate,
// reviewed bump, not something that silently changes behavior.
const KLAVIYO_REVISION = "2024-10-15";

type KlaviyoConfig = {
  apiKey: string;
  listId?: string;
};

function getConfig(): KlaviyoConfig | null {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!apiKey) return null;
  return { apiKey, listId: process.env.KLAVIYO_LIST_ID || undefined };
}

function authHeaders(config: KlaviyoConfig): Record<string, string> {
  return {
    Authorization: `Klaviyo-API-Key ${config.apiKey}`,
    revision: KLAVIYO_REVISION,
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  };
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "<unreadable response body>";
  }
}

export type WaitlistSyncInput = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  /**
   * Same "this submission's real answer" semantics as
   * GenericLeadInput.emailConsent/smsConsent in airtableClient.ts — always
   * a real boolean by the time it reaches this function (the API route
   * resolves "did this source even ask" before calling this; this module
   * doesn't need its own undefined-means-unasked case because it's only
   * ever called for the one source that does ask).
   */
  emailConsent: boolean;
  smsConsent: boolean;
  /** Exact value, shared with Airtable's Product Interest field — see PRODUCT_INTEREST_ESSENTIALS in airtableClient.ts. */
  productInterest: string;
  /** Human-readable source, for the Klaviyo profile property + tracked event — e.g. "GetAgeFit Essentials Waitlist". */
  sourceDetail: string;
  submittedAt: string;
  /**
   * The Airtable write's own already-computed result status for this same
   * submission (e.g. "created", "updated", "skipped_duplicate",
   * "unavailable", "error") — a closed, internal enum value, never a raw
   * error body. Written verbatim onto the Klaviyo profile as a durable
   * `airtable_sync_status` property so the two systems can be reconciled
   * from within Klaviyo itself. The caller (route.ts) computes this before
   * calling syncWaitlistSubscriber, since the Airtable write always
   * completes first.
   */
  airtableStatus: string;
};

type ChannelConsentStatus = "SUBSCRIBED" | "UNSUBSCRIBED" | "NEVER_SUBSCRIBED" | "unknown";

type ChannelAction =
  | "subscribed"
  | "unchanged"
  | "skipped_previously_unsubscribed"
  | "skipped_invalid_phone"
  | "not_requested"
  /**
   * Email consent was requested but could not be confirmed as committed
   * within the bounded retry window (see confirmEmailMarketingSubscribed
   * below) — the profile was deliberately NOT added to the list, so this
   * is honestly reported as neither success nor an error. Never produced
   * for SMS (no equivalent confirm-before-list step exists for that
   * channel — see this file's doc comment on why SMS stays unchanged).
   */
  | "pending_confirmation"
  | "error";

/**
 * Normalizes a phone number to E.164 for Klaviyo's wire format only — the
 * value Airtable stores is a separate, untouched copy (see this file's
 * doc comment). Returns null for anything missing or that doesn't parse
 * as a genuinely valid number, rather than guessing at a country code or
 * forcing a shape on it; the caller treats null as "cannot SMS-subscribe
 * this submission," never as a reason to fail the whole sync.
 */
export function normalizeToE164(phone: string | undefined): string | null {
  if (!phone) return null;
  const parsed = parsePhoneNumberFromString(phone, "US");
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number; // always E.164 when isValid() is true
}

export type WaitlistSyncResult =
  | { status: "unavailable"; reason: string }
  | {
      status: "synced";
      profileId: string;
      emailAction: ChannelAction;
      smsAction: ChannelAction;
      eventTracked: boolean;
    }
  | { status: "error"; reason: string };

type KlaviyoProfileRecord = {
  id: string;
  attributes?: {
    subscriptions?: {
      email?: { marketing?: { consent?: string } };
      sms?: { marketing?: { consent?: string } };
    };
  };
};

async function findProfileByEmail(
  email: string,
  config: KlaviyoConfig,
): Promise<
  | { status: "found"; id: string; emailConsent: ChannelConsentStatus; smsConsent: ChannelConsentStatus }
  | { status: "not_found" }
  | { status: "error"; reason: string }
> {
  const filter = encodeURIComponent(`equals(email,"${email}")`);
  const url = `${KLAVIYO_API_ROOT}/profiles/?filter=${filter}&additional-fields[profile]=subscriptions`;

  try {
    const res = await fetch(url, { headers: authHeaders(config) });
    if (!res.ok) {
      const body = await safeReadText(res);
      console.error(`[KlaviyoClient] Profile lookup failed: ${res.status} ${res.statusText}`, body);
      return { status: "error", reason: `lookup_failed_${res.status}` };
    }
    const json = (await res.json()) as { data?: KlaviyoProfileRecord[] };
    const records = json.data ?? [];
    if (records.length === 0) return { status: "not_found" };

    const record = records[0];
    const emailConsent =
      (record.attributes?.subscriptions?.email?.marketing?.consent as ChannelConsentStatus | undefined) ??
      "unknown";
    const smsConsent =
      (record.attributes?.subscriptions?.sms?.marketing?.consent as ChannelConsentStatus | undefined) ??
      "unknown";
    return { status: "found", id: record.id, emailConsent, smsConsent };
  } catch (err) {
    console.error("[KlaviyoClient] Network error during profile lookup:", err);
    return { status: "error", reason: "network_error" };
  }
}

async function upsertProfileAttributes(
  input: WaitlistSyncInput,
  klaviyoPhone: string | null,
  existingId: string | undefined,
  config: KlaviyoConfig,
): Promise<{ status: "ok"; id: string } | { status: "error"; reason: string }> {
  const attributes: Record<string, unknown> = {
    email: input.email,
    // Only ever the normalized E.164 value, never the raw input — an
    // unparseable number is omitted entirely rather than sent as-is,
    // since Klaviyo may itself reject a non-E.164 phone_number.
    ...(klaviyoPhone ? { phone_number: klaviyoPhone } : {}),
    ...(input.firstName ? { first_name: input.firstName } : {}),
    ...(input.lastName ? { last_name: input.lastName } : {}),
    properties: {
      product_interest: input.productInterest,
      waitlist_source: input.sourceDetail,
      // Durable cross-system reconciliation marker — see this file's doc
      // comment and WaitlistSyncInput.airtableStatus above.
      airtable_sync_status: input.airtableStatus,
    },
  };

  try {
    if (existingId) {
      const res = await fetch(`${KLAVIYO_API_ROOT}/profiles/${existingId}/`, {
        method: "PATCH",
        headers: authHeaders(config),
        body: JSON.stringify({ data: { type: "profile", id: existingId, attributes } }),
      });
      if (!res.ok) {
        const body = await safeReadText(res);
        console.error(`[KlaviyoClient] Profile update failed: ${res.status} ${res.statusText}`, body);
        return { status: "error", reason: `update_failed_${res.status}` };
      }
      return { status: "ok", id: existingId };
    }

    const res = await fetch(`${KLAVIYO_API_ROOT}/profiles/`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify({ data: { type: "profile", attributes } }),
    });
    if (!res.ok) {
      const body = await safeReadText(res);
      console.error(`[KlaviyoClient] Profile create failed: ${res.status} ${res.statusText}`, body);
      return { status: "error", reason: `create_failed_${res.status}` };
    }
    const json = (await res.json()) as { data: { id: string } };
    return { status: "ok", id: json.data.id };
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error during profile upsert:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
}

async function postSubscribeJob(
  profileAttributes: Record<string, unknown>,
  config: KlaviyoConfig,
  logLabel: string,
  options: { includeList: boolean },
): Promise<{ status: "ok" } | { status: "error"; reason: string }> {
  const body: Record<string, unknown> = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: { data: [{ type: "profile", attributes: profileAttributes }] },
      },
      ...(options.includeList && config.listId
        ? { relationships: { list: { data: { type: "list", id: config.listId } } } }
        : {}),
    },
  };

  try {
    const res = await fetch(`${KLAVIYO_API_ROOT}/profile-subscription-bulk-create-jobs/`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify(body),
    });
    // Klaviyo returns 202 Accepted for this job endpoint.
    if (!res.ok && res.status !== 202) {
      const text = await safeReadText(res);
      console.error(`[KlaviyoClient] ${logLabel} subscribe failed: ${res.status} ${res.statusText}`, text);
      return { status: "error", reason: `subscribe_failed_${res.status}` };
    }
    return { status: "ok" };
  } catch (err) {
    console.error(`[KlaviyoClient] Unexpected error during ${logLabel} subscribe call:`, err);
    return { status: "error", reason: "unexpected_exception" };
  }
}

// Two SEPARATE Subscribe Profiles calls, one per channel — deliberately
// not one shared call. Klaviyo validates a Subscribe Profiles job
// atomically, so a single bundled call means an account-side SMS-only
// rejection (e.g. no sending number configured for the phone's region —
// exactly what happened on 2026-10-13's test submission) fails the WHOLE
// job, taking the unrelated email subscription down with it. Splitting
// them means each channel's Klaviyo-side outcome is independent of the
// other's, on top of the independence already provided by this file's own
// phone-validity/consent checks.
//
// The email call also never bundles the list relationship (see this
// file's doc comment on the 2026-10-17 consent/list-trigger race) — list
// membership for email is added separately, only after consent is
// confirmed committed (see addProfileToList / confirmEmailMarketingSubscribed
// and resolveEmailEnrollment below). SMS keeps its original, unchanged
// behavior (still bundles the list relationship in the same call) per
// explicit instruction — SMS has no equivalent "Added to List"-triggered
// flow today, so there is nothing for it to race against.

async function subscribeEmail(
  input: WaitlistSyncInput,
  config: KlaviyoConfig,
): Promise<{ status: "ok" } | { status: "error"; reason: string }> {
  return postSubscribeJob(
    {
      email: input.email,
      subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
    },
    config,
    "email",
    { includeList: false },
  );
}

async function subscribeSms(
  input: WaitlistSyncInput,
  klaviyoPhone: string,
  config: KlaviyoConfig,
): Promise<{ status: "ok" } | { status: "error"; reason: string }> {
  return postSubscribeJob(
    {
      email: input.email,
      phone_number: klaviyoPhone,
      subscriptions: { sms: { marketing: { consent: "SUBSCRIBED" } } },
    },
    config,
    "sms",
    { includeList: true },
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Bounded, short retry schedule for confirmEmailMarketingSubscribed below.
// Deliberately NOT sized to reliably outlast the multi-minute commit times
// observed live (see this file's doc comment) — it only needs to be long
// enough to catch the common fast-committing case without risking a
// Vercel function timeout. Total worst-case added latency: ~3.4s.
const EMAIL_CONFIRM_RETRY_DELAYS_MS = [300, 600, 1000, 1500];

/**
 * Confirms — via Klaviyo's own profile-lookup endpoint, the only
 * documented way to check this, since the Subscribe-Profiles bulk job
 * exposes no job-status endpoint — that a just-requested email consent
 * has actually committed, before anything (specifically, list membership)
 * is made to depend on it. Polls with the bounded schedule above; never
 * polls indefinitely.
 *
 * Also treats a confirmed UNSUBSCRIBED state as its own outcome rather
 * than a bug: if the profile unsubscribed in the brief window between the
 * initial lookup and this confirmation (vanishingly rare, but possible),
 * this must still never be reported as a subscribe success.
 */
async function confirmEmailMarketingSubscribed(
  email: string,
  config: KlaviyoConfig,
): Promise<
  | { status: "confirmed"; profileId: string }
  | { status: "unsubscribed" }
  | { status: "timeout" }
  | { status: "error"; reason: string }
> {
  for (let attempt = 0; attempt <= EMAIL_CONFIRM_RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await sleep(EMAIL_CONFIRM_RETRY_DELAYS_MS[attempt - 1]);
    }
    const lookup = await findProfileByEmail(email, config);
    if (lookup.status === "error") return { status: "error", reason: lookup.reason };
    if (lookup.status === "found") {
      if (lookup.emailConsent === "SUBSCRIBED") return { status: "confirmed", profileId: lookup.id };
      if (lookup.emailConsent === "UNSUBSCRIBED") return { status: "unsubscribed" };
    }
    // "not_found" or found-but-still-NEVER_SUBSCRIBED/unknown: the write
    // hasn't committed yet (or isn't indexed for lookup yet) — keep polling.
  }
  return { status: "timeout" };
}

/**
 * Adds an already-consent-confirmed profile to the waitlist list. Never
 * called except after confirmEmailMarketingSubscribed() (or the
 * already-subscribed idempotent fast path below) reports SUBSCRIBED —
 * this is what makes the "Added to List" event only ever fire for a
 * profile the welcome flow's entry filter will actually match.
 */
async function addProfileToList(
  profileId: string,
  listId: string,
  config: KlaviyoConfig,
): Promise<{ status: "ok" } | { status: "error"; reason: string }> {
  try {
    const res = await fetch(`${KLAVIYO_API_ROOT}/lists/${listId}/relationships/profiles/`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify({ data: [{ type: "profile", id: profileId }] }),
    });
    if (!res.ok) {
      const text = await safeReadText(res);
      console.error(`[KlaviyoClient] Add-to-list failed: ${res.status} ${res.statusText}`, text);
      return { status: "error", reason: `list_add_failed_${res.status}` };
    }
    return { status: "ok" };
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error adding profile to list:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
}

/**
 * Resolves the full email-channel outcome for one submission: consent
 * request → confirm it committed → only then add to the list. See this
 * file's doc comment for why these three steps must run in this order and
 * cannot be collapsed back into one call.
 *
 * Idempotent: a submission for a profile that's already confirmed
 * SUBSCRIBED (e.g. a duplicate/resubmitted signup) skips straight to
 * ensuring list membership — no redundant consent request, no needless
 * wait. A submission for a profile already UNSUBSCRIBED never requests
 * consent or touches the list at all, preserving the existing
 * never-silently-resubscribe guarantee this file has always had.
 */
async function resolveEmailEnrollment(
  input: WaitlistSyncInput,
  lookup:
    | { status: "found"; id: string; emailConsent: ChannelConsentStatus; smsConsent: ChannelConsentStatus }
    | { status: "not_found" },
  config: KlaviyoConfig,
): Promise<ChannelAction> {
  if (!input.emailConsent) return "not_requested";

  if (lookup.status === "found" && lookup.emailConsent === "UNSUBSCRIBED") {
    return "skipped_previously_unsubscribed";
  }

  if (lookup.status === "found" && lookup.emailConsent === "SUBSCRIBED") {
    if (!config.listId) return "subscribed";
    const listResult = await addProfileToList(lookup.id, config.listId, config);
    return listResult.status === "ok" ? "subscribed" : "error";
  }

  const subscribeResult = await subscribeEmail(input, config);
  if (subscribeResult.status === "error") return "error";

  const confirm = await confirmEmailMarketingSubscribed(input.email, config);
  if (confirm.status === "error") return "error";
  if (confirm.status === "unsubscribed") return "skipped_previously_unsubscribed";
  if (confirm.status === "timeout") return "pending_confirmation";

  if (!config.listId) return "subscribed";
  const listResult = await addProfileToList(confirm.profileId, config.listId, config);
  return listResult.status === "ok" ? "subscribed" : "error";
}

async function trackWaitlistEvent(input: WaitlistSyncInput, config: KlaviyoConfig): Promise<boolean> {
  const body = {
    data: {
      type: "event",
      attributes: {
        properties: { product_interest: input.productInterest, source: input.sourceDetail },
        time: input.submittedAt,
        unique_id: `waitlist-${input.email}-${input.submittedAt}`,
        metric: { data: { type: "metric", attributes: { name: "Waitlist Signup" } } },
        profile: { data: { type: "profile", attributes: { email: input.email } } },
      },
    },
  };

  try {
    const res = await fetch(`${KLAVIYO_API_ROOT}/events/`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify(body),
    });
    if (!res.ok && res.status !== 202) {
      const text = await safeReadText(res);
      console.error(`[KlaviyoClient] Event tracking failed: ${res.status} ${res.statusText}`, text);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error tracking event:", err);
    return false;
  }
}

/**
 * Sync one supplement-waitlist submission to Klaviyo: upsert the profile's
 * attributes unconditionally, subscribe only the channel(s) the submission
 * actually consented to AND that aren't already UNSUBSCRIBED in Klaviyo,
 * and track a "Waitlist Signup" event for future flow/reporting use.
 *
 * Never throws. Always returns a status — the caller (the /api/lead route)
 * treats this as fire-and-forget relative to the Airtable write, which
 * remains the system of record and the sole determinant of whether the
 * HTTP response to the browser reports success.
 */
export async function syncWaitlistSubscriber(input: WaitlistSyncInput): Promise<WaitlistSyncResult> {
  const config = getConfig();
  if (!config) {
    console.log("[KlaviyoClient] Klaviyo not configured. Skipping sync for:", input.email);
    return { status: "unavailable", reason: "not_configured" };
  }

  try {
    const lookup = await findProfileByEmail(input.email, config);
    if (lookup.status === "error") {
      return { status: "error", reason: lookup.reason };
    }

    const existingId = lookup.status === "found" ? lookup.id : undefined;
    const klaviyoPhone = normalizeToE164(input.phone);

    // SMS consent alone is never enough to subscribe — a visitor who
    // checked the box but typed a number that doesn't parse as valid
    // must not be SMS-subscribed off whatever Klaviyo would otherwise do
    // with a malformed phone_number. This check runs before the
    // previously-unsubscribed check so an invalid number is reported as
    // exactly that, not misattributed to a prior unsubscribe.
    const smsAction: ChannelAction = !input.smsConsent
      ? "not_requested"
      : !klaviyoPhone
        ? "skipped_invalid_phone"
        : lookup.status === "found" && lookup.smsConsent === "UNSUBSCRIBED"
          ? "skipped_previously_unsubscribed"
          : "subscribed";

    // Attributes are awaited FIRST, ahead of email consent — deliberately
    // not run concurrently with it. product_interest is written here, and
    // the planned Essentials Waitlist Welcome v2 flow's entry filter checks
    // that same property against the "Subscribed to Email Marketing"
    // metric event resolveEmailEnrollment triggers below. This call is a
    // plain synchronous profile write (not an async bulk job), so by the
    // time it returns ok, product_interest has already committed — long
    // before the much slower consent-commit step even starts. Awaiting it
    // first also means a failed attribute upsert now skips the subscribe
    // calls entirely, rather than firing them and discarding the result.
    const attributesResult = await upsertProfileAttributes(input, klaviyoPhone, existingId, config);

    // The profile itself failing to upsert is the one case that means
    // nothing was synced at all — everything else (a single channel's
    // subscribe call failing) is reported per-channel below instead of
    // forcing the whole result to "error", so one channel's failure can
    // never mask or block the other's success.
    if (attributesResult.status === "error") {
      return { status: "error", reason: attributesResult.reason };
    }

    // These three run concurrently — none needs another's result (every
    // call identifies the profile by email, not by the Klaviyo-internal id
    // the attribute upsert returned above). This matters specifically on
    // Vercel: this project has no `after()`/background-execution API
    // enabled (see next.config.mjs), so every one of these sits in the
    // critical path of the HTTP response the visitor is waiting on, stacked
    // on top of the Airtable and CRM-webhook calls this same request
    // already made.
    //
    // resolveEmailEnrollment is itself internally sequential (consent →
    // confirm → list-add, see its own doc comment and this file's
    // top-of-file comment on the 2026-10-17 race) and bounded to a few
    // seconds worst case — it does not block SMS, which is why it's one
    // branch of this same Promise.all rather than something awaited
    // beforehand.
    const [emailAction, smsSubscribeResult, eventTracked] = await Promise.all([
      resolveEmailEnrollment(input, lookup, config),
      smsAction === "subscribed"
        ? subscribeSms(input, klaviyoPhone as string, config)
        : Promise.resolve<{ status: "ok" }>({ status: "ok" }),
      trackWaitlistEvent(input, config),
    ]);

    const finalSmsAction: ChannelAction =
      smsAction === "subscribed" && smsSubscribeResult.status === "error" ? "error" : smsAction;

    return {
      status: "synced",
      profileId: attributesResult.id,
      emailAction,
      smsAction: finalSmsAction,
      eventTracked,
    };
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error during waitlist sync:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
}
