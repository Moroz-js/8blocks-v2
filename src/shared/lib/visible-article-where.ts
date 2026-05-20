/** Опубликованные статьи, видимые на сайте (не отмечены «Скрыто»). */
export const visiblePublishedArticleWhere = {
  and: [
    { status: { equals: 'published' as const } },
    { hidden: { not_equals: true } },
  ],
} as const
