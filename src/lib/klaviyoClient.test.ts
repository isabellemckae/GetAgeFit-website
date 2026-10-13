import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeToE164, syncWaitlistSubscriber } from "@/lib/klaviyoClient";

// All Klaviyo calls go through global fetch, mocked here — these tests
// never touch the real Klaviyo API. They verify this module's OWN
// consent-safety logic (never resubscribe an UNSUBSCRIBED channel, never
// create a duplicate profile for an existing email) and channel
// independence (one channel's Subscribe Profiles failure never blocks or
// masks the other's), not Klaviyo's API behavior itself — see
// klaviyoClient.ts's own doc comment.

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

  it("creates a new profile, subscribes both channels via two separate calls, and tracks the event for a brand-new email", async () => {
    setConfigured();
    let createBody: Record<string, unknown> | undefined;
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse({ data: [] });
      }
      if (url.endsWith("/profiles/") && init?.method === "POST") {
        createBody = JSON.parse(init.body as string);
        return jsonResponse({ data: { id: "prof_new" } });
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
  });

  it("updates the existing profile in place rather than creating a duplicate (repeat/duplicate submission)", async () => {
    setConfigured();
    let patchedId: string | undefined;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse({
          data: [
            {
              id: "prof_existing",
              attributes: {
                subscriptions: {
                  email: { marketing: { consent: "NEVER_SUBSCRIBED" } },
                  sms: { marketing: { consent: "NEVER_SUBSCRIBED" } },
                },
              },
            },
          ],
        });
      }
      if (url.includes("/profiles/prof_existing/") && init?.method === "PATCH") {
        patchedId = "prof_existing";
        return jsonResponse({ data: { id: "prof_existing" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        return jsonResponse({}, true, 202);
      }
      if (url.endsWith("/events/")) {
        return jsonResponse({}, true, 202);
      }
      throw new Error(`Unexpected fetch call: ${url} ${init?.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(patchedId).toBe("prof_existing");
    expect(result).toMatchObject({ status: "synced", profileId: "prof_existing" });
    // No POST to /profiles/ (create) should have happened.
    const createCalls = fetchMock.mock.calls.filter(
      ([url, init]: [string, RequestInit?]) => url.endsWith("/profiles/") && init?.method === "POST",
    );
    expect(createCalls).toHaveLength(0);
  });

  it("never resubscribes a profile already UNSUBSCRIBED on email, even though this submission consented to email", async () => {
    setConfigured();
    let subscribeCalled = false;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse({
          data: [
            {
              id: "prof_unsub",
              attributes: {
                subscriptions: {
                  email: { marketing: { consent: "UNSUBSCRIBED" } },
                  sms: { marketing: { consent: "NEVER_SUBSCRIBED" } },
                },
              },
            },
          ],
        });
      }
      if (url.includes("/profiles/prof_unsub/")) {
        return jsonResponse({ data: { id: "prof_unsub" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeCalled = true;
        return jsonResponse({}, true, 202);
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
  });

  it("subscribes the channel the submission asked about that is still NEVER_SUBSCRIBED, while skipping the one that's UNSUBSCRIBED", async () => {
    setConfigured();
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse({
          data: [
            {
              id: "prof_mixed",
              attributes: {
                subscriptions: {
                  email: { marketing: { consent: "UNSUBSCRIBED" } },
                  sms: { marketing: { consent: "NEVER_SUBSCRIBED" } },
                },
              },
            },
          ],
        });
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
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/")) return jsonResponse({ data: { id: "prof_new" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        const body = subscribeJobBody(init);
        if ("sms" in body.subscriptions) {
          return jsonResponse({ error: "forbidden" }, false, 403);
        }
        return jsonResponse({}, true, 202);
      }
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

  it("email-only submission (no phone, no SMS consent) never touches phone_number and still subscribes email", async () => {
    setConfigured();
    let attributesSent: Record<string, unknown> | undefined;
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/") && init?.method === "POST") {
        attributesSent = JSON.parse(init.body as string).data.attributes;
        return jsonResponse({ data: { id: "prof_email_only" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
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

  it("SMS-consented submission with a valid phone sends the normalized E.164 value to both calls", async () => {
    setConfigured();
    let attributesPhone: unknown;
    const subscribeBodies: ReturnType<typeof subscribeJobBody>[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/") && init?.method === "POST") {
        attributesPhone = JSON.parse(init.body as string).data.attributes.phone_number;
        return jsonResponse({ data: { id: "prof_sms" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
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
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/") && init?.method === "POST") {
        attributesSent = JSON.parse(init.body as string).data.attributes;
        return jsonResponse({ data: { id: "prof_bad_phone" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
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
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/")) return jsonResponse({ data: { id: "prof_no_phone" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
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
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/") && init?.method === "POST") return jsonResponse({ data: { id: "prof_intl" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBodies.push(subscribeJobBody(init));
        return jsonResponse({}, true, 202);
      }
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
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/") && init?.method === "POST") {
        propertiesSent = JSON.parse(init.body as string).data.attributes.properties;
        return jsonResponse({ data: { id: "prof_reconcile" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
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
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/")) return jsonResponse({ data: { id: "prof_event_fails" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) return jsonResponse({}, true, 202);
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
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
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
    // reports its own "error".
    expect(result).toMatchObject({
      status: "synced",
      profileId: "prof_subscribe_fails",
      emailAction: "error",
      smsAction: "error",
    });
  });

  it("a failed SMS subscribe call does not prevent the email subscribe call from succeeding, or vice versa", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/")) return jsonResponse({ data: { id: "prof_mixed_result" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        const body = subscribeJobBody(init);
        // Simulate the real-world failure mode this fix addresses: Klaviyo
        // rejects the SMS channel (e.g. unsupported region for the
        // account's SMS configuration) while the email channel succeeds.
        if ("sms" in body.subscriptions) {
          return jsonResponse(
            { errors: [{ detail: "Phone number is valid but is not in a supported region for this account." }] },
            false,
            400,
          );
        }
        return jsonResponse({}, true, 202);
      }
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
