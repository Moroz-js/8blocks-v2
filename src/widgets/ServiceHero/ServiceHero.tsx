'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './ServiceHero.module.scss'

const ease = 'easeOut' as const

type Variant = 'consulting' | 'tokenomics' | 'audit'

interface ServiceHeroProps {
  label: string
  headline: string
  accentWord?: string
  description: string
  ctaLabel: string
  ctaHref: string
  variant?: Variant
}

// Розовый градиент сайта: rose → magenta → purple (как $gradient-accent)
const gradientStops = (
  <>
    <stop offset="0%" stopColor="#D9ADD0" stopOpacity="0.4" />
    <stop offset="55%" stopColor="#C24E88" stopOpacity="0.7" />
    <stop offset="100%" stopColor="#8E4ABD" stopOpacity="0.5" />
  </>
)

function DecorativeSvg({ variant }: { variant: Variant }) {
  if (variant === 'consulting') {
    return (
      <svg className={styles.decorSvg} viewBox="0 0 200 200" fill="none" aria-hidden>
        <defs>
          <linearGradient id="heroConsultingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            {gradientStops}
          </linearGradient>
        </defs>
        <rect x="45" y="45" width="110" height="110" rx="12" stroke="url(#heroConsultingGrad)" strokeWidth="1.5" fill="none" />
        <circle cx="72" cy="72" r="8" stroke="url(#heroConsultingGrad)" strokeWidth="1.5" fill="none" />
        <circle cx="128" cy="72" r="8" stroke="url(#heroConsultingGrad)" strokeWidth="1.5" fill="none" />
        <circle cx="72" cy="128" r="8" stroke="url(#heroConsultingGrad)" strokeWidth="1.5" fill="none" />
        <circle cx="128" cy="128" r="8" stroke="url(#heroConsultingGrad)" strokeWidth="1.5" fill="none" />
        <path d="M80 72h36M72 80v36M128 80v36M80 128h36" stroke="url(#heroConsultingGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </svg>
    )
  }
  if (variant === 'tokenomics') {
    return (
      <svg className={styles.decorSvg} viewBox="0 0 200 200" fill="none" aria-hidden>
        <defs>
          <linearGradient id="heroTokenomicsGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            {gradientStops}
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="56" stroke="url(#heroTokenomicsGrad)" strokeWidth="1.2" fill="none" opacity="0.5" />
        <circle cx="100" cy="100" r="38" stroke="url(#heroTokenomicsGrad)" strokeWidth="1.2" fill="none" opacity="0.65" />
        <circle cx="100" cy="100" r="20" stroke="url(#heroTokenomicsGrad)" strokeWidth="1.5" fill="none" opacity="0.9" />
        <circle cx="100" cy="100" r="4" fill="url(#heroTokenomicsGrad)" opacity="0.9" />
        <path d="M100 38v10M100 152v10M38 100h10M152 100h10" stroke="url(#heroTokenomicsGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </svg>
    )
  }
  return (
    <svg className={styles.decorSvg} viewBox="0 0 200 200" fill="none" aria-hidden>
      <defs>
        <linearGradient id="heroAuditGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          {gradientStops}
        </linearGradient>
      </defs>
      <rect x="55" y="45" width="90" height="110" rx="8" stroke="url(#heroAuditGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M68 68h54M68 92h54M68 116h38" stroke="url(#heroAuditGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <circle cx="138" cy="132" r="14" stroke="url(#heroAuditGrad)" strokeWidth="1.5" fill="none" opacity="0.9" />
      <path d="M132 132l4 4 8-8" stroke="url(#heroAuditGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    </svg>
  )
}

export function ServiceHero({
  label,
  headline,
  accentWord,
  description,
  ctaLabel,
  ctaHref,
  variant = 'consulting',
}: ServiceHeroProps) {
  const headlineParts = accentWord
    ? headline.split(accentWord)
    : [headline]

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.inner}>
        <div className={styles.content}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0 }}
          >
            <span className={styles.labelBracket}>[</span>
            {label}
            <span className={styles.labelBracket}>]</span>
          </motion.span>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
          >
            {headlineParts.length === 2 ? (
              <>
                {headlineParts[0]}
                <span className={styles.headlineAccent}>{accentWord}</span>
                {headlineParts[1]}
              </>
            ) : (
              headline
            )}
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.2 }}
          >
            {description}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.32 }}
          >
            <Link href={ctaHref} className={styles.cta}>
              {ctaLabel}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className={`${styles.visual} ${styles[`variant-${variant}`]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
          aria-hidden="true"
        >
          <DecorativeSvg variant={variant} />
        </motion.div>
      </div>
    </section>
  )
}
