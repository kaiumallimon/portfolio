import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ucam.uiu.ac.bd",
      },
      {
        protocol: "https",
        hostname: "nomrxaytlgdddhwjkkqo.supabase.co",
      },
    ],
  },
};

export default nextConfig;
