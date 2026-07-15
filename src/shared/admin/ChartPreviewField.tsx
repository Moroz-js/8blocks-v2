'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import {
  ChartView,
  type ChartType,
  type ChartPoint,
  type ChartSeriesDef,
} from '@/shared/render/ChartView'

/**
 * Live recharts preview inside the Payload admin for a `chart` block.
 * Reads sibling fields (type / series / seriesLabel / color / dataPoints).
 */
export const ChartPreviewField: React.FC<{ path?: string }> = ({ path }) => {
  const prefix = path && path.includes('.') ? path.slice(0, path.lastIndexOf('.') + 1) : ''

  const { type, color, seriesLabel, series, points } = useFormFields(([fields]) => {
    const get = (name: string) => fields[`${prefix}${name}`]?.value as unknown

    const seriesRows =
      (fields[`${prefix}series`]?.rows as { id?: string }[] | undefined) ?? []
    const collectedSeries: ChartSeriesDef[] = seriesRows.map((_, i) => ({
      label: (fields[`${prefix}series.${i}.label`]?.value as string) ?? '',
      color: (fields[`${prefix}series.${i}.color`]?.value as string) ?? null,
      yAxis:
        ((fields[`${prefix}series.${i}.yAxis`]?.value as string) ?? 'left') === 'right'
          ? 'right'
          : 'left',
    }))

    const rows =
      (fields[`${prefix}dataPoints`]?.rows as { id?: string }[] | undefined) ?? []

    const collected: ChartPoint[] = rows.map((_, i) => {
      // Prefer the array field value (authoritative); fall back to row paths.
      const rawValues = fields[`${prefix}dataPoints.${i}.values`]?.value as
        | { value?: number | null }[]
        | undefined
      const valueRows =
        (fields[`${prefix}dataPoints.${i}.values`]?.rows as { id?: string }[] | undefined) ??
        []

      let values: { value: number | null }[] | null = null
      if (Array.isArray(rawValues) && rawValues.length > 0) {
        values = rawValues.map((v) => {
          const n = Number(v?.value)
          return { value: Number.isFinite(n) ? n : null }
        })
      } else if (valueRows.length > 0) {
        values = valueRows.map((__, vi) => {
          const n = Number(
            fields[`${prefix}dataPoints.${i}.values.${vi}.value`]?.value ?? NaN,
          )
          return { value: Number.isFinite(n) ? n : null }
        })
      }

      const legacy = Number(fields[`${prefix}dataPoints.${i}.value`]?.value ?? NaN)

      return {
        label: (fields[`${prefix}dataPoints.${i}.label`]?.value as string) ?? '',
        value: Number.isFinite(legacy) ? legacy : null,
        values,
        color: (fields[`${prefix}dataPoints.${i}.color`]?.value as string) ?? null,
      }
    })

    return {
      type: (get('type') as ChartType) ?? 'line',
      color: (get('color') as string) ?? null,
      seriesLabel: (get('seriesLabel') as string) ?? null,
      series: collectedSeries,
      points: collected,
    }
  })

  const isMulti = type === 'line' || type === 'area'
  const valid = points.filter((p) => {
    if (!p.label) return false
    if (isMulti) {
      const hasValues = (p.values ?? []).some((v) =>
        Number.isFinite(typeof v === 'number' ? v : Number(v?.value)),
      )
      return hasValues || Number.isFinite(Number(p.value))
    }
    return Number.isFinite(Number(p.value))
  })

  return (
    <div className="field-type ui" style={{ marginTop: 8 }}>
      <div
        className="field-label"
        style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}
      >
        Превью
      </div>
      <div
        style={{
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 8,
          padding: 12,
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-elevation-800)',
        }}
      >
        {valid.length > 0 ? (
          <ChartView
            type={type}
            dataPoints={valid}
            series={isMulti ? series : undefined}
            color={color}
            seriesLabel={seriesLabel}
            height={280}
          />
        ) : (
          <div style={{ opacity: 0.6, fontSize: 13, padding: '24px 0', textAlign: 'center' }}>
            {isMulti
              ? 'Добавьте серии и точки (подпись + значения), чтобы увидеть график'
              : 'Добавьте точки данных (подпись + значение), чтобы увидеть график'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChartPreviewField
