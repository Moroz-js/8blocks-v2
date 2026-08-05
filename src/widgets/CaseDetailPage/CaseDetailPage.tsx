import Image from 'next/image'
import Link from 'next/link'
import type { CaseDetailData } from '@/entities/case-study'
import { casesUiContent } from '@/shared/content/casesPage'
import { RichText } from '@/shared/render'
import { CaseActionLink, CaseViewTracker } from './CaseAnalytics'
import styles from './CaseDetailPage.module.scss'

interface Props {
  item: CaseDetailData
}

export function CaseDetailPage({ item }: Props) {
  const isFull = item.format === 'full'
  const blogHref = item.relatedArticleSlug
    ? `/blog/${item.relatedArticleSlug}`
    : '/blog'

  return (
    <article className={styles.root}>
      <CaseViewTracker
        slug={item.slug}
        format={item.format}
        service={item.service}
      />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/cases" className={styles.backLink}>
            ← {casesUiContent.backToCases}
          </Link>

          <div className={styles.badges}>
            {isFull && item.service ? (
              <span className={styles.badge}>
                {casesUiContent.serviceLabels[item.service]}
              </span>
            ) : !isFull ? (
              <span className={styles.badge}>{casesUiContent.snapshotLabel}</span>
            ) : null}
            {item.industry && <span className={styles.badgeMuted}>{item.industry}</span>}
          </div>

          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.lead}>{item.task}</p>

          {item.cover && (
            <div className={styles.cover}>
              <Image
                src={item.cover.url}
                alt={item.cover.alt}
                width={1200}
                height={675}
                className={styles.coverImage}
                priority
              />
            </div>
          )}
        </div>
      </header>

      <div className={styles.body}>
        {isFull && (item.industry || item.clientGoals) && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>{casesUiContent.overviewLabel}</span>
            <div className={styles.overviewGrid}>
              {item.industry && (
                <div className={styles.overviewItem}>
                  <span>{casesUiContent.industryLabel}</span>
                  <strong>{item.industry}</strong>
                </div>
              )}
              {item.clientGoals && (
                <div className={styles.overviewItem}>
                  <span>{casesUiContent.goalsLabel}</span>
                  <p>{item.clientGoals}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {isFull && item.challenge && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>{casesUiContent.challengesLabel}</span>
            <p className={styles.sectionText}>{item.challenge}</p>
          </section>
        )}

        {item.actions.length > 0 && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>{casesUiContent.solutionLabel}</span>
            <ol className={styles.actions}>
              {item.actions.map((action, index) => (
                <li key={`${item.slug}-action-${index}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{action}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className={`${styles.section} ${styles.resultSection}`}>
          <span className={styles.sectionLabel}>{casesUiContent.resultLabel}</span>
          {item.metricValue && (
            <div className={styles.metric}>
              <strong>{item.metricValue}</strong>
              {item.metricLabel && <span>{item.metricLabel}</span>}
            </div>
          )}
          {item.result && <p className={styles.resultText}>{item.result}</p>}
        </section>

        {isFull && item.content != null && (
          <section className={styles.richContent}>
            <RichText content={item.content} />
          </section>
        )}
      </div>

      <section className={styles.cta}>
        <div>
          <span className={styles.sectionLabel}>{casesUiContent.resultLabel}</span>
          <h2>{casesUiContent.bookProject}</h2>
        </div>
        <div className={styles.ctaActions}>
          <CaseActionLink
            href="/contact"
            className={styles.primaryCta}
            slug={item.slug}
            target="book_similar_project"
          >
            {casesUiContent.bookProject} →
          </CaseActionLink>
          <CaseActionLink
            href={blogHref}
            className={styles.secondaryCta}
            slug={item.slug}
            target="related_article"
          >
            {item.relatedArticleTitle || casesUiContent.relatedArticle}
          </CaseActionLink>
        </div>
      </section>
    </article>
  )
}
