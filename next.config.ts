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
        hostname: API_HOSTNAME,
        pathname: '/img/**',
      },
    ],
    // Enable image optimization
    unoptimized: false,
  },

  // Configure caching for better performance
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
