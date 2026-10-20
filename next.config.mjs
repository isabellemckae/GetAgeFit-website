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
