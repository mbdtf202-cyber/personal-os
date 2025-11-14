import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable turbopack due to path encoding issues with non-ASCII characters
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
