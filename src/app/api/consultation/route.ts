import { NextRequest, NextResponse } from "next/server";
import { forwardToCrm } from "@/lib/crm";

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

  const { forwarded } = await forwardToCrm({
    leadSource: typeof body.source === "string" ? body.source : "consultation_form",
    firstName: asString(body.firstName),
    lastName: asString(body.lastName),
    email,
    phone,
    message: asString(body.goal),
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, forwarded });
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
