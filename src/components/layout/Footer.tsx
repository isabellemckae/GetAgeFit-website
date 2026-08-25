import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { primaryNav, cta, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-mesh-dark">
      <div className="blob -left-24 -top-24 h-72 w-72 bg-sage-600/25" />
      <div className="blob -bottom-32 -right-16 h-80 w-80 bg-plum-500/20" />
      <Container className="relative py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-3 flex items-center gap-2.5 font-display text-xl font-semibold text-sand-50">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sage-500 to-plum-500 text-sm font-bold text-sand-50"
              >
                GA
              </span>
              {siteConfig.name}
            </p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-sand-200/80">
              {siteConfig.tagline} Healthy-aging coaching for adults 40+ in
              Georgetown, Texas.
            </p>
            <Button
              href={cta.primary.href}
              size="md"
              variant="light"
              trackCta={cta.primary.label}
              trackLocation="footer"
            >
              {cta.primary.label}
            </Button>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-sand-50/50">
              Explore
            </p>
            <ul className="space-y-3 text-sm">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sand-200/90 hover:text-sand-50">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-sand-50/50">
              Get Started
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/qualify" className="text-sand-200/90 hover:text-sand-50">
                  Qualification Experience
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-sand-200/90 hover:text-sand-50">
                  Schedule a Consultation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sand-200/90 hover:text-sand-50">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sand-200/90 hover:text-sand-50">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-sand-50/50">
              Visit
            </p>
            <address className="space-y-2 text-sm not-italic text-sand-200/90">
              <p>Georgetown, Texas</p>
              <p>{siteConfig.nap.streetAddress}</p>
              <p>{siteConfig.nap.phone}</p>
              <p>{siteConfig.nap.email}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-sand-50/10 pt-8 text-xs text-sand-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-sand-50">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sand-50">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
