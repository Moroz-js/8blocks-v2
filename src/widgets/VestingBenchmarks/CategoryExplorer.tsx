'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import type { StaticImageData } from 'next/image'
import { Button, Carousel, Tabs } from '@/shared/ds'
import { getDefaultVestingConfigs, STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import type { StandardBucketKey } from '@/shared/lib/platform/tokenlab/types'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { BUBBLE_FRAME, packBubbles } from './bubbles'
import l1 from './assets/cat-l1.svg'
import l2 from './assets/cat-l2.svg'
import defi from './assets/cat-defi.svg'
import gaming from './assets/cat-gaming.svg'
import ai from './assets/cat-ai.svg'
import styles from './VestingBenchmarksPage.module.scss'

const CATEGORY_ICONS: StaticImageData[] = [l1, l2, defi, gaming, ai]

interface VestingSpec {
  tgePercent: number
  cliffMonths: number
  vestingMonths: number
}

export interface BenchmarkProject {
  name: string
  symbol: string
  launchYear: number
  buckets: { label: string; percent: number }[]
  vestingFacts: string[]
  templateMapping: Record<StandardBucketKey, number>
  vestingMapping?: Partial<Record<StandardBucketKey, VestingSpec>>
}

export interface BenchmarkCategory {
  category: string
  categoryInsight: string
  projects: BenchmarkProject[]
}

export interface CategoryExplorerCopy {
  title: string
  description: string
  adviceLabel: string
  insiderShare: string
  categoryDefinition: string
  openCalculator: string
  dataNote: string
  carousel: { prev: string; next: string }
}

function forkUrl(project: BenchmarkProject): string {
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

/** «By category»: filter tabs, a carousel of project cards with allocation bubbles. */
export function CategoryExplorer({
  categories,
  copy,
  advice,
}: {
  categories: BenchmarkCategory[]
  copy: CategoryExplorerCopy
  advice: Record<string, string>
}) {
  const [active, setActive] = useState(0)
  const [insightOpen, setInsightOpen] = useState(false)
  const category = categories[active]

  const insiderShare = useMemo(() => {
    const values = category.projects.map(
      (p) => (p.templateMapping.team ?? 0) + (p.templateMapping.investors ?? 0) + (p.templateMapping.foundation ?? 0),
    )
    return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
  }, [category])

  return (
    <Carousel
      title={copy.title}
      description={copy.description}
      slideWidth={823}
      labels={copy.carousel}
      resetKey={active}
      toolbar={
        <Tabs
          items={categories.map((item, i) => ({ value: String(i), label: item.category, icon: CATEGORY_ICONS[i] }))}
          value={String(active)}
          onChange={(value) => {
            const index = Number(value)
            setActive(index)
            trackPlatformEvent('benchmark_category_selected', { category: categories[index].category })
          }}
          label={copy.title}
        />
      }
      footer={
        <>
          <div className={styles.insight}>
            <button
              type="button"
              className={styles.insightHead}
              aria-expanded={insightOpen}
              onClick={() => setInsightOpen((open) => !open)}
            >
              <span className={styles.insightValue}>{insiderShare}%</span>
              <span className={styles.insightLabel}>
                {copy.insiderShare} · {copy.categoryDefinition}
              </span>
              <svg className={clsx(styles.insightChevron, insightOpen && styles.open)} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div className={clsx(styles.insightPanel, insightOpen && styles.open)}>
              <div>
                <p className={styles.insightText}>{category.categoryInsight}</p>
              </div>
            </div>
          </div>
          <p className={styles.dataNote}>{copy.dataNote}</p>
        </>
      }
    >
      {category.projects.map((project) => (
        <ProjectCard
          key={project.symbol}
          project={project}
          advice={advice[project.name]}
          adviceLabel={copy.adviceLabel}
          action={copy.openCalculator}
          onFork={() => trackPlatformEvent('benchmark_fork_clicked', { project: project.symbol, category: category.category })}
        />
      ))}
    </Carousel>
  )
}

function ProjectCard({
  project,
  advice,
  adviceLabel,
  action,
  onFork,
}: {
  project: BenchmarkProject
  advice?: string
  adviceLabel: string
  action: string
  onFork: () => void
}) {
  const bubbles = useMemo(() => packBubbles(project.buckets), [project.buckets])

  return (
    <article className={styles.project}>
      <div className={styles.projectHead}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectMeta}>
          ${project.symbol} · {project.launchYear}
        </p>
      </div>
      <div className={styles.projectFacts}>
        {project.vestingFacts.map((fact) => (
          <p key={fact}>{fact}</p>
        ))}
      </div>
      {advice && (
        <div className={styles.advice}>
          <p className={styles.adviceLabel}>{adviceLabel}</p>
          <p className={styles.adviceText}>{advice}</p>
        </div>
      )}
      <div
        className={styles.bubbles}
        style={{ width: BUBBLE_FRAME.width, height: BUBBLE_FRAME.height }}
        role="img"
        aria-label={project.buckets.map((b) => `${b.label} ${b.percent}%`).join(', ')}
      >
        {bubbles.map((b) => (
          <div
            key={b.label}
            title={`${b.label} ${b.percent}`}
            className={styles.bubble}
            style={
              {
                left: b.x,
                top: b.y,
                width: b.d,
                height: b.d,
                '--glow': `${b.glow}px`,
              } as CSSProperties
            }
          >
            <span style={{ fontSize: b.fontSize }}>{b.percent}</span>
            {b.showLabel && (
              <span className={styles.bubbleLabel} style={{ fontSize: b.labelSize }}>
                {b.label}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.projectAction}>
        <Button variant="secondary" href={forkUrl(project)} onClick={onFork}>
          {action}
        </Button>
      </div>
    </article>
  )
}
