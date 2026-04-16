import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  allowedDevOrigins: ['192.168.11.105'],

  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: "https://samplelib.com/lib/preview/:path*",
      },
    ];
  },
};

export default nextConfig;
