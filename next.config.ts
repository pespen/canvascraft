import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Configure images to work with static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
