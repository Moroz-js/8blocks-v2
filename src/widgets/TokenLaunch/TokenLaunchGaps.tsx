'use client'

import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { gaps } = tokenLaunchContent

export function TokenLaunchGaps() {
  return (
    <section className={styles.section} aria-label={gaps.headline}>
      <div className={styles.inner}>
        <SectionHead label={gaps.label} headline={gaps.headline} description={gaps.description} />
        <div className={styles.gapsGrid}>
          {gaps.items.map((item, index) => (
            <motion.div
              key={item.tag}
              className={styles.gapCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: index * 0.06 }}
            >
              <span className={styles.gapTag}>{item.tag}</span>
              <h3 className={styles.gapQuestion}>{item.question}</h3>
              <p className={styles.gapText}>{item.text}</p>
              <p className={styles.gapResult}>
                <b>{gaps.resultLabel}</b> {item.result}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
