'use client'

import { motion } from 'framer-motion'
import styles from './DeliverablesBlock.module.scss'

const ease = 'easeOut' as const

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export interface DeliverableItem {
  icon?: React.ReactNode
  title: string
  description: string
}

interface DeliverablesBlockProps {
  label?: string
  headline: string
  items: readonly DeliverableItem[]
}

export function DeliverablesBlock({ label, headline, items }: DeliverablesBlockProps) {
  return (
    <section className={styles.section} aria-label="Deliverables">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          {label && (
            <span className={styles.label}>
              <span className={styles.labelBracket}>[</span>
              {label}
              <span className={styles.labelBracket}>]</span>
            </span>
          )}
          <h2 className={styles.headline}>{headline}</h2>
        </motion.div>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
            >
              <div className={styles.cardTopBorder} aria-hidden="true" />
              <div className={styles.cardIcon}>
                {item.icon ?? <DefaultIcon />}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
