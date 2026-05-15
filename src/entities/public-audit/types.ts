import type { MediaItem } from '@/entities/article'

export interface PublicAuditCard {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  cover?: MediaItem | null
  publishedAt: string
  featured?: boolean
}
