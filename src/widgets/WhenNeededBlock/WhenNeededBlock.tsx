'use client'

import { motion } from 'framer-motion'
import styles from './WhenNeededBlock.module.scss'

const ease = 'easeOut' as const

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface WhenNeededBlockProps {
  headline: string
  items: readonly string[]
}

export function WhenNeededBlock({ headline, items }: WhenNeededBlockProps) {
  return (
    <section className={styles.section} aria-label="When audit is needed">
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

        <div className={styles.list}>
          {items.map((text, i) => (
            <motion.div
              key={i}
              className={styles.row}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, ease, delay: i * 0.05 }}
            >
              <span className={styles.check} aria-hidden="true">
                <CheckIcon />
              </span>
              <span className={styles.text}>{text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
