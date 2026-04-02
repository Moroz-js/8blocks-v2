import Link from 'next/link'
import Image from 'next/image'
import { lang } from '@/shared/i18n'
import { uiStrings } from '@/shared/content/uiStrings'
import type { ArticleCard as ArticleCardType } from './types'
import styles from './ArticleCard.module.scss'

// Deterministic cover placeholder gradient per-article
const PLACEHOLDERS = [
  'linear-gradient(135deg, rgba(197,61,255,0.18) 0%, rgba(99,62,220,0.10) 100%)',
  'linear-gradient(135deg, rgba(99,142,251,0.18) 0%, rgba(197,61,255,0.10) 100%)',
  'linear-gradient(135deg, rgba(117,251,99,0.12) 0%, rgba(99,142,251,0.12) 100%)',
]

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
  const placeholder = PLACEHOLDERS[index % PLACEHOLDERS.length]
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
              <CoverPattern />
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

// Subtle abstract lines for the cover placeholder
function CoverPattern() {
  return (
    <svg
      viewBox="0 0 420 236"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.patternSvg}
      aria-hidden="true"
    >
      <line x1="0" y1="118" x2="420" y2="118" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="210" y1="0" x2="210" y2="236" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="210" cy="118" r="60" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <circle cx="210" cy="118" r="32" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <circle cx="210" cy="118" r="10" fill="rgba(255,255,255,0.12)" />
      <line x1="80" y1="40" x2="340" y2="196" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <line x1="340" y1="40" x2="80" y2="196" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    </svg>
  )
}
