import Image from 'next/image'
import { RichText } from '@/shared/render'
import { buildToc } from '@/shared/lib/buildToc'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { lang } from '@/shared/i18n'
import { auditsArchiveContent } from '@/shared/content/auditsPage'
import type { AuditMetrics } from './auditMetrics'
import { AuditHero } from './AuditHero'
import { AuditToc } from './AuditToc'
import styles from './AuditPage.module.scss'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

interface AuditData {
  title: string
  slug: string
  excerpt?: string | null
  metrics?: AuditMetrics | null
  cover?: { url: string; alt: string } | null
  content?: unknown
  relatedArticleSlug?: string | null
  ctaText?: string | null
  publishedAt?: string | null
}

interface Props {
  audit: AuditData
}

export function AuditPage({ audit }: Props) {
  const dateLabel = formatDate(audit.publishedAt)
  const tocItems = buildToc(audit.content)

  return (
    <>
      <AuditHero
        title={audit.title}
        excerpt={audit.excerpt}
        metrics={audit.metrics}
        dateLabel={dateLabel || null}
        publishedAt={audit.publishedAt}
        relatedArticleSlug={audit.relatedArticleSlug}
      />
      {tocItems.length >= 2 && <AuditToc items={tocItems} />}

      <article className={styles.root}>
        {audit.cover?.url && (
          <div className={styles.coverWrap}>
            <Image
              src={audit.cover.url}
              alt={audit.cover.alt || audit.title}
              width={1200}
              height={630}
              className={styles.coverImg}
              priority
            />
          </div>
        )}

        {audit.content != null ? (
          <div className={styles.content}>
            <RichText content={audit.content} />
          </div>
        ) : null}

        {audit.relatedArticleSlug && audit.ctaText && (
          <ServiceCtaBlock
            headline={audit.ctaText}
            ctaLabel={auditsArchiveContent.blogArticleLink}
            ctaHref={`/blog/${audit.relatedArticleSlug}`}
          />
        )}
      </article>
    </>
  )
}
