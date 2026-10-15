import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import { upsertQualificationLead } from "@/lib/airtableClient";
import { PrimaryGoal, primaryGoalValues, routeQualification } from "@/lib/qualification";

// Same pattern as /api/lead/route.ts's EMAIL_PATTERN — stricter than a bare
// "@" check (requires a dot in the domain part). Kept here rather than
// imported so this route's validation never silently drifts if that file's
// pattern changes for Contact-form-specific reasons.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function logQualificationWriteFailure(input: { status: string; reason?: string }) {
  // Same structured-log convention as logLeadWriteFailure in
  // /api/lead/route.ts — the only signal an operator has that a
  // qualification submission was NOT captured, since this route now
  // correctly reports that to the browser as a failure rather than a 200.
  console.error(
    `[QualificationSubmission] integration=airtable status=${input.status} reason=${input.reason ?? "n/a"} persisted=false`,
  );
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const investmentMindset = body.investmentMindset;
  const personalizedImportance = body.personalizedImportance;
  const readiness = body.readiness;

  if (
    !isOneOf(investmentMindset, ["A", "B", "C", "D"]) ||
    !isOneOf(personalizedImportance, ["not_important", "somewhat", "very", "essential"]) ||
    !isOneOf(readiness, ["ready_now", "few_months", "exploring"])
  ) {
    return NextResponse.json(
      { error: "Missing or invalid qualification answers" },
      { status: 400 },
    );
  }

  // Recompute server-side rather than trusting the client-supplied result,
  // so the CRM record is authoritative even if the client is stale/tampered.
  // primaryGoal never participates in this — routing is unchanged.
  const result = routeQualification({
    investmentMindset,
    personalizedImportance,
    readiness,
  });

  const primaryGoal = asPrimaryGoalArray(body.primaryGoal);
  const firstName = asString(body.firstName);
  const lastName = asString(body.lastName);
  const phone = asString(body.phone);
  const submittedAt = new Date().toISOString();

  const { forwarded } = await forwardToCrm({
    leadSource: typeof body.source === "string" ? body.source : "qualify_page",
    firstName,
    lastName,
    email,
    phone,
    ageRange: asString(body.ageRange),
    primaryGoal: primaryGoal.length > 0 ? primaryGoal : undefined,
    trainingFrequency: asString(body.trainingFrequency),
    personalizedImportance,
    investmentMindset,
    hasInjuryOrLimitation: asString(body.hasInjuryOrLimitation),
    injuryDetail: asString(body.injuryDetail),
    readiness,
    qualificationStatus: result,
    submittedAt,
  });

  // Direct Airtable (Coaching OS) Lead upsert — additive alongside the
  // generic CRM forward above. Never allowed to throw or block the
  // response: qualification results must reach the user even if Airtable
  // is unreachable or unconfigured. See src/lib/airtableClient.ts.
  const airtableResult = await upsertQualificationLead({
    firstName,
    lastName,
    email,
    phone,
    qualificationOutcome: result,
    primaryGoal,
    submittedAt,
  });
  const airtableWrite =
    airtableResult.status === "created" || airtableResult.status === "updated";

  // Only "created"/"updated" mean the submission actually landed in
  // Airtable. "skipped_duplicate" is a deliberate non-write the frontend
  // already has a distinct state for (see QualifyQuiz.tsx), so it still
  // gets a 200 — but "unavailable"/"error" must NOT be reported as
  // success. Previously this always returned 200 regardless of
  // airtableResult.status, meaning a genuine Airtable failure was shown
  // to the visitor as a successful submission while nothing was actually
  // captured — exactly the silent-failure bug this fixes, mirroring the
  // same fix already applied to /api/lead/route.ts.
  if (airtableWrite || airtableResult.status === "skipped_duplicate") {
    return NextResponse.json({
      ok: true,
      result,
      forwarded,
      airtableWrite,
      airtableStatus: airtableResult.status,
    });
  }

  logQualificationWriteFailure({
    status: airtableResult.status,
    reason: "reason" in airtableResult ? airtableResult.reason : undefined,
  });
  return NextResponse.json(
    {
      ok: false,
      result,
      error: "We couldn't save your answers. Please try again shortly.",
    },
    { status: 502 },
  );
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function isOneOf<T extends string>(v: unknown, options: readonly T[]): v is T {
  return typeof v === "string" && (options as readonly string[]).includes(v);
}

// Accepts only a real array of known PrimaryGoal values; anything else
// (missing, wrong type, unknown strings mixed in) degrades to an empty
// array rather than rejecting the whole submission — primaryGoal has never
// been required for qualification to proceed.
function asPrimaryGoalArray(v: unknown): PrimaryGoal[] {
  if (!Array.isArray(v)) return [];
  return v.filter((item): item is PrimaryGoal => isOneOf(item, primaryGoalValues));
}
