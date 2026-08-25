import { Button } from "@/components/ui/Button";
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
    <section className="bg-mesh-dark py-20 md:py-28">
      <div className="blob -left-24 top-0 h-72 w-72 bg-sage-500/25" />
      <div className="blob -right-16 bottom-0 h-80 w-80 bg-plum-400/20" />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sage-300">
            {eyebrow}
          </p>
          <h2 className="mb-5 text-3xl text-sand-50 md:text-4xl">{heading}</h2>
          <p className="mb-9 text-lg leading-relaxed text-sand-200/90">{body}</p>
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
              className="border-sand-50/40 text-sand-50 hover:border-sand-50 hover:bg-sand-50/10"
              trackCta={cta.qualify.label}
              trackLocation={location}
            >
              {cta.qualify.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
