'use client'

import type { AllocationBucket } from '@/shared/lib/platform/tokenlab/types'
import { STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import {
  calcTotalPercent,
  isFullyAllocated,
} from '@/shared/lib/platform/tokenlab/validate'
import { autoBalance } from '@/shared/lib/platform/tokenlab/autoBalance'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { Button } from '@/shared/ui/Button'
import { bucketCopy, copy } from './copy'
import styles from './TokenLab.module.scss'

interface Props {
  allocations: AllocationBucket[]
  onChange: (next: AllocationBucket[]) => void
}

export function AllocationsStep({ allocations, onChange }: Props) {
  const total = calcTotalPercent(allocations)
  const complete = isFullyAllocated(allocations)

  function update(key: string, patch: Partial<AllocationBucket>) {
    onChange(
      allocations.map((item) =>
        item.key === key ? { ...item, ...patch } : item,
      ),
    )
  }

  return (
    <div>
      <div className={styles.allocationList}>
        {STANDARD_BUCKETS.map((definition) => {
          const allocation = allocations.find(
            (item) => item.key === definition.key,
          )
          if (!allocation) return null
          const localized = bucketCopy[definition.key]
          return (
            <div
              key={definition.key}
              onClick={() => {
                if (!allocation.enabled) {
                  update(definition.key, { enabled: true })
                }
              }}
              className={`${styles.allocationRow} ${
                allocation.enabled ? '' : styles.rowDisabled
              }`}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  update(definition.key, { enabled: !allocation.enabled })
                }}
                aria-label={`${copy.allocation.toggle}: ${localized[0]}`}
                className={styles.toggle}
                style={
                  allocation.enabled
                    ? {
                        background: definition.color,
                        borderColor: definition.color,
                      }
                    : undefined
                }
              />
              <div>
                <div className={styles.bucketName}>{localized[0]}</div>
                <div className={styles.category}>{localized[1]}</div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={allocation.percent}
                disabled={!allocation.enabled}
                onChange={(event) =>
                  update(definition.key, {
                    percent: Number(event.target.value),
                  })
                }
                className={styles.range}
                aria-label={`${localized[0]}, %`}
              />
              <div className={styles.numberWrap}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={allocation.percent}
                  disabled={!allocation.enabled}
                  onChange={(event) =>
                    update(definition.key, {
                      percent: Math.min(
                        100,
                        Math.max(0, Number(event.target.value)),
                      ),
                    })
                  }
                  className={styles.numberInput}
                  aria-label={`${localized[0]}, %`}
                />
                <span className={styles.unit}>%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={`${styles.card} ${styles.totalCard}`}>
        <div className={styles.totalHeader}>
          <span className={styles.label}>{copy.allocation.total}</span>
          <span
            className={`${styles.totalValue} ${
              complete ? styles.good : total > 100 ? styles.bad : styles.medium
            }`}
          >
            {total.toFixed(0)}%{complete ? ' ✓' : ''}
          </span>
        </div>
        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.min(total, 100)}%`,
              background:
                total > 100
                  ? 'var(--error-fg)'
                  : complete
                    ? 'var(--success-fg)'
                    : undefined,
            }}
          />
        </div>
        {!complete && (
          <div className={styles.totalMessage}>
            <p className={styles.fine}>
              {(total > 100
                ? copy.allocation.remove
                : copy.allocation.remaining
              ).replace(
                '{value}',
                Math.abs(total > 100 ? total - 100 : 100 - total).toFixed(0),
              )}
            </p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                onChange(autoBalance(allocations))
                trackPlatformEvent('auto_balance_used')
              }}
            >
              {copy.allocation.auto}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
