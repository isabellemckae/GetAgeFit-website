import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Testimonial } from "@/content/testimonials";

/**
 * Homepage §6 — "Real Client Stories" (Proof). Short-form, distinct from
 * the fuller case-study TransformationCard used on /our-clients. Per-item
 * like TrainerCard/TransformationCard, since testimonials are a genuine
 * repeatable card type. All current data is placeholder — see
 * src/content/testimonials.ts.
 */
export function TestimonialQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex flex-col items-center text-center">
      <ResponsiveImage
        alt={testimonial.context}
        placeholderLabel={testimonial.photoLabel}
        aspect="aspect-square"
        className="mb-5 w-20"
      />
      <blockquote className="mb-3 font-display text-xl leading-snug text-ink-900 sm:text-2xl">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="text-sm font-medium text-ink-500">
        {testimonial.context}
      </figcaption>
    </figure>
  );
}
