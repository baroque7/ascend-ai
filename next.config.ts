import type { NextConfig } from "next";

// Baseline security headers applied to every response. Conservative settings:
// the app is never embedded elsewhere and uses no camera/mic/geolocation.
const securityHeaders = [
  // Force HTTPS for 2 years (incl. subdomains) — prevents downgrade/snooping.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Block the site from being iframed by others — anti-clickjacking.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stop the browser from guessing (sniffing) content types.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limit referrer info leaked to third parties.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features the app doesn't use.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // HTML/data responses: keep fresh, and apply the security headers.
      source: '/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-store' }, ...securityHeaders],
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
