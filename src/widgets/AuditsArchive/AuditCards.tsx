import type { PublicAuditCard as PublicAuditCardType } from '@/entities/public-audit'
import { uiStrings } from '@/shared/content/uiStrings'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate } from '@/widgets/Posts/format'
import styles from './AuditsArchive.module.scss'

/** Public audit cards: cover, date, title, grade and score. */
export function AuditCards({ audits, priorityCount = 3 }: { audits: PublicAuditCardType[]; priorityCount?: number }) {
  return (
    <PostGrid>
      {audits.map((audit, i) => (
        <PostCard
          key={audit.id}
          href={`/audits/${audit.slug}`}
          cover={audit.cover ? { url: audit.cover.url, alt: audit.cover.alt } : null}
          meta={formatPostDate(audit.publishedAt)}
          title={audit.title}
          excerpt={audit.excerpt}
          footer={
            audit.rating || audit.score != null ? (
              <span className={styles.grade}>
                {audit.rating && <span className={styles.rating}>{audit.rating}</span>}
                {audit.score != null && `${audit.score}/100`}
              </span>
            ) : null
          }
          action={`${uiStrings.read} →`}
          priority={i < priorityCount}
        />
      ))}
    </PostGrid>
  )
}
