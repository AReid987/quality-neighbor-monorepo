/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: [
    "@qn/auth",
    "@qn/database",
    "@qn/ui",
    "@qn/types",
    "@qn/config",
  ],
};

module.exports = nextConfig;
