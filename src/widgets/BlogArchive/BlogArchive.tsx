import Link from 'next/link'

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
import type { ArticleCard as ArticleCardType, CategoryRef } from '@/entities/article'
import { ArticleCardUI } from '@/entities/article'
import styles from './BlogArchive.module.scss'

interface Props {
  articles: ArticleCardType[]
  categories: CategoryRef[]
  totalPages: number
  currentPage: number
  totalDocs: number
  activeCategory?: string | null
  /** If set, the archive shows this category name as headline */
  categoryTitle?: string
  /** Base href for pagination links, e.g. /blog or /blog/defi */
  paginationBase?: string
}

export function BlogArchive({
  articles,
  categories,
  totalPages,
  currentPage,
  totalDocs,
  activeCategory = null,
  categoryTitle,
  paginationBase = '/blog',
}: Props) {
  const isCategory = Boolean(categoryTitle)

  function pageHref(page: number) {
    if (page <= 1) return paginationBase
    return `${paginationBase}?page=${page}`
  }

  return (
    <div className={styles.root}>
      {/* ── Page header ───────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            {isCategory ? 'Category' : 'Blog'}
            <span className={styles.labelBracket}>]</span>
          </span>
          <h1 className={styles.headline}>
            {isCategory ? categoryTitle : 'Insights & articles'}
          </h1>
          {totalDocs > 0 && (
            <p className={styles.count}>{totalDocs} article{totalDocs !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* ── Category filter ───────────────────────────────────── */}
        {categories.length > 0 && (
          <nav className={styles.categoryNav} aria-label="Filter by category">
            <Link
              href="/blog"
              className={`${styles.catChip} ${!activeCategory ? styles.catChipActive : ''}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/${cat.slug}`}
                className={`${styles.catChip} ${activeCategory === cat.slug ? styles.catChipActive : ''}`}
              >
                {cat.title}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* ── Article grid ──────────────────────────────────────── */}
      {articles.length > 0 ? (
        <div className={styles.grid}>
          {articles.map((article, i) => (
            <ArticleCardUI
              key={article.id}
              article={article}
              index={i}
              priority={i < 3}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No articles in this category yet.</p>
          <p className={styles.emptyHint}>Check back soon.</p>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────── */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          {currentPage > 1 && (
            <Link
              href={pageHref(currentPage - 1)}
              className={styles.pageArrow}
              aria-label="Previous page"
            >
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
            <Link
              href={pageHref(currentPage + 1)}
              className={styles.pageArrow}
              aria-label="Next page"
            >
              <ArrowRight />
            </Link>
          )}
        </nav>
      )}

    </div>
  )
}

/** Builds a compact page range like [1, 2, '…', 7, 8, 9] */
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
