import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      // Only allow Unsplash in development
      ...(process.env.NODE_ENV === 'development' ? [{
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }] : []),
    ],
  },
};

export default nextConfig;
