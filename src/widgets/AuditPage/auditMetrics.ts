export interface AuditMetric {
  label: string
  value: string
}

export interface AuditHeroData {
  company?: string | null
  tokenName?: string | null
  tokenStandard?: string | null
  projectDescription?: string | null
  site?: string | null
  metrics?: AuditMetric[] | null
  verdict?: string | null
  strength?: string | null
  weakness?: string | null
  letterRating?: string | null
  score?: number | null
}
