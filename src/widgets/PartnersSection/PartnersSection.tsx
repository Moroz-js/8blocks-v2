'use client'

import Image from 'next/image'
import { partnersContent } from '@/shared/content/homePage'
import styles from './PartnersSection.module.scss'

export function PartnersSection() {
  const base = partnersContent.partners
  // 4 copies ensure track is always wider than 2× viewport for seamless loop
  const items = [...base, ...base, ...base, ...base]

  return (
    <section className={styles.section} id="partners" aria-label="Партнёры">
      <div className={styles.marqueeWrap}>
        <div className={styles.track} aria-hidden="true">
          {items.map((partner, i) => {
            const img = (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className={styles.partnerLogo}
              />
            )
            return 'href' in partner && partner.href ? (
              <a
                key={i}
                href={partner.href}
                className={styles.partnerSlot}
                target="_blank"
                rel="noopener noreferrer"
              >
                {img}
              </a>
            ) : (
              <div key={i} className={styles.partnerSlot}>
                {img}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
