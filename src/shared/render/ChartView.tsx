'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './ChartView.module.scss'

export type ChartType = 'line' | 'area' | 'bar' | 'hbar' | 'donut'
export type ChartYAxis = 'left' | 'right'

export interface ChartSeriesDef {
  label: string
  color?: string | null
  yAxis?: ChartYAxis | null
}

export interface ChartPoint {
  label: string
  value?: number | null
  values?: ({ value?: number | null } | number | null)[] | null
  color?: string | null
}

export interface ChartViewProps {
  type: ChartType
  dataPoints: ChartPoint[]
  series?: ChartSeriesDef[] | null
  seriesLabel?: string | null
  color?: string | null
  caption?: string | null
  height?: number
}

const DEFAULT_COLOR = '#C24E88'
const SERIES_PALETTE = [
  '#C24E88',
  '#0EA5E9',
  '#8E4ABD',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#2563EB',
  '#94A3B8',
]

const DONUT_PALETTE = SERIES_PALETTE

const AXIS_PROPS = {
  stroke: 'currentColor',
  tick: { fill: 'currentColor', fontSize: 12, opacity: 0.6 },
  tickLine: false,
  axisLine: { stroke: 'currentColor', strokeOpacity: 0.12 },
} as const

const TOOLTIP_STYLE = {
  background: '#141118',
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  fontSize: 13,
} as const

function seriesKey(i: number) {
  return `s${i}`
}

function readPointValue(
  entry: { value?: number | null } | number | null | undefined,
): number | null {
  if (entry == null) return null
  if (typeof entry === 'number') return Number.isFinite(entry) ? entry : null
  const n = Number(entry.value)
  return Number.isFinite(n) ? n : null
}

export function resolveSeries(
  series: ChartSeriesDef[] | null | undefined,
  seriesLabel?: string | null,
  color?: string | null,
): ChartSeriesDef[] {
  const cleaned = (series ?? [])
    .filter((s) => s && s.label)
    .map((s) => ({
      label: String(s.label),
      color: s.color ?? null,
      yAxis: s.yAxis === 'right' ? ('right' as const) : ('left' as const),
    }))
  if (cleaned.length > 0) return cleaned
  return [
    {
      label: seriesLabel || 'Значение',
      color: color || DEFAULT_COLOR,
      yAxis: 'left',
    },
  ]
}

export function buildSeriesData(
  dataPoints: ChartPoint[],
  seriesCount: number,
): Record<string, string | number | null>[] {
  return (dataPoints ?? [])
    .filter((p) => p && p.label != null)
    .map((p) => {
      const row: Record<string, string | number | null> = { label: String(p.label) }
      const fromValues = p.values ?? []
      for (let i = 0; i < seriesCount; i++) {
        const fromMulti = readPointValue(fromValues[i])
        if (fromMulti != null) {
          row[seriesKey(i)] = fromMulti
        } else if (i === 0 && p.value != null && Number.isFinite(Number(p.value))) {
          row[seriesKey(i)] = Number(p.value)
        } else {
          row[seriesKey(i)] = null
        }
      }
      if (p.color) row.color = p.color
      return row
    })
    .filter((row) => {
      for (let i = 0; i < seriesCount; i++) {
        if (typeof row[seriesKey(i)] === 'number') return true
      }
      return false
    })
}

/**
 * Recharts 2 renders SVG during SSR when width/height are numeric.
 * Recharts 3 only paints after client useEffect — empty in Puppeteer/PDF.
 */
function useChartWidth(fallback = 960) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(fallback)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const next = Math.floor(el.getBoundingClientRect().width)
      if (next > 0) setWidth((prev) => (prev === next ? prev : next))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, width] as const
}

