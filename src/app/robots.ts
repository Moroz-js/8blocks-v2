import type { MetadataRoute } from 'next'
import { siteConfig } from '@/shared/config/site'

const BASE = siteConfig.url.replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
