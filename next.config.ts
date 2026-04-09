import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// const CONTENT_SECURITY_POLICY = [
//   "default-src 'self'",
//   "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://widget.replain.cc",
//   "img-src 'self' data: https:",
//   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//   "font-src 'self' https://fonts.gstatic.com data:",
//   "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://widget.replain.cc",
//   "frame-src https://www.googletagmanager.com",
// ].join("; ");

const nextConfig: NextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Strict-Transport-Security",
  //           value: "max-age=63072000; includeSubDomains; preload",
  //         },
  //         { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  //         { key: "X-Content-Type-Options", value: "nosniff" },
  //         { key: "X-Frame-Options", value: "SAMEORIGIN" },
  //         {
  //           key: "Referrer-Policy",
  //           value: "strict-origin-when-cross-origin",
  //         },
  //       ],
  //     },
  //   ];
  // },

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
