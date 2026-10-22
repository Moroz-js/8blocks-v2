'use client'

import { useMemo } from 'react'
import { t } from '@/shared/i18n'
import styles from './BenchmarkBubbleCard.module.scss'

export interface BubbleBucket {
  label: string
  percent: number
}

interface PackedBubble {
  label: string
  shortLabel: string
  percent: number
  percentText: string
  r: number
  x: number
  y: number
}

const SLOTS = [
  { x: 337, y: 164 },
  { x: 132, y: 88 },
  { x: 540, y: 82 },
  { x: 516, y: 256 },
  { x: 132, y: 215 },
  { x: 208, y: 306 },
]

function shortenLabel(raw: string): string {
  const withoutParens = raw.replace(/\s*\([^)]*\)/g, '').trim()
  const cleaned = withoutParens
    .replace(/\s+incl\..*$/i, '')
    .replace(/,\s*включая.*$/i, '')
    .trim()
  return cleaned || raw
}

function formatPercent(percent: number): string {
  const rounded = Number(percent.toFixed(2))
  return `${rounded}%`
}

function packProjectBubbles(buckets: BubbleBucket[]): PackedBubble[] {
  const sorted = [...buckets]
    .filter((b) => b.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 6)

  if (sorted.length === 0) return []

  const maxPct = Math.max(...sorted.map((b) => b.percent), 1)
  const nodes = sorted.map((b, i) => {
    const slot = SLOTS[i] ?? SLOTS[SLOTS.length - 1]
    let r: number
    if (i === 0) {
      r = Math.round(98 + Math.min(24, Math.sqrt(b.percent / maxPct) * 23))
    } else {
      r = Math.round(Math.max(33, Math.min(68, 22 + Math.sqrt(b.percent) * 8.2)))
    }
    return {
      label: b.label,
      shortLabel: shortenLabel(b.label),
      percent: b.percent,
      percentText: formatPercent(b.percent),
      r,
      x: slot.x,
      y: slot.y,
      ax: slot.x,
      ay: slot.y,
    }
  })

  const W = 674
  const H = 354
  const PAD = 12

  for (let iter = 0; iter < 120; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      const pull = i === 0 ? 0.16 : 0.055
      n.x += (n.ax - n.x) * pull
      n.y += (n.ay - n.y) * pull
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 1
        const minDist = a.r + b.r + PAD
        if (dist < minDist) {
          const overlap = (minDist - dist) / dist
          const mx = dx * overlap * 0.5
          const my = dy * overlap * 0.5
          if (i === 0) {
            b.x += mx * 1.75
            b.y += my * 1.75
            a.x -= mx * 0.25
            a.y -= my * 0.25
          } else {
            a.x -= mx
            a.y -= my
            b.x += mx
            b.y += my
          }
        }
      }
    }

    for (const n of nodes) {
      n.x = Math.max(16 + n.r, Math.min(W - 16 - n.r, n.x))
      n.y = Math.max(14 + n.r, Math.min(H - 8 - n.r, n.y))
    }
  }

  return nodes
}

const BINARY_ROWS = [
  '0 1 1 0 1 0 0 1 1 0 1 1 0 0 1 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0',
  '1 0 0 1 0 1 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1',
  '0 1 0 1 1 0 0 1 0 1 1 0 0 1 1 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0',
  '1 1 0 0 1 0 1 0 1 0 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0 0 1 0 1 0 0 1 1 0 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1',
  '0 0 1 1 0 1 0 1 0 1 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0',
  '1 0 1 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 0 1 0 1 0 1 0 0 1 0 1 0 0 1 1 0 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1',
]

export function BenchmarkBubbleCard({
  buckets,
  advice,
}: {
  buckets: BubbleBucket[]
  advice: string
}) {
  const packed = useMemo(() => packProjectBubbles(buckets), [buckets])

  return (
    <div className={styles.card}>
      <div className={styles.binaryBg} aria-hidden="true">
        {BINARY_ROWS.map((row, idx) => (
          <div key={idx} className={styles.binaryRow}>
            {row}
          </div>
        ))}
      </div>

      <div className={styles.bubblesStage}>
        {packed.map((bubble, index) => {
          const diameter = bubble.r * 2
          const isPrimary = index === 0
          const isSmall = bubble.r < 44
          const leftPct = ((bubble.x - bubble.r) / 674) * 100
          const topPct = ((bubble.y - bubble.r) / 356) * 100
          const widthPct = (diameter / 674) * 100
          const heightPct = (diameter / 356) * 100

          return (
            <div
              key={`${bubble.label}-${index}`}
              className={`${styles.bubble} ${isPrimary ? styles.bubblePrimary : ''} ${
                isSmall ? styles.bubbleSmall : ''
              }`}
              style={{
                left: `${leftPct.toFixed(2)}%`,
                top: `${topPct.toFixed(2)}%`,
                width: `${widthPct.toFixed(2)}%`,
                height: `${heightPct.toFixed(2)}%`,
              }}
              title={`${bubble.label}: ${bubble.percentText}`}
            >
              <span className={styles.percent}>{bubble.percentText}</span>
              <span className={styles.label}>{bubble.shortLabel}</span>
            </div>
          )
        })}
      </div>

      <div className={styles.adviceBanner}>
        <div className={styles.adviceBinary} aria-hidden="true">
          {BINARY_ROWS.slice(0, 4).map((row, idx) => (
            <div key={idx} className={styles.binaryRow}>
              {row}
            </div>
          ))}
        </div>
        <div className={styles.adviceHeader}>
          <span className={styles.adviceDot} aria-hidden="true" />
          <span className={styles.adviceTitle}>
            {t({ en: '8Blocks advice', ru: 'Совет 8Blocks' })}
          </span>
        </div>
        <p className={styles.adviceBody}>{advice}</p>
      </div>
    </div>
  )
}
