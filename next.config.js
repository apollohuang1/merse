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
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SECRET: process.env.SECRET,
    STRIPE_PUBLISABLE_KEY: process.env.STRIPE_PUBLISABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  }
}

module.exports = nextConfig