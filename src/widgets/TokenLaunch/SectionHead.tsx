'use client'

import { motion } from 'framer-motion'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const

interface SectionHeadProps {
  label: string
  headline: string
  description?: string
}

export function SectionHead({ label, headline, description }: SectionHeadProps) {
  return (
    <motion.div
      className={styles.sectionHead}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease }}
    >
      <span className={styles.sectionLabel}>[{label}]</span>
      <h2 className={styles.sectionHeadline}>{headline}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
    </motion.div>
  )
}
