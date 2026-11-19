'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Hint } from '@/shared/ds'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { applyTemplate, MODEL_TEMPLATES } from '@/shared/lib/platform/tokenlab/presets'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { copy, templateCopy } from './copy'
import styles from './Calculator.module.scss'

interface Props {
  model: TokenModel
  onChange: (patch: Partial<TokenModel>) => void
}

const SUPPLY_PRESETS = [
  { label: '10M', value: 10_000_000 },
  { label: '100M', value: 100_000_000 },
  { label: '1B', value: 1_000_000_000 },
]

/** Step 1 — token name, ticker, template, total supply (Figma: calculator preview). */
export function BasicsStep({ model, onChange }: Props) {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const isPreset = SUPPLY_PRESETS.some((preset) => preset.value === model.totalSupply)
  const customActive = customOpen || !isPreset

  function selectTemplate(id: string) {
    const template = MODEL_TEMPLATES.find((item) => item.id === id)
    if (!template) return
    const next = applyTemplate(model, template)
    onChange({ allocations: next.allocations, vestings: next.vestings })
    setActiveTemplate(id)
    trackPlatformEvent('template_applied', { template: id })
  }

  function openCustom() {
    setCustomOpen(true)
    setDraft(isPreset ? '' : String(model.totalSupply))
  }

  return (
    <div className={styles.stepBody}>
      <div className={styles.fieldRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{copy.basics.tokenName}</span>
          <input
            type="text"
            value={model.name}
            placeholder={copy.basics.tokenPlaceholder}
            onChange={(event) => onChange({ name: event.target.value })}
            maxLength={64}
            autoComplete="off"
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{copy.basics.ticker}</span>
          <input
            type="text"
            value={model.symbol}
            placeholder={copy.basics.tickerPlaceholder}
            maxLength={8}
            autoComplete="off"
            onChange={(event) => onChange({ symbol: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.group}>
        <span className={styles.fieldLabel}>{copy.basics.template}</span>
        <div className={styles.chipGrid4} role="group" aria-label={copy.basics.template}>
          {MODEL_TEMPLATES.map((template) => {
            const [name, tagline] = templateCopy[template.id] ?? [template.name, template.tagline]
            return (
              <button
                key={template.id}
                type="button"
                title={tagline}
                aria-pressed={activeTemplate === template.id}
                onClick={() => selectTemplate(template.id)}
                className={clsx(styles.chip, activeTemplate === template.id && styles.chipOn)}
              >
                {name}
              </button>
            )
          })}
        </div>
        <p className={styles.note}>{copy.basics.templateHint}</p>
      </div>

      <div className={styles.group}>
        <span className={styles.fieldLabelRow}>
          <Hint text={copy.preview.hints.supply} />
          <span className={styles.fieldLabel}>{copy.basics.totalSupply}</span>
        </span>
        <div className={styles.chipRow} role="group" aria-label={copy.basics.totalSupply}>
          {SUPPLY_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              aria-pressed={!customActive && model.totalSupply === preset.value}
              onClick={() => {
                setCustomOpen(false)
                onChange({ totalSupply: preset.value })
              }}
              className={clsx(styles.chip, styles.chipSupply, !customActive && model.totalSupply === preset.value && styles.chipOn)}
            >
              {preset.label}
            </button>
          ))}
          {customActive ? (
            <input
              autoFocus
              type="text"
              inputMode="numeric"
              value={draft}
              placeholder={copy.basics.enterSupply}
              aria-label={copy.basics.customSupply}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '').slice(0, 15)
                setDraft(digits)
                if (digits) onChange({ totalSupply: Math.max(1, Number(digits)) })
              }}
              className={clsx(styles.chip, styles.chipCustom, styles.chipOn)}
            />
          ) : (
            <button type="button" aria-pressed={false} onClick={openCustom} className={styles.chip}>
              {copy.basics.customSupply}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
