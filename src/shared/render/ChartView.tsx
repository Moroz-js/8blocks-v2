'use client'

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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './ChartView.module.scss'

export type ChartType = 'line' | 'area' | 'bar' | 'hbar' | 'donut'

export interface ChartPoint {
  label: string
  value: number
  color?: string | null
}

export interface ChartViewProps {
  type: ChartType
  dataPoints: ChartPoint[]
  seriesLabel?: string | null
  color?: string | null
  caption?: string | null
  height?: number
}

const DEFAULT_COLOR = '#C24E88'

const DONUT_PALETTE = [
  '#C24E88',
  '#8E4ABD',
  '#2563EB',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#94A3B8',
]

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

export function ChartView({
  type,
  dataPoints,
  seriesLabel,
  color,
  caption,
  height,
}: ChartViewProps) {
  const points = (dataPoints ?? []).filter(
    (p) => p && p.label != null && Number.isFinite(Number(p.value)),
  )

  if (points.length === 0) {
    return null
  }

  const mainColor = color || DEFAULT_COLOR
  const name = seriesLabel || 'Значение'
  const data = points.map((p) => ({ ...p, value: Number(p.value) }))
  const resolvedHeight =
    height ?? (type === 'donut' ? 320 : type === 'hbar' ? 40 + data.length * 44 : 300)

  return (
    <figure className={styles.chart}>
      <div className={styles.card}>
        <div className={styles.body} style={{ height: resolvedHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(type, data, { mainColor, name })}
          </ResponsiveContainer>
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </div>
    </figure>
  )
}

function renderChart(
  type: ChartType,
  data: ChartPoint[],
  opts: { mainColor: string; name: string },
) {
  const { mainColor, name } = opts
  const gradientId = `auditAreaFill-${name.replace(/\W/g, '')}`

  switch (type) {
    case 'donut':
      return (
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 13, lineHeight: '22px', paddingTop: 12 }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="44%"
            innerRadius="55%"
            outerRadius="78%"
            paddingAngle={1.5}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell
                key={`c-${i}`}
                fill={entry.color || DONUT_PALETTE[i % DONUT_PALETTE.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )

    case 'hbar':
      return (
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} horizontal={false} />
          <XAxis type="number" {...AXIS_PROPS} />
          <YAxis type="category" dataKey="label" width={120} {...AXIS_PROPS} />
          <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" name={name} radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={`hb-${i}`} fill={entry.color || mainColor} />
            ))}
          </Bar>
        </BarChart>
      )

    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" name={name} radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={`b-${i}`} fill={entry.color || mainColor} />
            ))}
          </Bar>
        </BarChart>
      )

    case 'area':
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mainColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
          <Area
            type="monotone"
            dataKey="value"
            name={name}
            stroke={mainColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      )

    case 'line':
    default:
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip cursor={{ opacity: 0.06 }} contentStyle={TOOLTIP_STYLE} />
          <Line
            type="monotone"
            dataKey="value"
            name={name}
            stroke={mainColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      )
  }
}
