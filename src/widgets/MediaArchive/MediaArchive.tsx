import Link from 'next/link'
import type { MediaMentionCard as MediaMentionCardType } from '@/entities/media-mention'
import { MediaMentionCardUI } from '@/entities/media-mention'
import type { CategoryRef } from '@/entities/article'
import { lang } from '@/shared/i18n'
import { mediaArchiveContent } from '@/shared/content/mediaPage'
import styles from './MediaArchive.module.scss'

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
  mentions: MediaMentionCardType[]
  categories: CategoryRef[]
  totalPages: number
  currentPage: number
  totalDocs: number
  activeCategory?: string | null
}

export function MediaArchive({
  mentions,
  categories,
  totalPages,
  currentPage,
  totalDocs,
  activeCategory = null,
}: Props) {
  function pageHref(page: number) {
    const base = activeCategory ? `/media?cat=${activeCategory}` : '/media'
    if (page <= 1) return base
    return `${base}${activeCategory ? '&' : '?'}page=${page}`
  }

  function countLabel(count: number) {
    if (lang === 'ru') {
      if (count === 1) return mediaArchiveContent.countSingular
      if (count >= 2 && count <= 4) return mediaArchiveContent.countFew
      return mediaArchiveContent.countMany
    }
    return count === 1 ? mediaArchiveContent.countSingular : mediaArchiveContent.countMany
  }

  return (
    <div className={styles.root}>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            {mediaArchiveContent.labelSection}
            <span className={styles.labelBracket}>]</span>
          </span>
          <h1 className={styles.headline}>{mediaArchiveContent.headline}</h1>
          {totalDocs > 0 && (
            <p className={styles.count}>
              {totalDocs} {countLabel(totalDocs)}
            </p>
          )}
        </div>

        {/* ── Category filter ─────────────────────────────────────── */}
        {categories.length > 0 && (
          <nav className={styles.categoryNav} aria-label={mediaArchiveContent.filterByCategory}>
            <Link
              href="/media"
              className={`${styles.catChip} ${!activeCategory ? styles.catChipActive : ''}`}
            >
              {mediaArchiveContent.filterAll}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/media?cat=${cat.slug}`}
                className={`${styles.catChip} ${activeCategory === cat.slug ? styles.catChipActive : ''}`}
              >
                {cat.title}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* ── Cards grid ──────────────────────────────────────────── */}
      {mentions.length > 0 ? (
        <div className={styles.grid}>
          {mentions.map((mention, i) => (
            <MediaMentionCardUI
              key={mention.id}
              mention={mention}
              index={i}
              priority={i < 3}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>{mediaArchiveContent.emptyState}</p>
          <p className={styles.emptyHint}>{mediaArchiveContent.emptyHint}</p>
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────────── */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label={mediaArchiveContent.paginationAriaLabel}>
          {currentPage > 1 && (
            <Link href={pageHref(currentPage - 1)} className={styles.pageArrow} aria-label={mediaArchiveContent.prevPage}>
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
            <Link href={pageHref(currentPage + 1)} className={styles.pageArrow} aria-label={mediaArchiveContent.nextPage}>
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
