import Image from "next/image";
import { testimonials, featuredTestimonialSlugs } from "@/content/testimonials";

// Client-supplied real photo for Brenda Brand's circular badge. Kept as a
// local lookup (not a field on the shared Testimonial type) since most
// other testimonials have no photo on file — see testimonials.ts's own
// doc comment. Only "brenda-brand" is ever looked up here now, but the
// map stays keyed by slug (not hardcoded to one path) so a future
// featured testimonial with a photo on file picks one up automatically.
const photosBySlug: Record<string, string> = {
  "lisa-sanders": "/images/testimonials/lisa-sanders.webp",
  "brenda-brand": "/images/testimonials/brenda-brand.webp",
  "j-bryant-boyd": "/images/testimonials/j-bryant-boyd.webp",
};

/**
 * Homepage §6 — "Real Client Stories", single-testimonial redesign
 * (round 11, client-directed): replaces the prior three-card staggered
 * zig-zag layout (solid-color cards, alternating offset, line-clamp +
 * hover-to-reveal) with one centered, typographic testimonial — simpler
 * and more elegant by design now that there's only one review competing
 * for space, not three. No card background, border, or shadow: just the
 * client's photo, her quote, and her name, generously spaced on the
 * section's own white background.
 *
 * No star rating: these testimonials carry no verified star rating, and
 * fabricating one has been explicitly ruled out since earlier in this
 * project (see testimonials.ts) — "preserve the existing star-rating
 * display" has nothing to preserve, since there never was one.
 *
 * Shows exactly the testimonial(s) named in `featuredTestimonialSlugs`
 * (src/content/testimonials.ts) — currently just "brenda-brand". The
 * other six stay in `testimonials` untouched and unused, same as before.
 */
export function FeaturedTestimonials() {
  const featured = featuredTestimonialSlugs
    .map((slug) => testimonials.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto max-w-2xl text-center">
      {featured.map((testimonial) => {
        const photo = photosBySlug[testimonial.slug];
        const initial = testimonial.context.trim().charAt(0).toUpperCase();

        return (
          <figure key={testimonial.slug}>
            <span className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-sage-100 shadow-card sm:h-24 sm:w-24">
              {photo ? (
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <span className="font-display text-3xl text-sage-700">
                  {initial}
                </span>
              )}
            </span>
            <blockquote className="whitespace-pre-line font-display text-xl italic leading-relaxed text-ink-800 sm:text-2xl">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-sage-700">
              {testimonial.context}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
