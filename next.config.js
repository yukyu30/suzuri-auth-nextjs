/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // Konva & react-konvaのために必要
    return config;
  },
};

module.exports = nextConfig; 
