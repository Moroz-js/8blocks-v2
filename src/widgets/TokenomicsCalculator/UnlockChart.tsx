'use client'

import { useMemo, useRef, useState } from 'react'
import type {
  AllocationBucket,
  VestingConfig,
} from '@/shared/lib/platform/tokenlab/types'
import {
  calcCumulativeCirculating,
  calcTotalMonthlyUnlocks,
} from '@/shared/lib/platform/tokenlab/unlocks'
import { detectSpikes } from '@/shared/lib/platform/tokenlab/spikes'
import { fmtShort } from '@/shared/lib/platform/tokenlab/format'
import { t } from '@/shared/i18n'
import styles from './Calculator.module.scss'

interface Props {
  allocations: AllocationBucket[]
  vestings: VestingConfig[]
  totalSupply: number
  height?: number
  /** SVG font size; the chart is scaled with its container, so narrow panels need a larger value. */
  labelSize?: number
}

const copy = t({
  ru: {
    aria: 'Ежемесячные разблокировки и предложение в обращении',
    month: 'Месяц',
    spike: 'пиковый unlock',
    unlocks: 'Разблокируется',
    supply: 'от эмиссии',
    circulating: 'В обращении',
    monthly: 'ежемесячный unlock',
    spikeMonth: 'пиковый месяц',
    circulation: 'предложение в обращении, % от эмиссии',
  },
  en: {
    aria: 'Monthly unlocks and circulating supply',
    month: 'Month',
    spike: 'unlock spike',
    unlocks: 'Unlocks',
    supply: 'of supply',
    circulating: 'Circulating',
    monthly: 'monthly unlock',
    spikeMonth: 'spike month',
    circulation: 'circulating supply, % of total',
  },
})

const WIDTH = 720
const LEFT = 8
const RIGHT = 44
const TOP = 12
const BOTTOM = 24

/** Monthly unlock bars over the circulating-supply curve. Engine data, DS colours. */
export function UnlockChart({ allocations, vestings, totalSupply, height = 240, labelSize = 8 }: Props) {
  const { monthly, circulating, spikes } = useMemo(() => {
    const nextMonthly = calcTotalMonthlyUnlocks(allocations, vestings, totalSupply)
    const nextCirculating = calcCumulativeCirculating(nextMonthly)
    return {
      monthly: nextMonthly,
      circulating: nextCirculating,
      spikes: detectSpikes(nextMonthly, nextCirculating, totalSupply),
    }
  }, [allocations, vestings, totalSupply])
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const count = monthly.length
  const plotWidth = WIDTH - LEFT - RIGHT
  const plotHeight = height - TOP - BOTTOM
  const spikeMonths = new Set(spikes.map((item) => item.month))
  const maxMonthlyPercent = Math.max(...monthly.map((amount) => (amount / totalSupply) * 100), 5)
  const barWidth = Math.max((plotWidth / count) * 0.55, 1.5)
  const xFor = (month: number) => LEFT + (month / Math.max(count - 1, 1)) * plotWidth
  const yBar = (tokens: number) =>
    TOP + plotHeight - (tokens / totalSupply / maxMonthlyPercent) * 100 * plotHeight
  const yCirculating = (tokens: number) => TOP + plotHeight - (tokens / totalSupply) * plotHeight
  const line = circulating
    .map((amount, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index).toFixed(2)} ${yCirculating(amount).toFixed(2)}`)
    .join(' ')
  const area = `${line} L ${xFor(count - 1).toFixed(2)} ${TOP + plotHeight} L ${LEFT} ${TOP + plotHeight} Z`
  const ticks: number[] = []
  for (let month = 0; month < count; month += count > 40 ? 12 : 6) ticks.push(month)

  function handleMove(event: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const viewportX = ((event.clientX - rect.left) / rect.width) * WIDTH
    const month = Math.round(((viewportX - LEFT) / plotWidth) * (count - 1))
    setHover(month >= 0 && month < count ? month : null)
  }

  const tooltip =
    hover === null
      ? null
      : {
          month: hover,
          unlocks: monthly[hover],
          unlockPercent: (monthly[hover] / totalSupply) * 100,
          circulating: circulating[hover],
          circulatingPercent: (circulating[hover] / totalSupply) * 100,
          spike: spikeMonths.has(hover),
          left: (xFor(hover) / WIDTH) * 100,
        }

  return (
    <div>
      <div ref={wrapRef} className={styles.chartWrap} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${WIDTH} ${height}`} className={styles.chartSvg} role="img" aria-label={copy.aria}>
          <defs>
            <linearGradient id="calc-circ-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E52D9A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#E52D9A" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75, 100].map((percent) => {
            const y = TOP + plotHeight - (percent / 100) * plotHeight
            return (
              <g key={percent}>
                <line x1={LEFT} x2={WIDTH - RIGHT} y1={y} y2={y} stroke="var(--ds-border)" strokeDasharray="2 4" />
                <text x={WIDTH - RIGHT + 8} y={y + 3} fontSize={labelSize} fill="var(--ds-text-muted)">
                  {percent}%
                </text>
              </g>
            )
          })}
          <path d={area} fill="url(#calc-circ-fill)" />
          <path d={line} fill="none" stroke="#E52D9A" strokeWidth={1.6} />
          {monthly.map((tokens, month) => {
            if (tokens <= 0) return null
            const spike = spikeMonths.has(month)
            const active = hover === month
            return (
              <rect
                key={month}
                x={xFor(month) - barWidth / 2}
                y={yBar(tokens)}
                width={barWidth}
                height={TOP + plotHeight - yBar(tokens)}
                fill={spike ? 'var(--ds-danger)' : active ? 'var(--ds-text)' : 'rgba(255,255,255,0.35)'}
              />
            )
          })}
          {hover !== null && (
            <line
              x1={xFor(hover)}
              x2={xFor(hover)}
              y1={TOP}
              y2={TOP + plotHeight}
              stroke="var(--ds-text-muted)"
              strokeDasharray="3 3"
            />
          )}
          {ticks.map((month) => (
            <text key={month} x={xFor(month)} y={height - 8} fontSize={labelSize} textAnchor="middle" fill="var(--ds-text-muted)">
              M{month}
            </text>
          ))}
        </svg>
        {tooltip && (
          <div
            className={styles.chartTooltip}
            style={{ left: `${tooltip.left}%`, transform: tooltip.left > 60 ? 'translateX(-104%)' : 'translateX(6%)' }}
          >
            <strong>
              {copy.month} {tooltip.month}
              {tooltip.spike ? ` · ${copy.spike}` : ''}
            </strong>
            <span>
              {copy.unlocks}: {fmtShort(tooltip.unlocks)} · {tooltip.unlockPercent.toFixed(2)}% {copy.supply}
            </span>
            <span>
              {copy.circulating}: {fmtShort(tooltip.circulating)} · {tooltip.circulatingPercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <i className={styles.legendSwatch} style={{ background: 'rgba(255,255,255,0.35)' }} /> {copy.monthly}
        </span>
        <span className={styles.legendItem}>
          <i className={styles.legendSwatch} style={{ background: 'var(--ds-danger)' }} /> {copy.spikeMonth}
        </span>
        <span className={styles.legendItem}>
          <i className={styles.legendSwatch} style={{ background: '#E52D9A' }} /> {copy.circulation}
        </span>
      </div>
    </div>
  )
}
