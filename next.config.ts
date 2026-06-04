import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cache optimised images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Serve modern formats (avif → webp → original)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
