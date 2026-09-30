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
      // About was renamed to Founder (Demo #6) — old links/bookmarks keep working.
      { source: "/about", destination: "/founder", permanent: true },
      // Transformations was removed from the site (Demo #6, client-directed).
      { source: "/transformations", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
