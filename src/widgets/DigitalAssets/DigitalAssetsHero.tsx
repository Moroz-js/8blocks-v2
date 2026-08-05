import Image from 'next/image'
import Link from 'next/link'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import styles from './DigitalAssets.module.scss'

const { hero } = digitalAssetsContent

export function DigitalAssetsHero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.heroBlobLayer} aria-hidden="true">
        <div className={`${styles.heroBlob} ${styles.heroBlobA}`} />
        <div className={`${styles.heroBlob} ${styles.heroBlobB}`} />
      </div>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>
            [{hero.label}]
          </span>

          <h1 className={styles.heroHeadline}>
            {hero.headline}{' '}
            <span className={styles.heroHeadlineAccent}>{hero.headlineAccent}</span>
          </h1>

          <p className={styles.heroDescription}>
            {hero.description}
          </p>

          <div className={styles.heroActions}>
            {hero.ctaHref.startsWith('http') ? (
              <a href={hero.ctaHref} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
                {hero.ctaLabel}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </a>
            ) : (
              <Link href={hero.ctaHref} className={styles.ctaPrimary}>
                {hero.ctaLabel}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </Link>
            )}
            {hero.secondaryHref.startsWith('http') ? (
              <a href={hero.secondaryHref} target="_blank" rel="noopener noreferrer" className={styles.ctaGhost}>
                {hero.secondaryLabel}
              </a>
            ) : (
              <Link href={hero.secondaryHref} className={styles.ctaGhost}>
                {hero.secondaryLabel}
              </Link>
            )}
          </div>

          <ul className={styles.heroPoints}>
            {hero.points.map((point) => (
              <li key={point} className={styles.heroPoint}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.heroArtifact}>
          <div className={styles.heroPhotoWrap}>
            <Image
              src="/img/digital-assets-hero.jpg"
              alt={hero.photoAlt}
              fill
              sizes="(max-width: 1280px) 100vw, 1232px"
              className={styles.heroPhoto}
              preload
            />
            <span className={styles.heroGrid} aria-hidden="true">
              {Array.from({ length: 20 }, (_, index) => (
                <i key={index} className={index === 4 || index === 7 || index === 15 ? styles.heroGridActive : undefined} />
              ))}
            </span>
            <span className={`${styles.heroChip} ${styles.heroChipLeft}`}>{hero.chipLeft}</span>
            <span className={`${styles.heroChip} ${styles.heroChipRight}`}>{hero.chipRight}</span>
          </div>
          <figcaption className={styles.heroCaption}>
            <b>{hero.exampleLead}</b> {hero.exampleText}{' '}
            <a
              href={hero.exampleSourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroCaptionLink}
            >
              {hero.exampleSourceLabel} ↗
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
