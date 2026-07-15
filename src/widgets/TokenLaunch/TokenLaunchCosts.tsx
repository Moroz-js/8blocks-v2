'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { costs } = tokenLaunchContent

export function TokenLaunchCosts() {
  return (
    <section className={styles.section} aria-label={costs.headline}>
      <div className={styles.inner}>
        <SectionHead
          label={costs.label}
          headline={costs.headline}
          description={costs.description}
        />
        <div className={styles.costsGrid}>
          {costs.items.map((item, index) => (
            <motion.figure
              key={item.number}
              className={styles.costFigure}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: index * 0.06 }}
            >
              <span className={styles.costNumber}>{item.number}</span>
              <h3 className={styles.costQuestion}>{item.question}</h3>
              <p className={styles.costLead}>{item.lead}</p>
              <p className={styles.costData}>{item.data}</p>
              <figcaption className={styles.costSource}>
                <cite>
                  {item.external ? (
                    <a
                      href={item.sourceHref}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className={styles.costSourceLink}
                    >
                      {item.sourceLabel} ↗
                    </a>
                  ) : (
                    <Link href={item.sourceHref} className={styles.costSourceLink}>
                      {item.sourceLabel}
                    </Link>
                  )}
                </cite>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
