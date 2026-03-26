import Image from 'next/image'
import type { Article, ArticleCard } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'
import { siteConfig } from '@/shared/config/site'
import { RichText } from '@/shared/render'
import { buildToc } from '@/shared/lib/buildToc'
import { lang, t } from '@/shared/i18n'
import { ArticleViewTracker } from '@/features/articleView'
import { ShareBlock } from '@/features/shareBlock'
import { RelatedArticles } from '@/widgets/RelatedArticles'
import { ArticleToc } from './ArticleToc'
import styles from './ArticlePage.module.scss'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

interface Props {
  article: Article
  relatedArticles?: ArticleCard[]
}

export function ArticlePage({ article, relatedArticles = [] }: Props) {
  const tocItems = buildToc(article.content)
  const readingTime = estimateReadingTime(article.content)
  const date = formatDate(article.publishedAt)
  const hasToc = tocItems.length >= 2
  const articleUrl = `${siteConfig.url.replace(/\/$/, '')}/blog/${article.slug}`

  return (
    <article className={styles.root}>
      <ArticleViewTracker slug={article.slug} />

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className={styles.header}>
        {article.category && (
          <a href={`/blog/${article.category.slug}`} className={styles.category}>
            {article.category.title}
          </a>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        {article.excerpt && (
          <p className={styles.excerpt}>{article.excerpt}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.author}>8Blocks</span>
          <span className={styles.metaSep}>·</span>
          {date && (
            <>
              <time className={styles.date} dateTime={article.publishedAt ?? undefined}>
                {date}
              </time>
              <span className={styles.metaSep}>·</span>
            </>
          )}
          <span className={styles.readingTime}>{readingTime} {t({ ru: 'мин', en: 'min' })}</span>
        </div>
      </header>

      {/* ── Cover ───────────────────────────────────────────────── */}
      {article.cover?.url && (
        <div className={styles.coverWrap}>
          <Image
            src={article.cover.url}
            alt={article.cover.alt || article.title}
            width={1200}
            height={630}
            className={styles.coverImg}
            priority
          />
        </div>
      )}

      {/* ── Body: content + sidebar ToC ─────────────────────── */}
      <div className={`${styles.body} ${hasToc ? styles.bodyWithToc : ''}`}>
        <div className={styles.content}>
          <RichText content={article.content} />
        </div>

        {hasToc && (
          <aside className={styles.sidebar}>
            <ShareBlock url={articleUrl} title={article.title} />
            <ArticleToc items={tocItems} />
          </aside>
        )}
      </div>

      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} />
      )}
    </article>
  )
}
