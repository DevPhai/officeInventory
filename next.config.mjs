/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    allowedDevOrigins: ['127.0.0.1']
  }
};

export default nextConfig;
