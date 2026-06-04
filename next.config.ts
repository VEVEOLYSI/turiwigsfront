import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — used for all uploaded product/service/avatar images
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Allow any https source as a fallback for externally-sourced images
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
