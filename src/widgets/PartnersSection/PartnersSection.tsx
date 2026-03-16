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
          {items.map((partner, i) => (
            <div key={i} className={styles.partnerSlot}>
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className={styles.partnerLogo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
