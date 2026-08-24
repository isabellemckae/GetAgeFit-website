/**
 * Direct Airtable REST API client — server-side only.
 *
 * Demo #3 Phase 1: this is ADDITIVE, new alongside src/lib/airtable.ts, not
 * a replacement for it. src/lib/airtable.ts (forwardToAirtable /
 * AIRTABLE_WEBHOOK_URL) still powers the existing /consultation funnel and
 * is intentionally left untouched. This module powers ONLY the
 * qualification funnel's Lead upsert, because that requires a real lookup
 * (find-by-email) and conditional update that a blind webhook POST cannot
 * do.
 *
 * Talks directly to the Airtable REST API (api.airtable.com) using a
 * Personal Access Token, rather than an Automation webhook. Env vars are
 * read server-side only (no NEXT_PUBLIC_ prefix) and are never sent to the
 * browser:
 *   - AIRTABLE_ACCESS_TOKEN
 *   - AIRTABLE_BASE_ID
 *   - AIRTABLE_LEADS_TABLE_ID
 *
 * If any of the three are unset, every exported function degrades to a
 * logged no-op ({ status: "unavailable" }) rather than throwing — matching
 * the graceful-degradation pattern already used by forwardToCrm() and
 * forwardToAirtable() elsewhere in this codebase, so an unconfigured
 * environment (e.g. local dev) never breaks the qualification quiz.
 */

import {
  PrimaryGoal,
  QualificationResult,
  primaryGoalLabels,
} from "@/lib/qualification";

const AIRTABLE_API_ROOT = "https://api.airtable.com/v0";

export type AirtableLeadRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableConfig = {
  baseId: string;
  tableId: string;
  token: string;
};

