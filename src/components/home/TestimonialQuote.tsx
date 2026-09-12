import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Testimonial } from "@/content/testimonials";

/**
 * Homepage §6 — "Real Client Stories" (Proof). Short-form, distinct from
 * the fuller case-study TransformationCard used on /our-clients. Per-item
 * like TrainerCard/TransformationCard, since testimonials are a genuine
 * repeatable card type. Data is five real, approved client testimonials —
 * see src/content/testimonials.ts. No real client photos exist yet, so
 * each still renders through the standard placeholder image.
 */
function StarRating() {
  return (
    <div className="mb-4 flex items-center gap-1 text-sage-600" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative flex flex-col items-center rounded-xl2 border border-ink-100 bg-white px-6 py-9 text-center shadow-card">
      <span
        aria-hidden="true"
        className="absolute -top-5 font-display text-6xl leading-none text-plum-200"
      >
        “
      </span>
      <ResponsiveImage
        alt={testimonial.context}
        placeholderLabel={testimonial.photoLabel}
        aspect="aspect-square"
        className="mb-5 w-24 !rounded-full ring-4 ring-sage-100"
      />
      <StarRating />
      <blockquote className="mb-3 font-display text-xl leading-snug text-ink-900 sm:text-2xl">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="text-sm font-medium text-sage-700">
        {testimonial.context}
      </figcaption>
    </figure>
  );
}
