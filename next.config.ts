import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ['image.tmdb.org'],
  },
};

export default nextConfig;
