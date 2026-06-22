'use client'

import { useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import styles from './Footer.module.scss'

export function FooterWatermark() {
  const pathname = usePathname()
  const isContact = pathname === '/contact'
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.3'],
  })

  const ruWatermark = lang === 'ru' && !isContact

  // Меньший ход параллакса для двухстрочной русской версии, чтобы
  // overflow:hidden секции не обрезал вторую строку «токеномика.рф».
  const yRaw = useTransform(scrollYProgress, [0, 1], [ruWatermark ? 48 : 120, 0])
  const y = useSpring(yRaw, { stiffness: 60, damping: 20, mass: 0.8 })

  const handleClick = useCallback(() => {
    if (!isContact) return
    navigator.clipboard.writeText(siteConfig.email)
  }, [isContact])

  return (
    <div ref={ref} className={styles.watermarkSection} aria-hidden={!isContact}>
      <motion.div
        className={`${styles.watermarkText} ${isContact ? styles.watermarkEmail : ''} ${lang === 'en' && !isContact ? styles.watermarkEnglish : ''} ${ruWatermark ? styles.watermarkRu : ''}`}
        style={{ y, cursor: isContact ? 'pointer' : undefined, userSelect: isContact ? 'text' : 'none' }}
        onClick={handleClick}
      >
        {isContact ? (
          siteConfig.email
        ) : ruWatermark ? (
          <>
            <span className={styles.watermarkRuLine1}>А8А9</span>
            <span className={styles.watermarkRuLine2}>токеномика.рф</span>
          </>
        ) : (
          '8BLOCKS'
        )}
      </motion.div>
    </div>
  )
}
