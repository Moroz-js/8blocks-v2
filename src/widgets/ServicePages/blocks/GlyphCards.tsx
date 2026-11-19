import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import { AccentSurface } from '@/shared/ds'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import styles from './GlyphCards.module.scss'

export interface GlyphCardItem {
  title: ReactNode
  description: ReactNode
  /** Pink line above the text, pinned to the top of the card. */
  label?: ReactNode
  /** Binary glyph from the designer's set; `oy` / `os` — vertical anchor and scale. */
  glyph: { shape: string; oy?: number; os?: number }
}

interface GlyphCardsProps {
  items: readonly GlyphCardItem[]
  columns: 2 | 3 | 4
  /** Card height on desktop, px. */
  height: number
  /** Glyph area: offset from the top and height, px. */
  glyph: { top?: number; height: number }
  /** `bottom` — text at the bottom; `under` — text right under the glyph. */
  text?: 'bottom' | 'under'
  align?: 'left' | 'center'
  /**
   * Cards on the accent surface. `group` (default) — the grid shares one gradient;
   * `false` — a parent with `data-accent-group` (several grids, one gradient).
   */
  accent?: boolean
  accentGroup?: boolean
  className?: string
}

/** Cards with an animated binary glyph (designer's service pages). */
export function GlyphCards({
  items,
  columns,
  height,
  glyph,
  text = 'bottom',
  align = 'left',
  accent = false,
  accentGroup = true,
  className,
}: GlyphCardsProps) {
  const vars = {
    '--card-height': `${height}px`,
    '--glyph-top': `${glyph.top ?? 0}px`,
    '--glyph-height': `${glyph.height}px`,
  } as CSSProperties
  return (
    <ul
      className={clsx(styles.grid, styles[`cols${columns}`], styles[text], styles[align], className)}
      style={vars}
      data-accent-group={accent && accentGroup ? '' : undefined}
    >
      {items.map((item, i) => (
        <li key={i} className={clsx(styles.card, accent && styles.accentCard)}>
          {accent && <AccentSurface />}
          <div className={styles.glyph} aria-hidden="true">
            <BinaryGlyph shape={item.glyph.shape} oy={item.glyph.oy} os={item.glyph.os} />
          </div>
          {item.label && <p className={styles.label}>{item.label}</p>}
          <div className={styles.text}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
