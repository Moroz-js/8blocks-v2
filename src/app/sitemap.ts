import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/shared/config/site'
import { getBlogEnabled } from '@/shared/lib/getBlogEnabled'
import { getResearchEnabled } from '@/shared/lib/getResearchEnabled'
import { getPublicAuditsEnabled } from '@/shared/lib/getPublicAuditsEnabled'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'
import { visiblePublishedResearchWhere } from '@/shared/lib/visible-research-where'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'
import { visibleFullCaseWhere } from '@/shared/lib/visible-case-where'

const BASE = siteConfig.url.replace(/\/$/, '')

// The sitemap must reflect content published AFTER the last build (audits,
// new articles). Without this it is statically generated at build time and
// goes stale — e.g. articles/audits added later never appear.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_STAGING === 'true') {
    return []
  }

  const now = new Date()

  const servicePages: MetadataRoute.Sitemap = siteConfig.servicesEnabled
    ? [
        { url: `${BASE}/services`,                      lastModified: now, priority: 0.9 },
        { url: `${BASE}/services/strategic-consulting`, lastModified: now, priority: 0.9 },
        { url: `${BASE}/services/tokenomics`,           lastModified: now, priority: 0.9 },
        { url: `${BASE}/services/audit`,                lastModified: now, priority: 0.9 },
      ]
    : []

  const [blogEnabledRaw, hasVisibleResearch, hasVisibleAudits] = await Promise.all([
    getBlogEnabled(),
    getResearchEnabled(),
    getPublicAuditsEnabled(),
  ])
  const hasVisibleBlog = siteConfig.blogEnabled && blogEnabledRaw

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                     lastModified: now, priority: 1.0 },
    ...servicePages,
    ...(siteConfig.digitalAssetsEnabled
      ? [
          { url: `${BASE}/product/digital-assets`, lastModified: now, priority: 0.8 },
          { url: `${BASE}/product/digital-assets/owners-guide`, lastModified: now, priority: 0.5 },
        ]
      : []),
    { url: `${BASE}/product/tokenization-readiness`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/product/tokenization-cases`, lastModified: now, priority: 0.7 },
    { url: `${BASE}/product/tokenomics-ai`, lastModified: now, priority: 0.7 },
    { url: `${BASE}/learn/token-vesting-benchmarks`, lastModified: now, priority: 0.7 },
    { url: `${BASE}/cases`,          lastModified: now, priority: 0.7 },
    ...(hasVisibleBlog ? [{ url: `${BASE}/blog`, lastModified: now, priority: 0.8 }] : []),
    ...(hasVisibleResearch ? [{ url: `${BASE}/research`, lastModified: now, priority: 0.8 }] : []),
    ...(hasVisibleAudits ? [{ url: `${BASE}/audits`, lastModified: now, priority: 0.8 }] : []),
    { url: `${BASE}/about`,          lastModified: now, priority: 0.6 },
    { url: `${BASE}/contact`,        lastModified: now, priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: now, priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: now, priority: 0.3 },
  ]

  try {
    const payload = await getPayload({ config })

    const auditPages: MetadataRoute.Sitemap = hasVisibleAudits
      ? (
          await payload.find({
            collection: 'public-audits',
            where: visiblePublicAuditWhere,
            limit: 1000,
            sort: '-featured,-publishedAt',
          })
        ).docs
          .filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
          .map((doc) => ({
            url: `${BASE}/audits/${doc.slug}`,
            lastModified: new Date(doc.updatedAt),
            priority: 0.7,
          }))
      : []

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

    const casePages: MetadataRoute.Sitemap = (
      await payload.find({
        collection: 'cases',
        where: visibleFullCaseWhere,
        limit: 1000,
        sort: '-publishedAt',
      })
    ).docs
      .filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
      .map((doc) => ({
        url: `${BASE}/cases/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        priority: 0.7,
      }))

    let categoryPages: MetadataRoute.Sitemap = []
    let articlePages: MetadataRoute.Sitemap = []
    if (hasVisibleBlog) {
      const catsResult = await payload.find({ collection: 'categories', limit: 200, sort: 'title' })
      categoryPages = catsResult.docs.map((cat) => ({
        url: `${BASE}/blog/${cat.slug}`,
        lastModified: now,
        priority: 0.7,
      }))

      const articlesResult = await payload.find({
        collection: 'articles',
        where: visiblePublishedArticleWhere,
        limit: 1000,
        sort: '-publishedAt',
      })
      articlePages = articlesResult.docs
        .filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
        .map((doc) => ({
          url: `${BASE}/blog/${doc.slug}`,
          lastModified: new Date(doc.updatedAt),
          priority: 0.6,
        }))
    }

    return [
      ...staticPages,
      ...auditPages,
      ...casePages,
      ...categoryPages,
      ...articlePages,
      ...researchPages,
    ]
  } catch {
    return staticPages
  }
}
