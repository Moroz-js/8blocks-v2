'use client'

import Image from 'next/image'
import { lang } from '@/shared/i18n'
import { mediaArchiveContent } from '@/shared/content/mediaPage'
import type { MediaMentionCard as MediaMentionCardType } from './types'
import { CardCoverPattern } from '@/shared/ui/CardCoverPattern'
import { usePlaceholderGradients } from '@/shared/lib/useThemeColors'
import styles from './MediaMentionCard.module.scss'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ExternalArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface Props {
  mention: MediaMentionCardType
  index?: number
  priority?: boolean
}

export function MediaMentionCard({ mention, index = 0, priority = false }: Props) {
  const coverGradients = usePlaceholderGradients()
  const placeholder = coverGradients[index % coverGradients.length]
  const date = formatDate(mention.publishedAt)

  return (
    <article className={styles.card}>
      {/* Cover */}
      <a
        href={mention.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.coverLink}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className={styles.cover}>
          {mention.cover?.url ? (
            <Image
              src={mention.cover.url}
              alt={mention.cover.alt || mention.title}
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
      </a>

      {/* Meta: category + date */}
      <div className={styles.meta}>
        {mention.category && (
          <span className={styles.category}>{mention.category.title}</span>
        )}
        <time className={styles.date} dateTime={mention.publishedAt}>
          {date}
        </time>
      </div>

      {/* Title */}
      <a
        href={mention.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.titleLink}
      >
        <h3 className={styles.title}>{mention.title}</h3>
      </a>

      {/* Excerpt */}
      {mention.excerpt && <p className={styles.excerpt}>{mention.excerpt}</p>}

      {/* Footer */}
      <div className={styles.footer}>
        <a
          href={mention.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.readLink}
        >
          {mediaArchiveContent.readLink}
          <span className={styles.readArrow} aria-hidden="true">
            <ExternalArrow />
          </span>
        </a>
      </div>
    </article>
  )
}
