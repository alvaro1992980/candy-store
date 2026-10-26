import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local MinIO, standing in for the Railway Storage Bucket in dev.
      { protocol: "http", hostname: "localhost", port: "9010", pathname: "/**" },
      // TODO(M5): add the production Railway Storage Bucket's public hostname here.
    ],
    // localhost:9010 resolves to a loopback IP, which Next 16 refuses to
    // optimize by default (SSRF guard). Only relax that in dev.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  experimental: {
    serverActions: {
      // Product photos (up to 5MB) are posted with the product form itself;
      // the extra headroom covers multipart overhead.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
