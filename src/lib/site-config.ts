/**
 * Central site configuration: NAP (name/address/phone), navigation, and the
 * CTA hierarchy used throughout the site. Keeping this in one place makes it
 * easy for the GetAgeFit team to review and correct before launch.
 *
 * ⚠️ VERIFICATION NEEDED: address, phone, and email below are placeholders.
 * See docs/CONTENT-STATUS.md for the full list of items that require
 * verified facts before launch.
 */

export const siteConfig = {
  name: "GetAgeFit",
  tagline: "Strength for every stage of life.",
  description:
    "GetAgeFit is a boutique healthy-aging personal training studio in Georgetown, Texas, helping adults 40+ build strength, capability, and independence through personalized coaching.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.getagefit.com",

  // ⚠️ VERIFICATION NEEDED — confirm exact studio address, phone, and hours.
  nap: {
    legalName: "GetAgeFit",
    streetAddress: "[CONFIRM STREET ADDRESS]",
    addressLocality: "Georgetown",
    addressRegion: "TX",
    postalCode: "[CONFIRM ZIP]",
    phone: "[CONFIRM PHONE NUMBER]",
    email: "[CONFIRM CONTACT EMAIL]",
    hours: "[CONFIRM STUDIO HOURS]",
  },

  social: {
    instagram: "",
    facebook: "",
  },

  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "/consultation",
};

export type NavLink = {
  label: string;
  href: string;
};

export const primaryNav: NavLink[] = [
  { label: "Why GetAgeFit", href: "/why-getagefit" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Programs", href: "/programs" },
  { label: "Transformations", href: "/transformations" },
  { label: "Trainers", href: "/trainers" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
];

export const footerNav: NavLink[] = [
  ...primaryNav,
  { label: "Contact", href: "/contact" },
  { label: "Qualification Experience", href: "/qualify" },
  { label: "Consultation", href: "/consultation" },
];

// Consistent CTA hierarchy — see PROMPT §33. Do not introduce competing
// primary CTAs; every page should point back to one of these.
export const cta = {
  primary: { label: "Schedule a Consultation", href: "/consultation" },
  secondary: { label: "See How It Works", href: "/how-it-works" },
  qualify: {
    label: "Find Out If GetAgeFit Is Right for You",
    href: "/qualify",
  },
  resources: { label: "Explore Resources", href: "/resources" },
};
