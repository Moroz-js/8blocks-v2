'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { finalCta, legalDisclaimer } = digitalAssetsContent

export function DigitalAssetsFinalCta() {
  return (
    <section className={styles.finalSection} aria-label="Call to action">
      <motion.div
        className={styles.finalInner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
      >
        <span className={styles.finalLabel}>[{finalCta.label}]</span>
        <h2 className={styles.finalHeadline}>{finalCta.headline}</h2>
        <p className={styles.finalDescription}>{finalCta.description}</p>
        <div className={styles.finalActions}>
          <a href={finalCta.ctaHref} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
            {finalCta.ctaLabel}
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </a>
          {finalCta.secondaryHref.startsWith('http') ? (
            <a
              href={finalCta.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.finalSecondary}
            >
              {finalCta.secondaryLabel}
            </a>
          ) : (
            <Link href={finalCta.secondaryHref} className={styles.finalSecondary}>
              {finalCta.secondaryLabel}
            </Link>
          )}
        </div>
      </motion.div>
      <p className={styles.legalDisclaimer}>{legalDisclaimer}</p>
    </section>
  )
}
