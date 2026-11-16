import { ArrowLink, Button } from '@/shared/ds'
import { auditDetailContent, auditsArchiveContent } from '@/shared/content/auditsPage'
import type { AuditHeroData } from './auditMetrics'
import styles from './AuditPage.module.scss'

const DownloadIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12" />
  </svg>
)

interface Props {
  slug: string
  hero: AuditHeroData
  print: boolean
}

/** Under the article header: PDF and project links, score with key metrics, three takeaways. */
export function AuditSummary({ slug, hero, print }: Props) {
  const metrics = (hero.metrics ?? []).filter((m) => m?.label && String(m.value ?? '').trim())
  const hasScore = hero.score != null || Boolean(hero.letterRating)
  const takeaways = [hero.verdict, hero.strength, hero.weakness].filter(Boolean) as string[]
  const siteLabel = hero.site?.replace(/^https?:\/\//, '')

  return (
    <div className={styles.summary}>
      {!print && (
        <div className={styles.actions}>
          <Button variant="secondary" href={`/api/audits/${slug}/pdf`} prefetch={false} download rel="nofollow" icon={DownloadIcon}>
            {auditsArchiveContent.downloadPdf}
          </Button>
          {siteLabel && <ArrowLink href={`https://${siteLabel}`}>{siteLabel}</ArrowLink>}
        </div>
      )}

      {(hasScore || metrics.length > 0) && (
        <div className={styles.scorecard}>
          {hasScore && (
            <div className={styles.score}>
              <p className={styles.scoreLabel}>{auditsArchiveContent.finalRating}</p>
              {hero.score != null && (
                <p className={styles.scoreLine}>
                  <span className={styles.scoreNum}>{hero.score}</span>
                  <span className={styles.scoreMax}>/100</span>
                </p>
              )}
              {hero.letterRating && (
                <p className={styles.scoreLetter}>
                  {auditDetailContent.rating.ratingWord} {hero.letterRating}
                </p>
              )}
            </div>
          )}
          {metrics.length > 0 && (
            <dl className={styles.metrics}>
              {metrics.map((m, i) => (
                <div key={`${m.label}-${i}`} className={styles.metric}>
                  <dt className={styles.metricLabel}>{m.label}</dt>
                  <dd className={styles.metricValue}>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {takeaways.length > 0 && (
        <section aria-label={auditDetailContent.takeaways} data-pdf-takeaways>
          <div className={styles.takeaways}>
            {takeaways.map((text, i) => (
              <p key={i} className={styles.takeaway}>
                {text}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
