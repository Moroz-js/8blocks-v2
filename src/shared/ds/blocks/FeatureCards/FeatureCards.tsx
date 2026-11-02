import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from '../../ui/Button'
import styles from './FeatureCards.module.scss'

export interface FeatureCardItem {
  title: ReactNode
  description: ReactNode
  /** Illustration slot (image / animation). Without it an empty 5% placeholder is shown. */
  illustration?: ReactNode
  /** Only for the `action` variant. */
  action?: { label: string; href: string }
}

/*
 * Figma:
 *  - compact     «Карточка - компактная» (38:978) — 360 tall, text centred at the bottom, art on top. 4 per row.
 *  - action      «Карточка - кнопка» (38:1033)     — 680 tall, Heading 5 + text + tertiary button. 3 per row.
 *  - illustrated «Иллюстрация содержания» (38:1089) — 360 tall, text top-left, art at the bottom. 2 or 3 per row.
 */
interface FeatureCardsProps {
  variant: 'compact' | 'action' | 'illustrated'
  items: readonly FeatureCardItem[]
  /** Cards per row on desktop. Defaults: compact 4, action 3, illustrated 3. */
  columns?: 2 | 3 | 4
  className?: string
}

const DEFAULT_COLUMNS = { compact: 4, action: 3, illustrated: 3 } as const

export function FeatureCards({ variant, items, columns, className }: FeatureCardsProps) {
  const cols = columns ?? DEFAULT_COLUMNS[variant]
  return (
    <ul className={clsx(styles.grid, styles[`cols${cols}`], className)}>
      {items.map((item, i) => (
        <li key={i} className={clsx(styles.card, styles[variant])}>
          <div className={styles.art} aria-hidden={item.illustration ? undefined : true}>
            {item.illustration}
          </div>
          <div className={styles.text}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
          {variant === 'action' && item.action && (
            <Button variant="tertiary" href={item.action.href} className={styles.cta}>
              {item.action.label}
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
