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
import { visibleCaseWhere } from '@/shared/lib/visible-case-where'
import { methodologyContent } from '@/shared/content/methodology'
import { getEventsEnabled } from '@/shared/lib/getEventsEnabled'
import { visibleEventWhere } from '@/shared/lib/visible-event-where'
import { getNonEmptyBlogCategories } from '@/shared/lib/blog-nav-categories'

const BASE = siteConfig.url.replace(/\/$/, '')

// The sitemap must reflect content published AFTER the last build (audits,
// new articles). Without this it is statically generated at build time and
// goes stale — e.g. articles/audits added later never appear.
export const dynamic = 'force-dynamic'

// Статические маркетинговые страницы меняются только вместе с кодом, поэтому их lastmod —
// дата релиза, а не время запроса. Раньше тут стоял `new Date()`, и поскольку sitemap
// собирается динамически, каждая его выдача помечала 30 URL как «только что изменённые»:
// OpenAI-SearchBot отвечал на это переобходом одних и тех же страниц ~14 раз в сутки
// (замерено по nginx-логам 03–08.11.2026, 69% его запросов). Дату правим руками вместе
// со страницей — так же, как это уже сделано для methodologyContent.updatedAt.
const STATIC_PAGES_UPDATED_AT = new Date('2026-11-09T00:00:00.000Z')

/**
 * Дата последнего изменения страницы-листинга — это дата свежайшего элемента в ней.
 * Пустой список (или битые даты) означает, что менялась только вёрстка листинга.
 */
