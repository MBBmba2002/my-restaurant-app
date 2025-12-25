import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/my-restaurant-app",
  assetPrefix: "/my-restaurant-app/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
