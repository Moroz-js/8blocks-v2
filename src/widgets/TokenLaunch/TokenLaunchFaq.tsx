'use client'

import { FaqAccordion } from '@/widgets/FaqAccordion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const { faq } = tokenLaunchContent

export function TokenLaunchFaq() {
  return (
    <section className={styles.section} aria-label={faq.headline}>
      <div className={styles.inner}>
        <SectionHead label={faq.label} headline={faq.headline} />
        <div className={styles.faqAccordionWrap}>
          <FaqAccordion items={faq.items} bare headingOrder={3} />
        </div>

        <div className={styles.faqMeta}>
          <div className={styles.faqMetaBlock}>
            <h3 className={styles.faqMetaTitle}>{faq.geographyTitle}</h3>
            <p className={styles.faqMetaText}>{faq.geographyText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
