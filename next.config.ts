import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
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