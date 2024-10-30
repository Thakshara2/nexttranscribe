/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' as it's not needed for Vercel deployment
  // and might prevent some Next.js features from working
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**',
      },
    ],
    // Remove unoptimized: true as Vercel handles image optimization
  },
  // Add Vercel-specific optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig