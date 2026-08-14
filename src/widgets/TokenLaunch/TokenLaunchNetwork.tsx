'use client'

import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { PartnersSection } from '@/widgets/PartnersSection'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const { faq } = tokenLaunchContent

export function TokenLaunchNetwork() {
  return (
    <section className={styles.section} aria-label={faq.networkTitle}>
      <div className={styles.inner}>
        <SectionHead headline={faq.networkTitle} />
        <PartnersSection />
      </div>
    </section>
  )
}
