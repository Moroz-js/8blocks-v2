'use client'

import Image from 'next/image'
import Link from 'next/link'
import { lang } from '@/shared/i18n'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import type { PublicAuditCard as PublicAuditCardType } from './types'
import { CardCoverPattern } from '@/shared/ui/CardCoverPattern'
import { usePlaceholderGradients } from '@/shared/lib/useThemeColors'
import styles from './PublicAuditCard.module.scss'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface Props {
  audit: PublicAuditCardType
  index?: number
  priority?: boolean
}

export function PublicAuditCard({ audit, index = 0, priority = false }: Props) {
  const coverGradients = usePlaceholderGradients()
  const placeholder = coverGradients[index % coverGradients.length]
  const date = formatDate(audit.publishedAt)
  const href = `/audits/${audit.slug}`

  return (
    <article className={styles.card}>
      {/* Cover */}
      <Link href={href} className={styles.coverLink} tabIndex={-1} aria-hidden="true">
        <div className={styles.cover}>
          {audit.cover?.url ? (
            <Image
              src={audit.cover.url}
              alt={audit.cover.alt || audit.title}
              fill
              className={styles.coverImg}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
              priority={priority}
            />
          ) : (
            <div className={styles.coverPlaceholder} style={{ background: placeholder }}>
              <CardCoverPattern className={styles.patternSvg} />
            </div>
          )}
          <div className={styles.coverOverlay} aria-hidden="true" />
        </div>
      </Link>

      {/* Date */}
      <div className={styles.meta}>
        <time className={styles.date} dateTime={audit.publishedAt}>
          {date}
        </time>
      </div>

      {/* Title */}
      <Link href={href} className={styles.titleLink}>
        <h3 className={styles.title}>{audit.title}</h3>
      </Link>

      {/* Excerpt */}
      {audit.excerpt && <p className={styles.excerpt}>{audit.excerpt}</p>}

      {/* Footer */}
      <div className={styles.footer}>
        <Link href={href} className={styles.readLink}>
          {auditsArchiveContent.readLink}
          <span className={styles.readArrow} aria-hidden="true">
            <ArrowRight />
          </span>
        </Link>
      </div>
    </article>
  )
}
