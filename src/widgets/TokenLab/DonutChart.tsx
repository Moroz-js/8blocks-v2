import type { AllocationBucket } from '@/shared/lib/platform/tokenlab/types'
import { getBucketDef } from '@/shared/lib/platform/tokenlab/buckets'
import styles from './TokenLab.module.scss'

interface Props {
  allocations: AllocationBucket[]
  size?: number
  label?: string
  sublabel?: string
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function arcPath(cx: number, cy: number, radius: number, start: number, end: number) {
  const from = polar(cx, cy, radius, end)
  const to = polar(cx, cy, radius, start)
  const large = end - start <= 180 ? '0' : '1'
  return `M ${from.x.toFixed(3)} ${from.y.toFixed(3)} A ${radius} ${radius} 0 ${large} 0 ${to.x.toFixed(3)} ${to.y.toFixed(3)}`
}

export function DonutChart({
  allocations,
  size = 220,
  label,
  sublabel,
}: Props) {
  const active = allocations.filter((item) => item.enabled && item.percent > 0)
  const total = active.reduce((sum, item) => sum + item.percent, 0)
  const center = size / 2
  const radius = center - 14
  const gap = active.length > 1 ? 2.5 : 0
  const segments = active.map((item, index) => {
    const cursor = active
      .slice(0, index)
      .reduce(
        (sum, previous) =>
          sum + (previous.percent / Math.max(total, 100)) * 360,
        0,
      )
    const sweep = (item.percent / Math.max(total, 100)) * 360
    return {
      key: item.key,
      color: getBucketDef(item.key).color,
      start: cursor + gap / 2,
      end: cursor + Math.max(sweep - gap / 2, 0.1),
    }
  })

  return (
    <div className={styles.donutWrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border-secondary)"
          strokeWidth={10}
        />
        {segments.map((segment) => (
          <path
            key={segment.key}
            d={arcPath(
              center,
              center,
              radius,
              segment.start,
              segment.end,
            )}
            fill="none"
            stroke={segment.color}
            strokeWidth={10}
          />
        ))}
      </svg>
      <div className={styles.donutCenter}>
        {label !== undefined && <strong className={styles.donutLabel}>{label}</strong>}
        {sublabel !== undefined && <span className={styles.label}>{sublabel}</span>}
      </div>
    </div>
  )
}
