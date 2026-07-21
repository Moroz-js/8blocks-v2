import { RichText } from '@/shared/render'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { lang, t } from '@/shared/i18n'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import type { AuditHeroData } from './auditMetrics'
import { AuditHero } from './AuditHero'
import { AuditTakeaways } from './AuditTakeaways'
import { AuditRating, type RatingBlock } from './AuditRating'
import { type AuditExpertData } from './AuditExpert'
import { AuditDocMarker } from './AuditDocMarker'
import styles from './AuditPage.module.scss'

const AUDIT_DISCLAIMER = t({
  ru: 'Аудит не является инвестиционной рекомендацией. Используйте его как часть собственного анализа.',
  en: 'This audit is not investment advice. Use it as part of your own analysis.',
})

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatEyebrowDate(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${mm}.${yy}`
}

interface AuditData {
  title: string
  slug: string
  excerpt?: string | null
  hero?: AuditHeroData | null
  ratingBlocks?: RatingBlock[] | null
  expert?: AuditExpertData | null
  cover?: { url: string; alt: string } | null
  content?: unknown
  relatedArticleSlug?: string | null
  ctaText?: string | null
  publishedAt?: string | null
}

interface Props {
  audit: AuditData
  print?: boolean
}

export function AuditPage({ audit, print = false }: Props) {
  const dateLabel = formatDate(audit.publishedAt)
  const eyebrowDate = formatEyebrowDate(audit.publishedAt)
  const ratingBlocks = audit.ratingBlocks ?? []
  const conclusionParas = (audit.excerpt ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <AuditDocMarker />
      <div className={styles.printCover} data-pdf-cover>
        <AuditHero
          title={audit.title}
          slug={audit.slug}
          hero={audit.hero}
          dateLabel={dateLabel || null}
          eyebrowDate={eyebrowDate || null}
          print={print}
        />

        <AuditTakeaways
          verdict={audit.hero?.verdict}
          strength={audit.hero?.strength}
          weakness={audit.hero?.weakness}
        />
      </div>

      <article className={styles.root}>
        {audit.content != null ? (
          <div className={styles.content}>
            <RichText content={audit.content} />
          </div>
        ) : null}
      </article>

      {ratingBlocks.length > 0 && (
        <AuditRating
          blocks={ratingBlocks}
          letterRating={audit.hero?.letterRating}
          totalScore={audit.hero?.score}
          conclusion={conclusionParas}
          disclaimer={AUDIT_DISCLAIMER}
          expert={audit.expert}
        />
      )}

      {!print && audit.relatedArticleSlug && audit.ctaText && (
        <ServiceCtaBlock
          headline={audit.ctaText}
          ctaLabel={auditsArchiveContent.blogArticleLink}
          ctaHref={`/blog/${audit.relatedArticleSlug}`}
        />
      )}
    </>
  )
}
