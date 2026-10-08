import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/why-getagefit",
    "/how-it-works",
    "/programs",
    "/trainers",
    "/about",
    "/founder",
    "/resources",
    "/faq",
    "/contact",
    "/consultation",
    "/qualify",
    // /privacy and /terms are intentionally left out: both are marked
    // `robots: { index: false }` (placeholder legal content pending
    // counsel review — see their own page.tsx), and listing a noindex
    // page in the sitemap sends crawlers contradictory signals.
  ];

  return staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/qualify" || route === "/consultation" ? 0.9 : 0.6,
  }));
}
