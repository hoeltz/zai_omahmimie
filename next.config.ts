import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration
  reactStrictMode: true,
  
  // Image configuration
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  
  // Development-friendly settings
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
