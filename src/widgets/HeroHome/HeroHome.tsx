'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { heroContent, heroMarqueeItems } from '@/shared/content/homePage'
import { HeroCanvas } from './HeroCanvas'
import styles from './HeroHome.module.scss'

const ease = 'easeOut' as const

const MARQUEE_ITEMS = [
  heroMarqueeItems[0], '·', heroMarqueeItems[1], '·',
  heroMarqueeItems[2], '·', heroMarqueeItems[3], '·',
  'Web3', '·', heroMarqueeItems[4], '·', 'DeFi', '·', 'GameFi', '·',
]

export function HeroHome() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.inner}>
        {/* Left: content */}
        <div className={styles.content}>
          <motion.div
            className={styles.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0 }}
          >
            <span className={styles.labelBracket}>[</span>
            <span className={styles.labelText}>{heroContent.label}</span>
            <span className={styles.labelBracket}>]</span>
          </motion.div>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.08 }}
          >
            <span className={styles.headlineLine1}>{heroContent.headlineLine1}</span>
            <span className={styles.headlineLine1}>{heroContent.headlineLine2}</span>
            <span className={styles.headlineLine3}>
              <em className={styles.headlineAccent}>{heroContent.headlineLine3}</em>
            </span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.22 }}
          >
            {heroContent.description}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.34 }}
          >
            <Link href={heroContent.cta.href} className={styles.cta}>
              {heroContent.cta.label}
              <span className={styles.ctaArrow} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </Link>

            <div className={styles.servicePills}>
              {heroContent.serviceLinks.map((link) => (
                <Link key={link.label} href={link.href} className={styles.servicePill}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: animated canvas */}
        <motion.div
          className={styles.visual}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          aria-hidden="true"
        >
          <HeroCanvas className={styles.canvas} />
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
