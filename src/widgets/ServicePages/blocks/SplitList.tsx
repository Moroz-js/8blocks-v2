import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Section } from '@/shared/ds'
import styles from './SplitList.module.scss'

interface SplitListProps {
  title: ReactNode
  description?: ReactNode
  /** `md` — Heading 3, `sm` — Heading 4 (long titles). */
  titleSize?: 'md' | 'sm'
  children: ReactNode
}

/** Sticky title on the left, a list on the right (746px). */
export function SplitList({ title, description, titleSize = 'md', children }: SplitListProps) {
  return (
    <Section>
      <div className={styles.layout}>
        <div className={styles.aside}>
          <h2 className={clsx(styles.title, styles[titleSize])}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.list}>{children}</div>
      </div>
    </Section>
  )
}

export interface IndexedRow {
  /** Pink line above the text. */
  label?: ReactNode
  lead: ReactNode
  text: ReactNode
  /** Extra content under the text (data, source link). */
  body?: ReactNode
}

/**
 * Rows «01 | Lead. Text» with a numbered column. `lg` — Text L, lead and text
 * on separate lines (question / answer rows).
 */
export function IndexedRows({ items, size = 'sm' }: { items: readonly IndexedRow[]; size?: 'sm' | 'lg' }) {
  return (
    <ol className={clsx(styles.indexed, size === 'lg' && styles.indexedLg)}>
      {items.map((item, i) => (
        <li key={i} className={styles.indexedRow}>
          <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
          <div className={styles.indexedBody}>
            {item.label && <p className={styles.indexedLabel}>{item.label}</p>}
            <p className={styles.indexedText}>
              <span className={styles.lead}>{item.lead}</span> {item.text}
            </p>
            {item.body}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Rows with a pink label over a large line. */
export function LabeledRows({ items, numbered = false }: { items: readonly { label: ReactNode; text: ReactNode }[]; numbered?: boolean }) {
  return (
    <ul className={styles.labeled}>
      {items.map((item, i) => (
        <li key={i} className={styles.labeledRow}>
          <p className={styles.label}>
            {numbered && `${i + 1}. `}
            {item.label}
          </p>
          <p className={styles.labeledText}>{item.text}</p>
        </li>
      ))}
    </ul>
  )
}
