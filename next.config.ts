import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // Keep HTML/data responses fresh — no stale pages.
      source: '/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-store' }],
    },
    {
      // Build assets are content-hashed & immutable — cache hard for speed.
      // Listed second so it overrides the no-store above for these files only.
      source: '/_next/static/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};

export default nextConfig;
