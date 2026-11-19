'use client'

import clsx from 'clsx'
import type {
  AllocationBucket,
  VestingConfig,
} from '@/shared/lib/platform/tokenlab/types'
import { shapeCurve, VESTING_SHAPES } from '@/shared/lib/platform/tokenlab/presets'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { BUCKET_COLORS } from './bucketColors'
import { bucketCopy, copy, shapeCopy } from './copy'
import styles from './Calculator.module.scss'

interface Props {
  allocations: AllocationBucket[]
  vestings: VestingConfig[]
  onChange: (next: VestingConfig[]) => void
}

function Sparkline({ config }: { config: Omit<VestingConfig, 'bucketKey'> }) {
  const curve = shapeCurve(config, 48)
  const width = 60
  const height = 20
  const points = curve
    .map((value, index) => `${((index / (curve.length - 1)) * (width - 4) + 2).toFixed(1)},${(height - 3 - value * (height - 6)).toFixed(1)}`)
    .join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className={styles.sparkline}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function shapeMatches(config: VestingConfig, shape: (typeof VESTING_SHAPES)[number]) {
  return (
    config.tgePercent === shape.cfg.tgePercent &&
    config.cliffMonths === shape.cfg.cliffMonths &&
    config.vestingMonths === shape.cfg.vestingMonths
  )
}

const FIELDS = [
  { key: 'tgePercent', label: copy.vesting.tge, unit: '%', min: 0, max: 100 },
  { key: 'cliffMonths', label: copy.vesting.cliff, unit: copy.vesting.month, min: 0, max: 120 },
  { key: 'vestingMonths', label: copy.vesting.duration, unit: copy.vesting.month, min: 0, max: 240 },
] as const

/** Step 3 — a shape gallery and TGE / cliff / vesting fields per active bucket (prototype «3. Vesting»). */
export function VestingStep({ allocations, vestings, onChange }: Props) {
  const active = allocations.filter((item) => item.enabled && item.percent > 0)

  function update(bucketKey: string, field: (typeof FIELDS)[number]['key'], value: number) {
    onChange(vestings.map((item) => (item.bucketKey === bucketKey ? { ...item, [field]: value } : item)))
  }

  function applyShape(bucketKey: string, shapeId: string) {
    const shape = VESTING_SHAPES.find((item) => item.id === shapeId)
    if (!shape) return
    onChange(vestings.map((item) => (item.bucketKey === bucketKey ? { ...item, ...shape.cfg } : item)))
    trackPlatformEvent('vesting_shape_applied', { bucket: bucketKey, shape: shapeId })
  }

  return (
    <div className={styles.vestingList}>
      {active.map((allocation) => {
        const config = vestings.find((item) => item.bucketKey === allocation.key)
        if (!config) return null
        const name = bucketCopy[allocation.key][0]
        return (
          <section key={allocation.key} className={styles.vestingBlock} aria-label={name}>
            <h3 className={styles.vestingHead}>
              <span className={styles.colorMark} style={{ background: BUCKET_COLORS[allocation.key] }} />
              {name}
              <span className={styles.vestingPercent}>{allocation.percent}%</span>
            </h3>
            <div className={styles.shapeGrid}>
              {VESTING_SHAPES.map((shape) => {
                const on = shapeMatches(config, shape)
                return (
                  <button
                    key={shape.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => applyShape(allocation.key, shape.id)}
                    className={clsx(styles.shapeChip, on && styles.chipOn)}
                  >
                    <Sparkline config={shape.cfg} />
                    <span>{shapeCopy[shape.id] ?? shape.name}</span>
                  </button>
                )
              })}
            </div>
            <div className={styles.vestingFields}>
              {FIELDS.map((field) => (
                <label key={field.key} className={styles.field}>
                  <span className={styles.fieldLabel}>{field.label}</span>
                  <span className={styles.numberField}>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      value={config[field.key]}
                      onChange={(event) =>
                        update(allocation.key, field.key, Math.min(field.max, Math.max(field.min, Number(event.target.value))))
                      }
                      className={styles.numberInput}
                      aria-label={`${name}: ${field.label}`}
                    />
                    <span className={styles.unit}>{field.unit}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        )
      })}
      <p className={styles.note}>{copy.vesting.hint}</p>
    </div>
  )
}
