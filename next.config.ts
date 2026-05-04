import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

/**
 * CSP: GTM/GA, Replain (widget, app, ws, медиа), Calendly, Google Maps embed.
 * В dev для React/Next (Turbopack) добавляется 'unsafe-eval' — в production его нет.
 */
function buildContentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV === "development";

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://www.googletagmanager.com",
    "https://widget.replain.cc",
    "https://assets.calendly.com",
  ].join(" ");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com https://widget.replain.cc",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "media-src 'self' https://widget.replain.cc",
    "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://widget.replain.cc wss://widget.replain.cc wss://ws.replain.cc https://app.replain.cc wss://app.replain.cc https://calendly.com https://*.calendly.com",
    "frame-src https://www.googletagmanager.com https://www.google.com https://maps.google.com https://calendly.com https://*.calendly.com https://widget.replain.cc",
    "worker-src 'self' blob:",
  ].join("; ");
}

const CONTENT_SECURITY_POLICY = buildContentSecurityPolicy();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  images: {
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/team/**" },
      { pathname: "/partners/**" },
      { pathname: "/icons/**" },
      { pathname: "/img/**" },
      { pathname: "/api/media/file/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default withPayload(nextConfig);
