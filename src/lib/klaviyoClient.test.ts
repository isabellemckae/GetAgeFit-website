import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { syncWaitlistSubscriber } from "@/lib/klaviyoClient";

// All Klaviyo calls go through global fetch, mocked here — these tests
// never touch the real Klaviyo API. They verify this module's OWN
// consent-safety logic (never resubscribe an UNSUBSCRIBED channel, never
// create a duplicate profile for an existing email), not Klaviyo's API
// behavior itself, which has not been exercised against a real account —
// see klaviyoClient.ts's own doc comment.

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

  it("creates a new profile, subscribes both channels, and tracks the event for a brand-new email", async () => {
    setConfigured();
    let createBody: Record<string, unknown> | undefined;
    let subscribeBody: Record<string, unknown> | undefined;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/profiles/?filter=")) {
        return jsonResponse({ data: [] });
      }
      if (url.endsWith("/profiles/") && init?.method === "POST") {
        createBody = JSON.parse(init.body as string);
        return jsonResponse({ data: { id: "prof_new" } });
      }
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        subscribeBody = JSON.parse(init!.body as string);
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
        properties: { product_interest: baseInput.productInterest, waitlist_source: baseInput.sourceDetail },
      }),
    });
    const subscriptions = (subscribeBody?.data as any).attributes.profiles.data[0].attributes.subscriptions;
    expect(subscriptions.email.marketing.consent).toBe("SUBSCRIBED");
    expect(subscriptions.sms.marketing.consent).toBe("SUBSCRIBED");
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
    let subscriptionsSent: Record<string, unknown> | undefined;
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
        subscriptionsSent = JSON.parse(init!.body as string).data.attributes.profiles.data[0].attributes
          .subscriptions;
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
    expect(subscriptionsSent).toEqual({ sms: { marketing: { consent: "SUBSCRIBED" } } });
  });

  it("returns an error status (never throws) when the profile lookup fails", async () => {
    setConfigured();
    const fetchMock = vi.fn(async () => jsonResponse({ error: "unauthorized" }, false, 401));
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toEqual({ status: "error", reason: "lookup_failed_401" });
  });

  it("returns an error status when the Subscribe Profiles call fails, without throwing", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/?filter=")) return jsonResponse({ data: [] });
      if (url.endsWith("/profiles/")) return jsonResponse({ data: { id: "prof_new" } });
      if (url.endsWith("/profile-subscription-bulk-create-jobs/")) {
        return jsonResponse({ error: "forbidden" }, false, 403);
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncWaitlistSubscriber(baseInput);

    expect(result).toEqual({ status: "error", reason: "subscribe_failed_403" });
  });
});
