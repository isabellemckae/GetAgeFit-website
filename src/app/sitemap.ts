import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { articles } from "@/content/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/why-getagefit",
    "/how-it-works",
    "/programs",
    "/transformations",
    "/trainers",
    "/about",
    "/resources",
    "/contact",
    "/consultation",
    "/qualify",
    "/privacy",
    "/terms",
  ];

  const articleRoutes = articles.map((a) => `/resources/${a.slug}`);

  return [...staticRoutes, ...articleRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/qualify" || route === "/consultation" ? 0.9 : 0.6,
  }));
}
