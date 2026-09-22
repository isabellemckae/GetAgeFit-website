/**
 * Calendly webhook verification + payload parsing — server-side only.
 *
 * Verifies Calendly's HMAC-SHA256 webhook signature: the
 * `Calendly-Webhook-Signature` header is `t=<unix-seconds>,v1=<hex-hmac>`,
 * where `v1` is HMAC-SHA256 of `${t}.${rawBody}` using the signing key
 * issued by Calendly when the webhook subscription is created. Verifying
 * this is what proves a request claiming to be a Calendly booking event
 * actually came from Calendly and wasn't forged/replayed from elsewhere.
 *
 * Also extracts only the fields this integration actually needs from a
 * real `invitee.created` payload, defensively: every field except `email`
 * is optional. Calendly's exact payload shape (especially a custom
 * question like a phone number field) depends on how GetAgeFit's specific
 * event type is configured in their Calendly account, which this repo
 * has no way to inspect — so nothing here assumes a field is present, and
 * nothing throws if the shape differs from what's expected.
 */

import crypto from "crypto";

export const CALENDLY_SIGNATURE_HEADER = "Calendly-Webhook-Signature";

// Defense-in-depth replay-window check on top of the signature itself —
// not a documented Calendly requirement, just a generous tolerance (5
// minutes) so normal delivery delay/retries are never rejected.
const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

export type SignatureVerification =
  | { valid: true }
  | { valid: false; reason: string };

export function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string | null,
  signingKey: string,
): SignatureVerification {
  if (!signatureHeader) {
    return { valid: false, reason: "missing_signature_header" };
  }

  const parts: Record<string, string> = {};
  for (const kv of signatureHeader.split(",")) {
    const [key, value] = kv.split("=");
    if (key && value) parts[key.trim()] = value.trim();
  }
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) {
    return { valid: false, reason: "malformed_signature_header" };
  }

  const expectedHex = crypto
    .createHmac("sha256", signingKey)
    .update(`${t}.${rawBody}`)
    .digest("hex");

  // Both must decode to valid, equal-length hex before the timing-safe
  // compare — timingSafeEqual throws on a length mismatch, and a
  // malformed (non-hex or wrong-length) v1 is simply an invalid signature,
  // not a crash.
  let expectedBuf: Buffer;
  let actualBuf: Buffer;
  try {
    expectedBuf = Buffer.from(expectedHex, "hex");
    actualBuf = Buffer.from(v1, "hex");
  } catch {
    return { valid: false, reason: "malformed_signature_value" };
  }
  if (
    expectedBuf.length === 0 ||
    expectedBuf.length !== actualBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, actualBuf)
  ) {
    return { valid: false, reason: "signature_mismatch" };
  }

  const tsSeconds = Number(t);
  if (!Number.isFinite(tsSeconds)) {
    return { valid: false, reason: "invalid_timestamp" };
  }
  const ageSeconds = Math.abs(Date.now() / 1000 - tsSeconds);
  if (ageSeconds > TIMESTAMP_TOLERANCE_SECONDS) {
    return { valid: false, reason: "timestamp_out_of_tolerance" };
  }

  return { valid: true };
}

// --- Payload parsing --------------------------------------------------

export type CalendlyWebhookPayload = {
  event?: string;
  payload?: {
    uri?: string;
    email?: string;
    name?: string;
    first_name?: string | null;
    last_name?: string | null;
    text_reminder_number?: string | null;
    questions_and_answers?: { question?: string; answer?: string }[];
    scheduled_event?: {
      uri?: string;
      name?: string;
      start_time?: string;
      end_time?: string;
    };
    [key: string]: unknown;
  };
};

export type ExtractedBooking = {
  email: string;
  name?: string;
  phone?: string;
  /** ISO instant of the booked consultation start, if present. */
  startTime?: string;
  eventName?: string;
  /** Calendly's invitee URI — globally unique per booking; used as the idempotency key. */
  inviteeUri: string;
};

/**
 * Returns null if the payload doesn't even have the minimum needed to
 * process (a real email and an invitee URI) — that's treated as
 * unprocessable by the caller, not thrown.
 */
export function extractBooking(body: CalendlyWebhookPayload): ExtractedBooking | null {
  const p = body.payload;
  if (!p) return null;

  const email = typeof p.email === "string" ? p.email.trim() : "";
  const inviteeUri = typeof p.uri === "string" ? p.uri.trim() : "";
  if (!email || !email.includes("@") || !inviteeUri) return null;

  const name =
    typeof p.name === "string" && p.name.trim()
      ? p.name.trim()
      : [p.first_name, p.last_name].filter((v): v is string => !!v && v.trim().length > 0).join(" ") ||
        undefined;

  return {
    email,
    name,
    phone: extractPhone(p),
    startTime:
      typeof p.scheduled_event?.start_time === "string" ? p.scheduled_event.start_time : undefined,
    eventName: typeof p.scheduled_event?.name === "string" ? p.scheduled_event.name : undefined,
    inviteeUri,
  };
}

// Phone isn't a standard Calendly invitee field — it only shows up if
// GetAgeFit's event type collects it, either as SMS-reminder opt-in
// (`text_reminder_number`) or as a custom question. Scans
// `questions_and_answers` for a question whose text mentions "phone"
// rather than assuming a fixed question index/order.
function extractPhone(p: NonNullable<CalendlyWebhookPayload["payload"]>): string | undefined {
  if (typeof p.text_reminder_number === "string" && p.text_reminder_number.trim()) {
    return p.text_reminder_number.trim();
  }
  const qa = Array.isArray(p.questions_and_answers) ? p.questions_and_answers : [];
  const match = qa.find(
    (item) =>
      typeof item?.question === "string" &&
      /phone/i.test(item.question) &&
      typeof item?.answer === "string" &&
      item.answer.trim().length > 0,
  );
  return match?.answer?.trim();
}
