import { recognitionLines, recognitionReassurance } from "@/content/recognition";

/**
 * Homepage §2 — "Maybe You're Noticing…" (Recognition). Deliberately flat:
 * no cards, no shadows, no dark background — short lines the visitor can
 * read in a few seconds, per the Master Reference's mobile/brand-feel
 * requirements (no text walls, bright/warm, not clinical).
 */
export function RecognitionList() {
  return (
    <div className="mx-auto max-w-2xl">
      <ul className="space-y-3 text-center">
        {recognitionLines.map((line) => (
          <li
            key={line}
            className="text-lg leading-relaxed text-ink-700 sm:text-xl"
          >
            {line}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-lg font-medium text-ink-800">
        {recognitionReassurance}
      </p>
    </div>
  );
}
