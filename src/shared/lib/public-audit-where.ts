import type { Where } from 'payload'

/** Только аудиты, видимые на сайте (не отмечены «Скрыто»). */
export const visiblePublicAuditWhere: Where = {
  hidden: { not_equals: true },
}
