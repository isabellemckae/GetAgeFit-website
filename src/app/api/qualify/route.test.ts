import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const upsertQualificationLead = vi.fn();
const forwardToCrm = vi.fn();

vi.mock("@/lib/airtableClient", () => ({
  upsertQualificationLead: (...args: unknown[]) => upsertQualificationLead(...args),
}));

vi.mock("@/lib/crm", () => ({
  forwardToCrm: (...args: unknown[]) => forwardToCrm(...args),
}));

// Imported after the mocks above so route.ts picks up the mocked modules.
const { POST } = await import("@/app/api/qualify/route");

function postRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/qualify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Intentionally the "high-intent" combination per routeQualification() in
// src/lib/qualification.ts: investmentMindset B/C + readiness ready_now +
// personalizedImportance very/essential.
const highIntentSubmission = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "512-555-1234",
  ageRange: "50–59",
  investmentMindset: "C",
  personalizedImportance: "essential",
  readiness: "ready_now",
  source: "qualify_page",
};

describe("POST /api/qualify — validation", () => {
  beforeEach(() => {
    upsertQualificationLead.mockReset();
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("rejects a malformed email (no dot in the domain) with 400, never attempting the Airtable write", async () => {
    const res = await POST(postRequest({ ...highIntentSubmission, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(upsertQualificationLead).not.toHaveBeenCalled();
  });

  it("rejects an email that merely contains '@' but no valid domain", async () => {
    // This is the exact gap the real incident traced back to: the route
    // used to accept anything containing "@" (e.g. "a@b"), which the old
    // client-side check also never caught.
    const res = await POST(postRequest({ ...highIntentSubmission, email: "a@b" }));
    expect(res.status).toBe(400);
    expect(upsertQualificationLead).not.toHaveBeenCalled();
  });

  it("rejects missing/invalid qualification answers with 400", async () => {
    const res = await POST(
      postRequest({ ...highIntentSubmission, investmentMindset: "not-a-real-value" }),
    );
    expect(res.status).toBe(400);
    expect(upsertQualificationLead).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON with 400", async () => {
    const req = new NextRequest("http://localhost/api/qualify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/qualify — qualification routing", () => {
  beforeEach(() => {
    upsertQualificationLead.mockReset();
    upsertQualificationLead.mockResolvedValue({ status: "created", recordId: "rec1" });
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("recomputes the qualification result server-side rather than trusting the client", async () => {
    const res = await POST(postRequest(highIntentSubmission));
    const json = await res.json();
    expect(json.result).toBe("high_intent");
    expect(upsertQualificationLead).toHaveBeenCalledWith(
      expect.objectContaining({ qualificationOutcome: "high_intent" }),
    );
  });

  it("still writes a potential-fit-outcome submission to Airtable — scoring never discards a lead", async () => {
    const res = await POST(
      postRequest({ ...highIntentSubmission, readiness: "few_months" }),
    );
    const json = await res.json();
    expect(json.result).toBe("potential_fit");
    expect(upsertQualificationLead).toHaveBeenCalledWith(
      expect.objectContaining({ qualificationOutcome: "potential_fit" }),
    );
    expect(json.ok).toBe(true);
    expect(json.airtableWrite).toBe(true);
  });

  it("still writes a nurture-outcome submission to Airtable — scoring never discards a lead", async () => {
    const res = await POST(
      postRequest({ ...highIntentSubmission, investmentMindset: "D" }),
    );
    const json = await res.json();
    expect(json.result).toBe("nurture");
    expect(upsertQualificationLead).toHaveBeenCalledWith(
      expect.objectContaining({ qualificationOutcome: "nurture" }),
    );
    expect(json.ok).toBe(true);
    expect(json.airtableWrite).toBe(true);
  });

  it("still writes a low-fit-outcome submission to Airtable — scoring never discards a lead", async () => {
    const res = await POST(
      postRequest({ ...highIntentSubmission, investmentMindset: "A" }),
    );
    const json = await res.json();
    expect(json.result).toBe("low_fit");
    expect(json.ok).toBe(true);
    expect(json.airtableWrite).toBe(true);
  });
});

describe("POST /api/qualify — honest success/failure reporting (the incident fix)", () => {
  beforeEach(() => {
    upsertQualificationLead.mockReset();
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("reports success (200) when Airtable creates a new Lead", async () => {
    upsertQualificationLead.mockResolvedValue({ status: "created", recordId: "rec1" });
    const res = await POST(postRequest(highIntentSubmission));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ ok: true, airtableWrite: true, airtableStatus: "created" });
  });

  it("reports success (200) when Airtable updates an existing Lead", async () => {
    upsertQualificationLead.mockResolvedValue({ status: "updated", recordId: "rec1" });
    const res = await POST(postRequest(highIntentSubmission));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ ok: true, airtableWrite: true, airtableStatus: "updated" });
  });

  it("reports a distinct, still-200 'needs review' response on a duplicate-email collision", async () => {
    upsertQualificationLead.mockResolvedValue({
      status: "skipped_duplicate",
      matchedRecordIds: ["recA", "recB"],
    });
    const res = await POST(postRequest(highIntentSubmission));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ ok: true, airtableWrite: false, airtableStatus: "skipped_duplicate" });
  });

  it("THE INCIDENT BUG: does NOT report success when Airtable genuinely fails, and leaks no internal detail", async () => {
    upsertQualificationLead.mockResolvedValue({ status: "error", reason: "create_failed_500" });
    const res = await POST(postRequest(highIntentSubmission));
    const json = await res.json();
    // Previously this route always returned 200/ok:true regardless of
    // airtableResult.status — silently reporting success for a lead that
    // was never actually captured. This is the core fix.
    expect(res.ok).toBe(false);
    expect(res.status).toBe(502);
    expect(json.ok).toBe(false);
    expect(JSON.stringify(json)).not.toContain("create_failed_500");
  });

  it("does NOT report success when Airtable is unavailable/unconfigured", async () => {
    upsertQualificationLead.mockResolvedValue({ status: "unavailable", reason: "not_configured" });
    const res = await POST(postRequest(highIntentSubmission));
    const json = await res.json();
    expect(res.ok).toBe(false);
    expect(res.status).toBe(502);
    expect(json.ok).toBe(false);
  });

  it("still calls the CRM webhook forward even when the Airtable write ultimately fails", async () => {
    upsertQualificationLead.mockResolvedValue({ status: "error", reason: "unexpected_exception" });
    await POST(postRequest(highIntentSubmission));
    expect(forwardToCrm).toHaveBeenCalledTimes(1);
  });
});
