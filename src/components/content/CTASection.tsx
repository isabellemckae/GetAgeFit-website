import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { cta } from "@/lib/site-config";

export function CTASection({
  eyebrow = "Ready when you are",
  heading = "Let's find out if GetAgeFit is the right fit.",
  body = "A short conversation is all it takes to understand your goals, your history, and whether our coaching model is right for you.",
  location = "cta-section",
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  location?: string;
}) {
  return (
    <Section tone="sage">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sage-200">
          {eyebrow}
        </p>
        <h2 className="mb-5 text-3xl md:text-4xl">{heading}</h2>
        <p className="mb-9 text-lg leading-relaxed text-sage-100">{body}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            href={cta.primary.href}
            variant="light"
            size="lg"
            trackCta={cta.primary.label}
            trackLocation={location}
          >
            {cta.primary.label}
          </Button>
          <Button
            href={cta.qualify.href}
            variant="secondary"
            size="lg"
            className="border-sand-50/40 text-sand-50 hover:border-sand-50 hover:bg-sage-700"
            trackCta={cta.qualify.label}
            trackLocation={location}
          >
            {cta.qualify.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
