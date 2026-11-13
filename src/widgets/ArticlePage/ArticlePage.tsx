import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Article, ArticleCard } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'
import { Button, Section } from '@/shared/ds'
import { siteConfig } from '@/shared/config/site'
import { RichText } from '@/shared/render'
import { buildToc } from '@/shared/lib/buildToc'
import { uiStrings } from '@/shared/content/uiStrings'
import { ArticleViewTracker } from '@/features/articleView'
import { ShareBlock } from '@/features/shareBlock'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'
import { ArticleToc } from './ArticleToc'
import { ArticleDownloadCta } from './ArticleDownloadCta'
import styles from './ArticlePage.module.scss'

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
  const tocItems = buildToc(article.content)
  const readingTime = estimateReadingTime(article.content)
  const hasToc = tocItems.length >= 2
  const articleUrl = `${siteConfig.url.replace(/\/$/, '')}${basePath}/${article.slug}`

  return (
    <article className={styles.root}>
      {trackViews && <ArticleViewTracker slug={article.slug} />}

      <header className={styles.header}>
        <p className={styles.eyebrow}>
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
        </p>
        <h1 className={styles.title}>{article.title}</h1>
        {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        <p className={styles.meta}>
          {uiStrings.by}:{' '}
          {article.authors && article.authors.length > 0 ? (
            article.authors.map((author, i) => (
              <Fragment key={author.id}>
                {i > 0 && ', '}
                {author.linkedIn ? (
                  <a href={author.linkedIn} target="_blank" rel="noopener noreferrer">
                    {author.name}
                    {author.position ? `, ${author.position}` : ''}
                  </a>
                ) : (
                  <span>
                    {author.name}
                    {author.position ? `, ${author.position}` : ''}
                  </span>
                )}
              </Fragment>
            ))
          ) : (
            <span>{siteConfig.name}</span>
          )}
          {article.publishedAt && (
            <>
              {' · '}
              {uiStrings.published}: <time dateTime={article.publishedAt}>{formatPostDate(article.publishedAt)}</time>
            </>
          )}
          {' · '}
          {readingTime} {uiStrings.minRead}
        </p>
      </header>

      {article.cover?.url && (
        <div className={styles.cover}>
          <Image
            src={article.cover.url}
            alt={article.cover.alt || article.title}
            width={1200}
            height={630}
            className={styles.coverImg}
            sizes="(max-width: 800px) 100vw, 770px"
            priority
          />
        </div>
      )}

      <div className={styles.body}>
        {hasToc && (
          <aside className={styles.sidebar}>
            <ArticleToc items={tocItems} />
          </aside>
        )}
        <div className={styles.content}>
          <RichText content={article.content} />
          {article.cta && <ArticleDownloadCta cta={article.cta} source={`${basePath.replace(/^\//, '')}:${article.slug}`} />}
          <ShareBlock url={articleUrl} title={article.title} />
        </div>
      </div>

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
    </article>
  )
}
