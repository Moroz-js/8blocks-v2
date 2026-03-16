import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/shared/config/site'

const BASE = siteConfig.url.replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const servicePages: MetadataRoute.Sitemap = siteConfig.servicesEnabled
    ? [
        { url: `${BASE}/services`,                      lastModified: now, priority: 0.9 },
        { url: `${BASE}/services/strategic-consulting`, lastModified: now, priority: 0.9 },
        { url: `${BASE}/services/tokenomics`,           lastModified: now, priority: 0.9 },
        { url: `${BASE}/services/audit`,                lastModified: now, priority: 0.9 },
      ]
    : []

  const blogStaticPage: MetadataRoute.Sitemap = siteConfig.blogEnabled
    ? [{ url: `${BASE}/blog`, lastModified: now, priority: 0.8 }]
    : []

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                     lastModified: now, priority: 1.0 },
    ...servicePages,
    ...blogStaticPage,
    { url: `${BASE}/privacy-policy`, lastModified: now, priority: 0.3 },
  ]

  if (!siteConfig.blogEnabled) {
    return staticPages
  }

  try {
    const payload = await getPayload({ config })

    const catsResult = await payload.find({
      collection: 'categories',
      limit: 200,
      sort: 'title',
    })

    const categoryPages: MetadataRoute.Sitemap = catsResult.docs.map((cat) => ({
      url:          `${BASE}/blog/${cat.slug}`,
      lastModified: now,
      priority:     0.7,
    }))

    const articlesResult = await payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      limit: 1000,
      sort: '-publishedAt',
    })

    const articlePages: MetadataRoute.Sitemap = articlesResult.docs
      .filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
      .map((doc) => ({
        url:          `${BASE}/blog/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        priority:     0.6,
      }))

    return [...staticPages, ...categoryPages, ...articlePages]
  } catch {
    return staticPages
  }
}
