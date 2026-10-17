import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeToE164, syncWaitlistSubscriber } from "@/lib/klaviyoClient";

// All Klaviyo calls go through global fetch, mocked here — these tests
// never touch the real Klaviyo API. They verify this module's OWN
// consent-safety logic (never resubscribe an UNSUBSCRIBED channel, never
// create a duplicate profile for an existing email), channel independence
// (one channel's Subscribe Profiles failure never blocks or masks the
// other), and — since the 2026-10-17 incident — the consent-confirm-before-
// list-add sequencing for the email channel (see klaviyoClient.ts's own
// doc comment for the full root-cause writeup), not Klaviyo's API behavior
// itself.

const originalEnv = { ...process.env };

function setConfigured() {
  process.env.KLAVIYO_PRIVATE_API_KEY = "fake-test-key";
  process.env.KLAVIYO_LIST_ID = "LIST123";
}

function clearConfig() {
  delete process.env.KLAVIYO_PRIVATE_API_KEY;
  delete process.env.KLAVIYO_LIST_ID;
}

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Error",
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

function subscribeJobBody(init: RequestInit | undefined) {
  return JSON.parse(init!.body as string).data.attributes.profiles.data[0].attributes as {
    email: string;
    phone_number?: string;
    subscriptions: Record<string, unknown>;
  };
}

// A profile-lookup response for a given consent pair, matching the shape
// findProfileByEmail expects back from GET /profiles/?filter=...
function profileLookupBody(
  id: string,
  emailConsent: string,
  smsConsent = "NEVER_SUBSCRIBED",
) {
  return {
    data: [
      {
        id,
        attributes: {
          subscriptions: {
            email: { marketing: { consent: emailConsent } },
            sms: { marketing: { consent: smsConsent } },
          },
        },
      },
    ],
  };
}

const NOT_FOUND = { data: [] };

// Returns a stateful resolver: the Nth call (0-indexed) to the profile
// lookup URL returns responses[min(N, responses.length - 1)]. Used to
// simulate the profile's consent state changing across the sequence of
// lookups this module now makes (one before subscribing, then one or more
// inside the bounded confirm-retry loop).
function sequencedLookup(responses: unknown[]) {
  let call = 0;
  return () => {
    const body = responses[Math.min(call, responses.length - 1)];
    call += 1;
    return jsonResponse(body);
  };
}

const baseInput = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "+15125551234",
  emailConsent: true,
  smsConsent: true,
  productInterest: "GetAgeFit Essentials (ageLIFT + ageFUEL)",
  sourceDetail: "GetAgeFit Essentials Waitlist",
  submittedAt: "2026-10-13T00:00:00.000Z",
  // Closed-set Airtable result status for this same submission — see
  // WaitlistSyncInput.airtableStatus in klaviyoClient.ts.
  airtableStatus: "created",
};

