'use client'

import { motion } from 'framer-motion'
import styles from './ServicesPageHero.module.scss'

interface ServicesTransitionProps {
  headline: string
  description: string
}

export function ServicesPageHero({ headline, description }: ServicesTransitionProps) {
  return (
    <motion.div
      className={styles.transition}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className={styles.headline}>{headline}</h2>
      <p className={styles.description}>{description}</p>
    </motion.div>
  )
}
