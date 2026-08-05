'use client'

import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { packages } = digitalAssetsContent

export function DigitalAssetsPackages() {
  return (
    <section className={styles.section} aria-label={packages.label}>
      <div className={styles.inner}>
        <SectionHead
          label={packages.label}
          headline={packages.headline}
          description={packages.description}
        />

        <motion.div
          className={styles.workshopCard}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease }}
        >
          <span className={styles.workshopBadge}>{packages.workshop.badge}</span>
          <h3 className={styles.workshopTitle}>{packages.workshop.title}</h3>
          <p className={styles.workshopDescription}>{packages.workshop.description}</p>
          <div className={styles.workshopFooter}>
            <a href={packages.workshop.ctaHref} className={styles.ctaPrimary}>
              {packages.workshop.ctaLabel}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </a>
            <p className={styles.workshopPrice}>{packages.workshop.price}</p>
          </div>
        </motion.div>

        <div className={styles.tiersGrid}>
          {packages.tiers.map((tier, i) => (
            <motion.article
              key={tier.name}
              className={styles.tierCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <span className={styles.tierName}>{tier.name}</span>
              <h3 className={styles.tierTagline}>{tier.tagline}</h3>
              <dl className={styles.tierRows}>
                <div className={styles.tierRow}>
                  <dt className={styles.tierRowLabel}>{packages.youGetLabel}</dt>
                  <dd className={styles.tierRowValue}>{tier.youGet}</dd>
                </div>
                <div className={styles.tierRow}>
                  <dt className={styles.tierRowLabel}>{packages.youProvideLabel}</dt>
                  <dd className={styles.tierRowValue}>{tier.youProvide}</dd>
                </div>
                <div className={styles.tierRow}>
                  <dt className={styles.tierRowLabel}>{packages.whoExecutesLabel}</dt>
                  <dd className={styles.tierRowValue}>{tier.whoExecutes}</dd>
                </div>
                <div className={styles.tierRow}>
                  <dt className={styles.tierRowLabel}>{packages.endsWithLabel}</dt>
                  <dd className={styles.tierRowValue}>{tier.endsWith}</dd>
                </div>
              </dl>
              <a
                href={packages.talkHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.ctaGhost} ${styles.tierLink}`}
              >
                {packages.talkLabel} →
              </a>
            </motion.article>
          ))}
        </div>

        <p className={styles.packagesNote}>{packages.note}</p>
      </div>
    </section>
  )
}
