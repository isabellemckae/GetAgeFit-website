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
 * Desktop (lg+): three equal-height columns. The three quotes are very
 * different lengths (roughly 350–700 characters), so each card clamps its
 * quote to the same number of lines (`line-clamp-6`) rather than showing
 * it in full — uniform line count is what makes the cards come out even,
 * not a guessed fixed height. Hovering (mouse) or focusing (keyboard —
 * the card itself is tabbable) lifts the clamp to reveal the full quote;
 * a soft fade at the clamped edge hints that there's more to read. The
 * full quote is always present in the DOM either way (line-clamp is CSS
 * truncation only), so screen readers always hear the complete quote
 * regardless of hover state.
 *
 * Tablet and mobile stack to a single column, where there's no row to
 * keep even and no hover affordance to rely on — so the clamp/fade/hint
 * are desktop-only (`lg:`) and these breakpoints just show the full
 * quote plainly.
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
            tabIndex={0}
            className="group relative rounded-xl2 bg-sand-50 p-8 sm:p-9"
          >
            <span
              aria-hidden="true"
              className="mb-3 block font-display text-3xl leading-none text-plum-300"
            >
              &ldquo;
            </span>
            <div className="relative">
              <blockquote className="whitespace-pre-line text-lg leading-relaxed text-ink-900 sm:text-xl lg:line-clamp-6 lg:group-hover:line-clamp-none lg:group-focus-within:line-clamp-none">
                {testimonial.quote}
              </blockquote>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-10 bg-gradient-to-t from-sand-50 to-transparent lg:block lg:group-hover:hidden lg:group-focus-within:hidden"
              />
            </div>
            <p
              aria-hidden="true"
              className="mt-2 hidden text-xs font-medium text-ink-400 lg:block lg:group-hover:hidden lg:group-focus-within:hidden"
            >
              Hover to read the full quote
            </p>
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
