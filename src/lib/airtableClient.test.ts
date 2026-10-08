import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { upsertGenericLead } from "@/lib/airtableClient";

// upsertGenericLead talks directly to api.airtable.com via global fetch —
// mocked here so these tests never touch a real Airtable base, per the
// "mock external services, no real Airtable records" requirement.
const originalEnv = { ...process.env };

function setConfigured() {
  process.env.AIRTABLE_BASE_ID = "base123";
  process.env.AIRTABLE_LEADS_TABLE_ID = "tbl123";
  process.env.AIRTABLE_ACCESS_TOKEN = "fake-token-for-tests";
}

function clearConfig() {
  delete process.env.AIRTABLE_BASE_ID;
  delete process.env.AIRTABLE_LEADS_TABLE_ID;
  delete process.env.AIRTABLE_ACCESS_TOKEN;
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
  email: "Jane.Doe@Example.com",
  source: "supp waitlist",
  sourceDetail: "GetAgeFit Essentials Waitlist",
  submittedAt: "2026-01-01T00:00:00.000Z",
};

describe("upsertGenericLead", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("creates a new lead when no existing record matches the email", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        // GET lookup
        return jsonResponse({ records: [] });
      }
      if (init.method === "POST") {
        return jsonResponse({ id: "recNEW" });
      }
      throw new Error(`Unexpected fetch call: ${init.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result).toEqual({ status: "created", recordId: "recNEW" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("updates the existing record when exactly one match is found", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({
          records: [{ id: "recEXISTING", fields: { Notes: "old note" } }],
        });
      }
      if (init.method === "PATCH") {
        return jsonResponse({ id: "recEXISTING" });
      }
      throw new Error(`Unexpected fetch call: ${init.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result).toEqual({ status: "updated", recordId: "recEXISTING" });
  });

  it("returns an error status (never throws) when the Airtable write fails", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({ records: [] });
      }
      if (init.method === "POST") {
        return jsonResponse({ error: "INVALID_REQUEST" }, false, 422);
      }
      throw new Error(`Unexpected fetch call: ${init.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result.status).toBe("error");
    expect((result as { reason: string }).reason).toBe("create_failed_422");
  });

  it("returns unavailable (and never calls fetch) when Airtable is not configured", async () => {
    clearConfig();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result).toEqual({ status: "unavailable", reason: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips the write and reports skipped_duplicate when multiple records match the email", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({
          records: [
            { id: "recA", fields: {} },
            { id: "recB", fields: {} },
          ],
        });
      }
      throw new Error("Should not attempt a create/update on a duplicate collision");
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result).toEqual({
      status: "skipped_duplicate",
      matchedRecordIds: ["recA", "recB"],
    });
    // Only the lookup call — no create/update was attempted.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("never writes a consent field that this submission didn't ask about", async () => {
    setConfigured();
    let patchBody: Record<string, unknown> | undefined;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({
          records: [{ id: "recEXISTING", fields: { "Email Consent": true, "SMS Consent": true } }],
        });
      }
      if (init.method === "PATCH") {
        patchBody = JSON.parse(init.body as string).fields;
        return jsonResponse({ id: "recEXISTING" });
      }
      throw new Error(`Unexpected fetch call: ${init.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    // Simulates a Contact-form submission (never asks about consent at all).
    await upsertGenericLead({
      ...baseInput,
      source: "contact form",
      sourceDetail: "Contact Form",
      emailConsent: undefined,
      smsConsent: undefined,
      productInterest: undefined,
    });

    expect(patchBody).toBeDefined();
    expect(patchBody).not.toHaveProperty("Email Consent");
    expect(patchBody).not.toHaveProperty("SMS Consent");
    expect(patchBody).not.toHaveProperty("Product Interest");
  });
});
