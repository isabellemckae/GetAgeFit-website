/**
 * Generic CRM forwarding helper — PROMPT §20.
 *
 * We intentionally do not build a bespoke CRM. Every API route normalizes
 * its payload to the shared lead shape below and POSTs it to
 * CRM_WEBHOOK_URL (a CRM's native webhook, or a Zapier/Make/n8n catcher
 * that fans out to the real CRM). If no webhook is configured — e.g. in
 * local development — submissions are logged server-side only, so forms
 * still work end-to-end before the integration is wired up.
 */

export type CrmLeadPayload = {
  leadSource: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  ageRange?: string;
  primaryGoal?: string;
  trainingFrequency?: string;
  personalizedImportance?: string;
  investmentMindset?: string;
  hasInjuryOrLimitation?: string;
  injuryDetail?: string;
  readiness?: string;
  qualificationStatus?: string;
  message?: string;
  submittedAt: string;
};

export async function forwardToCrm(payload: CrmLeadPayload) {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    // No CRM configured yet — log so the submission is still visible
    // during development / before integration.
    console.log("[CRM] No CRM_WEBHOOK_URL configured. Lead payload:", payload);
    return { forwarded: false as const };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });
    return { forwarded: res.ok };
  } catch (err) {
    console.error("[CRM] Failed to forward lead:", err);
    return { forwarded: false as const };
  }
}
