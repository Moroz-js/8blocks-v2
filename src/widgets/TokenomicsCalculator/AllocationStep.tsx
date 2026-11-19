'use client'

import clsx from 'clsx'
import type { AllocationBucket } from '@/shared/lib/platform/tokenlab/types'
import { STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import { BUCKET_COLORS } from './bucketColors'
import { bucketCopy, copy } from './copy'
import styles from './Calculator.module.scss'

interface Props {
  allocations: AllocationBucket[]
  onChange: (next: AllocationBucket[]) => void
  /** Bucket under the pointer on the donut, highlighted here. */
  hovered: AllocationBucket['key'] | null
}

/** Step 2 — one row per bucket: toggle, slider, percent (prototype «2. Allocation»). */
export function AllocationStep({ allocations, onChange, hovered }: Props) {
  function update(key: string, patch: Partial<AllocationBucket>) {
    onChange(allocations.map((item) => (item.key === key ? { ...item, ...patch } : item)))
  }

  return (
    <ul className={styles.allocationList}>
      {STANDARD_BUCKETS.map((definition) => {
        const allocation = allocations.find((item) => item.key === definition.key)
        if (!allocation) return null
        const [name, category] = bucketCopy[definition.key]
        const color = BUCKET_COLORS[definition.key]
        return (
          <li
            key={definition.key}
            className={clsx(styles.allocationRow, !allocation.enabled && styles.rowOff, hovered === definition.key && styles.rowHover)}
            onClick={() => {
              if (!allocation.enabled) update(definition.key, { enabled: true })
            }}
          >
            <div className={styles.bucketHead}>
              <button
                type="button"
                role="checkbox"
                aria-checked={allocation.enabled}
                aria-label={`${copy.allocation.toggle}: ${name}`}
                className={styles.toggle}
                style={allocation.enabled ? { background: color, borderColor: color } : undefined}
                onClick={(event) => {
                  event.stopPropagation()
                  update(definition.key, { enabled: !allocation.enabled })
                }}
              >
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
                  <path d="M1 4.2 3.9 7 10 1" stroke={definition.key === 'team' ? '#000' : '#fff'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className={styles.bucketText}>
                <span className={styles.bucketName}>{name}</span>
                <span className={styles.bucketCategory}>{category}</span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={allocation.percent}
              disabled={!allocation.enabled}
              onChange={(event) => update(definition.key, { percent: Number(event.target.value) })}
              className={styles.range}
              aria-label={`${name}, %`}
            />
            <div className={styles.valueBox}>
              <input
                type="number"
                min={0}
                max={100}
                value={allocation.percent}
                disabled={!allocation.enabled}
                onChange={(event) => update(definition.key, { percent: Math.min(100, Math.max(0, Number(event.target.value))) })}
                className={styles.valueInput}
                aria-label={`${name}, %`}
              />
              <span className={styles.unit}>%</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
