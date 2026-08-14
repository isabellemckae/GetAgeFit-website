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
}: {
  src?: string;
  alt: string;
  placeholderLabel: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
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
        className="object-cover"
      />
    </div>
  );
}
