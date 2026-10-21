/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Force HTTPS on both production domains. Vercel's edge was observed
      // serving plain http:// directly (200, no redirect) instead of
      // upgrading it, so this is enforced explicitly rather than assumed.
      // :host is captured from the request so apex and www each redirect
      // to themselves over https, not to one hardcoded domain.
      {
        source: "/:path*",
        has: [
          { type: "header", key: "x-forwarded-proto", value: "http" },
          { type: "host", value: "(?<host>.*)" },
        ],
        destination: "https://:host/:path*",
        permanent: true,
      },
      // Transformations was removed from the site (Demo #6, client-directed).
      { source: "/transformations", destination: "/", permanent: true },
      // Privacy Policy lives in the standalone legal-standalone/ project
      // (its own, independently-protected Vercel deployment — see
      // legal-standalone/README.md) rather than this app, so its content
      // can be finalized/updated without a full site redeploy. Temporary
      // (307) since the hosting URL may move to a branded subdomain later.
      {
        source: "/privacy",
        destination: "https://getagefit-legal.vercel.app/privacy",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
