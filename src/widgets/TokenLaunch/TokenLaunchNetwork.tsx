'use client'

import { PartnersSection } from '@/widgets/PartnersSection'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const { faq } = tokenLaunchContent

export function TokenLaunchNetwork() {
  return (
    <section className={styles.section} aria-label={faq.networkTitle}>
      <div className={styles.inner}>
        <SectionHead label={faq.networkLabel} headline={faq.networkTitle} />
      </div>
      <PartnersSection />
    </section>
  )
}
