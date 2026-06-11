import type { CategoryRef, MediaItem } from '@/entities/article'

export interface ResearchCard {
  id: string
  title: string
  cardText: string
  slug: string
  excerpt?: string | null
  cover?: MediaItem | null
  category?: CategoryRef | null
  cardColor?: string | null
  textColor?: string | null
  publishedAt?: string | null
  views?: number | null
}
