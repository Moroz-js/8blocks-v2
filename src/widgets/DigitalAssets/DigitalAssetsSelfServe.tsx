'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { next } = digitalAssetsContent

export function DigitalAssetsSelfServe() {
  return (
    <section className={styles.section} aria-label={next.label}>
      <div className={styles.inner}>
        <div className={styles.selfServeGrid}>
          {next.cards.map((card, index) => (
            <motion.article
              key={card.title}
              className={styles.selfServeCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease, delay: index * 0.08 }}
            >
              <span className={styles.selfServeTag}>{card.tag}</span>
              <h2 className={styles.selfServeTitle}>{card.title}</h2>
              <p className={styles.selfServeDescription}>{card.description}</p>
              {card.href.startsWith('http') ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaGhost}
                >
                  {card.ctaLabel} <span aria-hidden="true">→</span>
                </a>
              ) : (
                <Link href={card.href} className={styles.ctaGhost}>
                  {card.ctaLabel} <span aria-hidden="true">→</span>
                </Link>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
