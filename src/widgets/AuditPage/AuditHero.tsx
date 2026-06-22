import { Download } from 'lucide-react'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import type { AuditHeroData } from './auditMetrics'
import styles from './AuditHero.module.scss'

interface Props {
  title: string
  slug: string
  hero?: AuditHeroData | null
  dateLabel?: string | null
  eyebrowDate?: string | null
  print?: boolean
}

export function AuditHero({ title, slug, hero, eyebrowDate, print = false }: Props) {
  const metrics = (hero?.metrics ?? []).filter(
    (m) => m && m.label && m.value != null && String(m.value).trim().length > 0,
  )
  const hasRating = Boolean(hero?.letterRating || hero?.score != null)
  const ticker = hero?.tokenName || title
  const siteLabel = hero?.site ? hero.site.replace(/^https?:\/\//, '') : null
  const siteHref = hero?.site
    ? /^https?:\/\//.test(hero.site)
      ? hero.site
      : `https://${hero.site}`
    : null

  const eyebrow = [auditsArchiveContent.auditLabel, eyebrowDate]
    .filter(Boolean)
    .join(' · ')

  return (
    <section className={styles.hero} aria-label={title} data-audit-hero>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.titleBlock}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.ticker}>
              {ticker}
              {ticker !== title && <span className={styles.srOnly}>{title}</span>}
            </h1>
            {siteLabel &&
              (siteHref ? (
                <a
                  href={siteHref}
                  className={styles.siteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteLabel}
                </a>
              ) : (
                <span className={styles.siteLink}>{siteLabel}</span>
              ))}
          </div>

          {hasRating && (
            <div className={styles.rating}>
              <span className={styles.ratingLabel}>
                {auditsArchiveContent.finalRating}
                {hero?.letterRating ? ` – ${hero.letterRating}` : ''}
              </span>
              {hero?.score != null && (
                <span className={styles.ratingScore}>
                  {hero.score}
                  <span className={styles.ratingMax}>/100</span>
                </span>
              )}
            </div>
          )}
        </div>

        {hero?.projectDescription && (
          <p className={styles.description}>{hero.projectDescription}</p>
        )}

        {!print && (
          <a href={`/api/audits/${slug}/pdf`} className={styles.pdfButton} data-no-print>
            {auditsArchiveContent.downloadPdf}
            <Download size={18} />
          </a>
        )}

        {metrics.length > 0 && (
          <div className={styles.metricsBand}>
            {metrics.map((m, i) => (
              <div key={`${m.label}-${i}`} className={styles.metric}>
                <span className={styles.metricLabel}>{m.label}</span>
                <span className={styles.metricValue}>{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
