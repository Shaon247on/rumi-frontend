import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const nextConfig: NextConfig = {
  // standalone output for Docker (required for containerized deployments)
  // output: 'standalone',
  // typedRoutes: true,

  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'consequence-string-quarterly-deny.trycloudflare.com' },
      { hostname: 'api.glowmi.net' },
    ],
  },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
