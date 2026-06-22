'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { ChartView, type ChartType, type ChartPoint } from '@/shared/render/ChartView'

/**
 * Live recharts preview inside the Payload admin for a `chart` block.
 * Reads sibling fields (type / color / seriesLabel / dataPoints) by deriving
 * the block path prefix from this UI field's own path.
 */
export const ChartPreviewField: React.FC<{ path?: string }> = ({ path }) => {
  const prefix = path && path.includes('.') ? path.slice(0, path.lastIndexOf('.') + 1) : ''

  const { type, color, seriesLabel, points } = useFormFields(([fields]) => {
    const get = (name: string) => fields[`${prefix}${name}`]?.value as unknown

    const rows =
      (fields[`${prefix}dataPoints`]?.rows as { id?: string }[] | undefined) ?? []

    const collected: ChartPoint[] = rows.map((_, i) => ({
      label: (fields[`${prefix}dataPoints.${i}.label`]?.value as string) ?? '',
      value: Number(fields[`${prefix}dataPoints.${i}.value`]?.value ?? NaN),
      color: (fields[`${prefix}dataPoints.${i}.color`]?.value as string) ?? null,
    }))

    return {
      type: (get('type') as ChartType) ?? 'line',
      color: (get('color') as string) ?? null,
      seriesLabel: (get('seriesLabel') as string) ?? null,
      points: collected,
    }
  })

  const valid = points.filter((p) => p.label && Number.isFinite(p.value))

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
            color={color}
            seriesLabel={seriesLabel}
            height={280}
          />
        ) : (
          <div style={{ opacity: 0.6, fontSize: 13, padding: '24px 0', textAlign: 'center' }}>
            Добавьте точки данных (подпись + значение), чтобы увидеть график
          </div>
        )}
      </div>
    </div>
  )
}

export default ChartPreviewField
