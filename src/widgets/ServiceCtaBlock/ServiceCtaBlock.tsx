'use client'

import React, { useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './ServiceCtaBlock.module.scss'

const ease = 'easeOut' as const

interface ServiceCtaBlockProps {
  headline: React.ReactNode
  ctaLabel: string
  ctaHref: string
}

export function ServiceCtaBlock({ headline, ctaLabel, ctaHref }: ServiceCtaBlockProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current
    const glow = glowRef.current
    if (!el || !glow) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glow.style.transform = `translate(${x - 300}px, ${y - 100}px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const glow = glowRef.current
    if (!glow) return
    glow.style.transform = 'translate(-50%, -50%)'
  }, [])

  return (
    <section className={styles.section} aria-label="Call to action">
      <motion.div
        ref={innerRef}
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={glowRef} className={styles.glow} aria-hidden="true" />
        <h2 className={styles.headline}>{headline}</h2>
        <Link href={ctaHref} className={styles.cta}>
          {ctaLabel}
          <span className={styles.ctaArrow} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
        </Link>
      </motion.div>
    </section>
  )
}
