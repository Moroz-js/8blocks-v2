'use client'

import type {
  AllocationBucket,
  VestingConfig,
} from '@/shared/lib/platform/tokenlab/types'
import { getBucketDef } from '@/shared/lib/platform/tokenlab/buckets'
import {
  shapeCurve,
  VESTING_SHAPES,
} from '@/shared/lib/platform/tokenlab/presets'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { bucketCopy, copy, shapeCopy } from './copy'
import styles from './TokenLab.module.scss'

interface Props {
  allocations: AllocationBucket[]
  vestings: VestingConfig[]
  onChange: (next: VestingConfig[]) => void
}

function Sparkline({
  config,
}: {
  config: Omit<VestingConfig, 'bucketKey'>
}) {
  const curve = shapeCurve(config, 48)
  const width = 44
  const height = 14
  const points = curve
    .map(
      (value, index) =>
        `${((index / (curve.length - 1)) * width).toFixed(1)},${(
          height -
          value * (height - 2) -
          1
        ).toFixed(1)}`,
    )
    .join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
      />
    </svg>
  )
}

function shapeMatches(
  config: VestingConfig,
  shape: (typeof VESTING_SHAPES)[number],
) {
  return (
    config.tgePercent === shape.cfg.tgePercent &&
    config.cliffMonths === shape.cfg.cliffMonths &&
    config.vestingMonths === shape.cfg.vestingMonths
  )
}

export function VestingStep({
  allocations,
  vestings,
  onChange,
}: Props) {
  const active = allocations.filter((item) => item.enabled && item.percent > 0)
  const fields = [
    {
      key: 'tgePercent',
      label: copy.vesting.tge,
      unit: '%',
      min: 0,
      max: 100,
    },
    {
      key: 'cliffMonths',
      label: copy.vesting.cliff,
      unit: copy.vesting.month,
      min: 0,
      max: 120,
    },
    {
      key: 'vestingMonths',
      label: copy.vesting.duration,
      unit: copy.vesting.month,
      min: 0,
      max: 240,
    },
  ] as const

  function update(
    bucketKey: string,
    field: (typeof fields)[number]['key'],
    value: number,
  ) {
    onChange(
      vestings.map((item) =>
        item.bucketKey === bucketKey ? { ...item, [field]: value } : item,
      ),
    )
  }

  function applyShape(bucketKey: string, shapeId: string) {
    const shape = VESTING_SHAPES.find((item) => item.id === shapeId)
    if (!shape) return
    onChange(
      vestings.map((item) =>
        item.bucketKey === bucketKey ? { ...item, ...shape.cfg } : item,
      ),
    )
    trackPlatformEvent('vesting_shape_applied', {
      bucket: bucketKey,
      shape: shapeId,
    })
  }

  return (
    <div className={styles.vestingList}>
      {active.map((allocation) => {
        const definition = getBucketDef(allocation.key)
        const config = vestings.find(
          (item) => item.bucketKey === allocation.key,
        )
        if (!config) return null
        return (
          <div
            key={allocation.key}
            className={`${styles.card} ${styles.vestingCard}`}
          >
            <div className={styles.vestingHeader}>
              <span
                className={styles.colorMark}
                style={{ background: definition.color }}
              />
              <strong className={styles.bucketName}>
                {bucketCopy[allocation.key][0]}
              </strong>
              <span className={styles.muted}>{allocation.percent}%</span>
            </div>
            <div className={styles.shapeList}>
              {VESTING_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => applyShape(allocation.key, shape.id)}
                  title={shapeCopy[shape.id] ?? shape.name}
                  className={`${styles.shapeChip} ${
                    shapeMatches(config, shape) ? styles.selected : ''
                  }`}
                >
                  <Sparkline config={shape.cfg} />
                  {shapeCopy[shape.id] ?? shape.name}
                </button>
              ))}
            </div>
            <div className={styles.fields3}>
              {fields.map((field) => (
                <label key={field.key} className={styles.field}>
                  <span className={styles.label}>{field.label}</span>
                  <div className={styles.numberWrap}>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      value={config[field.key]}
                      onChange={(event) =>
                        update(
                          allocation.key,
                          field.key,
                          Math.min(
                            field.max,
                            Math.max(field.min, Number(event.target.value)),
                          ),
                        )
                      }
                      className={styles.numberInput}
                      aria-label={`${bucketCopy[allocation.key][0]}: ${field.label}`}
                    />
                    <span className={styles.unit}>{field.unit}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )
      })}
      <p className={styles.fine}>{copy.vesting.hint}</p>
    </div>
  )
}