describe("syncWaitlistSubscriber", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns unavailable (and never calls fetch) when Klaviyo is not configured", async () => {
    clearConfig();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toEqual({ status: "unavailable", reason: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("creates a new profile, confirms email consent, adds it to the list, subscribes SMS via its own call, and tracks the event", async () => {
    setConfigured();
    let createBody: Record<string, unknown> | undefined;
    let listAddBody: unknown;
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    // First lookup (before subscribing): not found. Every lookup after
    // that (inside the confirm-retry loop) finds the profile already
    // SUBSCRIBED — confirms on the very first retry attempt, so this test
    // needs no fake timers.
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_new", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        createBody = JSON.parse(init.body as string);
        return jsonResponse({ data: { id: "prof_new" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/") && init?.method === "POST") {
        listAddBody = JSON.parse(init.body as string);
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) {
        return jsonResponse({}, true, 202);
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toEqual({
      status: "synced",
      profileId: "prof_new",
      emailAction: "subscribed",
      smsAction: "subscribed",
      eventTracked: true,
    });
    expect(createBody?.data).toMatchObject({
      type: "profile",
      attributes: expect.objectContaining({
        email: "jane@example.com",
        properties: {
          product_interest: baseInput.productInterest,
          waitlist_source: baseInput.sourceDetail,
          airtable_sync_status: "created",
        },
      }),
    });

    // Two SEPARATE Subscribe Profiles calls, not one bundled call.
    expect(subscribeBodies).toHaveLength(2);
    const emailCall = subscribeBodies.find((b) => "email" in b.subscriptions);
    const smsCall = subscribeBodies.find((b) => "sms" in b.subscriptions);
    expect((emailCall?.subscriptions as any).email.marketing.consent).toBe("SUBSCRIBED");
    expect(emailCall).not.toHaveProperty("phone_number");
    expect((smsCall?.subscriptions as any).sms.marketing.consent).toBe("SUBSCRIBED");
    expect(smsCall?.phone_number).toBe("+15125551234");

    // The list-add only ever happens AFTER consent is confirmed, as its
    // own separate call — never bundled into the subscribe job.
    expect(listAddBody).toEqual({ data: [{ type: "profile", id: "prof_new" }] });
  });

  it("updates the existing profile's attributes in place rather than creating a duplicate (repeat/duplicate submission), and still confirms + adds to list", async () => {
    setConfigured();
    let patchedId: string | undefined;
    let listAddCalled = false;
    const lookup = sequencedLookup([
      profileLookupBody("prof_existing", "NEVER_SUBSCRIBED"),
      profileLookupBody("prof_existing", "SUBSCRIBED"),
    ]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.includes("/profiles/prof_existing/") && init?.method === "PATCH") {
        patchedId = "prof_existing";
        return jsonResponse({ data: { id: "prof_existing" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        listAddCalled = true;
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) {
        return jsonResponse({}, true, 202);
      }
      throw new Error(`Unexpected fetch call: ${url} ${init?.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(patchedId).toBe("prof_existing");
    expect(result).toMatchObject({
      status: "synced",
      profileId: "prof_existing",
      emailAction: "subscribed",
    });
    expect(listAddCalled).toBe(true);
    // No POST to /profiles/ (create) should have happened.
    const createCalls = fetchMock.mock.calls.filter(
      ([url, init]: [string, RequestInit?]) =>
        url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST",
    );
    expect(createCalls).toHaveLength(0);
  });

  it("never resubscribes a profile already UNSUBSCRIBED on email, even though this submission consented to email — and never attempts to add it to the list", async () => {
    setConfigured();
    let subscribeCalled = false;
    let listAddCalled = false;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse(profileLookupBody("prof_unsub", "UNSUBSCRIBED"));
      }
      if (url.includes("/profiles/prof_unsub/")) {
        return jsonResponse({ data: { id: "prof_unsub" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeCalled = true;
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        listAddCalled = true;
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) {
        return jsonResponse({}, true, 202);
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    // This submission has smsConsent: false, so only email is in play —
    // isolates the email-channel skip behavior cleanly.
    const result = await syncWaitlistSubscriber({ ...baseInput, smsConsent: false });

    expect(result).toMatchObject({
      status: "synced",
      emailAction: "skipped_previously_unsubscribed",
      smsAction: "not_requested",
    });
    expect(subscribeCalled).toBe(false);
    expect(listAddCalled).toBe(false);
  });

  it("subscribes the channel the submission asked about that is still NEVER_SUBSCRIBED, while skipping the one that's UNSUBSCRIBED", async () => {
    setConfigured();
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse(profileLookupBody("prof_mixed", "UNSUBSCRIBED", "NEVER_SUBSCRIBED"));
      }
      if (url.includes("/profiles/prof_mixed/")) {
        return jsonResponse({ data: { id: "prof_mixed" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/events/")) {
        return jsonResponse({}, true, 202);
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput); // smsConsent: true

    expect(result).toMatchObject({
      emailAction: "skipped_previously_unsubscribed",
      smsAction: "subscribed",
    });
    // Only the SMS call happens — email is skipped entirely, never even attempted.
    expect(subscribeBodies).toHaveLength(1);
    expect(subscribeBodies[0].subscriptions).toEqual({ sms: { marketing: { consent: "SUBSCRIBED" } } });
  });

  it("returns an error status (never throws) when the profile lookup fails", async () => {
    setConfigured();
    const fetchMock = vi.fn(async () => jsonResponse({ error: "unauthorized" }, false, 401));
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toEqual({ status: "error", reason: "lookup_failed_401" });
  });

  it("reports a channel-level error (not an overall sync failure) when only the SMS subscribe call fails", async () => {
    setConfigured();
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_new", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) {
        return jsonResponse({ data: { id: "prof_new" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        const body = subscribeJobBody(init);
        if ("sms" in body.subscriptions) {
          return jsonResponse({ error: "forbidden" }, false, 403);
        }
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toMatchObject({
      status: "synced",
      emailAction: "subscribed",
      smsAction: "error",
    });
  });
});

describe("normalizeToE164", () => {
  it("converts a US number typed with common formatting into E.164", () => {
    expect(normalizeToE164("(512) 555-1234")).toBe("+15125551234");
    expect(normalizeToE164("512-555-1234")).toBe("+15125551234");
    expect(normalizeToE164("512.555.1234")).toBe("+15125551234");
  });

  it("leaves an already-E.164 US number unchanged", () => {
    expect(normalizeToE164("+15125551234")).toBe("+15125551234");
  });

  it("parses a non-US number that includes its own explicit country code", () => {
    // UK number, explicit +44 — never assumed, only ever trusted because
    // the input itself specifies the country code.
    expect(normalizeToE164("+442071838750")).toBe("+442071838750");
  });

  it("does not guess a country code for an ambiguous international-shaped number with no +", () => {
    // Looks like a UK local number, but with no country code present this
    // is only ever parsed against the US default — which correctly fails
    // rather than silently guessing at a different region.
    expect(normalizeToE164("020 7183 8750")).toBeNull();
  });

  it("returns null for a string that is not a valid phone number at all", () => {
    expect(normalizeToE164("call-me-maybe")).toBeNull();
    expect(normalizeToE164("12345")).toBeNull();
  });

  it("returns null for a missing phone number", () => {
    expect(normalizeToE164(undefined)).toBeNull();
    expect(normalizeToE164("")).toBeNull();
  });
});

describe("syncWaitlistSubscriber — phone handling and consent independence", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("email-only submission (no phone, no SMS consent) never touches phone_number and still subscribes + adds to list", async () => {
    setConfigured();
    let attributesSent: Record<string, unknown> | undefined;
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_email_only", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        attributesSent = JSON.parse(init.body as string).data.attributes;
        return jsonResponse({ data: { id: "prof_email_only" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { phone, smsConsent, ...emailOnlyInput } = baseInput;
    const result = await syncWaitlistSubscriber({ ...emailOnlyInput, smsConsent: false });

    expect(result).toMatchObject({ emailAction: "subscribed", smsAction: "not_requested" });
    expect(attributesSent).not.toHaveProperty("phone_number");
    expect(subscribeBodies).toHaveLength(1);
    expect(subscribeBodies[0]).not.toHaveProperty("phone_number");
    expect(subscribeBodies[0].subscriptions).toEqual({ email: { marketing: { consent: "SUBSCRIBED" } } });
  });

  it("SMS-consented submission with a valid phone sends the normalized E.164 value to the SMS call, never the email call", async () => {
    setConfigured();
    let attributesPhone: unknown;
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_sms", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        attributesPhone = JSON.parse(init.body as string).data.attributes.phone_number;
        return jsonResponse({ data: { id: "prof_sms" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber({ ...baseInput, phone: "(512) 555-1234" });

    expect(result).toMatchObject({ smsAction: "subscribed" });
    expect(attributesPhone).toBe("+15125551234");
    const smsCall = subscribeBodies.find((b) => "sms" in b.subscriptions);
    expect(smsCall?.phone_number).toBe("+15125551234");
    // The email call must never carry phone_number — only the SMS call does.
    const emailCall = subscribeBodies.find((b) => "email" in b.subscriptions);
    expect(emailCall).not.toHaveProperty("phone_number");
  });

  it("SMS consent with an invalid phone number skips SMS subscription but still allows the email signup to succeed", async () => {
    setConfigured();
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    let attributesSent: Record<string, unknown> | undefined;
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_bad_phone", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        attributesSent = JSON.parse(init.body as string).data.attributes;
        return jsonResponse({ data: { id: "prof_bad_phone" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber({ ...baseInput, phone: "12345" });

    expect(result).toMatchObject({ status: "synced", emailAction: "subscribed", smsAction: "skipped_invalid_phone" });
    expect(attributesSent).not.toHaveProperty("phone_number");
    // Only the email call happens — SMS is never attempted for an invalid phone.
    expect(subscribeBodies).toHaveLength(1);
    expect(subscribeBodies[0].subscriptions).not.toHaveProperty("sms");
  });

  it("SMS consent with a missing phone number is treated the same as an invalid one, not a crash", async () => {
    setConfigured();
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_no_phone", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_no_phone" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { phone, ...noPhoneInput } = baseInput;
    const result = await syncWaitlistSubscriber({ ...noPhoneInput, smsConsent: true });

    expect(result).toMatchObject({ smsAction: "skipped_invalid_phone" });
  });

  it("an international number with its own country code can still be SMS-subscribed", async () => {
    setConfigured();
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_intl", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") return jsonResponse({ data: { id: "prof_intl" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber({ ...baseInput, phone: "+442071838750" });

    expect(result).toMatchObject({ smsAction: "subscribed" });
    const smsCall = subscribeBodies.find((b) => "sms" in b.subscriptions);
    expect(smsCall?.phone_number).toBe("+442071838750");
  });
});

describe("syncWaitlistSubscriber — durable Airtable reconciliation marker", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("writes the caller-supplied airtableStatus onto the Klaviyo profile's properties verbatim", async () => {
    setConfigured();
    let propertiesSent: Record<string, unknown> | undefined;
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_reconcile", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        propertiesSent = JSON.parse(init.body as string).data.attributes.properties;
        return jsonResponse({ data: { id: "prof_reconcile" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    await syncWaitlistSubscriber({ ...baseInput, airtableStatus: "skipped_duplicate" });

    expect(propertiesSent).toMatchObject({ airtable_sync_status: "skipped_duplicate" });
  });
});

describe("syncWaitlistSubscriber — concurrent operations fail independently", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("a failed (best-effort) event-tracking call does not fail the overall sync or block the subscribe result", async () => {
    setConfigured();
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_event_fails", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_event_fails" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({ error: "server_error" }, false, 500);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toMatchObject({
      status: "synced",
      emailAction: "subscribed",
      smsAction: "subscribed",
      eventTracked: false,
    });
  });

  it("the profile attribute upsert still succeeds, and the overall sync still reports 'synced', even when BOTH subscribe calls fail", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse(NOT_FOUND);
      if (url.endsWith("/profiles/")) return jsonResponse({ data: { id: "prof_subscribe_fails" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        return jsonResponse({ error: "server_error" }, false, 500);
      }
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    // Channel subscribe failures are no longer treated as a whole-sync
    // failure — the profile itself still synced, each channel independently
    // reports its own "error". The email subscribe call itself failing
    // means confirmEmailMarketingSubscribed/addProfileToList are never
    // reached at all.
    expect(result).toMatchObject({
      status: "synced",
      profileId: "prof_subscribe_fails",
      emailAction: "error",
      smsAction: "error",
    });
  });

  it("a failed SMS subscribe call does not prevent the email subscribe call from succeeding, or vice versa", async () => {
    setConfigured();
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_mixed_result", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_mixed_result" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        const body = subscribeJobBody(init);
        // Simulate the real-world failure mode the two-call split
        // addresses: Klaviyo rejects the SMS channel (e.g. unsupported
        // region for the account's SMS configuration) while the email
        // channel succeeds.
        if ("sms" in body.subscriptions) {
          return jsonResponse(
            { errors: [{ detail: "Phone number is valid but is not in a supported region for this account." }] },
            false,
            400,
          );
        }
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toMatchObject({
      status: "synced",
      emailAction: "subscribed",
      smsAction: "error",
    });
  });
});

describe("syncWaitlistSubscriber — consent-confirm-before-list-add sequencing (2026-10-17 fix)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env = { ...originalEnv };
  });

  it("the email Subscribe Profiles call never bundles the list relationship — list membership is always a separate call", async () => {
    setConfigured();
    let subscribeJobRelationships: unknown;
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_split", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_split" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        const parsed = JSON.parse(init!.body as string);
        if ("email" in parsed.data.attributes.profiles.data[0].attributes.subscriptions) {
          subscribeJobRelationships = parsed.data.relationships;
        }
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber({ ...baseInput, smsConsent: false });
    await vi.advanceTimersByTimeAsync(10_000);
    await resultPromise;

    expect(subscribeJobRelationships).toBeUndefined();
  });

  it("writes and confirms product_interest on the profile BEFORE the email consent request is ever issued (Essentials Waitlist Welcome v2 entry-filter race fix)", async () => {
    setConfigured();
    const callOrder: string[] = [];
    let attributesPropertiesSent: Record<string, unknown> | undefined;
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_order", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        callOrder.push("attributes_upsert");
        attributesPropertiesSent = JSON.parse(init.body as string).data.attributes.properties;
        return jsonResponse({ data: { id: "prof_order" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        const body = subscribeJobBody(init);
        if ("email" in body.subscriptions) callOrder.push("email_consent_request");
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) return jsonResponse({}, true, 204);
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber({ ...baseInput, smsConsent: false });
    await vi.advanceTimersByTimeAsync(10_000);
    const result = await resultPromise;

    expect(result).toMatchObject({ emailAction: "subscribed" });
    // The attribute upsert (which writes product_interest) must be fully
    // awaited and confirmed ok BEFORE the email consent request starts —
    // never run concurrently with it.
    expect(callOrder).toEqual(["attributes_upsert", "email_consent_request"]);
    expect(attributesPropertiesSent).toMatchObject({ product_interest: baseInput.productInterest });
  });

  it("never issues the email consent request at all if the attribute upsert (product_interest write) itself fails", async () => {
    setConfigured();
    let subscribeJobCalled = false;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse(NOT_FOUND);
      if (url.endsWith("/profiles/") && !url.includes("/relationships/") && init?.method === "POST") {
        return jsonResponse({ error: "server_error" }, false, 500);
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeJobCalled = true;
        return jsonResponse({}, true, 202);
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toEqual({ status: "error", reason: "create_failed_500" });
    expect(subscribeJobCalled).toBe(false);
  });

  it("waits out a genuinely asynchronous consent commit — confirms after a couple of bounded retries, then adds to the list", async () => {
    setConfigured();
    let listAddCalled = false;
    let lookupCallCount = 0;
    // Not found, then NEVER_SUBSCRIBED twice (still committing), then
    // finally SUBSCRIBED on the 3rd confirm attempt — well within the
    // bounded retry schedule.
    const lookup = sequencedLookup([
      NOT_FOUND,
      profileLookupBody("prof_delayed", "NEVER_SUBSCRIBED"),
      profileLookupBody("prof_delayed", "NEVER_SUBSCRIBED"),
      profileLookupBody("prof_delayed", "SUBSCRIBED"),
    ]);
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) {
        lookupCallCount += 1;
        return lookup();
      }
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_delayed" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        listAddCalled = true;
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber(baseInput);
    await vi.advanceTimersByTimeAsync(10_000);
    const result = await resultPromise;

    expect(result).toMatchObject({ emailAction: "subscribed" });
    expect(listAddCalled).toBe(true);
    // Initial lookup + 3 confirm-loop lookups (immediate, then after two
    // delays) before confirming — never more than the bounded schedule
    // allows (initial + up to 5 confirm attempts = 6 max).
    expect(lookupCallCount).toBeGreaterThanOrEqual(4);
    expect(lookupCallCount).toBeLessThanOrEqual(6);
  });

  it("never claims enrollment and never adds the profile to the list if consent does not confirm within the bounded window (honest 'pending_confirmation', not a false success)", async () => {
    setConfigured();
    let listAddCalled = false;
    const fetchMock = vi.fn(async (url: string) => {
      // Consent never actually commits within the window this test gives it.
      if (url.includes("/profiles/?filter=")) return jsonResponse(NOT_FOUND);
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_slow" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        listAddCalled = true;
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber(baseInput);
    await vi.advanceTimersByTimeAsync(10_000);
    const result = await resultPromise;

    expect(result).toMatchObject({ status: "synced", emailAction: "pending_confirmation" });
    expect(listAddCalled).toBe(false);
  });

  it("is idempotent: a profile already confirmed SUBSCRIBED (duplicate/resubmitted signup) skips re-requesting consent entirely and goes straight to ensuring list membership", async () => {
    setConfigured();
    let subscribeJobCalled = false;
    let listAddCalled = false;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse(profileLookupBody("prof_already", "SUBSCRIBED"));
      }
      if (url.includes("/profiles/prof_already/")) return jsonResponse({ data: { id: "prof_already" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        if ("email" in subscribeJobBody(init).subscriptions) subscribeJobCalled = true;
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        listAddCalled = true;
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber(baseInput);
    await vi.advanceTimersByTimeAsync(1000);
    const result = await resultPromise;

    expect(result).toMatchObject({ emailAction: "subscribed" });
    expect(subscribeJobCalled).toBe(false);
    expect(listAddCalled).toBe(true);
  });

  it("honors a previously-unsubscribed profile even if it unsubscribes in the narrow window between the initial lookup and the confirm check — never resubscribes, never adds to list", async () => {
    setConfigured();
    let listAddCalled = false;
    // Initial lookup (before subscribing) shows NEVER_SUBSCRIBED, so this
    // submission proceeds to request consent — but by the time the
    // confirm check runs, the profile has become UNSUBSCRIBED (e.g. they
    // clicked an unsubscribe link in an unrelated email in the interim).
    const lookup = sequencedLookup([
      profileLookupBody("prof_race", "NEVER_SUBSCRIBED"),
      profileLookupBody("prof_race", "UNSUBSCRIBED"),
    ]);
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.includes("/profiles/prof_race/")) return jsonResponse({ data: { id: "prof_race" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        listAddCalled = true;
        return jsonResponse({}, true, 204);
      }
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber(baseInput);
    await vi.advanceTimersByTimeAsync(10_000);
    const result = await resultPromise;

    expect(result).toMatchObject({ emailAction: "skipped_previously_unsubscribed" });
    expect(listAddCalled).toBe(false);
  });

  it("reports a channel-level error, not a false success, when consent confirms but the separate list-add call itself fails", async () => {
    setConfigured();
    const lookup = sequencedLookup([NOT_FOUND, profileLookupBody("prof_list_fail", "SUBSCRIBED")]);
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return lookup();
      if (url.endsWith("/profiles/") && !url.includes("/relationships/")) return jsonResponse({ data: { id: "prof_list_fail" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
      if (url.endsWith("/lists/LIST123/relationships/profiles/")) {
        return jsonResponse({ error: "server_error" }, false, 500);
      }
      if (url.endsWith("/events/")) return jsonResponse({}, true, 202);
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const resultPromise = syncWaitlistSubscriber(baseInput);
    await vi.advanceTimersByTimeAsync(10_000);
    const result = await resultPromise;

    expect(result).toMatchObject({ status: "synced", emailAction: "error" });
  });
});
