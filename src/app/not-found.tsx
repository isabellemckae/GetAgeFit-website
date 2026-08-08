import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section tone="sand" className="text-center">
      <Eyebrow>Page Not Found</Eyebrow>
      <h1 className="mb-5 text-3xl md:text-4xl">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mx-auto mb-8 max-w-md text-lg leading-relaxed text-ink-600">
        Let&rsquo;s get you back to something useful.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button href="/" trackCta="Return Home" trackLocation="404">
          Return Home
        </Button>
        <Button
          href="/consultation"
          variant="secondary"
          trackCta="Schedule a Consultation"
          trackLocation="404"
        >
          Schedule a Consultation
        </Button>
      </div>
    </Section>
  );
}
