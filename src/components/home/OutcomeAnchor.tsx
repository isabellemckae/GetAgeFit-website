import { Outcome } from "@/content/outcomes";

const accents = ["sage", "plum", "sage", "plum"] as const;

/**
 * Homepage §4 — "Get Strong / Get Heart Healthy / Get Steady / Get Your
 * Life Back" (Possibility). Per-item, mirroring the existing PillarCard
 * convention (page.tsx maps over the data array) rather than
 * self-mapping — kept intentionally flat (no card border/shadow) per the
 * "avoid excessive cards" direction; this is typography, not a card grid.
 * Demo #3 visual sprint: a small accent mark + alternating sage/plum color
 * per item, so four plain text blocks in a row still read as designed
 * rather than a bare bullet list.
 */
export function OutcomeAnchor({ outcome, index = 0 }: { outcome: Outcome; index?: number }) {
  const accent = accents[index % accents.length];
  return (
    <div className="text-center sm:text-left">
      <span
        aria-hidden="true"
        className={`mb-4 inline-block h-1 w-10 rounded-full ${
          accent === "sage" ? "bg-sage-500" : "bg-plum-500"
        }`}
      />
      <h3 className="mb-2 font-display text-xl text-ink-900 sm:text-2xl">
        {outcome.anchor}
      </h3>
      <p className="text-[0.95rem] leading-relaxed text-ink-600">
        {outcome.description}
      </p>
    </div>
  );
}
