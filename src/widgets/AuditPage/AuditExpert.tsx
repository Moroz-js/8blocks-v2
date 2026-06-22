import Image from 'next/image'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import styles from './AuditExpert.module.scss'

export interface AuditExpertData {
  name?: string | null
  role?: string | null
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
          {expert.name && <span className={styles.name}>{expert.name}</span>}
          {expert.role && <span className={styles.role}>{expert.role}</span>}
          {expert.rating && <span className={styles.rating}>{expert.rating}</span>}
        </div>
      </div>
    </section>
  )
}
