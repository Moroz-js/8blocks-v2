'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './ProblemBlock.module.scss'

const ease = 'easeOut' as const

export interface ProblemItem {
  title: string
  description: string
}

export type ProblemBlockVariant = 'consulting' | 'audit' | 'tokenomics'

interface ProblemBlockProps {
  variant: ProblemBlockVariant
  headline: string
  description?: string
  items: readonly ProblemItem[]
  cta?: {
    headline: string
    ctaLabel: string
    ctaHref: string
  }
}

const iconsByVariant: Record<ProblemBlockVariant, string[]> = {
  consulting: ['/icons/consulting-1.svg', '/icons/consulting-2.svg', '/icons/consulting-3.svg', '/icons/consulting-4.svg'],
  audit: ['/icons/audit-1.svg', '/icons/audit-2.svg', '/icons/audit-3.svg', '/icons/audit-4.svg'],
  tokenomics: ['/icons/tokenomic-1.svg', '/icons/tokenomic-2.svg', '/icons/tokenomic-3.svg', '/icons/tokenomic-4.svg'],
}

const gridClassByVariant: Record<ProblemBlockVariant, string> = {
  consulting: styles.gridConsulting,
  audit: styles.gridAudit,
  tokenomics: styles.gridTokenomics,
}

export function ProblemBlock({ variant, headline, description, items, cta }: ProblemBlockProps) {
  const icons = iconsByVariant[variant]
  const gridClass = gridClassByVariant[variant]

  return (
    <section className={styles.section} aria-label="Problem">
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollRevealText text={headline} className={styles.headline} />
          {description && (
            <ScrollRevealText text={description} className={styles.description} />
          )}
        </div>

        <div className={gridClass}>
          {items.map((item, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
              {icons[i] && (
                <div className={styles.cardIcon}>
                  <Image src={icons[i]} alt="" width={323} height={228} aria-hidden />
                </div>
              )}
            </motion.article>
          ))}
        </div>

        {cta && (
          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: items.length * 0.08 }}
          >
            <p className={styles.ctaHeadline}>{cta.headline}</p>
            <Link href={cta.ctaHref} className={styles.ctaBtn}>
              {cta.ctaLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
