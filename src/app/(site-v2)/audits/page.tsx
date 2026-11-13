import type { Metadata } from 'next'
import { AuditsArchive, getPublicAudits } from '@/widgets/AuditsArchive'
import { auditsMeta } from '@/shared/content/auditsPage'
import { paginatedListingSeo, withPaginatedListing, withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams
  const listing = paginatedListingSeo('/audits', page)
  const metadata = await withPayloadPageMetadata('/audits', {
    title: auditsMeta.title,
    description: auditsMeta.description,
    alternates: { canonical: listing.canonical },
    openGraph: {
      title: auditsMeta.ogTitle,
      description: auditsMeta.ogDescription,
      url: listing.canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: auditsMeta.ogTitle,
      description: auditsMeta.ogDescription,
    },
  }, listing.hreflang)
  return withPaginatedListing(metadata, listing)
}

const AUDITS_PER_PAGE = 9

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AuditsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const { audits, totalPages, totalDocs } = await getPublicAudits({ limit: AUDITS_PER_PAGE, page: currentPage })

  return (
    <AuditsArchive
      audits={audits}
      totalPages={totalPages}
      currentPage={currentPage}
      totalDocs={totalDocs}
    />
  )
}
