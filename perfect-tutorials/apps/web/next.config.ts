import path from "node:path";
import type { NextConfig } from "next";
import { apiOrigin } from "./lib/env";

const clerkOrigins = [
  "https://*.clerk.accounts.dev",
  "https://*.clerk.dev",
  "https://*.clerk.com",
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  `img-src 'self' data: blob: ${clerkOrigins.join(" ")}`,
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src 'self' 'unsafe-inline' ${clerkOrigins.join(" ")}`,
  `connect-src 'self' ${apiOrigin} ${clerkOrigins.join(" ")}`,
  `frame-src 'self' ${clerkOrigins.join(" ")}`,
  "object-src 'none'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const forwardedHostPatterns = new Set<string>([
  "localhost:3000",
  "127.0.0.1:3000",
  "*.app.github.dev",
  "*.github.dev",
]);

if (siteUrl) {
  try {
    forwardedHostPatterns.add(new URL(siteUrl).host);
  } catch {
    // Ignore invalid env values and rely on the default local/dev hosts.
  }
}

const codespacesName = process.env.CODESPACE_NAME;
const internalApiBaseUrl =
  process.env.INTERNAL_API_BASE_URL ?? "http://127.0.0.1:3001/api";

if (codespacesName) {
  forwardedHostPatterns.add(`${codespacesName}-3000.app.github.dev`);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  experimental: {
    serverActions: {
      allowedOrigins: [...forwardedHostPatterns],
    },
  },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${internalApiBaseUrl}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
