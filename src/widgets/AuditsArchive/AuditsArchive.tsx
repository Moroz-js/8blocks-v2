import type { PublicAuditCard as PublicAuditCardType } from '@/entities/public-audit'
import { auditsArchiveContent as copy } from '@/shared/content/auditsPage'
import { ListingEmpty, ListingHeader, ListingPage, Pagination } from '@/widgets/Posts/Listing'
import { AuditCards } from './AuditCards'

interface Props {
  audits: PublicAuditCardType[]
  totalPages: number
  currentPage: number
  totalDocs: number
}

/** Public audits listing on design system v2 (project 2 «Audits»). */
export function AuditsArchive({ audits, totalPages, currentPage, totalDocs }: Props) {
  const pageHref = (page: number) => (page <= 1 ? '/audits' : `/audits?page=${page}`)

  return (
    <ListingPage>
      <ListingHeader
        title={copy.headline}
        subtitle={totalDocs > 0 ? `${totalDocs} ${copy.scoreNote}` : undefined}
      />

      {audits.length > 0 ? (
        <AuditCards audits={audits} />
      ) : (
        <ListingEmpty title={copy.emptyState} hint={copy.emptyHint} />
      )}

      <Pagination
        current={currentPage}
        total={totalPages}
        href={pageHref}
        labels={{ nav: copy.paginationAriaLabel, prev: copy.prevPage, next: copy.nextPage }}
      />
    </ListingPage>
  )
}
