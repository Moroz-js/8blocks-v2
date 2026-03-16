'use client'

import { motion } from 'framer-motion'
import styles from './UseCasesBlock.module.scss'

const ease = 'easeOut' as const

export interface UseCaseItem {
  label: string
  title: string
  description: string
  tags?: string[]
}

interface UseCasesBlockProps {
  headline: string
  items: readonly UseCaseItem[]
}

export function UseCasesBlock({ headline, items }: UseCasesBlockProps) {
  return (
    <section className={styles.section} aria-label="Use cases">
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
              key={item.label}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
