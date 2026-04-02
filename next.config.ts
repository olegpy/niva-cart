import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 15 features compatibility
  reactStrictMode: true,

  // Optimize images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.escuelajs.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdsassets.apple.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
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
