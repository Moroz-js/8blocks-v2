'use client'

import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { fit } = tokenLaunchContent

export function TokenLaunchFit() {
  return (
    <section className={styles.section} aria-label={fit.headline}>
      <div className={styles.inner}>
        <SectionHead label={fit.label} headline={fit.headline} description={fit.description} />
        <div className={styles.fitGrid}>
          <motion.div
            className={styles.fitCol}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
          >
            <h3 className={styles.fitColTitle}>
              <span className={`${styles.fitMark} ${styles.fitMarkYes}`} aria-hidden="true">✓</span>
              {fit.fitTitle}
            </h3>
            <ul className={styles.fitList}>
              {fit.fitItems.map((item) => (
                <li key={item} className={`${styles.fitItem} ${styles.fitItemYes}`}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={styles.fitCol}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease, delay: 0.08 }}
          >
            <h3 className={styles.fitColTitle}>
              <span className={`${styles.fitMark} ${styles.fitMarkNo}`} aria-hidden="true">✗</span>
              {fit.unfitTitle}
            </h3>
            <ul className={styles.fitList}>
              {fit.unfitItems.map((item) => (
                <li key={item} className={`${styles.fitItem} ${styles.fitItemNo}`}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
