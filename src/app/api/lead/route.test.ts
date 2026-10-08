import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const upsertGenericLead = vi.fn();
const forwardToCrm = vi.fn();

vi.mock("@/lib/airtableClient", () => ({
  upsertGenericLead: (...args: unknown[]) => upsertGenericLead(...args),
  PRODUCT_INTEREST_ESSENTIALS: "GetAgeFit Essentials (ageLIFT + ageFUEL)",
}));

vi.mock("@/lib/crm", () => ({
  forwardToCrm: (...args: unknown[]) => forwardToCrm(...args),
}));

// Imported after the mocks above so route.ts picks up the mocked modules.
const { POST } = await import("@/app/api/lead/route");

function postRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validContact = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  source: "contact_page",
  message: "Hi there",
};

const validWaitlist = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "512-555-1234",
  smsConsent: true,
  source: "supplement_waitlist",
};

describe("POST /api/lead — validation", () => {
  beforeEach(() => {
    upsertGenericLead.mockReset();
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("rejects an invalid email and never attempts the Airtable write", async () => {
    const res = await POST(postRequest({ ...validContact, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(upsertGenericLead).not.toHaveBeenCalled();
  });

  it("rejects a submission missing first/last name", async () => {
    const res = await POST(postRequest({ ...validContact, firstName: "" }));
    expect(res.status).toBe(400);
    expect(upsertGenericLead).not.toHaveBeenCalled();
  });

  it("rejects a malformed phone number without silently reformatting it", async () => {
    const res = await POST(postRequest({ ...validWaitlist, phone: "call-me-maybe" }));
    expect(res.status).toBe(400);
    expect(upsertGenericLead).not.toHaveBeenCalled();
  });

  it("rejects SMS consent with no phone number", async () => {
    const { phone, ...withoutPhone } = validWaitlist;
    const res = await POST(postRequest({ ...withoutPhone, smsConsent: true }));
    expect(res.status).toBe(400);
    expect(upsertGenericLead).not.toHaveBeenCalled();
  });

  it("rejects an unrecognized lead source", async () => {
    const res = await POST(postRequest({ ...validContact, source: "totally_made_up" }));
    expect(res.status).toBe(400);
    expect(upsertGenericLead).not.toHaveBeenCalled();
  });
});

describe("POST /api/lead — contact form submission", () => {
  beforeEach(() => {
    upsertGenericLead.mockReset();
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("classifies as the Contact Form source and never sends consent fields", async () => {
    upsertGenericLead.mockResolvedValue({ status: "created", recordId: "rec1" });

    const res = await POST(postRequest(validContact));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({ ok: true, airtableWrite: true, airtableStatus: "created" });
    expect(upsertGenericLead).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "contact form",
        sourceDetail: "Contact Form",
        emailConsent: undefined,
        smsConsent: undefined,
        productInterest: undefined,
      }),
    );
  });

  it("still forwards to the generic CRM webhook", async () => {
    upsertGenericLead.mockResolvedValue({ status: "created", recordId: "rec1" });
    await POST(postRequest(validContact));
    expect(forwardToCrm).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/lead — supplement waitlist submission", () => {
  beforeEach(() => {
    upsertGenericLead.mockReset();
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("classifies as the waitlist source and sets consent + product interest", async () => {
    upsertGenericLead.mockResolvedValue({ status: "created", recordId: "rec1" });

    const res = await POST(postRequest(validWaitlist));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(upsertGenericLead).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "supp waitlist",
        sourceDetail: "GetAgeFit Essentials Waitlist",
        emailConsent: true,
        smsConsent: true,
        productInterest: "GetAgeFit Essentials (ageLIFT + ageFUEL)",
      }),
    );
  });

  it("writes an explicit false (not undefined) when the SMS box is unchecked", async () => {
    upsertGenericLead.mockResolvedValue({ status: "created", recordId: "rec1" });
    const { phone, smsConsent, ...rest } = validWaitlist;

    await POST(postRequest({ ...rest }));

    expect(upsertGenericLead).toHaveBeenCalledWith(
      expect.objectContaining({ emailConsent: true, smsConsent: false }),
    );
  });
});

describe("POST /api/lead — honest success/failure reporting", () => {
  beforeEach(() => {
    upsertGenericLead.mockReset();
    forwardToCrm.mockReset();
    forwardToCrm.mockResolvedValue({ forwarded: true });
  });

  it("returns a distinct, non-2xx-free needs-review response on a duplicate collision", async () => {
    upsertGenericLead.mockResolvedValue({
      status: "skipped_duplicate",
      matchedRecordIds: ["recA", "recB"],
    });

    const res = await POST(postRequest(validWaitlist));
    const json = await res.json();

    expect(res.ok).toBe(true);
    expect(json).toMatchObject({ ok: true, airtableWrite: false, airtableStatus: "skipped_duplicate" });
  });

  it("does NOT report success when the Airtable write errors, and leaks no internal detail", async () => {
    upsertGenericLead.mockResolvedValue({ status: "error", reason: "create_failed_500" });

    const res = await POST(postRequest(validWaitlist));
    const json = await res.json();

    expect(res.ok).toBe(false);
    expect(json.ok).toBe(false);
    expect(JSON.stringify(json)).not.toContain("create_failed_500");
    expect(JSON.stringify(json)).not.toContain("airtableStatus");
  });

  it("does NOT report success when Airtable is unavailable/unconfigured", async () => {
    upsertGenericLead.mockResolvedValue({ status: "unavailable", reason: "not_configured" });

    const res = await POST(postRequest(validWaitlist));
    const json = await res.json();

    expect(res.ok).toBe(false);
    expect(json.ok).toBe(false);
  });

  it("still calls the CRM webhook forward even when the Airtable write ultimately fails", async () => {
    upsertGenericLead.mockResolvedValue({ status: "error", reason: "unexpected_exception" });
    await POST(postRequest(validWaitlist));
    expect(forwardToCrm).toHaveBeenCalledTimes(1);
  });
});
