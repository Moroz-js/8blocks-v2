import Image from 'next/image'
import Link from 'next/link'
import { lang } from '@/shared/i18n'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import type { PublicAuditCard as PublicAuditCardType } from './types'
import styles from './PublicAuditCard.module.scss'

const PLACEHOLDERS = [
  'linear-gradient(135deg, rgba(197,61,255,0.18) 0%, rgba(99,62,220,0.10) 100%)',
  'linear-gradient(135deg, rgba(99,142,251,0.18) 0%, rgba(197,61,255,0.10) 100%)',
  'linear-gradient(135deg, rgba(117,251,99,0.12) 0%, rgba(99,142,251,0.12) 100%)',
]

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
  const placeholder = PLACEHOLDERS[index % PLACEHOLDERS.length]
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
              <CoverPattern />
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
