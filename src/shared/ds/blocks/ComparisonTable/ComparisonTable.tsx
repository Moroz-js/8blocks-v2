import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import { AccentSurface } from '../../ui/AccentSurface'
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
  /** The highlighted column sits on the accent surface instead of the tint. */
  accent?: boolean
  /** Accessible table caption (visually hidden). */
  caption?: string
  className?: string
}

/**
 * Figma: «Таблица» (42:1286) / «Таблица - с выделением сегмента» (43:1391).
 * Row labels on the left, equal value columns. Scrolls horizontally on mobile.
 */
export function ComparisonTable({ columns, rows, highlight, accent = false, caption, className }: ComparisonTableProps) {
  const accentColumn = accent && highlight != null
  const cell = (index: number) => clsx(styles.cell, index === highlight && (accentColumn ? styles.onAccent : styles.highlight))
  return (
    <div className={clsx(styles.scroller, className)}>
      <div className={styles.frame}>
        {accentColumn && (
          <div
            className={styles.accentColumn}
            style={{ '--column': highlight, '--columns': columns.length } as CSSProperties}
            aria-hidden="true"
          >
            <AccentSurface />
          </div>
        )}
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
    </div>
  )
}
