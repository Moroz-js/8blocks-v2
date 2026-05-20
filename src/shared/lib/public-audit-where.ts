/** Только аудиты, видимые на сайте (не отмечены «Скрыто»). */
export const visiblePublicAuditWhere = {
  hidden: { not_equals: true },
} as const
