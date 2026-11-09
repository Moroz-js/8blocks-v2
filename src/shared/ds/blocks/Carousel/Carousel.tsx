'use client'

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { IconButton } from '../../ui/Elements'
import { Section } from '../Section'
import styles from './Carousel.module.scss'

interface CarouselProps {
  title: ReactNode
  description?: ReactNode
  /** Title sheen (Figma carousels); plain on service pages. */
  sheen?: boolean
  /** Slides; each child is one card. */
  children: ReactNode
  /** Slide width on desktop, px (Figma: accent 394, quote 450). */
  slideWidth: number
  labels?: { prev: string; next: string }
  className?: string
}

const GAP = 10

/**
 * Horizontal carousel with the block title and round arrows (Figma: «Карточка -
 * акцент» 54:2632, «Карточка - цитата» 54:2858). Cards run past the right edge
 * of the column. Drag / swipe and arrows; built on Framer Motion.
 */
export function Carousel({
  title,
  description,
  sheen = true,
  children,
  slideWidth,
  labels = { prev: 'Previous', next: 'Next' },
  className,
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const x = useMotionValue(0)
  const reduceMotion = useReducedMotion()
  const [maxOffset, setMaxOffset] = useState(0)
  const [offset, setOffset] = useState(0)

  // Recalculate the scroll range when the viewport or content size changes.
  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const measure = () => {
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth)
      setMaxOffset(max)
      if (-x.get() > max) x.set(-max)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    return () => observer.disconnect()
  }, [x])

  useEffect(() => x.on('change', (value) => setOffset(-value)), [x])

  const step = useCallback(
    (direction: 1 | -1) => {
      const first = trackRef.current?.firstElementChild as HTMLElement | null
      const distance = (first?.offsetWidth ?? slideWidth) + GAP
      const target = Math.min(maxOffset, Math.max(0, -x.get() + direction * distance))
      // Snap to slide boundaries so arrows always land on a card edge.
      const snapped = target === maxOffset ? target : Math.round(target / distance) * distance
      animate(x, -snapped, reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 35 })
    },
    [maxOffset, reduceMotion, slideWidth, x],
  )

  const atStart = offset <= 1
  const atEnd = offset >= maxOffset - 1

  return (
    <Section
      title={title}
      description={description}
      sheen={sheen}
      bleed
      className={className}
      actions={
        maxOffset > 0 ? (
          <>
            <IconButton direction="prev" label={labels.prev} onClick={() => step(-1)} disabled={atStart} />
            <IconButton direction="next" label={labels.next} onClick={() => step(1)} disabled={atEnd} />
          </>
        ) : null
      }
    >
      <div ref={viewportRef} className={styles.viewport}>
        <motion.ul
          ref={trackRef}
          className={styles.track}
          style={{ x, ['--slide-width' as string]: `${slideWidth}px` }}
          drag={maxOffset > 0 ? 'x' : false}
          dragConstraints={{ left: -maxOffset, right: 0 }}
          dragElastic={0.08}
          dragMomentum={!reduceMotion}
        >
          {Children.map(children, (child) => (
            <li className={clsx(styles.slide)}>{child}</li>
          ))}
        </motion.ul>
      </div>
    </Section>
  )
}
