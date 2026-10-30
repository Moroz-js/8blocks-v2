'use client'

import { useMemo, useState } from 'react'
import { lang } from '@/shared/i18n'
import enData from '@/shared/lib/platform/benchmarks/projects.json'
import ruData from '@/shared/lib/platform/benchmarks/projects.ru.json'
import {
  getDefaultVestingConfigs,
  STANDARD_BUCKETS,
} from '@/shared/lib/platform/tokenlab/buckets'
import type { StandardBucketKey } from '@/shared/lib/platform/tokenlab/types'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { platformPagesContent } from '@/shared/content/platformPages'
import styles from './Platform.module.scss'

interface Source {
  title: string
  url: string
}

interface VestingSpec {
  tgePercent: number
  cliffMonths: number
  vestingMonths: number
}

interface Project {
  name: string
  symbol: string
  launchYear: number
  buckets: { label: string; percent: number }[]
  vestingFacts: string[]
  tgeFloat?: string
  sources: Source[]
  templateMapping: Record<StandardBucketKey, number>
  vestingMapping?: Partial<Record<StandardBucketKey, VestingSpec>>
  audited?: boolean
  auditUrl?: string
}

interface Category {
  category: string
  categoryInsight: string
  projects: Project[]
}

const categories = (
  (lang === 'ru' ? ruData : enData) as { categories: Category[] }
).categories

const palette = [
  '#5c0a2a',
  '#7a1240',
  '#e84690',
  '#a31d58',
  '#3d0820',
  '#f06098',
  '#c43070',
  '#ff6eb4',
]

const jpgSymbols = new Set([
  'GRASS',
  'SAND',
  'STON',
  'TIA',
  'WLD',
  'HYPE',
  'ARB',
])

function logoPath(symbol: string): string {
  return `/logos/tokens/${symbol}.${jpgSymbols.has(symbol) ? 'jpg' : 'png'}`
}

function forkUrl(project: Project): string {
  const vestings = getDefaultVestingConfigs().map((vesting) => {
    const real = project.vestingMapping?.[vesting.bucketKey]
    return real ? { bucketKey: vesting.bucketKey, ...real } : vesting
  })
  const allocations = STANDARD_BUCKETS.map((bucket) => {
    const percent = project.templateMapping[bucket.key] ?? 0
    return { key: bucket.key, percent, enabled: percent > 0 }
  })
  return `/product/calculator?m=${encodeModel({
    name: project.name,
    symbol: project.symbol,
    totalSupply: 1_000_000_000,
    fdv: null,
    allocations,
    vestings,
  })}&fork=1`
}

function Allocation({ project }: { project: Project }) {
  return (
    <>
      <div className={styles.allocation}>
        {project.buckets.map((bucket, index) => (
          <span
            key={bucket.label}
            title={`${bucket.label}: ${bucket.percent}%`}
            style={{
              width: `${bucket.percent}%`,
              background: palette[index % palette.length],
            }}
          />
        ))}
      </div>
      <div className={styles.filters}>
        {project.buckets.map((bucket, index) => (
          <span key={bucket.label} className={styles.fine}>
            <span style={{ color: palette[index % palette.length] }}>■</span>{' '}
            {bucket.label} <b>{bucket.percent}%</b>
          </span>
        ))}
      </div>
    </>
  )
}

export function BenchmarkExplorer() {
  const [active, setActive] = useState(0)
  const category = categories[active]
  const insiderShare = useMemo(() => {
    const values = category.projects.map(
      (project) =>
        (project.templateMapping.team ?? 0) +
        (project.templateMapping.investors ?? 0) +
        (project.templateMapping.foundation ?? 0),
    )
    return Math.round(
      values.reduce((sum, value) => sum + value, 0) / values.length,
    )
  }, [category])
  const copy = platformPagesContent.benchmarks

  return (
    <>
      <div className={styles.filters}>
        {categories.map((item, index) => (
          <button
            key={item.category}
            type="button"
            className={`${styles.filter} ${
              index === active ? styles.filterActive : ''
            }`}
            onClick={() => {
              setActive(index)
              trackPlatformEvent('benchmark_category_selected', {
                category: item.category,
              })
            }}
          >
            {item.category}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <details>
          <summary className={styles.detailsSummary}>{copy.categoryDefinition}</summary>
          <p className={styles.description}>{category.categoryInsight}</p>
        </details>
        <p className={styles.fine}>
          {copy.insiderShare}: <b>{insiderShare}%</b>
        </p>
      </div>

      <div className={styles.projectGrid}>
        {category.projects.map((project) => (
          <article
            key={project.symbol}
            className={`${styles.card} ${styles.projectCard}`}
          >
            <div className={styles.spread}>
              <div className={styles.row}>
                {/* Curated local assets; Image adds little for 42px logos here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPath(project.symbol)}
                  className={styles.logo}
                  alt=""
                  aria-hidden="true"
                />
                <h3>
                  {project.name}{' '}
                  <span className={styles.mono}>${project.symbol}</span>
                </h3>
              </div>
              <span className={styles.mono}>{project.launchYear}</span>
            </div>
            {project.audited && (
              <span className={styles.badge}>{copy.audited}</span>
            )}
            <Allocation project={project} />
            <ul className={styles.list}>
              {project.vestingFacts.map((fact) => (
                <li key={fact} className={styles.listItem}>
                  {fact}
                </li>
              ))}
              {project.tgeFloat && (
                <li className={styles.listItem}>
                  TGE float: {project.tgeFloat}
                </li>
              )}
            </ul>
            <div className={`${styles.spread} ${styles.projectActions}`}>
              {project.audited && project.auditUrl ? (
                <a className={styles.source} href={project.auditUrl}>
                  {copy.readAudit} ↗
                </a>
              ) : (
                <span />
              )}
              <a
                href={forkUrl(project)}
                className={styles.secondary}
                onClick={() =>
                  trackPlatformEvent('benchmark_fork_clicked', {
                    project: project.symbol,
                    category: category.category,
                  })
                }
              >
                {copy.openCalculator} →
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.fine}>{copy.dataNote}</p>
    </>
  )
}
