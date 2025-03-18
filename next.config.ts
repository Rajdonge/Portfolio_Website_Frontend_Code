import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.67',
        port: '8000',
        pathname: '/media/logo/**', // Allow all images in the /media/logo/ directory
      },
    ],
  },
};

export default nextConfig;
