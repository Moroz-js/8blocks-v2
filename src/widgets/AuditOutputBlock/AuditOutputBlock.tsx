'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './AuditOutputBlock.module.scss'

const ease = 'easeOut' as const

interface AuditOutputBlockProps {
  headline: string
  description: string
  ctaLabel: string
  ctaHref: string
}

export function AuditOutputBlock({ headline, description, ctaLabel, ctaHref }: AuditOutputBlockProps) {
  return (
    <section className={styles.section} aria-label={headline}>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease }}
          >
            {headline}
          </motion.h2>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease, delay: 0.1 }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
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
