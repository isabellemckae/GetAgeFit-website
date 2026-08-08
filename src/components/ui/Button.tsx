"use client";

import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-soft focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-sage-700 text-sand-50 hover:bg-sage-800 shadow-card hover:shadow-soft",
  secondary:
    "bg-transparent text-sage-800 border border-sage-700/40 hover:border-sage-700 hover:bg-sage-50",
  ghost: "bg-transparent text-ink-800 hover:bg-ink-100",
  light:
    "bg-sand-50 text-ink-900 hover:bg-white shadow-card hover:shadow-soft",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** CTA label to record in analytics (see PROMPT §33 CTA hierarchy). */
  trackCta?: string;
  /** Section/page context for the click, e.g. "hero", "footer". */
  trackLocation?: string;
};

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    trackCta,
    trackLocation = "unknown",
    ...rest
  } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleTrack = () => {
    if (trackCta) {
      trackEvent({ name: "cta_click", cta: trackCta, location: trackLocation });
    }
  };

  if ("href" in props && props.href) {
    const { href, onClick, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <Link
        href={href}
        className={classes}
        onClick={(e) => {
          handleTrack();
          onClick?.(e);
        }}
        {...anchorRest}
      >
        {props.children}
      </Link>
    );
  }

  const { onClick, ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      onClick={(e) => {
        handleTrack();
        onClick?.(e);
      }}
      {...buttonRest}
    >
      {props.children}
    </button>
  );
}
