import { NextRequest, NextResponse } from "next/server";
import {
  CALENDLY_SIGNATURE_HEADER,
  CalendlyWebhookPayload,
  extractBooking,
  verifyCalendlySignature,
} from "@/lib/calendlyWebhook";
import { upsertConsultationBookedLead } from "@/lib/airtableClient";

/**
 * Calendly `invitee.created` webhook — the fully-automated Calendly →
 * Airtable path: the moment a prospect finishes booking through the
 * /consultation Calendly embed, this advances their Lead to "Consultation
 * Booked" with the booked date recorded, with zero staff involvement.
 * See src/lib/calendlyWebhook.ts for signature verification and payload
 * parsing, and upsertConsultationBookedLead() in src/lib/airtableClient.ts
 * for the dedup-safe, idempotent Airtable write. The internal
 * notification email is sent by a native Airtable automation (triggered
 * when a Lead's Pipeline Stage becomes "Consultation Booked"), not by
 * this route — no email provider is wired up here.
 *
 * Response status codes matter here beyond a browser's use of them —
 * Calendly's own delivery system reads them to decide whether to retry:
 * a 5xx means "try again later" (used only for failures a retry could
 * plausibly fix); a 2xx means "delivered, don't retry" (used even for
 * outcomes we can't act on automatically, like a duplicate-email
 * collision, since retrying the same event would never resolve those).
 */
export async function POST(req: NextRequest) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.error(
      "[CalendlyWebhook] CALENDLY_WEBHOOK_SIGNING_KEY not configured — rejecting webhook rather than processing an unverifiable request.",
    );
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // Read the raw body once for signature verification, then parse it
  // ourselves — req.json() would consume the stream and make it
  // unavailable for the HMAC computation, which must be over the exact
  // bytes Calendly signed, not a re-serialized version of them.
  const rawBody = await req.text();
  const verification = verifyCalendlySignature(
    rawBody,
    req.headers.get(CALENDLY_SIGNATURE_HEADER),
    signingKey,
  );
  if (!verification.valid) {
    console.error(`[CalendlyWebhook] Signature verification failed: ${verification.reason}`);
    return NextResponse.json({ ok: false, error: verification.reason }, { status: 401 });
  }

  let body: CalendlyWebhookPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.event !== "invitee.created") {
    // Any other Calendly event type (invitee.canceled, etc.) is accepted
    // but intentionally not processed — this integration only automates
    // the initial booking. A 2xx tells Calendly not to retry it.
    return NextResponse.json({ ok: true, ignored: true, event: body.event ?? null });
  }

  const booking = extractBooking(body);
  if (!booking) {
    console.error(
      "[CalendlyWebhook] invitee.created payload missing a usable email or invitee URI; cannot process.",
      body.payload,
    );
    // Not something a retry would fix — acknowledge so Calendly stops
    // redelivering an event this integration can never act on.
    return NextResponse.json({ ok: false, error: "unprocessable_payload" });
  }

  const submittedAt = new Date().toISOString();
  const result = await upsertConsultationBookedLead({
    email: booking.email,
    name: booking.name,
    phone: booking.phone,
    startTime: booking.startTime,
    eventName: booking.eventName,
    inviteeUri: booking.inviteeUri,
    submittedAt,
  });

  if (result.status === "unavailable") {
    return NextResponse.json(
      { ok: false, status: result.status, reason: result.reason },
      // Only ask Calendly to retry when the failure is actually
      // transient (network/API error) — a missing configuration won't
      // fix itself on retry, so that case gets a 2xx.
      { status: result.retryable ? 502 : 200 },
    );
  }
  if (result.status === "error") {
    return NextResponse.json({ ok: false, status: result.status, reason: result.reason }, { status: 502 });
  }

  // created | updated | already_processed | skipped_duplicate — all
  // acknowledged with 2xx; skipped_duplicate is a deliberate non-write
  // (see the function doc comment), not a failure Calendly should retry.
  return NextResponse.json({ ok: true, status: result.status });
}
