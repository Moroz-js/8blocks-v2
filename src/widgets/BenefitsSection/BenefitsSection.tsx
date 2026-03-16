'use client'

import { motion } from 'framer-motion'
import { benefitsContent } from '@/shared/content/homePage'
import { ScrollRevealText } from '@/shared/ui'
import styles from './BenefitsSection.module.scss'

const BenefitIcon = ({ id }: { id: string }) => {
  if (id === 'business-tied') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <path d="M3 21l6-6 4.5 4.5L21 8l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24.5 7v5.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (id === 'usage-demand') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 14l3 3 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 5v2M14 21v2M5 14h2M21 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'stress-tested') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <path d="M14 3l2.2 6.6H23l-5.7 4.1 2.2 6.7L14 16.6l-5.5 3.8 2.2-6.7L5 9.6h6.8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 28 28" fill="none">
      <rect x="3" y="12" width="5" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="8" width="5" height="17" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="20" y="3" width="5" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

const REVEAL_TEXT = `${benefitsContent.headlinePart1} ${benefitsContent.headlinePart2} ${benefitsContent.headlinePart3.replace('\n', ' ')}`

export function BenefitsSection() {
  return (
    <section className={styles.section} aria-label="Преимущества">
      <div className={styles.inner}>
        {/* Left: scroll-reveal headline */}
        <div className={styles.headlineCol}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={styles.labelBracket}>[</span>
            {benefitsContent.label}
            <span className={styles.labelBracket}>]</span>
          </motion.span>

          <ScrollRevealText
            text={REVEAL_TEXT}
            className={styles.headline}
            startOffset="start 0.82"
            endOffset="end 0.4"
          />

          <motion.div
            className={styles.decorLine}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            style={{ transformOrigin: 'left center' }}
            aria-hidden="true"
          />
        </div>

        {/* Right: benefit cards 2x2 */}
        <div className={styles.cardsCol}>
          <div className={styles.grid}>
            {benefitsContent.items.map((item, i) => (
              <motion.div
                key={item.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon} aria-hidden="true">
                    <BenefitIcon id={item.id} />
                  </div>
                  <span className={styles.cardNumber} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
