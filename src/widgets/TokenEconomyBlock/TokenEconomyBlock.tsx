'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { tokenEconomyContent } from '@/shared/content/homePage'
import styles from './TokenEconomyBlock.module.scss'

const ease = 'easeOut' as const

function AccentHeadline({ text, accents }: { text: string; accents: readonly string[] }) {
  const regex = new RegExp(`(${accents.join('|')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        accents.some((a) => a.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className={styles.accent}>{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

export function TokenEconomyBlock() {
  const { headline, accentWords, description, cards } = tokenEconomyContent

  return (
    <section className={styles.section} aria-label="Токен-экономика">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className={styles.headline}>
            <AccentHeadline text={headline} accents={accentWords} />
          </h2>
          <p className={styles.description}>{description}</p>
        </motion.div>

        <div className={styles.grid}>
          {cards.map((card, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease, delay: i * 0.07 }}
            >
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
