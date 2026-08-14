import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import { routeQualification } from "@/lib/qualification";

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
  const result = routeQualification({
    investmentMindset,
    personalizedImportance,
    readiness,
  });

  const { forwarded } = await forwardToCrm({
    leadSource: typeof body.source === "string" ? body.source : "qualify_page",
    firstName: asString(body.firstName),
    lastName: asString(body.lastName),
    email,
    phone: asString(body.phone),
    ageRange: asString(body.ageRange),
    primaryGoal: asString(body.primaryGoal),
    trainingFrequency: asString(body.trainingFrequency),
    personalizedImportance,
    investmentMindset,
    hasInjuryOrLimitation: asString(body.hasInjuryOrLimitation),
    injuryDetail: asString(body.injuryDetail),
    readiness,
    qualificationStatus: result,
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, result, forwarded });
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function isOneOf<T extends string>(v: unknown, options: readonly T[]): v is T {
  return typeof v === "string" && (options as readonly string[]).includes(v);
}
