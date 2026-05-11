import type { MediaItem, CategoryRef } from '@/entities/article'

export interface MediaMentionCard {
  id: string
  title: string
  url: string
  excerpt?: string | null
  cover?: MediaItem | null
  category?: CategoryRef | null
  publishedAt: string
  featured?: boolean
}
