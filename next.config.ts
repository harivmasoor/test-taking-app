/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove trailing slashes from URLs
  trailingSlash: false,
}

module.exports = nextConfig
