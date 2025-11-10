import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xdxvqlvaiagsvtezaaft.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
