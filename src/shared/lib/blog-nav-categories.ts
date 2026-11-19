import type { Payload } from 'payload'
import type { CategoryRef } from '@/entities/article'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'

/**
 * Категории блога, в которых есть хотя бы одна опубликованная статья.
 * Пустые категории — тонкие страницы (noindex): их не показываем в навигации и не кладём в sitemap.
 */
export async function getNonEmptyBlogCategories(payload: Payload): Promise<CategoryRef[]> {
  const [categories, articles] = await Promise.all([
    payload.find({ collection: 'categories', limit: 200, sort: 'title', depth: 0 }),
    payload.find({
      collection: 'articles',
      where: visiblePublishedArticleWhere,
      limit: 1000,
      depth: 0,
      select: { category: true },
    }),
  ])

  // depth: 0 → category is the id; guard the populated shape anyway.
  const usedCategoryIds = new Set(
    articles.docs.map((doc) => {
      const ref: unknown = doc.category
      return typeof ref === 'object' && ref !== null && 'id' in ref ? ref.id : ref
    }),
  )

  return categories.docs
    .filter((doc) => usedCategoryIds.has(doc.id))
    .map((doc) => ({ id: String(doc.id), title: doc.title, slug: doc.slug }))
}
