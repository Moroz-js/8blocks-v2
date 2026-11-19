import type { ReactNode } from 'react'
import { Section } from '@/shared/ds'
import styles from './ChecklistRows.module.scss'

interface ChecklistRowsProps {
  title: ReactNode
  items: readonly { label: string; text: string; points: readonly string[] }[]
}

/** «What you’ll walk away with»: a pink label and a line on the left, a two-column checklist on the right. */
export function ChecklistRows({ title, items }: ChecklistRowsProps) {
  return (
    <Section title={title}>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.row}>
            <div className={styles.lead}>
              <h3 className={styles.label}>{item.label}</h3>
              <p className={styles.text}>{item.text}</p>
            </div>
            <ul className={styles.points}>
              {item.points.map((point) => (
                <li key={point} className={styles.point}>
                  <svg className={styles.check} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <circle cx="9" cy="9" r="9" />
                    <path d="M5.2 9.3l2.4 2.4 5-5.2" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  )
}
