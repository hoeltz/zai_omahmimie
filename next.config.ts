import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Image optimization for production
  images: {
    domains: ['localhost'],
    unoptimized: true, // For Vercel deployment
  },
  
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  
  // Build optimizations
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checking
  },
  
  // Server external packages
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
