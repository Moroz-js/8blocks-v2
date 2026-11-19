import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import type { CaseDetailData } from '@/entities/case-study'
import { AccentSurface } from '@/shared/ds'
import { casesUiContent as copy } from '@/shared/content/casesPage'
import { RichText } from '@/shared/render'
import { buildToc, type TocItem } from '@/shared/lib/buildToc'
import { ArticleToc } from '@/widgets/ArticlePage/ArticleToc'
import article from '@/widgets/ArticlePage/ArticlePage.module.scss'
import { CaseActionLink, CaseViewTracker } from './CaseAnalytics'
import styles from './CaseDetailPage.module.scss'

interface Props {
  item: CaseDetailData
}

/** Case study on the article template of design system v2 (project 2 «Case Hadronica»). */
export function CaseDetailPage({ item }: Props) {
  const isFull = item.format === 'full'
  const blogHref = item.relatedArticleSlug ? `/blog/${item.relatedArticleSlug}` : '/blog'
  const hasOverview = isFull && Boolean(item.industry || item.clientGoals)
  const hasChallenge = isFull && Boolean(item.challenge)

  const sections: TocItem[] = [
    ...(hasOverview ? [{ id: 'overview', text: copy.overviewLabel, level: 2 as const }] : []),
    ...(hasChallenge ? [{ id: 'challenges', text: copy.challengesLabel, level: 2 as const }] : []),
    ...(item.actions.length > 0 ? [{ id: 'solution', text: copy.solutionLabel, level: 2 as const }] : []),
    { id: 'result', text: copy.resultLabel, level: 2 },
    ...(isFull ? buildToc(item.content) : []),
  ]
  let index = 0
  const eyebrow = (label: string) => `${String(++index).padStart(2, '0')} · ${label}`
  const tags = [isFull && item.service ? copy.serviceLabels[item.service] : !isFull ? copy.snapshotLabel : null, item.industry].filter(Boolean)

  return (
    <article className={article.root}>
      <CaseViewTracker slug={item.slug} format={item.format} service={item.service} />

      <header className={article.header}>
        <p className={clsx(article.eyebrow, styles.crumbs)}>
          <Link href="/cases">{copy.allCases}</Link>
          {tags.length > 0 && <span className={styles.tags}>{tags.join(' · ')}</span>}
        </p>
        <h1 className={article.title}>{item.title}</h1>
        <p className={article.excerpt}>{item.task}</p>
      </header>

      {item.cover && (
        <div className={article.cover}>
          <Image
            src={item.cover.url}
            alt={item.cover.alt}
            width={1200}
            height={675}
            className={article.coverImg}
            sizes="(max-width: 800px) 100vw, 770px"
            priority
          />
        </div>
      )}

      <div className={article.body}>
        {sections.length >= 2 && (
          <aside className={article.sidebar}>
            <ArticleToc items={sections} />
          </aside>
        )}
        <div className={clsx(article.content, styles.content)}>
          {hasOverview && (
            <section id="overview" className={styles.section}>
              <p className={styles.eyebrow}>{eyebrow(copy.overviewLabel)}</p>
              {item.clientGoals && (
                <>
                  <h2 className={styles.sectionTitle}>{copy.goalsLabel}</h2>
                  <p>{item.clientGoals}</p>
                </>
              )}
              {item.industry && (
                <dl className={styles.facts}>
                  <dt>{copy.industryLabel}</dt>
                  <dd>{item.industry}</dd>
                </dl>
              )}
            </section>
          )}

          {hasChallenge && (
            <section id="challenges" className={styles.section}>
              <p className={styles.eyebrow}>{eyebrow(copy.challengesLabel)}</p>
              <h2 className={styles.sectionTitle}>{copy.challengesLabel}</h2>
              <p className={styles.lead}>{item.challenge}</p>
            </section>
          )}

          {item.actions.length > 0 && (
            <section id="solution" className={styles.section}>
              <p className={styles.eyebrow}>{eyebrow(copy.solutionLabel)}</p>
              <h2 className={styles.sectionTitle}>{copy.solutionLabel}</h2>
              <ol className={styles.plates}>
                {item.actions.map((action, i) => (
                  <li key={action} className={styles.plate}>
                    <span className={styles.plateNumber}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.plateText}>{action}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id="result" className={styles.section}>
            <p className={styles.eyebrow}>{eyebrow(copy.resultLabel)}</p>
            <h2 className={styles.sectionTitle}>{copy.resultLabel}</h2>
            {item.metricValue && (
              <div className={styles.metric}>
                <strong>{item.metricValue}</strong>
                {item.metricLabel && <span>{item.metricLabel}</span>}
              </div>
            )}
            {item.result && <p>{item.result}</p>}
          </section>

          {isFull && item.content != null && <RichText content={item.content} />}

          <section className={styles.cta}>
            <AccentSurface />
            <h2 className={styles.ctaTitle}>{copy.bookProject}</h2>
            <div className={styles.ctaActions}>
              <CaseActionLink href="/contact" className={styles.primary} slug={item.slug} target="book_similar_project">
                {copy.bookProject} →
              </CaseActionLink>
              <CaseActionLink href={blogHref} className={styles.secondary} slug={item.slug} target="related_article">
                {item.relatedArticleTitle || copy.relatedArticle}
              </CaseActionLink>
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}
