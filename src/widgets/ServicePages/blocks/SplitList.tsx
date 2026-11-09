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

/** Rows «01 | Lead. Text» with a numbered column. */
export function IndexedRows({ items }: { items: readonly { lead: ReactNode; text: ReactNode }[] }) {
  return (
    <ol className={styles.indexed}>
      {items.map((item, i) => (
        <li key={i} className={styles.indexedRow}>
          <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
          <p className={styles.indexedText}>
            <span className={styles.lead}>{item.lead}</span> {item.text}
          </p>
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
