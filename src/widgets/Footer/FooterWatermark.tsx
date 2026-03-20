'use client'

import { usePathname } from 'next/navigation'
import { siteConfig } from '@/shared/config/site'
import styles from './Footer.module.scss'

export function FooterWatermark() {
  const pathname = usePathname()
  const isContact = pathname === '/contact'

  return (
    <div className={styles.watermarkSection} aria-hidden="true">
      <div
        className={`${styles.watermarkText} ${isContact ? styles.watermarkEmail : ''}`}
      >
        {isContact ? siteConfig.email : '8BLOCKS'}
      </div>
    </div>
  )
}