function newestUpdatedAt(docs: Record<string, unknown>[]): Date {
  const times = docs
    .map((doc) => new Date(String(doc.updatedAt ?? '')).getTime())
    .filter((t) => Number.isFinite(t))
  return times.length > 0 ? new Date(Math.max(...times)) : STATIC_PAGES_UPDATED_AT
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_STAGING === 'true') {
    return []
  }

  const staticDate = STATIC_PAGES_UPDATED_AT

  const servicePages: MetadataRoute.Sitemap = siteConfig.servicesEnabled
    ? [
        { url: `${BASE}/services`,                      lastModified: staticDate, priority: 0.9 },
        { url: `${BASE}/services/strategic-consulting`, lastModified: staticDate, priority: 0.9 },
        { url: `${BASE}/services/tokenomics`,           lastModified: staticDate, priority: 0.9 },
        { url: `${BASE}/services/audit`,                lastModified: staticDate, priority: 0.9 },
      ]
    : []

  const [blogEnabledRaw, hasVisibleResearch, hasVisibleAudits, hasVisibleEvents] = await Promise.all([
    getBlogEnabled(),
    getResearchEnabled(),
    getPublicAuditsEnabled(),
    getEventsEnabled(),
  ])
  const hasVisibleBlog = siteConfig.blogEnabled && blogEnabledRaw

  // Только страницы, которые меняются вместе с кодом. Всё, что зависит от коллекций Payload
  // (главная с анонсами статей, /press, /product/token-launch, листинги), датируется ниже
  // по свежайшему элементу своей коллекции.
  const staticPages: MetadataRoute.Sitemap = [
    ...servicePages,
    ...(siteConfig.digitalAssetsEnabled
      ? [
          { url: `${BASE}/product/digital-assets`, lastModified: staticDate, priority: 0.8 },
          { url: `${BASE}/product/digital-assets/owners-guide`, lastModified: staticDate, priority: 0.5 },
        ]
      : []),
    { url: `${BASE}/product/tokenization-readiness`, lastModified: staticDate, priority: 0.8 },
    { url: `${BASE}/product/tokenization-cases`, lastModified: staticDate, priority: 0.7 },
    { url: `${BASE}/product/tokenomics-ai`, lastModified: staticDate, priority: 0.7 },
    { url: `${BASE}/product/calculator`, lastModified: staticDate, priority: 0.8 },
    { url: `${BASE}/product/workshop`, lastModified: staticDate, priority: 0.7 },
    { url: `${BASE}/learn/token-vesting-benchmarks`, lastModified: staticDate, priority: 0.7 },
    { url: `${BASE}/${methodologyContent.slug}`, lastModified: new Date(methodologyContent.updatedAt), priority: 0.8 },
    { url: `${BASE}/about`,          lastModified: staticDate, priority: 0.6 },
    { url: `${BASE}/contact`,        lastModified: staticDate, priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: staticDate, priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: staticDate, priority: 0.3 },
  ]

  // Ветка catch (Payload недоступен): те же URL, но с датой релиза вместо даты контента.
  const fallbackContentPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: staticDate, priority: 1.0 },
    { url: `${BASE}/product/token-launch`, lastModified: staticDate, priority: 0.8 },
    { url: `${BASE}/press`, lastModified: staticDate, priority: 0.5 },
    { url: `${BASE}/cases`, lastModified: staticDate, priority: 0.7 },
    ...(hasVisibleBlog ? [{ url: `${BASE}/blog`, lastModified: staticDate, priority: 0.8 }] : []),
    ...(hasVisibleResearch ? [{ url: `${BASE}/research`, lastModified: staticDate, priority: 0.8 }] : []),
    ...(hasVisibleAudits ? [{ url: `${BASE}/audits`, lastModified: staticDate, priority: 0.8 }] : []),
    ...(hasVisibleEvents ? [{ url: `${BASE}/events`, lastModified: staticDate, priority: 0.7 }] : []),
  ]

  try {
    const payload = await getPayload({ config })

    const auditDocs = hasVisibleAudits
      ? (
          await payload.find({
            collection: 'public-audits',
            where: visiblePublicAuditWhere,
            limit: 1000,
            sort: '-featured,-publishedAt',
          })
        ).docs.filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
      : []
    const auditPages: MetadataRoute.Sitemap = auditDocs.map((doc) => ({
      url: `${BASE}/audits/${doc.slug}`,
      lastModified: new Date(doc.updatedAt),
      priority: 0.7,
    }))

    const researchDocs = hasVisibleResearch
      ? (
          await payload.find({
            collection: 'research',
            where: visiblePublishedResearchWhere,
            limit: 1000,
            sort: '-publishedAt',
          })
        ).docs.filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
      : []
    const researchPages: MetadataRoute.Sitemap = researchDocs.map((doc) => ({
      url: `${BASE}/research/${doc.slug}`,
      lastModified: new Date(doc.updatedAt),
      priority: 0.6,
    }))

    // Листинг /cases показывает и mini-кейсы, поэтому его дату считаем по всем видимым;
    // собственная страница есть только у формата full — из них и строим URL.
    const caseDocs = (
      await payload.find({
        collection: 'cases',
        where: visibleCaseWhere,
        limit: 1000,
        sort: '-publishedAt',
      })
    ).docs.filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
    const casePages: MetadataRoute.Sitemap = caseDocs
      .filter((doc) => doc.format === 'full')
      .map((doc) => ({
        url: `${BASE}/cases/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        priority: 0.7,
      }))

    const eventDocs = hasVisibleEvents
      ? (
          await payload.find({
            collection: 'events',
            where: visibleEventWhere,
            limit: 1000,
            sort: 'startsAt',
          })
        ).docs.filter((doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex)
      : []
    const eventPages: MetadataRoute.Sitemap = eventDocs.map((doc) => ({
      url: `${BASE}/events/${doc.slug}`,
      lastModified: new Date(doc.updatedAt),
      priority: 0.6,
    }))

    let categoryPages: MetadataRoute.Sitemap = []
    let articlePages: MetadataRoute.Sitemap = []
    let articleDocs: Record<string, unknown>[] = []
    if (hasVisibleBlog) {
      const [categories, articlesResult] = await Promise.all([
        getNonEmptyBlogCategories(payload),
        payload.find({
          collection: 'articles',
          where: visiblePublishedArticleWhere,
          limit: 1000,
          sort: '-publishedAt',
        }),
      ])

      const visibleArticles = articlesResult.docs.filter(
        (doc) => !(doc.seo as { noindex?: boolean } | undefined)?.noindex,
      )
      articleDocs = visibleArticles

      // Страница рубрики меняется, когда в ней выходит или правится статья, — её дата и нужна.
      // depth у выборки не нулевой, поэтому category может прийти и объектом, и идентификатором.
      const articlesByCategory = new Map<string, Record<string, unknown>[]>()
      for (const doc of visibleArticles) {
        const ref: unknown = doc.category
        const id =
          typeof ref === 'object' && ref !== null && 'id' in ref ? String(ref.id) : String(ref)
        const bucket = articlesByCategory.get(id)
        if (bucket) bucket.push(doc)
        else articlesByCategory.set(id, [doc])
      }

      categoryPages = categories.map((cat) => ({
        url: `${BASE}/blog/${cat.slug}`,
        lastModified: newestUpdatedAt(articlesByCategory.get(String(cat.id)) ?? []),
        priority: 0.7,
      }))

      articlePages = visibleArticles.map((doc) => ({
        url: `${BASE}/blog/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        priority: 0.6,
      }))
    }

    const pressDocs = (
      await payload.find({ collection: 'media-mentions', limit: 1000, depth: 0 })
    ).docs
    const launchModuleDocs = (
      await payload.find({ collection: 'launch-modules', limit: 100, depth: 0 })
    ).docs

    // Страницы, чей контент живёт в CMS: дата — свежайший элемент того, что на них показано.
    // Главная выводит анонсы последних статей, /press — упоминания в СМИ,
    // /product/token-launch — состав и цены модулей запуска.
    const contentPages: MetadataRoute.Sitemap = [
      { url: BASE, lastModified: newestUpdatedAt(articleDocs), priority: 1.0 },
      {
        url: `${BASE}/product/token-launch`,
        lastModified: newestUpdatedAt(launchModuleDocs),
        priority: 0.8,
      },
      { url: `${BASE}/press`, lastModified: newestUpdatedAt(pressDocs), priority: 0.5 },
      { url: `${BASE}/cases`, lastModified: newestUpdatedAt(caseDocs), priority: 0.7 },
      ...(hasVisibleBlog
        ? [{ url: `${BASE}/blog`, lastModified: newestUpdatedAt(articleDocs), priority: 0.8 }]
        : []),
      ...(hasVisibleResearch
        ? [{ url: `${BASE}/research`, lastModified: newestUpdatedAt(researchDocs), priority: 0.8 }]
        : []),
      ...(hasVisibleAudits
        ? [{ url: `${BASE}/audits`, lastModified: newestUpdatedAt(auditDocs), priority: 0.8 }]
        : []),
      ...(hasVisibleEvents
        ? [{ url: `${BASE}/events`, lastModified: newestUpdatedAt(eventDocs), priority: 0.7 }]
        : []),
    ]

    return [
      ...staticPages,
      ...contentPages,
      ...auditPages,
      ...casePages,
      ...categoryPages,
      ...articlePages,
      ...researchPages,
      ...eventPages,
    ]
  } catch {
    return [...staticPages, ...fallbackContentPages]
  }
}
