'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
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
          <motion.span
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            [{hero.label}]
          </motion.span>

          <motion.h1
            className={styles.heroHeadline}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
          >
            {hero.headline}{' '}
            <span className={styles.heroHeadlineAccent}>{hero.headlineAccent}</span>
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.2 }}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.3 }}
          >
            <Link href={hero.ctaHref} className={styles.ctaPrimary}>
              {hero.ctaLabel}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </Link>
            <a href={hero.secondaryHref} className={styles.ctaGhost}>
              {hero.secondaryLabel}
            </a>
          </motion.div>

          <motion.ul
            className={styles.heroPoints}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.4 }}
          >
            {hero.points.map((point) => (
              <li key={point} className={styles.heroPoint}>
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.figure
          className={styles.heroArtifact}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.5 }}
        >
          <div className={styles.heroPhotoWrap}>
            <Image
              src="/img/digital-assets-hero.jpg"
              alt={hero.photoAlt}
              fill
              sizes="(max-width: 1280px) 100vw, 1232px"
              className={styles.heroPhoto}
              priority
            />
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
        </motion.figure>
      </div>
    </section>
  )
}
