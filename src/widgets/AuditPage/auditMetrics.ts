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

export interface AuditExpertData {
  name?: string | null
  role?: string | null
  linkedIn?: string | null
  rating?: string | null
  photo?: { url: string; alt: string } | null
}
