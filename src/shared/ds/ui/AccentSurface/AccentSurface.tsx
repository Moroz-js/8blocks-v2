'use client'

import { useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import styles from './AccentSurface.module.scss'

/** Gradient angle from the block's proportions, as in Figma 110:6122. */
const accentAngle = (width: number, height: number) => 180 - (Math.atan((1.53 * height) / width) * 180) / Math.PI

/**
 * Accent background (Figma 110:6122): plum → pink gradient with drifting grain and specks.
 * Place it first inside a block with `position: relative; isolation: isolate; overflow: hidden`.
 * Cards inside an element with `data-accent-group` share one gradient sized to that element.
 */
export function AccentSurface({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const group = el?.parentElement?.closest<HTMLElement>('[data-accent-group]')
    if (!el || !group) return

    const update = () => {
      const area = group.getBoundingClientRect()
      const own = el.getBoundingClientRect()
      if (!area.width || !area.height) return
      el.style.setProperty('--accent-angle', `${accentAngle(area.width, area.height)}deg`)
      el.style.setProperty('--accent-w', `${area.width}px`)
      el.style.setProperty('--accent-h', `${area.height}px`)
      el.style.setProperty('--accent-x', `${area.left - own.left}px`)
      el.style.setProperty('--accent-y', `${area.top - own.top}px`)
    }

    const observer = new ResizeObserver(update)
    observer.observe(group)
    observer.observe(el)
    update()
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref} aria-hidden className={clsx(styles.root, className)}>
      <span className={styles.fill} />
    </span>
  )
}
