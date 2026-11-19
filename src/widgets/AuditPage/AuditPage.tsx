import Link from 'next/link'
import { estimateReadingTime } from '@/entities/article'
import { Cta, Section } from '@/shared/ds'
import { siteConfig } from '@/shared/config/site'
import { auditDetailContent, auditsArchiveContent } from '@/shared/content/auditsPage'
import { ShareBlock } from '@/features/shareBlock'
import { ArticleBody, ArticleCover, ArticleHeader, ArticleRoot } from '@/widgets/ArticlePage'
import type { AuditExpertData, AuditHeroData } from './auditMetrics'
import { AuditRating, type RatingBlock } from './AuditRating'
import { AuditSummary } from './AuditSummary'

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
  /** `?print=1` render for the PDF route: no links, share, CTA or table of contents. */
  print?: boolean
}

/** Public audit on the v2 article template, with the summary under the header and the rating block. */
export function AuditPage({ audit, print = false }: Props) {
  const hero = audit.hero ?? {}
  const expert = audit.expert
  const ticker = hero.tokenName && hero.tokenName !== audit.title ? hero.tokenName : null
  const conclusion = (audit.excerpt ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  const auditUrl = `${siteConfig.url.replace(/\/$/, '')}/audits/${audit.slug}`

  return (
    <ArticleRoot>
      <div data-pdf-cover>
        <ArticleHeader
          eyebrow={
            <>
              <Link href="/audits">{auditsArchiveContent.labelSection}</Link>
              {ticker && <span>{` · ${ticker}`}</span>}
            </>
          }
          title={audit.title}
          excerpt={hero.projectDescription}
          authors={expert?.name ? [{ name: expert.name, position: expert.role ?? null, linkedIn: expert.linkedIn ?? null }] : []}
          publishedAt={audit.publishedAt}
          readingTime={estimateReadingTime(audit.content)}
        />
        {!print && audit.cover && <ArticleCover src={audit.cover.url} alt={audit.cover.alt} />}
        <AuditSummary slug={audit.slug} hero={hero} print={print} />
      </div>

      {audit.content != null && (
        <ArticleBody content={audit.content} toc={!print}>
          {!print && <ShareBlock url={auditUrl} title={audit.title} />}
        </ArticleBody>
      )}

      {(audit.ratingBlocks ?? []).length > 0 && (
        <AuditRating
          blocks={audit.ratingBlocks ?? []}
          labels={auditDetailContent.rating}
          letterRating={hero.letterRating}
          totalScore={hero.score}
          conclusion={conclusion}
          disclaimer={auditDetailContent.disclaimer}
          expert={expert}
        />
      )}

      {!print && audit.relatedArticleSlug && audit.ctaText && (
        <Section>
          <Cta size="md" title={audit.ctaText} primary={{ label: auditsArchiveContent.blogArticleLink, href: `/blog/${audit.relatedArticleSlug}` }} />
        </Section>
      )}
    </ArticleRoot>
  )
}
