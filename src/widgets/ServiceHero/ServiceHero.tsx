'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './ServiceHero.module.scss'

const ease = 'easeOut' as const

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

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.blobLayer}>
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
      </div>
      <div className={styles.inner}>
        <div className={styles.content}>
          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
          >
            {headlineParts.length === 2 ? (
              <>
                {headlineParts[0]}
                <span className={styles.headlineAccent}>{accentWord}</span>
                {headlineParts[1]}
              </>
            ) : (
              headline
            )}
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.2 }}
          >
            {description}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.32 }}
          >
            <Link href={ctaHref} className={styles.cta}>
              {ctaLabel}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
