import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import type { LaunchModuleView } from './types'
import styles from './TokenLaunch.module.scss'

interface TokenLaunchModuleSummaryProps {
  modules: LaunchModuleView[]
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

export function TokenLaunchModuleSummary({ modules }: TokenLaunchModuleSummaryProps) {
  const { calculator } = tokenLaunchContent

  if (modules.length === 0) {
    return null
  }

  return (
    <div className={styles.moduleSummaryList} aria-label={`${calculator.headline}: modules`}>
      {modules.map((module) => {
        if (!module.includeInTotal) {
          return (
            <article key={module.id} className={styles.moduleSummaryItem}>
              <h3 className={styles.moduleSummaryName}>{module.name}</h3>
              <p className={styles.moduleSummaryMeta}>
                {module.durationLabel} · {calculator.customPriceLabel}
              </p>
            </article>
          )
        }

        const prices = module.packages.map((pkg) => pkg.price)
        const minPrice = prices.length > 0 ? Math.min(...prices) : module.price
        const maxPrice = prices.length > 0 ? Math.max(...prices) : module.price
        const price = minPrice === maxPrice ? formatUsd(minPrice) : `${formatUsd(minPrice)} – ${formatUsd(maxPrice)}`

        return (
          <article key={module.id} className={styles.moduleSummaryItem}>
            <h3 className={styles.moduleSummaryName}>{module.name}</h3>
            <p className={styles.moduleSummaryMeta}>
              {module.durationLabel} · {module.priceFrom && prices.length === 0 ? `${calculator.fromPrefix} ` : ''}
              {price}
            </p>
          </article>
        )
      })}
    </div>
  )
}
