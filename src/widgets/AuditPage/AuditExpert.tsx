import Image from 'next/image'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import styles from './AuditExpert.module.scss'

export interface AuditExpertData {
  name?: string | null
  role?: string | null
  linkedIn?: string | null
  rating?: string | null
  photo?: { url: string; alt: string } | null
}

interface Props {
  expert?: AuditExpertData | null
}

export function AuditExpert({ expert }: Props) {
  if (!expert || (!expert.name && !expert.role && !expert.photo)) return null

  const initials = (expert.name ?? '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <section className={styles.root} aria-label={auditsArchiveContent.expertLabel}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          {expert.photo?.url ? (
            <Image
              src={expert.photo.url}
              alt={expert.photo.alt || expert.name || ''}
              width={88}
              height={88}
              className={styles.avatarImg}
            />
          ) : (
            <span className={styles.avatarFallback}>{initials}</span>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.label}>{auditsArchiveContent.expertLabel}</span>
          {expert.name &&
            (expert.linkedIn ? (
              <a
                href={expert.linkedIn}
                className={`${styles.name} ${styles.nameLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {expert.name}
                <svg
                  className={styles.linkedInIcon}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
                </svg>
              </a>
            ) : (
              <span className={styles.name}>{expert.name}</span>
            ))}
          {expert.role && <span className={styles.role}>{expert.role}</span>}
          {expert.rating && <span className={styles.rating}>{expert.rating}</span>}
        </div>
      </div>
    </section>
  )
}
