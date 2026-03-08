import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: [
    "@my-knowledge/config",
    "@my-knowledge/contracts",
    "@my-knowledge/db",
    "@my-knowledge/utils",
  ],
};

export default nextConfig;
