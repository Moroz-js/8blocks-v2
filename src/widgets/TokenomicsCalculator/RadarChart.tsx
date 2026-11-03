import type { CSSProperties } from 'react'
import styles from './Results.module.scss'

export interface RadarAxis {
  id: string
  label: string
  /** 0–100 */
  score: number
}

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 120
const RINGS = [0.25, 0.5, 0.75, 1]

function point(index: number, count: number, ratio: number) {
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2
  return { x: CENTER + RADIUS * ratio * Math.cos(angle), y: CENTER + RADIUS * ratio * Math.sin(angle) }
}

/** Radar of the five structure dimensions (prototype «Tokenomics Calculator» result card). */
export function RadarChart({ axes, color, label }: { axes: RadarAxis[]; color: string; label: string }) {
  const count = axes.length
  const shape = axes.map((axis, i) => point(i, count, Math.max(axis.score, 4) / 100))
  const polygon = shape.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <div className={styles.radar} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={axes.map((_, i) => `${point(i, count, ring).x.toFixed(1)},${point(i, count, ring).y.toFixed(1)}`).join(' ')}
            fill="none"
            stroke="var(--ds-border)"
          />
        ))}
        {axes.map((axis, i) => (
          <line key={axis.id} x1={CENTER} y1={CENTER} x2={point(i, count, 1).x} y2={point(i, count, 1).y} stroke="var(--ds-border)" />
        ))}
        <polygon points={polygon} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {shape.map((p, i) => (
          <circle key={axes[i].id} cx={p.x} cy={p.y} r={4} fill={color} />
        ))}
      </svg>
      {axes.map((axis, i) => {
        const p = point(i, count, 1.22)
        const style: CSSProperties = { left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }
        return (
          <span key={axis.id} className={styles.radarLabel} style={style}>
            <span>{axis.label}</span>
            <strong>{axis.score}</strong>
          </span>
        )
      })}
    </div>
  )
}
