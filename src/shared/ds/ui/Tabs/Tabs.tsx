'use client'

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import Image, { type StaticImageData } from 'next/image'
import clsx from 'clsx'
import styles from './Tabs.module.scss'

export interface TabItem<V extends string = string> {
  value: V
  label: string
  /** 20px white icon before the label; inverted on the selected tab. */
  icon?: StaticImageData
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
  /**
   * `pill` — filled tabs; `glass` — translucent off tabs (on accent surfaces);
   * `ghost` — transparent tabs, the selection flows between them.
   */
  variant?: 'pill' | 'glass' | 'ghost'
}

interface Indicator {
  left: number
  right: number
  top: number
  height: number
  forward: boolean
}

/**
 * Pill tabs (Figma: Tab on / Tab off, 63:3169 / 63:3172). Used as a filter or
 * as a switch between panels. Arrow keys move between tabs (WAI-ARIA tabs pattern).
 */
export function Tabs<V extends string>({
  items,
  value,
  onChange,
  label,
  className,
  panelIdPrefix,
  variant = 'pill',
}: TabsProps<V>) {
  const baseId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState<Indicator | null>(null)
  const ghost = variant === 'ghost'
  const selectedIndex = items.findIndex((item) => item.value === value)

  useLayoutEffect(() => {
    const list = listRef.current
    const tab = refs.current[selectedIndex]
    if (!ghost || !list || !tab) return
    const measure = () =>
      setIndicator((prev) => {
        const left = tab.offsetLeft
        return {
          left,
          right: list.clientWidth - left - tab.offsetWidth,
          top: tab.offsetTop,
          height: tab.offsetHeight,
          forward: prev ? left >= prev.left : true,
        }
      })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [ghost, selectedIndex])

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
    <div ref={listRef} role="tablist" aria-label={label} className={clsx(styles.list, styles[variant], ghost && indicator && styles.ready, className)}>
      {ghost && indicator && (
        <span
          aria-hidden="true"
          className={clsx(styles.indicator, indicator.forward ? styles.forward : styles.backward)}
          style={{ left: indicator.left, right: indicator.right, top: indicator.top, height: indicator.height }}
        />
      )}
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
            {item.icon && <Image src={item.icon} alt="" width={20} height={20} className={styles.icon} />}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
