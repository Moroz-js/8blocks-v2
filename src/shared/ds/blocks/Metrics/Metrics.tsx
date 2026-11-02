import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Metrics.module.scss'

export interface MetricItem {
  value: ReactNode
  label: ReactNode
}

/** Figma: «Карточка - крупная цифра» (38:964) — big number + caption, 4 per row. */
export function Metrics({ items, className }: { items: readonly MetricItem[]; className?: string }) {
  return (
    <dl className={clsx(styles.grid, className)}>
      {items.map((item, i) => (
        <div key={i} className={styles.card}>
          <dt className={styles.value}>{item.value}</dt>
          <dd className={styles.label}>{item.label}</dd>
        </div>
      ))}
    </dl>
  )
}
