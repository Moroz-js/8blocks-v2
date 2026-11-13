import type { ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import styles from './Listing.module.scss'

/** Listing page frame: content column right under the site header. */
export function ListingPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(styles.root, className)}>{children}</div>
}

/** Page title of a listing (h1) with a muted line under it. */
export function ListingHeader({ title, subtitle, children }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </header>
  )
}

/** Category filter as links (server-side filtering via the URL). */
export function FilterChips({ label, items }: { label: string; items: readonly { label: ReactNode; href: string; active: boolean }[] }) {
  return (
    <nav className={styles.chips} aria-label={label}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(styles.chip, item.active && styles.chipActive)}
          aria-current={item.active ? 'page' : undefined}
          scroll={false}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function pageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

const Arrow = ({ back }: { back?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d={back ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Pagination({
  current,
  total,
  href,
  labels,
}: {
  current: number
  total: number
  href: (page: number) => string
  labels: { nav: string; prev: string; next: string }
}) {
  if (total <= 1) return null
  return (
    <nav className={styles.pagination} aria-label={labels.nav}>
      {current > 1 && (
        <Link href={href(current - 1)} className={styles.page} aria-label={labels.prev}>
          <Arrow back />
        </Link>
      )}
      {pageRange(current, total).map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className={styles.gap}>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            className={clsx(styles.page, item === current && styles.pageActive)}
            aria-current={item === current ? 'page' : undefined}
          >
            {item}
          </Link>
        ),
      )}
      {current < total && (
        <Link href={href(current + 1)} className={styles.page} aria-label={labels.next}>
          <Arrow />
        </Link>
      )}
    </nav>
  )
}

/** Empty state of a filtered listing. */
export function ListingEmpty({ title, hint }: { title: ReactNode; hint?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>{title}</p>
      {hint && <p className={styles.emptyHint}>{hint}</p>}
    </div>
  )
}
