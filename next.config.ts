import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    GRID_API_URL: process.env.GRID_API_URL,
  },
};

export default nextConfig;
