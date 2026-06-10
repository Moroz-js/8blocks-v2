import type { Where } from 'payload'

/** Условия видимого опубликованного исследования (для составных where). */
export const visiblePublishedResearchConditions: Where[] = [
  { status: { equals: 'published' } },
  { hidden: { not_equals: true } },
]

/** Опубликованные исследования, видимые на сайте (не отмечены «Скрыто»). */
export const visiblePublishedResearchWhere: Where = {
  and: visiblePublishedResearchConditions,
}
