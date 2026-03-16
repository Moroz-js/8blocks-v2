'use client'

import { motion } from 'framer-motion'
import styles from './FalseAssumptionsBlock.module.scss'

const ease = 'easeOut' as const

export interface FalseAssumptionItem {
  seems: string
  reality: string
}

interface FalseAssumptionsBlockProps {
  headline: string
  items: readonly FalseAssumptionItem[]
}

export function FalseAssumptionsBlock({ headline, items }: FalseAssumptionsBlockProps) {
  return (
    <section className={styles.section} aria-label="False assumptions">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
            >
              <div className={styles.columnSeems}>
                <span className={styles.columnLabel}>Кажется</span>
                <p className={styles.seemsText}>{item.seems}</p>
              </div>
              <div className={styles.arrow} aria-hidden="true">→</div>
              <div className={styles.columnReality}>
                <span className={styles.columnLabel}>На практике</span>
                <p className={styles.realityText}>{item.reality}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
