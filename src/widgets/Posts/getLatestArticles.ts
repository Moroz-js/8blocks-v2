import { getPayload } from 'payload'
import config from '@payload-config'
import { estimateReadingTime, type ArticleCard } from '@/entities/article'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'

/** Latest published blog articles as listing cards; empty on CMS errors. */
export async function getLatestArticles(limit = 3): Promise<ArticleCard[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'articles',
      where: visiblePublishedArticleWhere,
      sort: '-publishedAt',
      limit,
      depth: 1,
    })
    return result.docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title as string,
      slug: doc.slug as string,
      excerpt: (doc.excerpt as string | undefined) ?? undefined,
      cover:
        doc.cover && typeof doc.cover === 'object' && 'url' in doc.cover
          ? {
              id: String((doc.cover as { id: unknown }).id),
              url: (doc.cover as { url: string }).url,
              alt: (doc.cover as { alt?: string }).alt ?? '',
            }
          : null,
      category:
        doc.category && typeof doc.category === 'object' && 'slug' in doc.category
          ? {
              id: String((doc.category as { id: unknown }).id),
              title: (doc.category as { title: string }).title,
              slug: (doc.category as { slug: string }).slug,
            }
          : null,
      publishedAt: (doc.publishedAt as string | undefined) ?? null,
      readingTime: estimateReadingTime(doc.content),
    }))
  } catch {
    return []
  }
}
