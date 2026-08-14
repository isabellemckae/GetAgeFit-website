import { objections } from "@/content/objections";

/**
 * Homepage §7 — "Thinking About Getting Started?" (Safety/objection
 * handling). Deliberately NOT an accordion — the Master Reference wants
 * this scannable, not collapsed. Uses a definition list (question/answer
 * pairs) rather than heading elements, since this reads as quick
 * reassurance text, not a document-outline-level FAQ like
 * FAQAccordion (used elsewhere for actual expand/collapse FAQs).
 */
export function ObjectionFAQ() {
  return (
    <dl className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
      {objections.map((o) => (
        <div key={o.question}>
          <dt className="mb-1 font-display text-lg text-ink-900">
            {o.question}
          </dt>
          <dd className="text-[0.95rem] leading-relaxed text-ink-600">
            {o.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}
