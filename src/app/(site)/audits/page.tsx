import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AuditsArchive } from '@/widgets/AuditsArchive'
import type { PublicAuditCard } from '@/entities/public-audit'
import { auditsMeta } from '@/shared/content/auditsPage'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/audits', {
    title: auditsMeta.title,
    description: auditsMeta.description,
    alternates: { canonical: '/audits' },
    openGraph: {
      title: auditsMeta.ogTitle,
      description: auditsMeta.ogDescription,
      url: '/audits',
    },
    twitter: {
      card: 'summary_large_image',
      title: auditsMeta.ogTitle,
      description: auditsMeta.ogDescription,
    },
  })
}

const AUDITS_PER_PAGE = 9

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AuditsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const payload = await getPayload({ config })

  const auditsResult = await payload.find({
    collection: 'public-audits',
    where: visiblePublicAuditWhere,
    sort: '-featured,-publishedAt',
    limit: AUDITS_PER_PAGE,
    page: currentPage,
    depth: 1,
  })

  const audits: PublicAuditCard[] = auditsResult.docs.map((doc) => {
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
    }
  })

  return (
    <AuditsArchive
      audits={audits}
      totalPages={auditsResult.totalPages}
      currentPage={currentPage}
      totalDocs={auditsResult.totalDocs}
    />
  )
}
