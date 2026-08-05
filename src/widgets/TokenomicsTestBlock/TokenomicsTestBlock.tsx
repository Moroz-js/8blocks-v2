'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import { tokenomicsTestContent, tokenomicsTestScreens, tokenomicsTestAriaLabel } from '@/shared/content/homePage'
import { tokenLabContent } from '@/shared/content/tokenLabPage'
import styles from './TokenomicsTestBlock.module.scss'

const ease = 'easeOut' as const

const arrow = (
  <span className={styles.ctaArrow} aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

const SCREENS = [...tokenomicsTestScreens]

export function TokenomicsTestBlock() {
  const { headline, description } = tokenomicsTestContent
  const heroCtas = tokenLabContent.hero.ctas

  return (
    <section className={styles.section} aria-label={tokenomicsTestAriaLabel}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <ScrollRevealText text={headline} className={styles.headline} />
          <p className={styles.description}>{description}</p>
        </motion.div>

        <div className={styles.rows}>
          {SCREENS.map((screen, i) => {
            const reversed = i % 2 !== 0
            return (
              <motion.div
                key={i}
                className={`${styles.row} ${reversed ? styles.rowReversed : ''}`}
                initial={{ opacity: 0, x: reversed ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease, delay: 0.05 }}
              >
                <div className={styles.imageCol}>
                  <div className={styles.phone}>
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      width={390}
                      height={844}
                      className={styles.phoneScreen}
                      quality={85}
                      sizes="(max-width: 768px) 260px, 340px"
                    />
                  </div>
                </div>

                <div className={styles.textCol}>
                  <span className={styles.step}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.rowTitle}>{screen.title}</h3>
                  <p className={styles.rowDesc}>{screen.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className={styles.ctaWrap}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
        >
          {heroCtas.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`${styles.heroCta} ${i === 0 ? styles.heroCtaPrimary : ''}`}
            >
              {c.label}
              {arrow}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
