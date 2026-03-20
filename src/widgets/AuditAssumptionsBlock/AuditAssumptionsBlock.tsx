'use client'

import { motion } from 'framer-motion'
import styles from './AuditAssumptionsBlock.module.scss'

const ease = 'easeOut' as const

export interface AuditAssumptionItem {
  seems: string
  reality: string
}

interface AuditAssumptionsBlockProps {
  headline: string
  items: readonly AuditAssumptionItem[]
}

function AssumptionModule({ item, index }: { item: AuditAssumptionItem; index: number }) {
  return (
    <motion.div
      className={styles.module}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, ease, delay: index * 0.06 }}
    >
      <p className={styles.seems}>{item.seems}</p>
      <div className={styles.accentLine} aria-hidden="true" />
      <p className={styles.reality}>{item.reality}</p>
    </motion.div>
  )
}

export function AuditAssumptionsBlock({ headline, items }: AuditAssumptionsBlockProps) {
  const leftCol = items.slice(0, 3)
  const rightCol = items.slice(3, 6)

  return (
    <section className={styles.section} aria-label="False assumptions about audit">
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
          <div className={styles.column}>
            {leftCol.map((item, i) => (
              <AssumptionModule key={i} item={item} index={i} />
            ))}
          </div>
          <div className={styles.column}>
            {rightCol.map((item, i) => (
              <AssumptionModule key={i} item={item} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
