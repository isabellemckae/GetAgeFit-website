"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav, cta, siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/60 bg-sand-50/90 backdrop-blur">
      <div className="h-[3px] w-full bg-gradient-to-r from-sage-600 via-plum-500 to-sage-600" />
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between gap-6 px-6 md:px-10">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/brand/getagefit-logo.png"
            alt={siteConfig.name}
            width={630}
            height={81}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 xl:flex"
        >
          {primaryNav.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 whitespace-nowrap py-1 text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-sage-600 after:to-plum-500 after:transition-all after:duration-300 after:ease-soft ${
                  active
                    ? "text-sage-800 after:w-full"
                    : "text-ink-600 hover:text-sage-800 after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 xl:block">
          <Button
            href={cta.primary.href}
            size="md"
            className="whitespace-nowrap"
            trackCta={cta.primary.label}
            trackLocation="header"
          >
            {cta.primary.label}
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-800 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`xl:hidden ${open ? "block" : "hidden"} border-t border-ink-100 bg-sand-50`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 py-4">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-ink-700 hover:bg-sand-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-3">
            <Button
              href={cta.primary.href}
              size="lg"
              trackCta={cta.primary.label}
              trackLocation="mobile-nav"
            >
              {cta.primary.label}
            </Button>
            <Button
              href={cta.qualify.href}
              variant="secondary"
              size="lg"
              trackCta={cta.qualify.label}
              trackLocation="mobile-nav"
            >
              {cta.qualify.label}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
