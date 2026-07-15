'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { hero } = tokenLaunchContent
const statSourceExternal = /^https?:\/\//.test(hero.statSourceHref)

export function TokenLaunchHero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.heroBlobLayer} aria-hidden="true">
        <div className={`${styles.heroBlob} ${styles.heroBlobA}`} />
        <div className={`${styles.heroBlob} ${styles.heroBlobB}`} />
      </div>
      <div className={styles.heroInner}>
        <div className={styles.heroLayout}>
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
              {hero.headline}
            </motion.h1>

            <motion.p
              className={styles.heroDescription}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.2 }}
            >
              {hero.description}
            </motion.p>

            <motion.p
              className={styles.heroStatsParagraph}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.28 }}
            >
              {hero.statsParagraph}
            </motion.p>

            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.36 }}
            >
              <a href={hero.ctaHref} className={styles.ctaPrimary}>
                {hero.ctaLabel}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </a>
              <a href={hero.secondaryHref} className={styles.ctaGhost}>
                {hero.secondaryLabel}
              </a>
            </motion.div>
          </div>

          <motion.figure
            className={styles.heroStat}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.3 }}
            style={{ margin: 0 }}
          >
            <span className={styles.heroStatValue}>{hero.statValue}</span>
            <p className={styles.heroStatCaption}>{hero.statCaption}</p>
            <figcaption>
              {statSourceExternal ? (
                <a
                  href={hero.statSourceHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={styles.heroStatSource}
                >
                  {hero.statSourceLabel} ↗
                </a>
              ) : (
                <Link href={hero.statSourceHref} className={styles.heroStatSource}>
                  {hero.statSourceLabel}
                </Link>
              )}
            </figcaption>
          </motion.figure>
        </div>

        <motion.div
          className={styles.heroPartners}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.5 }}
        >
          <span className={styles.heroPartnersLead}>{hero.partnersLead}</span>
          <div className={styles.heroPartnerLogos}>
            {hero.partners.map((partner) => (
              <Image
                key={partner.name}
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={32}
                className={styles.heroPartnerLogo}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
