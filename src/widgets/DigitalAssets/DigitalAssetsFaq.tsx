'use client'

import { FaqAccordion } from '@/widgets/FaqAccordion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const { faq } = digitalAssetsContent

export function DigitalAssetsFaq() {
  return (
    <section className={styles.section} aria-label={faq.label}>
      <div className={styles.inner}>
        <SectionHead label={faq.label} headline={faq.headline} />
        <div className={styles.faqAccordionWrap}>
          <FaqAccordion items={faq.items} bare />
        </div>
      </div>
    </section>
  )
}
