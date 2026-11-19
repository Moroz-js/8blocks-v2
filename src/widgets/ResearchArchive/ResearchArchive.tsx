import type { ResearchCard as ResearchCardType } from '@/entities/research'
import { lang } from '@/shared/i18n'
import { researchArchiveContent as copy } from '@/shared/content/researchPage'
import { uiStrings } from '@/shared/content/uiStrings'
import { ListingEmpty, ListingPage, Pagination } from '@/widgets/Posts/Listing'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'
import styles from './ResearchArchive.module.scss'

interface Props {
  research: ResearchCardType[]
  totalPages: number
  currentPage: number
  totalDocs: number
}

function countLabel(count: number) {
  if (lang === 'ru') {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return copy.countSingular
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return copy.countFew
    return copy.countMany
  }
  return count === 1 ? copy.countSingular : copy.countMany
}

const Eye = (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 3.75c4.17 0 7.72 2.59 9.17 6.25-1.45 3.66-5 6.25-9.17 6.25S2.28 13.66.83 10C2.28 6.34 5.83 3.75 10 3.75Zm0 2.08a4.17 4.17 0 1 0 0 8.34 4.17 4.17 0 0 0 0-8.34Zm0 1.67a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
  </svg>
)

/** Research listing on design system v2 (project 2 «Research»). */
export function ResearchArchive({ research, totalPages, currentPage, totalDocs }: Props) {
  const pageHref = (page: number) => (page <= 1 ? '/research' : `/research?page=${page}`)

  return (
    <ListingPage>
      <header className={styles.header}>
        <p className={styles.title}>{copy.labelSection}</p>
        <div className={styles.subtitle}>
          <h1 className={styles.headline}>{copy.headline}</h1>
          {totalDocs > 0 && ` · ${totalDocs} ${countLabel(totalDocs)}`}
        </div>
      </header>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{copy.allStudies}</h2>
        <p className={styles.sort}>{copy.sortedByDate}</p>
      </div>

      {research.length > 0 ? (
        <PostGrid columns={2}>
          {research.map((item) => (
            <PostCard
              key={item.id}
              href={`/research/${item.slug}`}
              meta={postMeta(item.category?.title, formatPostDate(item.publishedAt))}
              title={item.title}
              footer={
                <span className={styles.views}>
                  {Eye}
                  {item.views ?? 0}
                </span>
              }
              action={`${uiStrings.read} →`}
            />
          ))}
        </PostGrid>
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