export function ChartView({
  type,
  dataPoints,
  series,
  seriesLabel,
  color,
  caption,
  height,
}: ChartViewProps) {
  const [bodyRef, width] = useChartWidth()
  const isMultiCapable = type === 'line' || type === 'area'
  const resolvedSeries = isMultiCapable
    ? resolveSeries(series, seriesLabel, color)
    : [{ label: seriesLabel || 'Значение', color: color || DEFAULT_COLOR, yAxis: 'left' as const }]

  const data = isMultiCapable
    ? buildSeriesData(dataPoints, resolvedSeries.length)
    : (dataPoints ?? [])
        .filter((p) => p && p.label != null && Number.isFinite(Number(p.value)))
        .map((p) => ({
          label: String(p.label),
          value: Number(p.value),
          color: p.color ?? null,
        }))

  if (data.length === 0) {
    return null
  }

  const mainColor = color || DEFAULT_COLOR
  const name = seriesLabel || 'Значение'
  const resolvedHeight =
    height ?? (type === 'donut' ? 320 : type === 'hbar' ? 40 + data.length * 44 : 300)
  const showExternalLegend =
    (isMultiCapable && resolvedSeries.length > 1) || type === 'donut'
  const legendItems =
    type === 'donut'
      ? data.map((entry, i) => ({
          label: String(entry.label),
          color: (entry.color as string) || DONUT_PALETTE[i % DONUT_PALETTE.length],
        }))
      : resolvedSeries.map((s, i) => ({
          label: s.label,
          color: s.color || SERIES_PALETTE[i % SERIES_PALETTE.length],
        }))

  return (
    <figure className={styles.chart} data-pdf-chart>
      <div className={styles.card}>
        <div
          ref={bodyRef}
          className={styles.body}
          style={{ width: '100%', height: resolvedHeight, minHeight: resolvedHeight }}
        >
          {renderChart(type, data, {
            mainColor,
            name,
            series: resolvedSeries,
            width,
            height: resolvedHeight,
            externalLegend: showExternalLegend,
          })}
        </div>
        {showExternalLegend && (
          <div className={styles.legend}>
            {legendItems.map((item, i) => (
              <span key={`leg-${i}`} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        )}
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </div>
    </figure>
  )
}

function renderChart(
  type: ChartType,
  data: Record<string, string | number | null>[],
  opts: {
    mainColor: string
    name: string
    series: ChartSeriesDef[]
    width: number
    height: number
    externalLegend?: boolean
  },
) {
  const { mainColor, name, series, width, height, externalLegend } = opts

  switch (type) {
    case 'donut':
      return (
        <PieChart width={width} height={height} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="78%"
            paddingAngle={1.5}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry, i) => (
              <Cell
                key={`c-${i}`}
                fill={(entry.color as string) || DONUT_PALETTE[i % DONUT_PALETTE.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )

    case 'hbar':
      return (
        <BarChart
          width={width}
          height={height}
          data={data}
          layout="vertical"
          margin={{ left: 12, right: 28, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} horizontal={false} />
          <XAxis type="number" {...AXIS_PROPS} />
          <YAxis type="category" dataKey="label" width={120} {...AXIS_PROPS} />
          <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" name={name} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={`hb-${i}`} fill={(entry.color as string) || mainColor} />
            ))}
          </Bar>
        </BarChart>
      )

    case 'bar':
      return (
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} />
          <YAxis width={48} {...AXIS_PROPS} />
          <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" name={name} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={`b-${i}`} fill={(entry.color as string) || mainColor} />
            ))}
          </Bar>
        </BarChart>
      )

    case 'area':
      return renderMultiSeriesChart('area', data, series, width, height, externalLegend)

    case 'line':
    default:
      return renderMultiSeriesChart('line', data, series, width, height, externalLegend)
  }
}

function renderMultiSeriesChart(
  kind: 'line' | 'area',
  data: Record<string, string | number | null>[],
  series: ChartSeriesDef[],
  width: number,
  height: number,
  externalLegend?: boolean,
) {
  const useRight = series.some((s) => s.yAxis === 'right')
  const useLeft = series.some((s) => s.yAxis !== 'right')
  const Chart = kind === 'area' ? AreaChart : LineChart
  const multi = series.length > 1

  return (
    <Chart
      width={width}
      height={height}
      data={data}
      margin={{
        top: 12,
        // Room for right-axis ticks (e.g. 2332) and edge dots — keep inside the card.
        right: useRight ? 56 : 28,
        left: 8,
        bottom: 8,
      }}
    >
      <defs>
        {kind === 'area' &&
          series.map((s, i) => {
            const c = s.color || SERIES_PALETTE[i % SERIES_PALETTE.length]
            const id = `auditAreaFill-${i}`
            return (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.3} />
                <stop offset="100%" stopColor={c} stopOpacity={0} />
              </linearGradient>
            )
          })}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
      <XAxis dataKey="label" padding={{ left: 8, right: 8 }} {...AXIS_PROPS} />
      {useLeft && <YAxis yAxisId="left" orientation="left" width={48} {...AXIS_PROPS} />}
      {useRight && <YAxis yAxisId="right" orientation="right" width={52} {...AXIS_PROPS} />}
      <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
      {/* Legend rendered outside SVG when multi-series — avoids axis overlap. */}
      {!externalLegend && multi && (
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="top"
          iconType="circle"
          wrapperStyle={{ fontSize: 13, lineHeight: '22px', paddingBottom: 8 }}
        />
      )}
      {series.map((s, i) => {
        const c = s.color || SERIES_PALETTE[i % SERIES_PALETTE.length]
        const yAxisId = s.yAxis === 'right' ? 'right' : 'left'
        const key = seriesKey(i)
        if (kind === 'area') {
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={s.label}
              yAxisId={yAxisId}
              stroke={c}
              strokeWidth={2}
              fill={`url(#auditAreaFill-${i})`}
              connectNulls
              isAnimationActive={false}
              dot={multi ? { r: 3, fill: c, strokeWidth: 0 } : false}
              activeDot={{ r: 5 }}
            />
          )
        }
        return (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={s.label}
            yAxisId={yAxisId}
            stroke={c}
            strokeWidth={2}
            connectNulls
            isAnimationActive={false}
            dot={multi ? { r: 3, fill: c, strokeWidth: 0 } : false}
            activeDot={{ r: 5 }}
          />
        )
      })}
    </Chart>
  )
}
