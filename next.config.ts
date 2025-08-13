import type { NextConfig } from "next";

const API_HOSTNAME = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('https://', '') || 'fakestoreapi.com';

const nextConfig: NextConfig = {
  // Enable React 15 features compatibility
  reactStrictMode: true,

  // Optimize images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        pathname: '/img/**',
      },
    ],
    // Enable image optimization
    unoptimized: false,
    // Add domains for backward compatibility
    domains: ['fakestoreapi.com'],
    // Configure image sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configure caching for better performance
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
