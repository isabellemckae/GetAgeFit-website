/**
 * Central site configuration: NAP (name/address/phone), navigation, and the
 * CTA hierarchy used throughout the site. Keeping this in one place makes it
 * easy for the GetAgeFit team to review and correct before launch.
 *
 * NAP below is sourced from the current live site
 * (docs/CONTENT-STATUS.md → "Legacy Site Baseline"), captured August 2026.
 * It's operational fact (address/phone/hours), not a performance claim, so
 * it's used directly — but reconfirm it's still current before launch.
 */

export const siteConfig = {
  name: "GetAgeFit",
  tagline: "Strength for every stage of life.",
  description:
    "GetAgeFit is a healthy-aging personal training studio in Georgetown, Texas, helping adults 40+ build strength, capability, and independence through a personalized 12-week transformation experience.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.getagefit.com",

  nap: {
    legalName: "GetAgeFit",
    streetAddress: "3626 Williams Drive, Suite 200",
    addressLocality: "Georgetown",
    addressRegion: "TX",
    postalCode: "78628",
    phone: "(512) 591-7923",
    email: "info@getagefit.com",
    hours: "Mon–Fri 5:00am–8:00pm · Sat 7:00am–4:00pm · Sun by appointment",
  },

  social: {
    instagram: "",
    facebook: "",
    // TODO(Demo #4 Part 2.5): set once GetAgeFit supplies the verified
    // Google Business Profile reviews URL. Left blank rather than guessed —
    // the "Explore 150+ Five-Star Reviews" link on the homepage falls back
    // to a non-navigating placeholder until this is filled in.
    googleReviews: "",
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
