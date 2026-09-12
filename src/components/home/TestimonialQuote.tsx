import { Testimonial } from "@/content/testimonials";

const accents = ["sage", "plum"] as const;

/**
 * Homepage §6 — "Real Client Stories". Redesigned (Demo #5) from a
 * 3-up equal-width card grid into a single, editorial column of
 * full-width pull-quotes.
 *
 * Why: the five approved testimonials vary a lot in length (roughly
 * 260 to 700 characters). In a grid, CSS stretches every card in a row
 * to match the row's tallest one — so the short testimonials ended up
 * with a large empty gap at the bottom just to line up with the long
 * ones next to them, which read as accidental, not designed. A single
 * stacked column has no row to match: each entry only ever takes the
 * vertical space its own words need, so five different lengths sit
 * comfortably next to each other instead of fighting a shared grid.
 *
 * No photos: none exist for these clients, and per direction this
 * section is now 100% typographic — no placeholder avatars, initials,
 * or generated images stand in for them. No star rating either — a
 * row of star icons is the signature look of a generic
 * reviews-carousel, which this section is deliberately moving away
 * from in favor of the quote and the name carrying the whole thing.
 * The small accent bar under each quote (alternating sage/plum) is the
 * same restrained "signature mark instead of decoration" motif already
 * used by OutcomeAnchor.tsx elsewhere on this page.
 */
export function TestimonialQuote({
  testimonial,
  index = 0,
}: {
  testimonial: Testimonial;
  index?: number;
}) {
  const accent = accents[index % accents.length];
  return (
    <figure className="py-12 first:pt-0 last:pb-0 sm:py-14">
      <span
        aria-hidden="true"
        className="mb-3 block font-display text-6xl leading-none text-plum-200 sm:text-7xl"
      >
        &ldquo;
      </span>
      <blockquote className="max-w-3xl font-display text-xl leading-relaxed text-ink-900 sm:text-2xl sm:leading-relaxed">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`h-1 w-10 shrink-0 rounded-full ${
            accent === "sage" ? "bg-sage-500" : "bg-plum-500"
          }`}
        />
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-sage-700">
          {testimonial.context}
        </span>
      </figcaption>
    </figure>
  );
}
