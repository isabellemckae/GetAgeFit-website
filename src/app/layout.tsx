import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { JsonLd, localBusinessJsonLd, serviceJsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Strength for Every Stage of Life`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "personal training Georgetown TX",
    "gym Georgetown TX",
    "healthy aging fitness",
    "strength training after 40",
    "12-week transformation program",
    "senior strength coaching Georgetown Texas",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Strength for Every Stage of Life`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Strength for Every Stage of Life`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd data={localBusinessJsonLd()} />
        {/* Demo #4 Part 1: previously defined but never rendered anywhere
            — wiring it up site-wide gives search engines an explicit
            Service record (ExerciseGym provider) alongside the
            LocalBusiness record above, with no visible copy change. */}
        <JsonLd data={serviceJsonLd()} />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
