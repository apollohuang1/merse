/** @type {import('next').NextConfig} */
// next.config.js
require('dotenv').config();

const nextConfig = {
  experimental: { appDir: true, serverComponentsExternalPackages: ["mongoose"] },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    STABLE_DIFFUSION_API_KEY: process.env.STABLE_DIFFUSION_API_KEY,
  }
}

module.exports = nextConfig