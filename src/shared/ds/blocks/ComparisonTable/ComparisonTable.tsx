import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './ComparisonTable.module.scss'

export interface ComparisonRow {
  label: ReactNode
  values: readonly ReactNode[]
}

interface ComparisonTableProps {
  columns: readonly ReactNode[]
  rows: readonly ComparisonRow[]
  /** Index of a column to highlight (Figma: «Таблица - с выделением сегмента», 43:1391). */
  highlight?: number
  /** Accessible table caption (visually hidden). */
  caption?: string
  className?: string
}

/**
 * Figma: «Таблица» (42:1286) / «Таблица - с выделением сегмента» (43:1391).
 * Row labels on the left, equal value columns. Scrolls horizontally on mobile.
 */
export function ComparisonTable({ columns, rows, highlight, caption, className }: ComparisonTableProps) {
  const cell = (index: number) => clsx(styles.cell, index === highlight && styles.highlight)
  return (
    <div className={clsx(styles.scroller, className)}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            <td className={styles.corner} />
            {columns.map((column, i) => (
              <th key={i} scope="col" className={clsx(cell(i), styles.head)}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              <th scope="row" className={styles.label}>
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td key={i} className={cell(i)}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
