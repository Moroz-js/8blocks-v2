'use client'

import { useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { Button } from '@/shared/ds'
import styles from './VestingBenchmarksPage.module.scss'

interface Source {
  title: string
  url: string
}

export interface AllocationBucket {
  key: string
  label: string
  typicalRange: string
  median: string
  note: string
  source?: Source
  source2?: Source
}

/** «15-25% (context)» → range, low / high bounds and the context line. */
function parseRange(bucket: AllocationBucket, medianLabel: string) {
  const match = bucket.typicalRange.match(/^(\d+)\s*-\s*(\d+)%/)
  const range = match ? `${match[1]}-${match[2]}%` : bucket.typicalRange
  const rest = match ? bucket.typicalRange.slice(match[0].length).replace(/[()]/g, '').trim() : ''
  return {
    range,
    low: match ? Number(match[1]) : 0,
    high: match ? Number(match[2]) : 0,
    context: rest || `${medianLabel} · ${bucket.median}`,
  }
}

/** «Allocation benchmarks by bucket»: bucket list, range cone, context and sources. */
export function BucketExplorer({
  buckets,
  medianLabel,
  action,
}: {
  buckets: AllocationBucket[]
  medianLabel: string
  action: { label: string; href: string }
}) {
  const [active, setActive] = useState(0)
  const bucket = buckets[active]
  const { range, low, high, context } = parseRange(bucket, medianLabel)
  const sources = [bucket.source, bucket.source2].filter((s): s is Source => Boolean(s?.url))

  return (
    <div className={styles.buckets}>
      <div className={styles.bucketList} role="tablist" aria-orientation="vertical">
        {buckets.map((item, i) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={clsx(styles.bucketTab, i === active && styles.bucketTabActive)}
            onClick={() => setActive(i)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.cone}>
        <div className={styles.coneCircle} style={{ '--low': `${low}%`, '--high': `${high}%` } as CSSProperties}>
          <div className={styles.coneText}>
            <p className={styles.coneRange}>{range}</p>
            <p className={styles.coneNote}>{context}</p>
          </div>
        </div>
        <Button variant="secondary" href={action.href}>
          {action.label}
        </Button>
      </div>

      <div className={styles.bucketInfo} role="tabpanel">
        <div className={styles.bucketText}>
          <h3 className={styles.bucketName}>{bucket.label}</h3>
          <p className={styles.bucketNote}>{bucket.note}</p>
        </div>
        <div className={styles.sources}>
          {sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="nofollow noopener noreferrer" className={styles.source}>
              {source.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
