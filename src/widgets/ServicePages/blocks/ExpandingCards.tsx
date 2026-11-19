'use client'

import { useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Section } from '@/shared/ds'
import styles from './ExpandingCards.module.scss'

interface ExpandingCardsProps {
  title: ReactNode
  description: ReactNode
  items: readonly string[]
}

/** Title on the left, a row of numbered cards; the chosen one widens to show its text. */
export function ExpandingCards({ title, description, items }: ExpandingCardsProps) {
  const [active, setActive] = useState(0)
  return (
    <Section>
      <div className={styles.layout}>
        <div className={styles.aside}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <ul className={styles.cards}>
          {items.map((text, i) => (
            <li key={i} className={clsx(styles.card, i === active && styles.active)}>
              <button
                type="button"
                className={styles.button}
                aria-expanded={i === active}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.text}>{text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
