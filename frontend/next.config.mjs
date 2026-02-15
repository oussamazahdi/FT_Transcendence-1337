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
        protocol: 'http',
        hostname: '172.25.22.85',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

// 	images: {
//     // local static assets are fine
//     // unoptimized: false,
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/uploads/:path*",
//         // ✅ if NOT using Docker
//         destination: "http://127.0.0.1:3001/uploads/:path",

//         // ✅ if using Docker, replace with:
//         // destination: "http://backend:3001/uploads/:path*",
//       },
//     ];
//   },
//   /* config options here */
};

export default nextConfig;
