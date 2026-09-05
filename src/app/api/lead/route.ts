import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import { upsertGenericLead, PRODUCT_INTEREST_ESSENTIALS } from "@/lib/airtableClient";

// Maps this route's `source` values (set by each form component's fetch
// call — see ContactForm.tsx and SupplementTeaser.tsx) to the exact
// "Source" single-select option configured on the Coaching OS Leads table,
// plus a human-readable "Source Detail". Keep in sync with that dropdown —
// see upsertGenericLead() in src/lib/airtableClient.ts.
const SOURCE_OPTIONS: Record<string, { source: string; detail: string }> = {
  contact_page: { source: "contact form", detail: "Contact Form" },
  supplement_waitlist: {
    source: "supp waitlist",
    detail: "GetAgeFit Essentials Waitlist",
  },
};
const DEFAULT_SOURCE_OPTION = { source: "website", detail: "Website Lead Form" };

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const rawSource = typeof body.source === "string" ? body.source : "contact_form";
  const firstName = asString(body.firstName);
  const lastName = asString(body.lastName);
  const phone = asString(body.phone);
  const message = asString(body.message);
  const submittedAt = new Date().toISOString();

  const { forwarded } = await forwardToCrm({
    leadSource: rawSource,
    firstName,
    lastName,
    email,
    phone,
    message,
    submittedAt,
  });

  // Communication-consent + product-interest: only the supplement
  // waitlist form asks about these today, so only that source gets a
  // defined value here. Any other source (e.g. the Contact form) passes
  // `undefined` for all three, which upsertGenericLead() treats as "this
  // submission never asked" and leaves any existing Airtable value
  // untouched rather than overwriting it — see that function's doc
  // comment on GenericLeadInput.
  const isSupplementWaitlist = rawSource === "supplement_waitlist";

  // Submitting the "Notify Me" form is itself the email opt-in (matches
  // the approved copy: "we will use it to communicate with you... you
  // can unsubscribe from emails... at any time") — there's no separate
  // email checkbox and none is needed. SMS is different: it requires its
  // own explicit, affirmative checkbox, so it's read from the request
  // body instead of assumed. A submission that leaves that box unchecked
  // still writes `false` (a real "no"), not "unanswered" — and a phone
  // number being present never implies consent by itself.
  const emailConsent = isSupplementWaitlist ? true : undefined;
  const smsConsent = isSupplementWaitlist
    ? typeof body.smsConsent === "boolean"
      ? body.smsConsent
      : false
    : undefined;
  const productInterest = isSupplementWaitlist ? PRODUCT_INTEREST_ESSENTIALS : undefined;

  // Direct Airtable (Coaching OS) Lead upsert — additive alongside the
  // generic CRM forward above, same pattern already used by /api/qualify
  // and /api/consultation. Never allowed to throw or block the response.
  const { source, detail } = SOURCE_OPTIONS[rawSource] ?? DEFAULT_SOURCE_OPTION;
  const airtableResult = await upsertGenericLead({
    firstName,
    lastName,
    email,
    phone,
    source,
    sourceDetail: detail,
    message,
    submittedAt,
    emailConsent,
    smsConsent,
    productInterest,
  });
  const airtableWrite =
    airtableResult.status === "created" || airtableResult.status === "updated";

  return NextResponse.json({ ok: true, forwarded, airtableWrite });
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
