/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        pathname: '/image/**'
      },
      {
        protocol: 'https',
        hostname: 'newjams-images.scdn.co',
        pathname: '/image/**'
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
        pathname: '/image/**'
      }
    ]
  },
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]]
  }
}

module.exports = nextConfig
