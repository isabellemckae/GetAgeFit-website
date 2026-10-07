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
    "/privacy",
    "/terms",
  ];

  return staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/qualify" || route === "/consultation" ? 0.9 : 0.6,
  }));
}
