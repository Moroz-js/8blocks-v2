'use client'

import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { context } = digitalAssetsContent

export function DigitalAssetsContext() {
  return (
    <section className={styles.section} aria-label={context.label}>
      <div className={styles.inner}>
        <SectionHead
          label={context.label}
          headline={context.headline}
          description={context.description}
        />

        <div className={styles.contextGrid}>
          {context.items.map((item, i) => (
            <motion.article
              key={i}
              className={styles.contextCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <span className={styles.contextDate}>{item.date}</span>
              <h3 className={styles.contextTitle}>{item.title}</h3>
              <p className={styles.contextDescription}>{item.description}</p>
              <a
                href={item.sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                {context.sourceLabel} ↗
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
