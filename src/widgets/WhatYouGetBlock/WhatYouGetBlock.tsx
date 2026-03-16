'use client'

import { motion } from 'framer-motion'
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
  items: readonly string[]
}

export function WhatYouGetBlock({ headline, items }: WhatYouGetBlockProps) {
  return (
    <section className={styles.section} aria-label="Что вы получите">
      <div className={styles.inner}>
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease }}
        >
          {headline}
        </motion.h2>

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
