'use client'

import { motion } from 'framer-motion'
import styles from './SolutionBlock.module.scss'

const ease = 'easeOut' as const

export interface SolutionItem {
  id: string
  label: string
  description?: string
}

interface SolutionBlockProps {
  headline: string
  description?: string
  variant: 'flow' | 'principles'
  items: readonly SolutionItem[]
}

export function SolutionBlock({ headline, description, variant, items }: SolutionBlockProps) {
  return (
    <section className={styles.section} aria-label="Solution">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className={styles.headline}>{headline}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </motion.div>

        {variant === 'flow' ? (
          <motion.div
            className={styles.flow}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease }}
          >
            {items.map((item, i) => (
              <div key={item.id} className={styles.flowNode}>
                <span className={styles.flowLabel}>{item.label}</span>
                {i < items.length - 1 && <span className={styles.flowConnector} aria-hidden="true" />}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className={styles.principlesGrid}>
            {items.map((item, i) => (
              <motion.article
                key={item.id}
                className={styles.principleCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <div className={styles.cardTopBorder} aria-hidden="true" />
                <h3 className={styles.principleTitle}>{item.label}</h3>
                {item.description && (
                  <p className={styles.principleDescription}>{item.description}</p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
