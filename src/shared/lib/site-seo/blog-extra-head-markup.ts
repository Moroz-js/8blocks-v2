import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'

/** Доп. разметка из Payload для /blog/:slug (статья или категория). Дедуп с страницей через React.cache. */
export const getBlogExtraHeadMarkup = cache(async (pathname: string): Promise<string | undefined> => {
  const m = pathname.match(/^\/blog\/([^/?#]+)$/)
  if (!m) return undefined
  const slug = decodeURIComponent(m[1])

  const payload = await getPayload({ config })

  const published = await payload.find({
    collection: 'articles',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 0,
  })

  const article = published.docs[0]
  if (article) {
    const raw = (article.seo as { headMarkup?: string | null } | undefined)?.headMarkup
    const t = typeof raw === 'string' ? raw.trim() : ''
    return t || undefined
  }

  const categories = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const category = categories.docs[0]
  if (category) {
    const raw = (category.seo as { headMarkup?: string | null } | undefined)?.headMarkup
    const t = typeof raw === 'string' ? raw.trim() : ''
    return t || undefined
  }

  return undefined
})
