'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { next } = digitalAssetsContent

export function DigitalAssetsNext() {
  return (
    <section className={styles.section} id="book" aria-label={next.label}>
      <div className={styles.inner}>
        <div className={styles.nextLayout}>
          <motion.div
            className={styles.nextMain}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease }}
          >
            <SectionHead
              label={next.label}
              headline={next.headline}
              description={next.description}
            />
            <ul className={styles.nextPoints}>
              {next.points.map((point) => (
                <li key={point} className={styles.nextPoint}>
                  {point}
                </li>
              ))}
            </ul>
            <p className={styles.nextNote}>{next.note}</p>
            <div className={styles.nextActions}>
              <Link href={next.ctaHref} className={styles.ctaPrimary}>
                {next.ctaLabel}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </Link>
              <p className={styles.nextEmailLine}>
                {next.emailLead}{' '}
                <a href={`mailto:${next.email}`} className={styles.nextEmailLink}>
                  {next.email}
                </a>{' '}
                · {next.emailNote}
              </p>
            </div>
          </motion.div>

          <div className={styles.nextCards}>
            {next.cards.map((card, i) => (
              <motion.article
                key={card.title}
                className={styles.nextCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              >
                <span className={styles.nextCardTag}>{card.tag}</span>
                <h3 className={styles.nextCardTitle}>{card.title}</h3>
                <p className={styles.nextCardDescription}>{card.description}</p>
                <Link href={card.href} className={`${styles.ctaGhost} ${styles.tierLink}`}>
                  {card.ctaLabel} <span aria-hidden="true">→</span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
