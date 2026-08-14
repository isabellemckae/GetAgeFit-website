import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { primaryNav, cta, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-display text-xl font-semibold text-ink-900">
              {siteConfig.name}
            </p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-ink-500">
              {siteConfig.tagline} Boutique healthy-aging coaching for adults
              40+ in Georgetown, Texas.
            </p>
            <Button
              href={cta.primary.href}
              size="md"
              trackCta={cta.primary.label}
              trackLocation="footer"
            >
              {cta.primary.label}
            </Button>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-400">
              Explore
            </p>
            <ul className="space-y-3 text-sm">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-600 hover:text-sage-800">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-400">
              Get Started
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/qualify" className="text-ink-600 hover:text-sage-800">
                  Qualification Experience
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-ink-600 hover:text-sage-800">
                  Schedule a Consultation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ink-600 hover:text-sage-800">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-ink-600 hover:text-sage-800">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-400">
              Visit
            </p>
            <address className="space-y-2 text-sm not-italic text-ink-600">
              <p>Georgetown, Texas</p>
              <p>{siteConfig.nap.streetAddress}</p>
              <p>{siteConfig.nap.phone}</p>
              <p>{siteConfig.nap.email}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-100 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-sage-800">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sage-800">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
