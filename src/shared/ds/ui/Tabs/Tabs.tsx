'use client'

import { useId, useRef, type KeyboardEvent } from 'react'
import clsx from 'clsx'
import styles from './Tabs.module.scss'

export interface TabItem<V extends string = string> {
  value: V
  label: string
}

interface TabsProps<V extends string> {
  items: readonly TabItem<V>[]
  value: V
  onChange: (value: V) => void
  /** Accessible name of the tab list. */
  label: string
  className?: string
  /** id prefix of the panels this list controls (`${panelIdPrefix}-${value}`). */
  panelIdPrefix?: string
}

/**
 * Pill tabs (Figma: Tab on / Tab off, 63:3169 / 63:3172). Used as a filter or
 * as a switch between panels. Arrow keys move between tabs (WAI-ARIA tabs pattern).
 */
export function Tabs<V extends string>({ items, value, onChange, label, className, panelIdPrefix }: TabsProps<V>) {
  const baseId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    refs.current[next]?.focus()
    onChange(items[next].value)
  }

  return (
    <div role="tablist" aria-label={label} className={clsx(styles.list, className)}>
      {items.map((item, index) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            id={`${baseId}-${item.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelIdPrefix ? `${panelIdPrefix}-${item.value}` : undefined}
            tabIndex={selected ? 0 : -1}
            className={clsx(styles.tab, selected && styles.selected)}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
