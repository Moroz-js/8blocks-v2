'use client'

import Link from 'next/link'
import Image from 'next/image'
import { lang } from '@/shared/i18n'
import { uiStrings } from '@/shared/content/uiStrings'
import type { ArticleCard as ArticleCardType } from './types'
import { CardCoverPattern } from '@/shared/ui/CardCoverPattern'
import { usePlaceholderGradients } from '@/shared/lib/useThemeColors'
import styles from './ArticleCard.module.scss'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface Props {
  article: ArticleCardType
  index?: number
  priority?: boolean
}

export function ArticleCard({ article, index = 0, priority = false }: Props) {
  const href = `/blog/${article.slug}`
  const coverGradients = usePlaceholderGradients()
  const placeholder = coverGradients[index % coverGradients.length]
  const date = formatDate(article.publishedAt)

  return (
    <article className={styles.card}>
      {/* Cover */}
      <Link href={href} className={styles.coverLink} tabIndex={-1} aria-hidden="true">
        <div className={styles.cover}>
          {article.cover?.url ? (
            <Image
              src={article.cover.url}
              alt={article.cover.alt || article.title}
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
          {/* Overlay for readability */}
          <div className={styles.coverOverlay} aria-hidden="true" />
        </div>
      </Link>

      {/* Meta row: category + date */}
      <div className={styles.meta}>
        {article.category && (
          <Link href={`/blog/${article.category.slug}`} className={styles.category}>
            {article.category.title}
          </Link>
        )}
        {date && (
          <time className={styles.date} dateTime={article.publishedAt ?? undefined}>
            {date}
          </time>
        )}
      </div>

      {/* Title */}
      <Link href={href} className={styles.titleLink}>
        <h3 className={styles.title}>{article.title}</h3>
      </Link>

      {/* Excerpt */}
      {article.excerpt && (
        <p className={styles.excerpt}>{article.excerpt}</p>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        {article.readingTime && (
          <span className={styles.readingTime}>{article.readingTime} {uiStrings.minutes}</span>
        )}
        <Link href={href} className={styles.readLink}>
          {uiStrings.read}
          <span className={styles.readArrow} aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
