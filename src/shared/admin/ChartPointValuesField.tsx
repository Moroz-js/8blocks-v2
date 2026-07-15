'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

type SeriesMeta = { label: string; color?: string | null }
type ValueRow = { id?: string; value?: number | null }

function newRowId() {
  return `v_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Per-point multi-series values editor.
 * Renders one number input per series (labels taken from sibling `series` array).
 */
export const ChartPointValuesField: React.FC<{ path?: string; field?: { name?: string } }> = ({
  path: pathFromProps,
  field,
}) => {
  const path = pathFromProps ?? field?.name ?? 'values'
  const { value, setValue } = useField<ValueRow[] | null>({ path })

  const seriesPrefix = useMemo(() => {
    const marker = '.dataPoints.'
    const idx = path.lastIndexOf(marker)
    if (idx === -1) return ''
    return path.slice(0, idx + 1)
  }, [path])

  const seriesList = useFormFields(([fields]): SeriesMeta[] => {
    const rows =
      (fields[`${seriesPrefix}series`]?.rows as { id?: string }[] | undefined) ?? []
    if (rows.length === 0) return []
    return rows.map((_, i) => ({
      label: String(fields[`${seriesPrefix}series.${i}.label`]?.value ?? `Серия ${i + 1}`),
      color: (fields[`${seriesPrefix}series.${i}.color`]?.value as string) ?? null,
    }))
  })

  const current: ValueRow[] = Array.isArray(value) ? value : []

  useEffect(() => {
    if (seriesList.length === 0) return
    if (current.length === seriesList.length) return
    const next = seriesList.map((_, i) => ({
      id: current[i]?.id ?? newRowId(),
      value:
        current[i]?.value != null && Number.isFinite(Number(current[i].value))
          ? Number(current[i].value)
          : null,
    }))
    setValue(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesList.length])

  const onChangeAt = useCallback(
    (index: number, raw: string) => {
      const next = seriesList.map((_, i) => {
        const prev = current[i]
        const id = prev?.id ?? newRowId()
        if (i !== index) {
          const n = prev?.value
          return {
            id,
            value: n != null && Number.isFinite(Number(n)) ? Number(n) : null,
          }
        }
        if (raw.trim() === '') return { id, value: null }
        const n = Number(raw)
        return { id, value: Number.isFinite(n) ? n : null }
      })
      setValue(next)
    },
    [seriesList, current, setValue],
  )

  if (seriesList.length === 0) {
    return (
      <div className="field-type" style={{ marginBottom: 12 }}>
        <div className="field-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Значения по сериям
        </div>
        <div style={{ opacity: 0.6, fontSize: 13 }}>
          Сначала добавьте серии выше — здесь появятся поля под каждую.
        </div>
      </div>
    )
  }

  return (
    <div className="field-type" style={{ marginBottom: 12 }}>
      <div className="field-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
        Значения по сериям
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {seriesList.map((s, i) => {
          const v = current[i]?.value
          const display = v != null && Number.isFinite(Number(v)) ? String(v) : ''
          return (
            <label
              key={`${s.label}-${i}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '16px 1fr 120px',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: s.color || '#C24E88',
                }}
              />
              <span style={{ fontSize: 13 }}>{s.label}</span>
              <input
                type="number"
                value={display}
                onChange={(e) => onChangeAt(i, e.target.value)}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 4,
                  border: '1px solid var(--theme-elevation-150)',
                  background: 'var(--theme-input-bg)',
                  color: 'var(--theme-elevation-800)',
                }}
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default ChartPointValuesField
