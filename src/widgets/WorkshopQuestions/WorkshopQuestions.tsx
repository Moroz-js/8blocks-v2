'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WorkshopQuestions.module.scss'

const ease = 'easeOut' as const

interface WorkshopQuestionsProps {
  headline: string
  description: string
  items: readonly string[]
  accentQuestion: string
}

export function WorkshopQuestions({
  headline,
  description,
  items,
  accentQuestion,
}: WorkshopQuestionsProps) {
  const regularItems = items.slice(0, -1)

  return (
    <section className={styles.section} aria-label="Workshop questions">
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollRevealText text={headline} className={styles.headline} />
          <ScrollRevealText text={description} className={styles.description} />
        </div>

        <div className={styles.grid}>
          {regularItems.map((question, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, ease, delay: (i % 5) * 0.05 }}
            >
              <span className={styles.itemNum} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className={styles.itemText}>{question}</p>
            </motion.div>
          ))}

          <motion.div
            className={`${styles.item} ${styles.itemAccent}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
          >
            <span className={styles.itemNum} aria-hidden="true">
              {String(items.length).padStart(2, '0')}
            </span>
            <p className={`${styles.itemText} ${styles.itemTextAccent}`}>
              <span className={styles.accentArrow} aria-hidden="true">→ </span>
              {accentQuestion}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
