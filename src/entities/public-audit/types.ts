import type { MediaItem } from '@/entities/article'

export interface PublicAuditCard {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  cover?: MediaItem | null
  publishedAt: string
  featured?: boolean
  /** Letter grade and 0–100 score from the audit hero. */
  rating?: string | null
  score?: number | null
}
