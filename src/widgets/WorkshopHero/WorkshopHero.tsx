'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './WorkshopHero.module.scss'

const ease = 'easeOut' as const

interface WorkshopHeroProps {
  label: string
  stat: string
  statSource: string
  statSourceUrl: string
  headline: string
  description: string
  price: string
  duration: string
  audience: string
  cta1Label: string
  cta1Href: string
  cta2Label: string
  cta2Href: string
}

export function WorkshopHero({
  label,
  stat,
  statSource,
  statSourceUrl,
  headline,
  description,
  price,
  duration,
  audience,
  cta1Label,
  cta1Href,
  cta2Label,
  cta2Href,
}: WorkshopHeroProps) {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.blobLayer} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
      </div>

      <div className={styles.inner}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <blockquote className={styles.statQuote} cite={statSourceUrl}>
            <p className={styles.stat}>{stat}</p>
            <cite className={styles.statCite}>
              <a
                href={statSourceUrl}
                className={styles.statCiteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {statSource}
              </a>
            </cite>
          </blockquote>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            {headline.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
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
            className={styles.offer}
            itemScope
            itemType="https://schema.org/Offer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.28 }}
          >
            <span className={styles.offerPrice} itemProp="price" content="2500">
              {price}
            </span>
            <meta itemProp="priceCurrency" content="USD" />
            <meta itemProp="availability" content="https://schema.org/InStock" />
            <span className={styles.offerDot} aria-hidden="true">·</span>
            <span className={styles.offerMeta}>{duration}</span>
            <span className={styles.offerDot} aria-hidden="true">·</span>
            <span className={styles.offerMeta}>{audience}</span>
          </motion.div>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.36 }}
          >
            <Link href={cta1Href} className={styles.ctaPrimary}>
              {cta1Label}
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
            <Link href={cta2Href} className={styles.ctaSecondary}>
              {cta2Label}
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
