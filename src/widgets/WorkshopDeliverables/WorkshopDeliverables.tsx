'use client'

import { useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WorkshopDeliverables.module.scss'

const ease = 'easeOut' as const

interface DeliverableItem {
  title: string
  description: string
}

interface WorkshopDeliverablesProps {
  headline: string
  description: string
  items: readonly DeliverableItem[]
  upsell: {
    headline: string
    description: string
    ctaLabel: string
    ctaHref: string
  }
}

export function WorkshopDeliverables({
  headline,
  description,
  items,
  upsell,
}: WorkshopDeliverablesProps) {
  const upsellRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = upsellRef.current
    const glow = glowRef.current
    if (!el || !glow) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glow.style.transform = `translate(${x - 150}px, ${y - 150}px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const glow = glowRef.current
    if (!glow) return
    glow.style.transform = 'translate(-60px, -60px)'
  }, [])

  return (
    <section className={styles.section} aria-label="What you get">
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollRevealText text={headline} className={styles.headline} />
          <ScrollRevealText text={description} className={styles.description} />
        </div>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.article
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className={styles.cardTopBorder} aria-hidden="true" />
              <span className={styles.cardNum} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </motion.article>
          ))}
        </div>

        <div
          ref={upsellRef}
          className={styles.upsellWrapper}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
        <motion.div
          className={styles.upsell}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease, delay: 0.1 }}
        >
          <div ref={glowRef} className={styles.upsellGlow} aria-hidden="true" />
          <p className={styles.upsellHeadline}>{upsell.headline}</p>
          <p className={styles.upsellDesc}>{upsell.description}</p>
          <Link href={upsell.ctaHref} className={styles.upsellCta}>
            {upsell.ctaLabel}
            <span className={styles.upsellCtaArrow} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </motion.div>
        </div>
      </div>
    </section>
  )
}
