'use client'

import { useMemo, useState } from 'react'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import { TokenLaunchLeadForm } from './TokenLaunchLeadForm'
import type { LaunchModuleView } from './types'
import styles from './TokenLaunch.module.scss'

const { calculator, form: formContent } = tokenLaunchContent

function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

interface TokenLaunchCalculatorProps {
  modules: LaunchModuleView[]
}

export function TokenLaunchCalculator({ modules }: TokenLaunchCalculatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [packageChoice, setPackageChoice] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      modules.filter((m) => m.packages.length > 0).map((m) => [m.id, m.packages[0].id]),
    ),
  )

  function toggleModule(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function pickPackage(moduleId: string, packageId: string) {
    setPackageChoice((prev) => ({ ...prev, [moduleId]: packageId }))
    setSelectedIds((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]))
  }

  const totals = useMemo(() => {
    const selected = modules.filter((m) => selectedIds.includes(m.id))
    const included = selected.filter((m) => m.includeInTotal)

    const priceOf = (m: LaunchModuleView) => {
      const pkg = m.packages.find((p) => p.id === packageChoice[m.id])
      return pkg ? pkg.price : m.price
    }
    const weeksOf = (m: LaunchModuleView) => {
      const pkg = m.packages.find((p) => p.id === packageChoice[m.id])
      return pkg?.durationWeeks ?? m.durationWeeks
    }

    const cost = included.reduce((sum, m) => sum + priceOf(m), 0)
    const isFrom = included.some((m) => m.priceFrom)
    // Параллельные модули (Workshop, аудит) идут одновременно — в срок входит max по группе
    const sequentialWeeks = included.filter((m) => !m.parallel).reduce((s, m) => s + weeksOf(m), 0)
    const parallelWeeks = Math.max(0, ...included.filter((m) => m.parallel).map(weeksOf))
    const weeks = sequentialWeeks + parallelWeeks
    const listingSelected = selected.some((m) => !m.includeInTotal)

    return { selected, cost, isFrom, weeks, listingSelected, priceOf }
  }, [modules, selectedIds, packageChoice])

  const hasSelection = totals.selected.some((m) => m.includeInTotal) || totals.listingSelected

  function modulePriceDisplay(m: LaunchModuleView): string {
    if (!m.includeInTotal) {
      return calculator.customPriceLabel
    }

    if (m.packages.length > 0) {
      const prices = m.packages.map((p) => p.price)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      return min === max ? formatUsd(min) : `${formatUsd(min)} – ${formatUsd(max)}`
    }
    return m.priceFrom ? `${calculator.fromPrefix} ${formatUsd(m.price)}` : formatUsd(m.price)
  }

  function buildExtraMessage(): string {
    const lines: string[] = []
    if (totals.selected.length > 0) {
      const moduleLines = totals.selected.map((m) => {
        const pkg = m.packages.find((p) => p.id === packageChoice[m.id])
        const label = pkg ? `${m.name} (${pkg.label})` : m.name
        const price = m.includeInTotal
          ? formatUsd(totals.priceOf(m))
          : `${calculator.fromPrefix} ${formatUsd(m.price)}`
        return `— ${label}: ${price}`
      })
      lines.push(`${formContent.modulesLine}:`, ...moduleLines)

      const costText = `${totals.isFrom ? `${calculator.fromPrefix} ` : ''}${formatUsd(totals.cost)}`
      const weeksText = calculator.weeksTemplate.replace('%s', String(Math.max(1, Math.ceil(totals.weeks))))
      const listingText = totals.listingSelected ? ` (${calculator.listingAsideNote})` : ''
      lines.push(`${formContent.estimateLine}: ${costText} · ${weeksText}${listingText}`)
    }
    return lines.join('\n')
  }

  return (
    <section id="calculator" className={styles.section} aria-label={calculator.headline}>
      <div className={styles.inner}>
        <SectionHead
          label={calculator.label}
          headline={calculator.headline}
          description={calculator.description}
        />

        <div className={styles.calcLayout}>
          <h3 className={styles.calcStepTitle}>{calculator.step1Title}</h3>

          <div className={styles.calcModules}>
            {modules.map((m) => {
              const checked = selectedIds.includes(m.id)
              return (
                <div key={m.id} className={styles.moduleCard} data-checked={checked}>
                  <div className={styles.moduleMain}>
                    <input
                      id={`module-${m.id}`}
                      type="checkbox"
                      className={styles.moduleCheckbox}
                      checked={checked}
                      onChange={() => toggleModule(m.id)}
                    />
                    <label
                      htmlFor={`module-${m.id}`}
                      className={styles.moduleCheckboxBox}
                      aria-hidden="true"
                    >
                      ✓
                    </label>
                    <div className={styles.moduleInfo}>
                      <h3 className={styles.moduleName}>
                        <label htmlFor={`module-${m.id}`}>{m.name}</label>
                      </h3>
                      <span className={styles.moduleDuration}>{m.durationLabel}</span>
                    </div>
                    <span className={styles.modulePrice}>{modulePriceDisplay(m)}</span>
                  </div>

                  <details className={styles.moduleDetails}>
                    <summary className={styles.moduleSummary}>
                      <span className={styles.moduleDetailsChevron} aria-hidden="true">▼</span>
                      {calculator.detailsLabel}
                    </summary>
                    <p className={styles.moduleDescription}>{m.description}</p>
                    {m.packages.length > 0 && (
                      <fieldset className={styles.modulePackages}>
                        <legend className={styles.modulePackagesLegend}>
                          {calculator.packagesLabel}
                        </legend>
                        {m.packages.map((pkg) => {
                          const active = packageChoice[m.id] === pkg.id
                          return (
                            <label
                              key={pkg.id}
                              className={styles.packageOption}
                              data-active={active}
                            >
                              <input
                                type="radio"
                                name={`pkg-${m.id}`}
                                className={styles.packageRadio}
                                checked={active}
                                onChange={() => pickPackage(m.id, pkg.id)}
                              />
                              <span className={styles.packageRadioDot} aria-hidden="true" />
                              <span className={styles.packageLabel}>{pkg.label}</span>
                              <span className={styles.packagePrice}>{formatUsd(pkg.price)}</span>
                            </label>
                          )
                        })}
                      </fieldset>
                    )}
                  </details>
                </div>
              )
            })}
          </div>

          <div className={styles.calcTotal} role="status" aria-live="polite">
            {hasSelection ? (
              <>
                <span className={styles.calcTotalItem}>
                  <span className={styles.calcTotalLabel}>{calculator.totalCostLabel}</span>
                  <span className={styles.calcTotalValue}>
                    {totals.isFrom ? `${calculator.fromPrefix} ` : ''}
                    {formatUsd(totals.cost)}
                  </span>
                </span>
                <span className={styles.calcTotalItem}>
                  <span className={styles.calcTotalLabel}>{calculator.totalDurationLabel}</span>
                  <span className={styles.calcTotalValue}>
                    {calculator.weeksTemplate.replace(
                      '%s',
                      String(Math.max(1, Math.ceil(totals.weeks))),
                    )}
                  </span>
                </span>
                {totals.listingSelected && (
                  <span className={styles.calcTotalNote}>{calculator.listingAsideNote}</span>
                )}
              </>
            ) : (
              <span className={styles.calcTotalNote}>{calculator.emptyTotalNote}</span>
            )}
          </div>

          <div className={styles.calcFormBlock}>
            <h3 className={styles.calcStepTitle}>{calculator.step2Title}</h3>
            <TokenLaunchLeadForm
              idPrefix="calc"
              submitLabel={formContent.submitCalcLabel}
              extraMessage={buildExtraMessage}
            />
            <p className={styles.calcDisclaimer}>{calculator.disclaimer}</p>
            <p className={styles.calcBypass}>
              {calculator.bypassLead}{' '}
              <a href={calculator.bypassHref} className={styles.calcBypassLink}>
                {calculator.bypassLabel}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
