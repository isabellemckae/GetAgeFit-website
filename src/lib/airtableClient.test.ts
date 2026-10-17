import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { upsertGenericLead, appendKlaviyoReconciliationNote } from "@/lib/airtableClient";

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

  it("never updates/merges the matched records on a duplicate collision, but creates a new, traceable review record", async () => {
    setConfigured();
    let createBody: Record<string, unknown> | undefined;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({
          records: [
            { id: "recA", fields: {} },
            { id: "recB", fields: {} },
          ],
        });
      }
      if (init.method === "POST") {
        createBody = JSON.parse(init.body as string).fields;
        return jsonResponse({ id: "recREVIEW" });
      }
      throw new Error("Should never PATCH (update/merge) a matched duplicate record");
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result).toEqual({
      status: "skipped_duplicate",
      matchedRecordIds: ["recA", "recB"],
      reviewRecordId: "recREVIEW",
    });
    // Lookup + one create — never a PATCH against recA/recB.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(createBody).toMatchObject({
      Email: "jane.doe@example.com",
      Source: "supp waitlist",
      "Source Detail": "GetAgeFit Essentials Waitlist",
      "Pipeline Stage": "New",
    });
    expect(createBody?.Notes).toContain("DUPLICATE REVIEW NEEDED");
    expect(createBody?.Notes).toContain("recA");
    expect(createBody?.Notes).toContain("recB");
  });

  it("still reports skipped_duplicate with no reviewRecordId if even the review-record creation fails", async () => {
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
      if (init.method === "POST") {
        return jsonResponse({ error: "INVALID_REQUEST" }, false, 422);
      }
      throw new Error("Should never PATCH (update/merge) a matched duplicate record");
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertGenericLead(baseInput);

    expect(result).toEqual({
      status: "skipped_duplicate",
      matchedRecordIds: ["recA", "recB"],
    });
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

describe("appendKlaviyoReconciliationNote", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("appends the note to the record's existing Notes rather than overwriting it", async () => {
    setConfigured();
    let patchedNotes: unknown;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({ fields: { Notes: "existing note" } });
      }
      if (init.method === "PATCH") {
        patchedNotes = JSON.parse(init.body as string).fields["Notes"];
        return jsonResponse({ id: "recEXISTING" });
      }
      throw new Error(`Unexpected fetch call: ${init.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await appendKlaviyoReconciliationNote("recEXISTING", "[2026-01-01] note text");

    expect(result).toEqual({ status: "ok" });
    expect(patchedNotes).toBe("existing note\n[2026-01-01] note text");
  });

  it("returns unavailable (and never calls fetch) when Airtable is not configured", async () => {
    clearConfig();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await appendKlaviyoReconciliationNote("recEXISTING", "note text");

    expect(result).toEqual({ status: "error", reason: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an error status (never throws) when the patch fails", async () => {
    setConfigured();
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return jsonResponse({ fields: {} });
      }
      if (init.method === "PATCH") {
        return jsonResponse({ error: "INVALID_REQUEST" }, false, 422);
      }
      throw new Error(`Unexpected fetch call: ${init.method}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await appendKlaviyoReconciliationNote("recEXISTING", "note text");

    expect(result).toEqual({ status: "error", reason: "update_failed_422" });
  });
});
