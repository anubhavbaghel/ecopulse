import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'googleusercontent.com' },
    ],
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', '@google/genai'],
  },
};

export default nextConfig;
