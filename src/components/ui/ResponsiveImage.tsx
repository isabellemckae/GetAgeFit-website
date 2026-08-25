import { ReactNode } from "react";
import Image from "next/image";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

/**
 * The insertion seam for real Get Age Fit photography (Demo #2 decision
 * #6). Every call site passes a descriptive `placeholderLabel` up front;
 * until a real `src` is supplied, it renders the same on-brand
 * PhotoPlaceholder used throughout the app. Once a photo file exists,
 * passing `src` (and keeping the same `alt`) is the only change needed —
 * no section restructuring.
 *
 * Demo #3 editorial pass: `imageClassName` lets a real photo be reframed
 * per placement (e.g. `object-top`, `object-[center_20%]`) and `children`
 * lets a call site layer a color tint/scrim (an absolutely-positioned div)
 * or a badge on top of the photo — this is how the same 17 real photos in
 * this repo get reused across many pages without looking like the same
 * image pasted twice: different crop, different tint, different framing
 * each time. Neither prop changes any existing call site's rendering
 * (both default to empty).
 *
 * Not wired into next.config.mjs `images.remotePatterns` yet since no
 * external image host is in use; add that only when real photos are
 * hosted somewhere other than /public.
 */
export function ResponsiveImage({
  src,
  alt,
  placeholderLabel,
  aspect = "aspect-[4/5]",
  sizes = "100vw",
  priority = false,
  className = "",
  imageClassName = "",
  children,
}: {
  src?: string;
  alt: string;
  placeholderLabel: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  if (!src) {
    return (
      <PhotoPlaceholder
        label={placeholderLabel}
        aspect={aspect}
        className={className}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl2 ${aspect} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
      {children}
    </div>
  );
}
