import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  // Enable React 15 features compatibility
  reactStrictMode: true,
  transpilePackages: ["@niva/support-realtime"],

  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configure caching for better performance
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
