'use client'

import { useEffect, useRef } from 'react'
import { findIllustration } from './engine/illustrations'
import { mountIllustration } from './engine/mountIllustration'
import { createGlyph, type GlyphOptions } from './glyph/createGlyph'
import { elapsed, subscribe } from './ticker'

interface BinaryGlyphProps extends GlyphOptions {
  className?: string
  /** Darker body, brighter edges — the look of every card in project 2. Engine illustrations only. */
  deep?: boolean
}

/**
 * Animated binary-digit art; fills its box. Shapes registered in `engine/illustrations` are drawn by the
 * Binary Engine (monochrome object revealed on scroll), the rest by the procedural glyph.
 * Static at `prefers-reduced-motion`.
 */
export function BinaryGlyph({ shape, deep = true, className, ...glyph }: BinaryGlyphProps) {
  return findIllustration(shape) ? (
    <EngineIllustration shape={shape} deep={deep} className={className} {...glyph} />
  ) : (
    <ProceduralGlyph shape={shape} className={className} {...glyph} />
  )
}

function EngineIllustration({ shape, ox, oy, os, deep, className }: BinaryGlyphProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const ill = findIllustration(shape)
    if (!el || !ill) return
    return mountIllustration(el, ill, { ox, oy, os, deep })
  }, [shape, ox, oy, os, deep])

  return <div ref={ref} className={className} style={{ position: 'relative', width: '100%', height: '100%' }} aria-hidden="true" />
}

function ProceduralGlyph({ shape, ox, oy, os, grid, className }: BinaryGlyphProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let glyph: ReturnType<typeof createGlyph> | null = null
    let visible = false, width = 0, height = 0, dpr = 0
    let unsubscribe: (() => void) | null = null

    const sync = () => {
      const active = visible && !!glyph && !motion.matches
      if (active && !unsubscribe) unsubscribe = subscribe(t => glyph?.draw(t))
      if (!active && unsubscribe) {
        unsubscribe()
        unsubscribe = null
      }
      if (glyph && visible && motion.matches) glyph.draw(0)
    }
    const build = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight, ratio = Math.min(2, window.devicePixelRatio || 1)
      if (!w || !h || (w === width && h === height && ratio === dpr)) return
      width = w
      height = h
      dpr = ratio
      canvas.width = Math.round(w * ratio)
      canvas.height = Math.round(h * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      glyph = createGlyph(ctx, w, h, { shape, ox, oy, os, grid })
      glyph.draw(motion.matches ? 0 : elapsed())
      sync()
    }

    const resizeObserver = new ResizeObserver(build)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) build()
      sync()
    }, { rootMargin: '100px' })
    intersectionObserver.observe(canvas)
    motion.addEventListener('change', sync)
    return () => {
      unsubscribe?.()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motion.removeEventListener('change', sync)
    }
  }, [shape, ox, oy, os, grid])

  return <canvas ref={ref} className={className} style={{ display: 'block', width: '100%', height: '100%' }} aria-hidden="true" />
}
