import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Self-contained server bundle, to package as a Lambda Web Function
  output: 'standalone',
};

export default nextConfig;
