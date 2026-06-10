import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/shared/config/site'
import { getBlogEnabled } from '@/shared/lib/getBlogEnabled'
import { getResearchEnabled } from '@/shared/lib/getResearchEnabled'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'
import { visiblePublishedResearchWhere } from '@/shared/lib/visible-research-where'

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

  const hasVisibleBlog = siteConfig.blogEnabled && (await getBlogEnabled())
  const hasVisibleResearch = await getResearchEnabled()

  const blogStaticPage: MetadataRoute.Sitemap = hasVisibleBlog
    ? [{ url: `${BASE}/blog`, lastModified: now, priority: 0.8 }]
    : []

  const researchStaticPage: MetadataRoute.Sitemap = hasVisibleResearch
    ? [{ url: `${BASE}/research`, lastModified: now, priority: 0.8 }]
    : []

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                     lastModified: now, priority: 1.0 },
    ...servicePages,
    ...blogStaticPage,
    ...researchStaticPage,
    { url: `${BASE}/privacy-policy`, lastModified: now, priority: 0.3 },
  ]

  if (!hasVisibleBlog && !hasVisibleResearch) {
    return staticPages
  }

  try {
    const payload = await getPayload({ config })

    const researchPages: MetadataRoute.Sitemap = hasVisibleResearch
      ? (
          await payload.find({
            collection: 'research',
            where: visiblePublishedResearchWhere,
            limit: 1000,
            sort: '-publishedAt',
          })
        ).docs
          .filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
          .map((doc) => ({
            url: `${BASE}/research/${doc.slug}`,
            lastModified: new Date(doc.updatedAt),
            priority: 0.6,
          }))
      : []

    if (!hasVisibleBlog) {
      return [...staticPages, ...researchPages]
    }

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
      where: visiblePublishedArticleWhere,
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

    return [...staticPages, ...categoryPages, ...articlePages, ...researchPages]
  } catch {
    return staticPages
  }
}
