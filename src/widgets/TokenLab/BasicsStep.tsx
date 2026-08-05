'use client'

import { useState } from 'react'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { fmtSpace } from '@/shared/lib/platform/tokenlab/format'
import {
  applyTemplate,
  MODEL_TEMPLATES,
} from '@/shared/lib/platform/tokenlab/presets'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { copy, templateCopy } from './copy'
import styles from './TokenLab.module.scss'

interface Props {
  model: TokenModel
  onChange: (patch: Partial<TokenModel>) => void
}

const SUPPLY_PRESETS = [
  { label: '10M', value: 10_000_000 },
  { label: '100M', value: 100_000_000 },
  { label: '1B', value: 1_000_000_000 },
]

export function BasicsStep({ model, onChange }: Props) {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  function selectTemplate(id: string) {
    const template = MODEL_TEMPLATES.find((item) => item.id === id)
    if (!template) return
    const next = applyTemplate(model, template)
    onChange({ allocations: next.allocations, vestings: next.vestings })
    setActiveTemplate(id)
    trackPlatformEvent('template_applied', { template: id })
  }

  return (
    <div className={styles.stack}>
      <div className={styles.card}>
        <div className={styles.label}>{copy.basics.template}</div>
        <div className={styles.templateGrid}>
          {MODEL_TEMPLATES.map((template) => {
            const localized = templateCopy[template.id] ?? [
              template.name,
              template.tagline,
            ]
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => selectTemplate(template.id)}
                className={`${styles.templateButton} ${
                  activeTemplate === template.id ? styles.selected : ''
                }`}
              >
                <span className={styles.templateTitle}>{localized[0]}</span>
                <span className={styles.templateDescription}>
                  {localized[1]}
                </span>
              </button>
            )
          })}
        </div>
        <p className={styles.fine}>{copy.basics.templateHint}</p>
      </div>

      <div className={styles.grid2}>
        <label className={`${styles.card} ${styles.field}`}>
          <span className={styles.label}>{copy.basics.tokenName}</span>
          <input
            type="text"
            value={model.name}
            placeholder={copy.basics.tokenPlaceholder}
            onChange={(event) => onChange({ name: event.target.value })}
            className={styles.input}
          />
        </label>
        <label className={`${styles.card} ${styles.field}`}>
          <span className={styles.label}>{copy.basics.ticker}</span>
          <input
            type="text"
            value={model.symbol}
            maxLength={8}
            placeholder={copy.basics.tickerPlaceholder}
            onChange={(event) =>
              onChange({
                symbol: event.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, ''),
              })
            }
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>{copy.basics.totalSupply}</div>
        <div className={styles.supplyRow}>
          {SUPPLY_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ totalSupply: preset.value })}
              className={`${styles.chip} ${
                model.totalSupply === preset.value ? styles.selected : ''
              }`}
            >
              {preset.label}
            </button>
          ))}
          <input
            type="number"
            min={1}
            value={model.totalSupply}
            onChange={(event) =>
              onChange({ totalSupply: Math.max(1, Number(event.target.value)) })
            }
            className={`${styles.input} ${styles.supplyInput}`}
            aria-label={copy.basics.customSupply}
          />
        </div>
        <p className={styles.fine}>
          {fmtSpace(model.totalSupply)} {copy.basics.tokens}
        </p>
      </div>
    </div>
  )
}
