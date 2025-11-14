import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Disable turbopack due to path encoding issues with non-ASCII characters
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
