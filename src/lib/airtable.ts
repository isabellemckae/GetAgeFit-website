/**
 * Airtable webhook helper — server-side only.
 *
 * Sends /consultation form leads to the Airtable Leads table via a
 * webhook (e.g. an Airtable Automation "When webhook received" trigger,
 * or a Zapier/Make catcher that writes to Airtable).
 *
 * This is intentionally separate from the generic CRM_WEBHOOK_URL path
 * in src/lib/crm.ts. Airtable's field mapping here (leadName,
 * sourceDetail, pipelineStage, convertedToClient) is specific to this
 * one integration and doesn't belong in the shared CrmLeadPayload type
 * that /api/lead and /api/qualify also depend on.
 *
 * AIRTABLE_WEBHOOK_URL is read server-side only (no NEXT_PUBLIC_ prefix)
 * and is never sent to client-side code.
 */

export type AirtableLeadPayload = {
  leadName: string;
  email: string;
  phone: string;
  goal?: string;
  source: string;
  sourceDetail: string;
  pipelineStage: string;
  convertedToClient: string;
};

export async function forwardToAirtable(payload: AirtableLeadPayload) {
  const webhookUrl = process.env.AIRTABLE_WEBHOOK_URL;

  if (!webhookUrl) {
    // No Airtable webhook configured yet — log so the lead is still
    // visible during development / before the integration is wired up.
    console.log(
      "[Airtable] No AIRTABLE_WEBHOOK_URL configured. Lead payload:",
      payload,
    );
    return { forwarded: false as const };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(
        `[Airtable] Webhook responded with ${res.status} ${res.statusText}`,
      );
      return { forwarded: false as const };
    }

    return { forwarded: true as const };
  } catch (err) {
    console.error("[Airtable] Failed to forward lead:", err);
    return { forwarded: false as const };
  }
}
