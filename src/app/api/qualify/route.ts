import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import { upsertQualificationLead } from "@/lib/airtableClient";
import { PrimaryGoal, primaryGoalValues, routeQualification } from "@/lib/qualification";

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

  return NextResponse.json({ ok: true, result, forwarded, airtableWrite });
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
