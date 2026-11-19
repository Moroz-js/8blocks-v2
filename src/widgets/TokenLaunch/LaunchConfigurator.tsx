'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import chevronDown from '@/shared/ds/icons/chevron-down.svg'
import { LaunchLeadForm } from './LaunchLeadForm'
import type { LaunchCalculatorCopy, LaunchFormCopy, LaunchModuleView } from './types'
import styles from './TokenLaunchPage.module.scss'

function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

interface LaunchConfiguratorProps {
  modules: LaunchModuleView[]
  copy: LaunchCalculatorCopy
  form: LaunchFormCopy
}

/** Module picker with a running estimate, then the request form (project 2 «Build your track»). */
export function LaunchConfigurator({ modules, copy, form }: LaunchConfiguratorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openIds, setOpenIds] = useState<string[]>([])
  const [packageChoice, setPackageChoice] = useState<Record<string, string>>(() =>
    Object.fromEntries(modules.filter((m) => m.packages.length > 0).map((m) => [m.id, m.packages[0].id])),
  )

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  function pickPackage(moduleId: string, packageId: string) {
    setPackageChoice((prev) => ({ ...prev, [moduleId]: packageId }))
    setSelectedIds((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]))
  }

  const totals = useMemo(() => {
    const selected = modules.filter((m) => selectedIds.includes(m.id))
    const included = selected.filter((m) => m.includeInTotal)
    const packageOf = (m: LaunchModuleView) => m.packages.find((p) => p.id === packageChoice[m.id])
    const priceOf = (m: LaunchModuleView) => packageOf(m)?.price ?? m.price
    const weeksOf = (m: LaunchModuleView) => packageOf(m)?.durationWeeks ?? m.durationWeeks

    const cost = included.reduce((sum, m) => sum + priceOf(m), 0)
    const isFrom = included.some((m) => m.priceFrom)
    // Parallel modules (Workshop, audit) run at the same time: the group adds its longest one.
    const sequentialWeeks = included.filter((m) => !m.parallel).reduce((s, m) => s + weeksOf(m), 0)
    const parallelWeeks = Math.max(0, ...included.filter((m) => m.parallel).map(weeksOf))
    const weeks = sequentialWeeks + parallelWeeks
    const listingSelected = selected.some((m) => !m.includeInTotal)

    return { selected, included, cost, isFrom, weeks, listingSelected, priceOf }
  }, [modules, selectedIds, packageChoice])

  const hasSelection = totals.included.length > 0 || totals.listingSelected
  const costText = `${totals.isFrom ? `${copy.fromPrefix} ` : ''}${formatUsd(totals.cost)}`
  const weeksText =
    totals.included.length === 1
      ? totals.included[0].durationLabel
      : copy.weeksTemplate.replace('%s', String(Math.max(1, Math.ceil(totals.weeks))))

  function modulePrice(m: LaunchModuleView): string {
    if (!m.includeInTotal) return copy.customPriceLabel
    if (m.packages.length > 0) {
      const prices = m.packages.map((p) => p.price)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      return min === max ? formatUsd(min) : `${formatUsd(min)} – ${formatUsd(max)}`
    }
    return m.priceFrom ? `${copy.fromPrefix} ${formatUsd(m.price)}` : formatUsd(m.price)
  }

  function buildExtraMessage(): string {
    if (totals.selected.length === 0) return ''
    const moduleLines = totals.selected.map((m) => {
      const pkg = m.packages.find((p) => p.id === packageChoice[m.id])
      const label = pkg ? `${m.name} (${pkg.label})` : m.name
      const price = m.includeInTotal ? formatUsd(totals.priceOf(m)) : `${copy.fromPrefix} ${formatUsd(m.price)}`
      return `— ${label}: ${price}`
    })
    const listingText = totals.listingSelected ? ` (${copy.listingAsideNote})` : ''
    return [
      `${form.modulesLine}:`,
      ...moduleLines,
      `${form.estimateLine}: ${costText} · ${weeksText}${listingText}`,
    ].join('\n')
  }

  return (
    <div className={styles.configurator}>
      <ul className={styles.modules}>
        {modules.map((m) => {
          const checked = selectedIds.includes(m.id)
          const open = openIds.includes(m.id)
          const panelId = `module-${m.id}-details`
          return (
            <li key={m.id} className={styles.module}>
              <input
                id={`module-${m.id}`}
                type="checkbox"
                className={styles.checkboxInput}
                checked={checked}
                onChange={() => setSelectedIds((prev) => toggle(prev, m.id))}
              />
              <label htmlFor={`module-${m.id}`} className={styles.checkbox} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7.3l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </label>
              <div className={styles.moduleBody}>
                <label htmlFor={`module-${m.id}`} className={styles.moduleHead}>
                  <span className={styles.moduleName}>
                    <span>{m.name}</span>
                    <span className={styles.modulePrice}>{modulePrice(m)}</span>
                  </span>
                  <span className={styles.moduleTime}>{m.durationLabel}</span>
                </label>
                <button
                  type="button"
                  className={styles.moduleMore}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIds((prev) => toggle(prev, m.id))}
                >
                  {copy.detailsLabel}
                  <Image src={chevronDown} alt="" width={16} height={16} className={clsx(styles.chevron, open && styles.chevronOpen)} />
                </button>
                {open && (
                  <div id={panelId} className={styles.moduleDetails}>
                    <p>{m.description}</p>
                    {m.packages.length > 0 && (
                      <fieldset className={styles.packages}>
                        <legend className={styles.packagesLegend}>{copy.packagesLabel}</legend>
                        {m.packages.map((pkg) => (
                          <label key={pkg.id} className={styles.package}>
                            <input
                              type="radio"
                              name={`pkg-${m.id}`}
                              className={styles.packageRadio}
                              checked={packageChoice[m.id] === pkg.id}
                              onChange={() => pickPackage(m.id, pkg.id)}
                            />
                            <span className={styles.packageLabel}>{pkg.label}</span>
                            <span>{formatUsd(pkg.price)}</span>
                          </label>
                        ))}
                      </fieldset>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className={styles.totals} role="status" aria-live="polite">
        <p className={styles.totalsNote}>
          {!hasSelection ? copy.emptyTotalNote : totals.listingSelected ? copy.listingAsideNote : null}
        </p>
        {hasSelection && (
          <div className={styles.totalsValues}>
            <p>
              <span className={styles.totalsLabel}>{copy.totalDurationLabel}:</span> {weeksText}
            </p>
            <p>
              <span className={styles.totalsLabel}>{copy.totalCostLabel}:</span> {costText}
            </p>
          </div>
        )}
      </div>

      <div className={styles.step}>
        <h3 className={styles.stepTitle}>{copy.step2Title}</h3>
        <LaunchLeadForm copy={form} idPrefix="calc" submitLabel={form.submitCalcLabel} extraMessage={buildExtraMessage} />
        <p className={styles.disclaimer}>{copy.disclaimer}</p>
        <p className={styles.bypass}>
          {copy.bypassLead} <a href={copy.bypassHref}>{copy.bypassLabel}</a>
        </p>
      </div>
    </div>
  )
}
