'use client'

import { motion } from 'framer-motion'
import styles from './ProblemBlock.module.scss'

const ease = 'easeOut' as const

export interface ProblemItem {
  title: string
  description: string
}

interface ProblemBlockProps {
  headline: string
  items: readonly ProblemItem[]
}

export function ProblemBlock({ headline, items }: ProblemBlockProps) {
  return (
    <section className={styles.section} aria-label="Problem">
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

        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <span className={styles.cardNumber} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
