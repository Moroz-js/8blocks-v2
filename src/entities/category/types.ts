export interface Category {
  id: string
  title: string
  slug: string
  description?: string
  seo?: {
    seoTitle?: string
    seoDescription?: string
  }
  createdAt: string
  updatedAt: string
}
