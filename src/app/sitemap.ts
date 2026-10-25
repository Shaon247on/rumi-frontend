import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://glowmi.com'
  const locales = ['en', 'ar']

  // Define main pages
  const routes = ['', '/about', '/contact', '/privacy-policy', '/terms', '/faq']

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      })
    }
  }

  return sitemapEntries
}
