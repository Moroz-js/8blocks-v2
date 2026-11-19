import Link from 'next/link'
import type { Article, ArticleCard } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'
import { Button, Section } from '@/shared/ds'
import { siteConfig } from '@/shared/config/site'
import { uiStrings } from '@/shared/content/uiStrings'
import { ArticleViewTracker } from '@/features/articleView'
import { ShareBlock } from '@/features/shareBlock'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'
import { ArticleBody, ArticleCover, ArticleHeader, ArticleRoot } from './ArticleParts'
import { ArticleDownloadCta } from './ArticleDownloadCta'

interface Props {
  article: Article
  relatedArticles?: ArticleCard[]
  /** URL prefix for category/share links, e.g. /blog or /research. */
  basePath?: string
  /** Section name in the eyebrow line («Blog · Tokenomics»). */
  sectionLabel?: string
  /** Whether to track views via the articles API (blog only). */
  trackViews?: boolean
  /** Link the category label to `${basePath}/${category.slug}` (only the blog has category pages). */
  linkCategory?: boolean
  /** Kept for API compatibility; the v2 layout always has room for the table of contents. */
  wide?: boolean
}

const AllArrow = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Article template on design system v2 (project 2 «Article» / «Research Article»). */
export function ArticlePage({
  article,
  relatedArticles = [],
  basePath = '/blog',
  sectionLabel = uiStrings.blogLabel,
  trackViews = true,
  linkCategory = true,
}: Props) {
  const articleUrl = `${siteConfig.url.replace(/\/$/, '')}${basePath}/${article.slug}`

  return (
    <ArticleRoot>
      {trackViews && <ArticleViewTracker slug={article.slug} />}

      <ArticleHeader
        eyebrow={
          <>
            <Link href={basePath}>{sectionLabel}</Link>
            {article.category && (
              <>
                {' · '}
                {linkCategory ? (
                  <Link href={`${basePath}/${article.category.slug}`}>{article.category.title}</Link>
                ) : (
                  <span>{article.category.title}</span>
                )}
              </>
            )}
          </>
        }
        title={article.title}
        excerpt={article.excerpt}
        authors={article.authors}
        publishedAt={article.publishedAt}
        readingTime={estimateReadingTime(article.content)}
      />

      {article.cover?.url && <ArticleCover src={article.cover.url} alt={article.cover.alt || article.title} />}

      <ArticleBody content={article.content}>
        {article.cta && <ArticleDownloadCta cta={article.cta} source={`${basePath.replace(/^\//, '')}:${article.slug}`} />}
        <ShareBlock url={articleUrl} title={article.title} />
      </ArticleBody>

      {relatedArticles.length > 0 && (
        <Section
          title={uiStrings.relatedArticles}
          sheen
          actions={
            <Button variant="secondary" href={basePath} icon={AllArrow}>
              {uiStrings.allArticles}
            </Button>
          }
        >
          <PostGrid>
            {relatedArticles.slice(0, 3).map((related) => (
              <PostCard
                key={related.id}
                href={`${basePath}/${related.slug}`}
                cover={related.cover ? { url: related.cover.url, alt: related.cover.alt } : null}
                meta={postMeta(related.category?.title, formatPostDate(related.publishedAt))}
                title={related.title}
                excerpt={related.excerpt}
                footer={`${related.readingTime} ${uiStrings.minRead}`}
                action={`${uiStrings.read} →`}
              />
            ))}
          </PostGrid>
        </Section>
      )}
    </ArticleRoot>
  )
}
