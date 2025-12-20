/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,   // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', // ⚠️ Crucial: Matches the port in your error URL
        pathname: '/uploads/**', // Allows images from the uploads folder
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
