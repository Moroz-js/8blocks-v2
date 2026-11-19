import { Fragment, type ReactNode } from 'react'
import Image from 'next/image'
import type { AuthorRef } from '@/entities/article'
import { siteConfig } from '@/shared/config/site'
import { RichText } from '@/shared/render'
import { buildToc } from '@/shared/lib/buildToc'
import { uiStrings } from '@/shared/content/uiStrings'
import { formatPostDate } from '@/widgets/Posts/format'
import { ArticleToc } from './ArticleToc'
import styles from './ArticlePage.module.scss'

/** Article wrapper: maps the v1 tokens RichText blocks read onto v2. */
export function ArticleRoot({ children }: { children: ReactNode }) {
  return <article className={styles.root}>{children}</article>
}

interface ArticleHeaderProps {
  /** Section line above the title («Blog · Tokenomics»). */
  eyebrow: ReactNode
  title: string
  excerpt?: ReactNode
  authors?: readonly Pick<AuthorRef, 'name' | 'position' | 'linkedIn'>[]
  publishedAt?: string | null
  readingTime: number
}

/** Centred header: eyebrow, title, lead and the «By · Published · min read» line. */
export function ArticleHeader({ eyebrow, title, excerpt, authors = [], publishedAt, readingTime }: ArticleHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      <p className={styles.meta}>
        {uiStrings.by}:{' '}
        {authors.length > 0 ? (
          authors.map((author, i) => {
            const label = `${author.name}${author.position ? `, ${author.position}` : ''}`
            return (
              <Fragment key={`${author.name}-${i}`}>
                {i > 0 && ', '}
                {author.linkedIn ? (
                  <a href={author.linkedIn} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
              </Fragment>
            )
          })
        ) : (
          <span>{siteConfig.name}</span>
        )}
        {publishedAt && (
          <>
            {' · '}
            {uiStrings.published}: <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>
          </>
        )}
        {' · '}
        {readingTime} {uiStrings.minRead}
      </p>
    </header>
  )
}

/** 770px cover under the header. */
export function ArticleCover({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={styles.cover}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className={styles.coverImg}
        sizes="(max-width: 800px) 100vw, 770px"
        priority
      />
    </div>
  )
}

interface ArticleBodyProps {
  content: unknown
  /** Table of contents on the left (shown from two headings). */
  toc?: boolean
  /** After the text: download CTA, share block. */
  children?: ReactNode
}

/** Table of contents + 595px reading column. */
export function ArticleBody({ content, toc = true, children }: ArticleBodyProps) {
  const tocItems = buildToc(content)
  return (
    <div className={styles.body}>
      {toc && tocItems.length >= 2 && (
        <aside className={styles.sidebar}>
          <ArticleToc items={tocItems} />
        </aside>
      )}
      <div className={styles.content}>
        <RichText content={content} />
        {children}
      </div>
    </div>
  )
}
