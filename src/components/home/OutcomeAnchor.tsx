import { Outcome } from "@/content/outcomes";

/**
 * Homepage §4 — "Get Strong / Get Heart Healthy / Get Steady / Get Your
 * Life Back" (Possibility). Per-item, mirroring the existing PillarCard
 * convention (page.tsx maps over the data array) rather than
 * self-mapping — kept intentionally flat (no card border/shadow) per the
 * "avoid excessive cards" direction; this is typography, not a card grid.
 */
export function OutcomeAnchor({ outcome }: { outcome: Outcome }) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="mb-2 font-display text-xl text-ink-900 sm:text-2xl">
        {outcome.anchor}
      </h3>
      <p className="text-[0.95rem] leading-relaxed text-ink-600">
        {outcome.description}
      </p>
    </div>
  );
}
