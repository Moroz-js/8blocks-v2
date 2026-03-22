'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './MidCta.module.scss'

const ease = 'easeOut' as const

interface MidCtaProps {
  headline: string
  ctaLabel: string
  ctaHref: string
}

export function MidCta({ headline, ctaLabel, ctaHref }: MidCtaProps) {
  return (
    <section className={styles.section} aria-label="Call to action">
      <div className={styles.inner}>
        <ScrollRevealText text={headline} className={styles.headline} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
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
