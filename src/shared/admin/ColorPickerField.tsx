'use client'

import React, { useId } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

/**
 * Custom admin field: a native color swatch + a text input bound to the same value.
 * Stores a plain string (HEX / CSS color), so it stays compatible with the
 * underlying `text` field used for `cardColor` / `textColor`.
 */
export const ColorPickerField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const id = useId()
  const current = value ?? ''
  const swatch = HEX_RE.test(current) ? current : '#141414'
  const label = field?.label
  const description =
    typeof field?.admin?.description === 'string' ? field.admin.description : undefined

  return (
    <div className="field-type text">
      <FieldLabel htmlFor={id} label={label} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          aria-label={typeof label === 'string' ? label : 'color'}
          type="color"
          value={swatch}
          disabled={readOnly}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: 44,
            height: 36,
            padding: 2,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background: 'var(--theme-input-bg)',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            flexShrink: 0,
          }}
        />
        <input
          id={id}
          type="text"
          value={current}
          disabled={readOnly}
          placeholder="#141414"
          onChange={(e) => setValue(e.target.value)}
          style={{
            flex: 1,
            height: 36,
            padding: '0 10px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-elevation-800)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        />
      </div>
      {description ? (
        <div className="field-description" style={{ marginTop: 6 }}>
          {description}
        </div>
      ) : null}
    </div>
  )
}

export default ColorPickerField
