import { getPayload } from 'payload'
import config from '@payload-config'
import type { PublicAuditCard } from '@/entities/public-audit'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'

/** Visible public audits, featured first, mapped to card data. */
export async function getPublicAudits({ limit, page = 1 }: { limit: number; page?: number }) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'public-audits',
    where: visiblePublicAuditWhere,
    sort: '-featured,-publishedAt',
    limit,
    page,
    depth: 1,
  })

  const audits: PublicAuditCard[] = result.docs.map((doc) => {
    const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt ?? null,
      cover: cover
        ? {
            id: String(cover.id),
            url: cover.url ?? `/uploads/${cover.filename}`,
            alt: (cover.alt as string) || doc.title,
          }
        : null,
      publishedAt: String(doc.publishedAt),
      featured: doc.featured ?? false,
      rating: doc.hero?.letterRating ?? null,
      score: typeof doc.hero?.score === 'number' ? doc.hero.score : null,
    }
  })

  return { audits, totalPages: result.totalPages, totalDocs: result.totalDocs }
}