function getConfig(): AirtableConfig | null {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_LEADS_TABLE_ID;
  const token = process.env.AIRTABLE_ACCESS_TOKEN;

  if (!baseId || !tableId || !token) return null;
  return { baseId, tableId, token };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Airtable formula strings are single-quoted; escape any literal single
// quote in the (already-normalized, but user-supplied) email so it can't
// break out of the filterByFormula string.
function escapeForFormula(value: string): string {
  return value.replace(/'/g, "\\'");
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "<unreadable response body>";
  }
}

export type LeadLookupResult =
  | { status: "found"; record: AirtableLeadRecord }
  | { status: "not_found" }
  | { status: "multiple"; records: AirtableLeadRecord[] }
  | { status: "unavailable"; reason: string };

/**
 * Look up a Lead in the Coaching OS Leads table by (normalized) email.
 *
 * Part G duplicate-safety: this can return "multiple" if more than one
 * existing record matches the same normalized email. Callers must NOT
 * silently update all of them — see upsertQualificationLead() below for
 * the chosen behavior.
 */
export async function findLeadByEmail(email: string): Promise<LeadLookupResult> {
  const config = getConfig();
  if (!config) {
    console.log(
      "[AirtableClient] Airtable API not configured (AIRTABLE_ACCESS_TOKEN / AIRTABLE_BASE_ID / AIRTABLE_LEADS_TABLE_ID). Skipping lookup.",
    );
    return { status: "unavailable", reason: "not_configured" };
  }

  const normalized = normalizeEmail(email);
  const formula = `LOWER({Email})='${escapeForFormula(normalized)}'`;
  const url = `${AIRTABLE_API_ROOT}/${config.baseId}/${config.tableId}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=5`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${config.token}` },
    });

    if (!res.ok) {
      const body = await safeReadText(res);
      console.error(
        `[AirtableClient] Email lookup failed: ${res.status} ${res.statusText}`,
        body,
      );
      return { status: "unavailable", reason: `lookup_failed_${res.status}` };
    }

    const json = (await res.json()) as { records?: AirtableLeadRecord[] };
    const records = json.records ?? [];

    if (records.length === 0) return { status: "not_found" };
    if (records.length === 1) return { status: "found", record: records[0] };
    return { status: "multiple", records };
  } catch (err) {
    console.error("[AirtableClient] Network error during email lookup:", err);
    return { status: "unavailable", reason: "network_error" };
  }
}

async function airtableCreate(fields: Record<string, unknown>, config: AirtableConfig) {
  return fetch(`${AIRTABLE_API_ROOT}/${config.baseId}/${config.tableId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
}

async function airtablePatch(
  recordId: string,
  fields: Record<string, unknown>,
  config: AirtableConfig,
) {
  return fetch(`${AIRTABLE_API_ROOT}/${config.baseId}/${config.tableId}/${recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
}

const qualificationOutcomeLabel: Record<QualificationResult, string> = {
  high_intent: "High Intent",
  potential_fit: "Potential Fit",
  nurture: "Nurture",
  low_fit: "Low Fit",
};

function buildQualificationNote(input: {
  qualificationOutcome: QualificationResult;
  primaryGoal?: PrimaryGoal[];
  submittedAt: string;
}): string {
  const goals = (input.primaryGoal ?? []).map((g) => primaryGoalLabels[g]).join(", ");
  const outcomeLabel = qualificationOutcomeLabel[input.qualificationOutcome];
  const goalsPart = goals ? ` Goals: ${goals}.` : "";
  return `[${input.submittedAt}] Qualification funnel — Outcome: ${outcomeLabel}.${goalsPart}`;
}

function appendNote(existing: unknown, addition: string): string {
  const existingText = typeof existing === "string" ? existing.trim() : "";
  return existingText ? `${existingText}\n${addition}` : addition;
}

export type QualificationLeadInput = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  qualificationOutcome: QualificationResult;
  primaryGoal?: PrimaryGoal[];
  /** ISO timestamp for the "Submitted At" field. */
  submittedAt: string;
};

export type UpsertLeadResult =
  | { status: "created"; recordId: string }
  | { status: "updated"; recordId: string }
  | { status: "skipped_duplicate"; matchedRecordIds: string[] }
  | { status: "unavailable"; reason: string }
  | { status: "error"; reason: string };

/**
 * Create-or-update a Coaching OS Lead from a qualification submission,
 * matched by normalized email.
 *
 * - No existing Lead found  → create one, Pipeline Stage = "New".
 * - Exactly one existing Lead found → update it. Pipeline Stage is
 *   deliberately NOT included in the update payload, so whatever stage the
 *   Lead is already in (e.g. further along than "New") is left untouched —
 *   qualification submissions must never regress or overwrite pipeline
 *   progress. See Part G below for the "multiple matches" case.
 * - More than one existing Lead matches the same email → do NOT update any
 *   of them and do NOT create a new one (would-be duplicate). This is
 *   logged as a data-quality issue for manual review and reported back to
 *   the caller as "skipped_duplicate" so nothing is silently lost or
 *   silently applied to the wrong record.
 *
 * Never throws — any unexpected failure (network error, unexpected
 * response shape) is caught and returned as { status: "error" } so a
 * broken/misconfigured Airtable integration can never crash the
 * qualification API route or the quiz UI in front of it.
 */
export async function upsertQualificationLead(
  input: QualificationLeadInput,
): Promise<UpsertLeadResult> {
  const config = getConfig();
  if (!config) {
    console.log(
      "[AirtableClient] Airtable API not configured. Skipping direct Lead upsert for:",
      input.email,
    );
    return { status: "unavailable", reason: "not_configured" };
  }

  try {
    const normalizedEmail = normalizeEmail(input.email);
    const lookup = await findLeadByEmail(normalizedEmail);

    if (lookup.status === "unavailable") {
      return { status: "unavailable", reason: lookup.reason };
    }

    if (lookup.status === "multiple") {
      const matchedRecordIds = lookup.records.map((r) => r.id);
      console.error(
        `[AirtableClient] ${lookup.records.length} existing Leads match email "${normalizedEmail}". Skipping automatic update/create to avoid updating the wrong record or creating a duplicate. Needs manual review. Record IDs:`,
        matchedRecordIds,
      );
      return { status: "skipped_duplicate", matchedRecordIds };
    }

    const leadName = `${input.firstName ?? ""} ${input.lastName ?? ""}`.trim();
    const outcomeLabel = qualificationOutcomeLabel[input.qualificationOutcome];
    const noteAddition = buildQualificationNote(input);

    if (lookup.status === "found") {
      const fields: Record<string, unknown> = {
        ...(leadName ? { "Lead Name": leadName } : {}),
        Email: normalizedEmail,
        ...(input.phone ? { Phone: input.phone } : {}),
        Source: "Website",
        "Source Detail": "Qualification Funnel",
        "Qualification Outcome": outcomeLabel,
        "Submitted At": input.submittedAt,
        Notes: appendNote(lookup.record.fields["Notes"], noteAddition),
        // Pipeline Stage intentionally omitted — see function doc comment.
      };

      const res = await airtablePatch(lookup.record.id, fields, config);
      if (!res.ok) {
        const body = await safeReadText(res);
        console.error(
          `[AirtableClient] Failed to update Lead ${lookup.record.id}: ${res.status} ${res.statusText}`,
          body,
        );
        return { status: "error", reason: `update_failed_${res.status}` };
      }
      return { status: "updated", recordId: lookup.record.id };
    }

    // lookup.status === "not_found" → create
    const fields: Record<string, unknown> = {
      ...(leadName ? { "Lead Name": leadName } : {}),
      Email: normalizedEmail,
      ...(input.phone ? { Phone: input.phone } : {}),
      Source: "Website",
      "Source Detail": "Qualification Funnel",
      "Pipeline Stage": "New",
      "Qualification Outcome": outcomeLabel,
      "Submitted At": input.submittedAt,
      Notes: noteAddition,
    };

    const res = await airtableCreate(fields, config);
    if (!res.ok) {
      const body = await safeReadText(res);
      console.error(
        `[AirtableClient] Failed to create Lead: ${res.status} ${res.statusText}`,
        body,
      );
      return { status: "error", reason: `create_failed_${res.status}` };
    }
    const json = (await res.json()) as { id: string };
    return { status: "created", recordId: json.id };
  } catch (err) {
    console.error("[AirtableClient] Unexpected error during Lead upsert:", err);
    return { status: "error", reason: "unexpected_exception" };
  }
}
