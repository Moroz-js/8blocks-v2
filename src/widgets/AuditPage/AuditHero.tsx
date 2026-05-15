import Link from 'next/link'
import { Logo } from '@/shared/ui'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import type { AuditMetrics } from './auditMetrics'
import styles from './AuditHero.module.scss'

interface MetricSlot {
  key: keyof AuditMetrics
  label: string
}

const METRIC_SLOTS: MetricSlot[] = [
  { key: 'companyName', label: 'COMPANY NAME' },
  { key: 'tokenName', label: 'TOKEN NAME' },
  { key: 'tokenStandard', label: 'TOKEN STANDARD' },
  { key: 'fdv', label: 'FDV' },
  { key: 'mc', label: 'MC' },
  { key: 'tvl', label: 'TVL' },
  { key: 'fees', label: 'FEES' },
  { key: 'users', label: 'USERS' },
  { key: 'unlock', label: 'UNLOCK' },
  { key: 'retail', label: 'RETAIL' },
  { key: 'rating', label: 'RATING' },
  { key: 'ratingScore', label: 'SCORE' },
]

const LOGO_GRID_AREAS = [
  '1 / 1 / 2 / 5',
  '5 / 1 / 6 / 6',
  '1 / 5 / 5 / 6',
  '4 / 1 / 5 / 3',
  '3 / 1 / 4 / 3',
  '3 / 3 / 5 / 4',
  '2 / 4 / 5 / 5',
  '2 / 1 / 3 / 4',
] as const

interface Props {
  title: string
  excerpt?: string | null
  metrics?: AuditMetrics | null
  dateLabel?: string | null
  publishedAt?: string | null
  relatedArticleSlug?: string | null
}

export function AuditHero({
  title,
  excerpt,
  metrics,
  dateLabel,
  publishedAt,
  relatedArticleSlug,
}: Props) {
  const filled = METRIC_SLOTS.filter((slot) => {
    const value = metrics?.[slot.key]
    return typeof value === 'string' && value.trim().length > 0
  })

  const primary = filled.slice(0, 8)
  const overflow = filled.slice(8)
  const showMeta = Boolean(dateLabel || relatedArticleSlug)

  return (
    <section className={styles.hero} aria-label={title}>
      <div className={styles.inner}>
        <Link href="/audits" className={styles.backLink}>
          ← {auditsArchiveContent.headline}
        </Link>

        <Logo className={styles.logo} href="/" />

        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>

          {showMeta && (
            <div className={styles.meta}>
              {dateLabel && (
                <time className={styles.date} dateTime={publishedAt ?? undefined}>
                  {dateLabel}
                </time>
              )}
              {relatedArticleSlug && (
                <>
                  {dateLabel && <span className={styles.metaSep}>·</span>}
                  <Link
                    href={`/blog/${relatedArticleSlug}`}
                    className={styles.articleLink}
                  >
                    {auditsArchiveContent.blogArticleLink}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

        {primary.length > 0 && (
          <div className={styles.metricsGridLogo}>
            {primary.map((slot, index) => (
              <div
                key={slot.key}
                className={styles.metricCard}
                style={{ gridArea: LOGO_GRID_AREAS[index] }}
              >
                <span className={styles.metricLabel}>{slot.label}</span>
                <span className={styles.metricValue}>{metrics?.[slot.key]}</span>
              </div>
            ))}
          </div>
        )}

        {overflow.length > 0 && (
          <div className={styles.metricsGridExtra}>
            {overflow.map((slot) => (
              <div key={slot.key} className={styles.metricCard}>
                <span className={styles.metricLabel}>{slot.label}</span>
                <span className={styles.metricValue}>{metrics?.[slot.key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
