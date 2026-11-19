'use client'

import { useState } from 'react'
import type { AllocationBucket } from '@/shared/lib/platform/tokenlab/types'
import { BUCKET_COLORS } from './bucketColors'
import { bucketCopy } from './copy'
import styles from './Calculator.module.scss'

interface Props {
  allocations: AllocationBucket[]
  label: string
  /** Shown under the label while a slice is hovered: «{value}% of supply». */
  sliceNote: string
  /** Called with the hovered bucket key, `null` when the pointer leaves. */
  onHover?: (key: AllocationBucket['key'] | null) => void
}

const SIZE = 260
const CENTER = SIZE / 2
const RADIUS = 112
const STROKE = 16
const GAP = 3 // degrees between slices

function polar(angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return { x: CENTER + RADIUS * Math.cos(radians), y: CENTER + RADIUS * Math.sin(radians) }
}

function arc(start: number, end: number) {
  const from = polar(end)
  const to = polar(start)
  return `M ${from.x.toFixed(2)} ${from.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${end - start <= 180 ? 0 : 1} 0 ${to.x.toFixed(2)} ${to.y.toFixed(2)}`
}

/** Allocation ring with the ticker in the middle (Figma: calculator preview). */
export function DonutChart({ allocations, label, sliceNote, onHover }: Props) {
  const [hovered, setHovered] = useState<AllocationBucket['key'] | null>(null)
  const active = allocations.filter((item) => item.enabled && item.percent > 0)
  const total = Math.max(
    active.reduce((sum, item) => sum + item.percent, 0),
    100,
  )
  const single = active.length === 1
  const slices = active.map((item, index) => {
    const before = active.slice(0, index).reduce((sum, previous) => sum + previous.percent, 0)
    const cursor = (before / total) * 360
    const sweep = (item.percent / total) * 360
    const start = cursor + (single ? 0 : GAP / 2)
    const end = cursor + sweep - (single ? 0.01 : GAP / 2)
    return { key: item.key, percent: item.percent, d: arc(start, Math.max(end, start + 0.1)), color: BUCKET_COLORS[item.key] }
  })
  const current = hovered ? slices.find((slice) => slice.key === hovered) : null
  const bucket = hovered ? bucketCopy[hovered][0] : null

  function hover(key: AllocationBucket['key'] | null) {
    setHovered(key)
    onHover?.(key)
  }

  return (
    <div className={styles.donut}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
        {slices.map((slice) => (
          <path
            key={slice.key}
            d={slice.d}
            fill="none"
            stroke={slice.color}
            strokeWidth={hovered === slice.key ? STROKE + 4 : STROKE}
            className={styles.donutSlice}
            style={{ filter: `drop-shadow(0 0 6px ${slice.color}55)` }}
            onMouseEnter={() => hover(slice.key)}
            onMouseLeave={() => hover(null)}
          />
        ))}
      </svg>
      <div className={styles.donutCenter}>
        <span className={current ? styles.donutBucket : styles.donutLabel}>{bucket ?? label}</span>
        {current && <span className={styles.donutNote}>{sliceNote.replace('{value}', String(current.percent))}</span>}
      </div>
    </div>
  )
}
