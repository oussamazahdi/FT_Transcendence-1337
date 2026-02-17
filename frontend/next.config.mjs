/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: ["lh3.googleusercontent.com"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com/**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
