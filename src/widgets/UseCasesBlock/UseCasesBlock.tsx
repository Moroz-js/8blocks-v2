'use client'

import { motion } from 'framer-motion'
import styles from './UseCasesBlock.module.scss'

const ease = 'easeOut' as const

export interface UseCaseBullet {
  title: string
  description: string
}

export interface UseCaseItem {
  label: string
  title: string
  /** @deprecated use intro + bullets */
  description?: string
  intro?: string
  bullets?: readonly UseCaseBullet[]
}

interface UseCasesBlockProps {
  headline: string
  items: readonly UseCaseItem[]
}

export function UseCasesBlock({ headline, items }: UseCasesBlockProps) {
  return (
    <section className={styles.section} aria-label="Use cases">
      <div className={styles.inner}>
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          {headline}
        </motion.h2>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.article
              key={item.label}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              {item.bullets && item.bullets.length > 0 ? (
                <>
                  {item.intro && <p className={styles.cardIntro}>{item.intro}</p>}
                  <ul className={styles.bulletList}>
                    {item.bullets.map((b, j) => (
                      <li key={j} className={styles.bulletItem}>
                        <p className={styles.bulletTitle}>{b.title}</p>
                        <p className={styles.bulletDescription}>{b.description}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                item.description && (
                  <p className={styles.cardDescription}>{item.description}</p>
                )
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
