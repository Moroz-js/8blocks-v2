export type CaseFormat = 'mini' | 'full'
export type CaseService = 'design' | 'audit' | 'advisory'
export type CaseCategory = 'DeFi' | 'GameFi' | 'RWA' | 'Finance'

export interface CaseMedia {
  url: string
  alt: string
}

export interface CaseCardData {
  id: string
  slug: string
  format: CaseFormat
  title: string
  category: CaseCategory | null
  industry: string | null
  service: CaseService | null
  cover: CaseMedia | null
  task: string
  actions: string[]
  result: string
  metricValue: string | null
  metricLabel: string | null
}

export interface CaseDetailData extends CaseCardData {
  clientGoals: string | null
  challenge: string | null
  content: unknown
  relatedArticleSlug: string | null
  relatedArticleTitle: string | null
  publishedAt: string | null
  updatedAt: string
}
