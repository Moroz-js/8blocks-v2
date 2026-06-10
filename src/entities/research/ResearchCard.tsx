'use client'

import Link from 'next/link'
import Image from 'next/image'
import { lang } from '@/shared/i18n'
import { uiStrings } from '@/shared/content/uiStrings'
import type { ResearchCard as ResearchCardType } from './types'
import styles from './ResearchCard.module.scss'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h9M12 8L8 4M12 8l-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M1.5 8S3.5 3.5 8 3.5 14.5 8 14.5 8 12.5 12.5 8 12.5 1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

interface Props {
  research: ResearchCardType
  priority?: boolean
}

export function ResearchCard({ research, priority = false }: Props) {
  const href = `/research/${research.slug}`
  const date = formatDate(research.publishedAt)
  const cardColor = research.cardColor || '#141414'
  const textColor = research.textColor || '#FFFFFF'

  return (
    <article
      className={styles.card}
      style={
        {
          '--research-card-bg': cardColor,
          '--research-card-fg': textColor,
        } as React.CSSProperties
      }
    >
      <Link href={href} className={styles.fill} aria-label={research.title}>
        {research.cover?.url && (
          <div className={styles.cover}>
            <Image
              src={research.cover.url}
              alt={research.cover.alt || research.title}
              fill
              className={styles.coverImg}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priority}
            />
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.meta}>
            {research.category && (
              <span className={styles.category}>{research.category.title}</span>
            )}
            {date && (
              <time className={styles.date} dateTime={research.publishedAt ?? undefined}>
                {date}
              </time>
            )}
          </div>

          <h3 className={styles.title}>{research.title}</h3>

          {research.excerpt && <p className={styles.srOnly}>{research.excerpt}</p>}

          <div className={styles.footer}>
            <span className={styles.readLink}>
              {uiStrings.read}
              <span className={styles.readArrow} aria-hidden="true">
                <ArrowRight />
              </span>
            </span>
            {typeof research.views === 'number' && research.views > 0 && (
              <span className={styles.views}>
                <EyeIcon />
                {research.views.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
