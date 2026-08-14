import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

/**
 * Homepage §9 — "Why I Created Get Age Fit — Theo" (Founder trust).
 * Copy is VERIFIED / APPROVED verbatim from the New Website Master
 * Reference §11 and inlined directly here (single non-repeating block,
 * one instance ever) rather than a content/*.ts file — mirrors how
 * CTASection inlines its own default copy.
 */
export function FounderHomeSection() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <ResponsiveImage
        alt="Theo Thurston, founder of Get Age Fit"
        placeholderLabel="Theo Thurston portrait needed"
        aspect="aspect-[4/5]"
      />
      <div>
        <p className="mb-4 text-lg leading-relaxed text-ink-700 sm:text-xl">
          Because I believe getting older should be something we
          embrace, not something we apologize for.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-ink-700 sm:text-xl">
          Get Age Fit was created around a simple idea: You should be able
          to get stronger at any age. And you shouldn’t have to feel
          intimidated, embarrassed, or out of place to do it.
        </p>
        <p className="mb-6 font-semibold text-ink-900">
          Theo Thurston, Founder
        </p>
        <Button
          href="/about"
          variant="secondary"
          trackCta="Read Our Story"
          trackLocation="homepage-founder"
        >
          Read Our Story
        </Button>
      </div>
    </div>
  );
}
