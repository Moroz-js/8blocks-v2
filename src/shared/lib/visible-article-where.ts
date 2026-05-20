import type { Where } from 'payload'

/** Условия видимой опубликованной статьи (для составных where). */
export const visiblePublishedArticleConditions: Where[] = [
  { status: { equals: 'published' } },
  { hidden: { not_equals: true } },
]

/** Опубликованные статьи, видимые на сайте (не отмечены «Скрыто»). */
export const visiblePublishedArticleWhere: Where = {
  and: visiblePublishedArticleConditions,
}
