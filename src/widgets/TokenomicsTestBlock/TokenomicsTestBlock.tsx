'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { tokenomicsTestContent } from '@/shared/content/homePage'
import styles from './TokenomicsTestBlock.module.scss'

const ease = 'easeOut' as const

export function TokenomicsTestBlock() {
  const { headline, description, cards, ctaLabel, ctaHref } = tokenomicsTestContent

  return (
    <section className={styles.section} aria-label="Тест токеномики">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.description}>{description}</p>
        </motion.div>

        <div className={styles.grid}>
          {cards.map((card, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease, delay: i * 0.08 }}
            >
              <span className={styles.cardNumber}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className={styles.ctaWrap}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
        >
          <Link href={ctaHref} className={styles.cta}>
            {ctaLabel}
            <span className={styles.ctaArrow} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
