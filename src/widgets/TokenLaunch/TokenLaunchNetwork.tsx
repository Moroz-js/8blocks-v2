'use client'

import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const { faq } = tokenLaunchContent

export function TokenLaunchNetwork() {
  return (
    <section className={styles.section} aria-label={faq.networkTitle}>
      <div className={styles.inner}>
        <SectionHead headline={faq.networkTitle} />
        <div className={styles.faqNetwork}>
          {faq.network.map((partner) => (
            <a
              key={partner.label}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={styles.faqNetworkLink}
            >
              {partner.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
