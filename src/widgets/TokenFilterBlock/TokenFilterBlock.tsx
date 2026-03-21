'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { tokenFilterContent } from '@/shared/content/homePage'
import styles from './TokenFilterBlock.module.scss'

const ease = 'easeOut' as const

export function TokenFilterBlock() {
  const { headline, subtitle, ctaLabel, ctaHref } = tokenFilterContent

  return (
    <section className={styles.section} aria-label="Фильтр токенов">
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
      >
        <div className={styles.glow} aria-hidden="true" />
        <h2 className={styles.headline}>{headline}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <Link href={ctaHref} className={styles.cta}>
          {ctaLabel}
          <span className={styles.ctaArrow} aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </section>
  )
}
