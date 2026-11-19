'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Button, Tabs } from '@/shared/ds'
import type { CaseCardData, CaseCategory } from '@/entities/case-study'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import styles from './CasesPage.module.scss'

const CATEGORIES: CaseCategory[] = ['DeFi', 'GameFi', 'RWA', 'Finance']
type Filter = 'all' | CaseCategory

export interface CasesPageCopy {
  headline: string
  description: string
  ariaLabel: string
  filterAll: string
  taskLabel: string
  actionsLabel: string
  resultLabel: string
  viewFull: string
  emptyLabel: string
  serviceLabels: Record<string, string>
  count: string
}

const Check = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={styles.check}>
    <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.22" />
    <path d="M5.2 9.3l2.4 2.4 5-5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** «Lead: rest» → bold lead and muted rest, as in the featured case lists. */
function splitLead(text: string) {
  const i = text.indexOf(':')
  return i > 0 && i < 90 ? { lead: text.slice(0, i + 1), rest: text.slice(i + 1) } : { lead: '', rest: text }
}

function FeaturedCase({ item, copy, reversed }: { item: CaseCardData; copy: CasesPageCopy; reversed: boolean }) {
  const href = `/cases/${item.slug}`
  const track = () => trackPlatformEvent('case_opened', { slug: item.slug, format: item.format, category: item.category ?? undefined })
  const tags = [item.category ?? item.industry, item.service ? copy.serviceLabels[item.service] : null].filter(Boolean)
  return (
    <article className={clsx(styles.featured, reversed && styles.reversed)}>
      <div className={styles.featuredText}>
        <h2 className={styles.cardTitle}>{item.title}</h2>
        <ul className={styles.checks}>
          {item.actions.map((action) => {
            const { lead, rest } = splitLead(action)
            return (
              <li key={action} className={styles.checkItem}>
                {Check}
                <span>
                  {lead && <span className={styles.lead}>{lead}</span>}
                  <span className={lead ? styles.muted : undefined}>{rest}</span>
                </span>
              </li>
            )
          })}
        </ul>
        <Button href={href} onClick={track} className={styles.featuredAction}>
          {copy.viewFull}
        </Button>
      </div>
      <Link href={href} onClick={track} className={styles.featuredMedia} tabIndex={-1} aria-hidden="true">
        {item.cover && <Image src={item.cover.url} alt="" fill sizes="(max-width: 1024px) 100vw, 600px" className={styles.cover} />}
        <span className={styles.coverShade} />
        <span className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.glassTag}>
              {tag}
            </span>
          ))}
        </span>
        {item.metricValue && (
          <span className={styles.stat}>
            <span className={styles.statValue}>{item.metricValue}</span>
            {item.metricLabel && <span className={styles.statLabel}>{item.metricLabel}</span>}
          </span>
        )}
      </Link>
    </article>
  )
}

function MiniCase({ item, copy }: { item: CaseCardData; copy: CasesPageCopy }) {
  const tag = item.category ?? item.industry
  return (
    <article className={styles.mini}>
      <div className={styles.miniHead}>
        {tag && <span className={styles.tag}>{tag}</span>}
        <h2 className={styles.cardTitle}>{item.title}</h2>
      </div>
      <div className={styles.field}>
        <p className={styles.fieldLabel}>{copy.taskLabel}</p>
        <p className={styles.fieldText}>{item.task}</p>
      </div>
      {item.actions.length > 0 && (
        <div className={styles.field}>
          <p className={styles.fieldLabel}>{copy.actionsLabel}</p>
          <ul className={styles.checks}>
            {item.actions.map((action) => (
              <li key={action} className={styles.checkItem}>
                {Check}
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={clsx(styles.field, styles.result)}>
        <p className={styles.fieldLabel}>{copy.resultLabel}</p>
        <p className={styles.fieldText}>{item.result}</p>
      </div>
    </article>
  )
}

/** Cases listing on design system v2 (project 2 «Cases»): full cases as wide cards, the rest in a grid. */
export function CasesPage({ cases, copy }: { cases: CaseCardData[]; copy: CasesPageCopy }) {
  const [filter, setFilter] = useState<Filter>('all')
  const filtered = useMemo(() => (filter === 'all' ? cases : cases.filter((item) => item.category === filter)), [filter, cases])
  const featured = filtered.filter((item) => item.format === 'full' && item.cover)
  const rest = filtered.filter((item) => !featured.includes(item))

  return (
    <div className={styles.page} aria-label={copy.ariaLabel}>
      <header className={styles.header}>
        <h1 className={styles.title}>{copy.headline}</h1>
        <p className={styles.description}>
          {copy.description} · {copy.count}
        </p>
      </header>

      <Tabs
        className={styles.filters}
        label={copy.filterAll}
        value={filter}
        onChange={(value) => {
          setFilter(value)
          trackPlatformEvent('case_filter_selected', { category: value })
        }}
        items={[{ value: 'all' as Filter, label: copy.filterAll }, ...CATEGORIES.map((category) => ({ value: category as Filter, label: category }))]}
      />

      {filtered.length === 0 ? (
        <p className={styles.empty}>{copy.emptyLabel}</p>
      ) : (
        <div className={styles.list}>
          {featured.map((item, i) => (
            <FeaturedCase key={item.id} item={item} copy={copy} reversed={i % 2 === 1} />
          ))}
          {rest.length > 0 && (
            <div className={styles.grid}>
              {rest.map((item) => (
                <MiniCase key={item.id} item={item} copy={copy} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
