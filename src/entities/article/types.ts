// Article entity types for frontend use
// These mirror the Payload CMS collection but are shaped for public-facing consumption

export type ArticleStatus = 'draft' | 'published'

export interface MediaItem {
  id: string
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  filename?: string
  mimeType?: string
}

export interface CategoryRef {
  id: string
  title: string
  slug: string
}

export interface TagRef {
  id: string
  name: string
  slug: string
}

export interface ArticleSeo {
  seoTitle?: string
  seoDescription?: string
  noindex?: boolean
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: unknown // Lexical rich text — rendered by shared/render
  cover?: MediaItem | null
  category?: CategoryRef | null
  tags?: TagRef[]
  relatedArticles?: ArticleCard[]
  status: ArticleStatus
  publishedAt?: string | null
  views: number
  seo?: ArticleSeo
  createdAt: string
  updatedAt: string
}

// For card display (list/archive)
export interface ArticleCard {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover?: MediaItem | null
  category?: CategoryRef | null
  tags?: TagRef[]
  publishedAt?: string | null
  readingTime?: number // computed, not stored
}

// Helper: estimate reading time from word count
export function estimateReadingTime(content: unknown): number {
  if (!content) return 1
  const text = JSON.stringify(content)
  const words = text.split(/\s+/).length
  // average reading speed: ~200 words/min (accounting for JSON overhead, ~3x factor)
  const adjusted = Math.ceil(words / 270)
  return Math.max(1, adjusted)
}
