'use client'

import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { TokenLaunchLeadForm } from './TokenLaunchLeadForm'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { finalCta, form: formContent } = tokenLaunchContent

export function TokenLaunchFinalCta() {
  return (
    <section id="contact" className={styles.finalSection} aria-label={finalCta.headline}>
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
          <a href={finalCta.ctaHref} className={styles.ctaGhost}>
            {finalCta.ctaLabel}
          </a>
        </div>
        <div className={styles.finalFormWrap}>
          <h3 className={styles.finalFormTitle}>{finalCta.formTitle}</h3>
          <TokenLaunchLeadForm idPrefix="contact" submitLabel={formContent.submitShortLabel} />
        </div>
      </motion.div>
    </section>
  )
}
