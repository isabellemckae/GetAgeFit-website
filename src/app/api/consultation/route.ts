import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";
import { forwardToAirtable } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const phone = typeof body.phone === "string" ? body.phone : "";
  if (!email || !email.includes("@") || !phone) {
    return NextResponse.json(
      { error: "A valid email and phone number are required" },
      { status: 400 },
    );
  }

  const firstName = asString(body.firstName);
  const lastName = asString(body.lastName);
  const goal = asString(body.goal);

  const { forwarded } = await forwardToCrm({
    leadSource: typeof body.source === "string" ? body.source : "consultation_form",
    firstName,
    lastName,
    email,
    phone,
    message: goal,
    submittedAt: new Date().toISOString(),
  });

  // Airtable Leads table — separate from the generic CRM webhook above.
  // See src/lib/airtable.ts for the field mapping and failure handling.
  await forwardToAirtable({
    leadName: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
    email,
    phone,
    goal,
    source: "Website",
    sourceDetail: "Free Evaluation & Consultation Form",
    pipelineStage: "New",
    convertedToClient: "No",
  });

  return NextResponse.json({ ok: true, forwarded });
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
