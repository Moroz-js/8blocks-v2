'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { t } from '@/shared/i18n'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WhatYouGetBlock.module.scss'

const ease = 'easeOut' as const

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface WhatYouGetBlockProps {
  headline: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  items: readonly string[]
}

export function WhatYouGetBlock({ headline, description, ctaLabel, ctaHref, items }: WhatYouGetBlockProps) {
  return (
    <section className={styles.section} aria-label={t({ ru: 'Что вы получите', en: "What you'll get" })}>
      <div className={styles.inner}>
        <ScrollRevealText text={headline} className={styles.headline} />
        {description && <ScrollRevealText text={description} className={styles.description} />}
        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className={styles.cta}>
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        )}

        <div className={styles.grid}>
          {items.map((text, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
            >
              <div className={styles.cardTopBorder} aria-hidden="true" />
              <div className={styles.cardIcon}>
                <CheckIcon />
              </div>
              <p className={styles.cardText}>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
