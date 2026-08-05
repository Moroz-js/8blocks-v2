import Link from 'next/link'
import styles from './ServiceHero.module.scss'

interface ServiceHeroProps {
  label: string
  headline: string
  accentWord?: string
  description: string
  ctaLabel: string
  ctaHref: string
  variant?: string
}

export function ServiceHero({
  headline,
  accentWord,
  description,
  ctaLabel,
  ctaHref,
}: ServiceHeroProps) {
  const headlineParts = accentWord ? headline.split(accentWord) : [headline]

  const renderWithBreaks = (text: string) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ))

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.blobLayer}>
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
      </div>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.headline}>
            {headlineParts.length === 2 ? (
              <>
                {renderWithBreaks(headlineParts[0])}
                <span className={styles.headlineAccent}>{accentWord}</span>
                {renderWithBreaks(headlineParts[1])}
              </>
            ) : (
              renderWithBreaks(headline)
            )}
          </h1>

          <p className={styles.description}>
            {description}
          </p>

          <div className={styles.actions}>
            <Link href={ctaHref} className={styles.cta}>
              {ctaLabel}
              <span className={styles.ctaArrow} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
