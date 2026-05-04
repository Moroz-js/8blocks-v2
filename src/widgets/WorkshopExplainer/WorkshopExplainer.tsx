'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WorkshopExplainer.module.scss'

const ease = 'easeOut' as const

export interface WorkshopExplainerCard {
  title: string
  body: string
}

interface WorkshopExplainerProps {
  headline: string
  subtitle: string
  cards: readonly WorkshopExplainerCard[]
}

export function WorkshopExplainer({ headline, subtitle, cards }: WorkshopExplainerProps) {
  const sectionId = 'workshop-explainer'

  return (
    <section className={styles.section} aria-labelledby={sectionId}>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <div className={styles.introText}>
            <h2 id={sectionId} className={styles.srOnly}>
              {headline}
            </h2>
            <div aria-hidden="true">
              <ScrollRevealText text={headline} className={styles.headline} />
            </div>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease, delay: 0.06 }}
            >
              {subtitle}
            </motion.p>
          </div>
          <div className={styles.introGlow} aria-hidden="true" />
        </header>

        <div className={styles.cardsTrack} role="list">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              className={`${styles.card} ${i === 2 ? styles.cardEmphasis : ''}`}
              role="listitem"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-24px' }}
              transition={{ duration: 0.5, ease, delay: 0.08 + i * 0.07 }}
            >
              <div className={styles.cardTop} aria-hidden="true" />
              <span className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
