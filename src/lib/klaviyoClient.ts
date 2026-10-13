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
 */

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
};

type ChannelConsentStatus = "SUBSCRIBED" | "UNSUBSCRIBED" | "NEVER_SUBSCRIBED" | "unknown";

type ChannelAction = "subscribed" | "unchanged" | "skipped_previously_unsubscribed" | "not_requested";

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
  existingId: string | undefined,
  config: KlaviyoConfig,
): Promise<{ status: "ok"; id: string } | { status: "error"; reason: string }> {
  const fullName = `${input.firstName ?? ""} ${input.lastName ?? ""}`.trim();
  const attributes: Record<string, unknown> = {
    email: input.email,
    ...(input.phone ? { phone_number: input.phone } : {}),
    ...(input.firstName ? { first_name: input.firstName } : {}),
    ...(input.lastName ? { last_name: input.lastName } : {}),
    properties: {
      product_interest: input.productInterest,
      waitlist_source: input.sourceDetail,
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

async function subscribeChannels(
  input: WaitlistSyncInput,
  channels: { email: boolean; sms: boolean },
  config: KlaviyoConfig,
): Promise<{ status: "ok" } | { status: "error"; reason: string }> {
  const subscriptions: Record<string, unknown> = {};
  if (channels.email) subscriptions.email = { marketing: { consent: "SUBSCRIBED" } };
  if (channels.sms) subscriptions.sms = { marketing: { consent: "SUBSCRIBED" } };

  const profile: Record<string, unknown> = {
    type: "profile",
    attributes: { email: input.email, ...(input.phone ? { phone_number: input.phone } : {}), subscriptions },
  };

  const body: Record<string, unknown> = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: { profiles: { data: [profile] } },
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
      console.error(`[KlaviyoClient] Subscribe Profiles failed: ${res.status} ${res.statusText}`, text);
      return { status: "error", reason: `subscribe_failed_${res.status}` };
    }
    return { status: "ok" };
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error during subscribe call:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
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

    const emailAction: ChannelAction = !input.emailConsent
      ? "not_requested"
      : lookup.status === "found" && lookup.emailConsent === "UNSUBSCRIBED"
        ? "skipped_previously_unsubscribed"
        : "subscribed";
    const smsAction: ChannelAction = !input.smsConsent
      ? "not_requested"
      : lookup.status === "found" && lookup.smsConsent === "UNSUBSCRIBED"
        ? "skipped_previously_unsubscribed"
        : "subscribed";

    // These three calls are mutually independent (none needs another's
    // result — Subscribe Profiles and the event call identify the profile
    // by email, not by the Klaviyo-internal id the attribute upsert
    // returns), so they run concurrently rather than as four sequential
    // round trips. This matters specifically on Vercel: this project has
    // no `after()`/background-execution API enabled (see next.config.mjs),
    // so every one of these calls sits in the critical path of the HTTP
    // response the visitor is waiting on, stacked on top of the Airtable
    // and CRM-webhook calls this same request also makes. Running them in
    // parallel is what keeps this comfortably inside a serverless
    // function's duration budget instead of relying on a generous timeout.
    const needsSubscribeCall = emailAction === "subscribed" || smsAction === "subscribed";
    const [attributesResult, subscribeResult, eventTracked] = await Promise.all([
      upsertProfileAttributes(input, existingId, config),
      needsSubscribeCall
        ? subscribeChannels(
            input,
            { email: emailAction === "subscribed", sms: smsAction === "subscribed" },
            config,
          )
        : Promise.resolve<{ status: "ok" }>({ status: "ok" }),
      trackWaitlistEvent(input, config),
    ]);

    if (attributesResult.status === "error") {
      return { status: "error", reason: attributesResult.reason };
    }
    if (subscribeResult.status === "error") {
      return { status: "error", reason: subscribeResult.reason };
    }

    return {
      status: "synced",
      profileId: attributesResult.id,
      emailAction,
      smsAction,
      eventTracked,
    };
  } catch (err) {
    console.error("[KlaviyoClient] Unexpected error during waitlist sync:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
}
