'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { footerContent } from '@/shared/content/footer'
import styles from './Footer.module.scss'

export function FooterMap() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const theme = mounted && resolvedTheme === 'light' ? 'light' : 'dark'

  return (
    <div className={styles.mapWrap} data-lenis-prevent>
      <iframe
        key={theme}
        title={footerContent.mapTitle}
        src={footerContent.mapEmbedSrc}
        className={styles.mapIframe}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        style={{ colorScheme: theme }}
      />
    </div>
  )
}
