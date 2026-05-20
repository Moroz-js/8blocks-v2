import { getPayload } from 'payload'
import config from '@payload-config'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'

let cached: boolean | null = null
let cachedAt = 0
const TTL_MS = 60_000

export async function getPublicAuditsEnabled(): Promise<boolean> {
  const now = Date.now()
  if (cached !== null && now - cachedAt < TTL_MS) return cached

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'public-audits',
      where: visiblePublicAuditWhere,
      limit: 1,
      depth: 0,
    })
    cached = result.totalDocs > 0
    cachedAt = now
    return cached
  } catch {
    return false
  }
}
