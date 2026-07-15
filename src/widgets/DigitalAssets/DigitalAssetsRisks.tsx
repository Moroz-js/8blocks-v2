'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { risks } = digitalAssetsContent

export function DigitalAssetsRisks() {
  return (
    <section className={styles.section} aria-label={risks.label}>
      <div className={styles.inner}>
        <SectionHead
          label={risks.label}
          headline={risks.headline}
          description={risks.description}
        />

        <ol className={styles.risksList}>
          {risks.items.map((item, i) => {
            const sourceHref = 'sourceHref' in item ? item.sourceHref : undefined
            return (
              <motion.li
                key={i}
                className={styles.riskRow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              >
                <span className={styles.riskNumber} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className={styles.riskTitle}>{item.title}</h3>
                <div className={styles.riskBody}>
                  <p className={styles.riskDescription}>{item.description}</p>
                  {sourceHref && (
                    <a
                      href={sourceHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.textLink}
                    >
                      {risks.sourceLabel} ↗
                    </a>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ol>

        <motion.div
          className={styles.risksCtaRow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease }}
        >
          <p className={styles.risksCtaHeadline}>{risks.ctaHeadline}</p>
          <Link href={risks.ctaHref} className={styles.ctaGhost}>
            {risks.ctaLabel} <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
