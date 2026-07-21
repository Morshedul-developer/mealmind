import type { NextConfig } from "next";

// Same-origin proxy for the backend: the frontend (Vercel) and backend
// (Render) are on different registrable domains, so the session cookie
// would otherwise be third-party — already blocked in Incognito, and on
// its way to being blocked everywhere as third-party cookies phase out.
// Routing /api/* through Next.js's own server means the browser only ever
// talks to its own origin; Set-Cookie then looks first-party.
// Override via BACKEND_ORIGIN for local dev against a local backend
// (keep this default in sync with the one in src/lib/api.ts).
const backendOrigin =
  process.env.BACKEND_ORIGIN ?? "https://mealmind-backend-aw95.onrender.com";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
