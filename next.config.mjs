/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  serverExternalPackages: ["@mastra/core"],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
