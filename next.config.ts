import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local MinIO, standing in for the Railway Storage Bucket in dev.
      { protocol: "http", hostname: "localhost", port: "9010", pathname: "/**" },
      // TODO(M5): add the production Railway Storage Bucket's public hostname here.
    ],
  },
};

export default nextConfig;
