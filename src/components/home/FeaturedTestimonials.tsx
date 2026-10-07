import { testimonials, featuredTestimonialSlugs } from "@/content/testimonials";

const accents = ["sage", "plum", "sage"] as const;

/**
 * Homepage §6 — "Real Client Stories", three-review editorial redesign
 * (client-directed, replacing the prior five-up single-column stack —
 * see TestimonialQuote.tsx's doc comment for that version's own history).
 *
 * Shows exactly the three testimonials named in
 * `featuredTestimonialSlugs` (src/content/testimonials.ts), in that
 * order. The other four stay in `testimonials` untouched and unused —
 * nothing is deleted, this component just doesn't render them.
 *
 * Desktop: three columns, `items-start` rather than the grid default of
 * stretch — these three quotes are very different lengths, and
 * stretching every card to match the tallest is exactly the "accidental
 * empty gap" problem the old design's doc comment describes. Each card
 * instead only ever takes the height its own words need. Tablet and
 * mobile stack to a single column for comfortable reading width.
 */
export function FeaturedTestimonials() {
  const featured = featuredTestimonialSlugs
    .map((slug) => testimonials.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 lg:items-start">
      {featured.map((testimonial, i) => {
        const accent = accents[i % accents.length];
        return (
          <figure
            key={testimonial.slug}
            className="rounded-xl2 bg-sand-50 p-8 sm:p-9"
          >
            <span
              aria-hidden="true"
              className="mb-3 block font-display text-3xl leading-none text-plum-300"
            >
              &ldquo;
            </span>
            <blockquote className="whitespace-pre-line text-lg leading-relaxed text-ink-900 sm:text-xl">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`h-1 w-8 shrink-0 rounded-full ${
                  accent === "sage" ? "bg-sage-500" : "bg-plum-500"
                }`}
              />
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-sage-700">
                {testimonial.context}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
