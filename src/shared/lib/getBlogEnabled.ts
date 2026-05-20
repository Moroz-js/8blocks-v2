import { getPayload } from 'payload'
import config from '@payload-config'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'

let cached: boolean | null = null
let cachedAt = 0
const TTL_MS = 60_000

export async function getBlogEnabled(): Promise<boolean> {
  const now = Date.now()
  if (cached !== null && now - cachedAt < TTL_MS) return cached

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'articles',
      where: visiblePublishedArticleWhere,
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
