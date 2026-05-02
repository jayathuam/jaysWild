/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
      },
    ],
  },
  trailingSlash: true, // Optional: adds trailing slashes to URLs
  // Turbopack configuration for yarn workspace
  turbopack: {
    root: __dirname,
  },
  // React Compiler is enabled by default in Next.js 16
}

module.exports = nextConfig
