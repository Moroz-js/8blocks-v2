'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
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
          <ScrollRevealText text={headline} className={styles.headline} />

          <ScrollRevealText text={description} className={styles.description} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
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
      </div>
    </section>
  )
}
