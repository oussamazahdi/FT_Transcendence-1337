/** @type {import('next').NextConfig} */
const nextConfig = {
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
