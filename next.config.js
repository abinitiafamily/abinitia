/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
