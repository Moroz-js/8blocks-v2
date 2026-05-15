import Link from 'next/link'
import type { PublicAuditCard as PublicAuditCardType } from '@/entities/public-audit'
import { PublicAuditCardUI } from '@/entities/public-audit'
import { lang } from '@/shared/i18n'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import styles from './AuditsArchive.module.scss'

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface Props {
  audits: PublicAuditCardType[]
  totalPages: number
  currentPage: number
  totalDocs: number
}

export function AuditsArchive({
  audits,
  totalPages,
  currentPage,
  totalDocs,
}: Props) {
  function pageHref(page: number) {
    if (page <= 1) return '/audits'
    return `/audits?page=${page}`
  }

  function countLabel(count: number) {
    if (lang === 'ru') {
      if (count === 1) return auditsArchiveContent.countSingular
      if (count >= 2 && count <= 4) return auditsArchiveContent.countFew
      return auditsArchiveContent.countMany
    }
    return count === 1 ? auditsArchiveContent.countSingular : auditsArchiveContent.countMany
  }

  return (
    <div className={styles.root}>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            {auditsArchiveContent.labelSection}
            <span className={styles.labelBracket}>]</span>
          </span>
          <h1 className={styles.headline}>{auditsArchiveContent.headline}</h1>
          {totalDocs > 0 && (
            <p className={styles.count}>
              {totalDocs} {countLabel(totalDocs)}
            </p>
          )}
        </div>
      </div>

      {/* ── Cards grid ──────────────────────────────────────────── */}
      {audits.length > 0 ? (
        <div className={styles.grid}>
          {audits.map((audit, i) => (
            <PublicAuditCardUI
              key={audit.id}
              audit={audit}
              index={i}
              priority={i < 3}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>{auditsArchiveContent.emptyState}</p>
          <p className={styles.emptyHint}>{auditsArchiveContent.emptyHint}</p>
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────────── */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label={auditsArchiveContent.paginationAriaLabel}>
          {currentPage > 1 && (
            <Link href={pageHref(currentPage - 1)} className={styles.pageArrow} aria-label={auditsArchiveContent.prevPage}>
              <ArrowLeft />
            </Link>
          )}

          <div className={styles.pageNumbers}>
            {buildPageRange(currentPage, totalPages).map((item, i) =>
              item === '…' ? (
                <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>…</span>
              ) : (
                <Link
                  key={item}
                  href={pageHref(item)}
                  className={`${styles.pageNum} ${item === currentPage ? styles.pageNumActive : ''}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                >
                  {item}
                </Link>
              ),
            )}
          </div>

          {currentPage < totalPages && (
            <Link href={pageHref(currentPage + 1)} className={styles.pageArrow} aria-label={auditsArchiveContent.nextPage}>
              <ArrowRight />
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = []
  const addPage = (p: number) => { if (!pages.includes(p)) pages.push(p) }
  addPage(1)
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) addPage(p)
  if (current < total - 2) pages.push('…')
  addPage(total)
  return pages
}
