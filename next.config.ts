import type { NextConfig } from "next";

const isWindows = process.platform === "win32";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    ...(isWindows ? { cpus: 1 } : {}),
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
