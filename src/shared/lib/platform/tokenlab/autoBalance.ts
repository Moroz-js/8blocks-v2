import type { AllocationBucket } from './types'

/** Rescale enabled non-zero buckets to exactly 100%. */
export function autoBalance(
  allocations: AllocationBucket[],
): AllocationBucket[] {
  const enabled = allocations.filter((item) => item.enabled && item.percent > 0)
  const total = enabled.reduce((sum, item) => sum + item.percent, 0)
  if (total === 0) return allocations
  const scaled = allocations.map((item) =>
    item.enabled && item.percent > 0
      ? { ...item, percent: Math.round((item.percent / total) * 100) }
      : item,
  )
  const nextTotal = scaled
    .filter((item) => item.enabled)
    .reduce((sum, item) => sum + item.percent, 0)
  const drift = 100 - nextTotal
  if (drift === 0) return scaled
  const largest = scaled
    .filter((item) => item.enabled && item.percent > 0)
    .reduce((current, item) =>
      item.percent > current.percent ? item : current,
    )
  return scaled.map((item) =>
    item.key === largest.key
      ? { ...item, percent: item.percent + drift }
      : item,
  )
}
