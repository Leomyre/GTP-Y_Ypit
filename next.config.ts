import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Désactive complètement l'optimisation
  },
};

export default nextConfig;
