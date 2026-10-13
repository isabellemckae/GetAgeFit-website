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
): Promise<{ status: "ok" } | { status: "error"; reason: string }> {
  const body: Record<string, unknown> = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: { data: [{ type: "profile", attributes: profileAttributes }] },
      },
      ...(config.listId
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
  );
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

    const emailAction: ChannelAction = !input.emailConsent
      ? "not_requested"
      : lookup.status === "found" && lookup.emailConsent === "UNSUBSCRIBED"
        ? "skipped_previously_unsubscribed"
        : "subscribed";
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

    // These calls are mutually independent (none needs another's result —
    // every Subscribe Profiles call and the event call identify the
    // profile by email, not by the Klaviyo-internal id the attribute
    // upsert returns), so they run concurrently rather than as sequential
    // round trips. This matters specifically on Vercel: this project has
    // no `after()`/background-execution API enabled (see next.config.mjs),
    // so every one of these calls sits in the critical path of the HTTP
    // response the visitor is waiting on, stacked on top of the Airtable
    // and CRM-webhook calls this same request also makes. Running them in
    // parallel is what keeps this comfortably inside a serverless
    // function's duration budget instead of relying on a generous timeout.
    //
    // Email and SMS are two SEPARATE calls (subscribeEmail/subscribeSms)
    // so a Klaviyo-side failure in one (account config, region
    // restrictions, anything) can never prevent the other from succeeding
    // — see this file's doc comment.
    const [attributesResult, emailSubscribeResult, smsSubscribeResult, eventTracked] = await Promise.all([
      upsertProfileAttributes(input, klaviyoPhone, existingId, config),
      emailAction === "subscribed"
        ? subscribeEmail(input, config)
        : Promise.resolve<{ status: "ok" }>({ status: "ok" }),
      smsAction === "subscribed"
        ? subscribeSms(input, klaviyoPhone as string, config)
        : Promise.resolve<{ status: "ok" }>({ status: "ok" }),
      trackWaitlistEvent(input, config),
    ]);

    // The profile itself failing to upsert is the one case that means
    // nothing was synced at all — everything else (a single channel's
    // subscribe call failing) is reported per-channel below instead of
    // forcing the whole result to "error", so one channel's failure can
    // never mask or block the other's success.
    if (attributesResult.status === "error") {
      return { status: "error", reason: attributesResult.reason };
    }

    const finalEmailAction: ChannelAction =
      emailAction === "subscribed" && emailSubscribeResult.status === "error" ? "error" : emailAction;
    const finalSmsAction: ChannelAction =
      smsAction === "subscribed" && smsSubscribeResult.status === "error" ? "error" : smsAction;

    return {
      status: "synced",
      profileId: attributesResult.id,
      emailAction: finalEmailAction,
      smsAction: finalSmsAction,
      eventTracked,
    };
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error during waitlist sync:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
}
