'use client'

import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { partners } = tokenLaunchContent

export function TokenLaunchPartners() {
  return (
    <section className={styles.section} aria-label={partners.headline}>
      <div className={styles.inner}>
        <SectionHead
          label={partners.label}
          headline={partners.headline}
          description={partners.description}
        />
        <div className={styles.partnersGrid}>
          {partners.items.map((item, index) => (
            <motion.article
              key={item.name}
              className={styles.partnerCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: index * 0.08 }}
            >
              <span className={styles.partnerRole}>{item.role}</span>
              <h3 className={styles.partnerName}>{item.name}</h3>
              <p className={styles.partnerSubtitle}>{item.subtitle}</p>
              <p className={styles.partnerDescription}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
