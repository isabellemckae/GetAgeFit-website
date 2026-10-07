import { testimonials, featuredTestimonialSlugs } from "@/content/testimonials";

const accents = ["sage", "plum", "sage"] as const;

/**
 * Homepage §6 — "Real Client Stories", three-review editorial redesign
 * (client-directed — matching the visual *style* of a Canva reference
 * video: solid-color cards, a circular badge breaking the card's corner,
 * staggered alternating offset down the page, name-then-quote hierarchy).
 *
 * Two deliberate departures from that reference, both required by
 * standing instructions from earlier in this project:
 * - No star-rating icons — these testimonials carry no verified star
 *   rating, and fabricating one was explicitly ruled out.
 * - No face photo in the circular badge — there's no approved client
 *   photo for any of these three, and a stock/generic face would
 *   misrepresent a real person. The badge instead holds the client's
 *   initial, keeping the "circle breaks the card's corner" look without
 *   inventing imagery of someone.
 *
 * Shows exactly the three testimonials named in
 * `featuredTestimonialSlugs` (src/content/testimonials.ts), in that
 * order. The other four stay in `testimonials` untouched and unused.
 *
 * The three quotes are very different lengths (roughly 350–700
 * characters), so each card still clamps its quote (`line-clamp-6`) and
 * reveals the full text on hover or keyboard focus (the card itself is
 * tabbable) — same mechanism as before, just restyled for the new dark
 * cards, including a fade that matches each card's own accent color
 * rather than a fixed one. The clamp/fade/hint only apply on genuinely
 * hover-capable devices (`@media (hover: hover)`) — touch devices have no
 * reliable hover, so there the quote just shows in full, unclamped, with
 * no "hover to read more" hint that would be misleading on a touchscreen.
 * The full quote is always present in the DOM regardless (line-clamp is
 * CSS truncation only), so screen readers always hear it complete.
 *
 * The staggered zig-zag is the reference's own structure at every width
 * — it's inherently a single vertical column, not a grid with a separate
 * desktop variant — so this same layout runs from mobile through
 * desktop, just within the page's normal content width rather than the
 * reference's full-bleed 1080×1920 canvas.
 */
export function FeaturedTestimonials() {
  const featured = featuredTestimonialSlugs
    .map((slug) => testimonials.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto max-w-2xl">
      {featured.map((testimonial, i) => {
        const accent = accents[i % accents.length];
        const badgeOnRight = i % 2 === 0;
        const initial = testimonial.context.trim().charAt(0).toUpperCase();
        const cardBg = accent === "sage" ? "bg-sage-800" : "bg-plum-800";
        const fadeFrom = accent === "sage" ? "from-sage-800" : "from-plum-800";
        const badgeText = accent === "sage" ? "text-sage-700" : "text-plum-700";

        return (
          <div
            key={testimonial.slug}
            className={`relative w-[90%] sm:w-[85%] ${
              badgeOnRight ? "mr-auto" : "ml-auto"
            } ${i > 0 ? "-mt-4 sm:-mt-6" : ""}`}
            style={{ zIndex: i + 1 }}
          >
            <span
              aria-hidden="true"
              className={`absolute -top-6 flex h-16 w-16 items-center justify-center rounded-full bg-sand-50 shadow-card sm:h-20 sm:w-20 ${
                badgeOnRight ? "-right-5 sm:-right-6" : "-left-5 sm:-left-6"
              }`}
            >
              <span className={`font-display text-2xl sm:text-3xl ${badgeText}`}>
                {initial}
              </span>
            </span>

            <figure
              tabIndex={0}
              className={`group rounded-xl2 p-7 pt-9 shadow-soft sm:p-8 sm:pt-10 ${cardBg} ${
                badgeOnRight ? "pr-16 sm:pr-20" : "pl-16 sm:pl-20"
              }`}
            >
              <figcaption className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1 w-8 shrink-0 rounded-full bg-sand-50/60"
                />
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-sand-50">
                  {testimonial.context}
                </span>
              </figcaption>
              <div className="relative">
                <blockquote className="whitespace-pre-line text-base leading-relaxed text-sand-100 [@media(hover:hover)]:line-clamp-6 group-focus-within:line-clamp-none group-hover:line-clamp-none sm:text-lg">
                  {testimonial.quote}
                </blockquote>
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 hidden h-10 bg-gradient-to-t [@media(hover:hover)]:block ${fadeFrom} to-transparent group-hover:hidden group-focus-within:hidden`}
                />
              </div>
              <p
                aria-hidden="true"
                className="mt-2 hidden text-xs font-medium text-sand-200/80 [@media(hover:hover)]:block group-hover:hidden group-focus-within:hidden"
              >
                Hover to read the full quote
              </p>
            </figure>
          </div>
        );
      })}
    </div>
  );
}
