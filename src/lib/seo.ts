import { siteConfig } from "./site-config";

/**
 * Per-page Open Graph / Twitter metadata — PROMPT (Oct 2026) Task 7A.
 *
 * Next.js metadata resolution does NOT apply a page's own `title`/
 * `description` to `openGraph`/`twitter` automatically — a page that
 * defines only `title`/`description` silently inherits the ROOT layout's
 * generic Open Graph block (same title/description for every page) when
 * shared on social media. This reuses the exact title/description a page
 * already approved for its `<title>`/meta description tag, so sharing any
 * page gives it its own accurate preview instead of the homepage's.
 */
export function pageOpenGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = `${siteConfig.url}${path}`;
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}
