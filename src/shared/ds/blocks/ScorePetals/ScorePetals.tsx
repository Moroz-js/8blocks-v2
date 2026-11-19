'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Hint, HintTooltip } from '../../ui/Hint'
import { PETAL_LEVELS, type Petal, type PetalTone } from './petals'
import styles from './ScorePetals.module.scss'

const GAP = 5
const DURATION = 700
const TONE_VAR: Record<PetalTone, string> = { good: '--ds-success', medium: '--ds-warning', bad: '--ds-danger' }
/** Label corners, clockwise from the top-right petal. */
const POSITIONS: Record<number, readonly Corner[]> = {
  4: ['topRight', 'bottomRight', 'bottomLeft', 'topLeft'],
  5: ['topRight', 'bottomRight', 'bottom', 'bottomLeft', 'topLeft'],
}
type Corner = 'topRight' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'topLeft'

function draw(canvas: HTMLCanvasElement, values: number[], tones: PetalTone[]) {
  const width = canvas.offsetWidth
  const height = canvas.offsetHeight
  if (!width || !height) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)
  const css = getComputedStyle(canvas)
  const cx = width / 2
  const cy = height / 2
  const R = Math.min(width, height) / 2 / 1.3

  PETAL_LEVELS.forEach((level, i) => {
    ctx.beginPath()
    ctx.arc(cx, cy, R * level, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${i === PETAL_LEVELS.length - 1 ? 0.22 : 0.12})`
    ctx.lineWidth = 1
    ctx.stroke()
  })

  const sector = (b0: number, b1: number, r: number) => {
    const corner = Math.min(10, r * 0.45)
    const n0 = [-Math.sin(b0), Math.cos(b0)]
    const n1 = [Math.sin(b1), -Math.cos(b1)]
    const d0 = [Math.cos(b0), Math.sin(b0)]
    const d1 = [Math.cos(b1), Math.sin(b1)]
    const mid = (b0 + b1) / 2
    const s = GAP / Math.sin((b1 - b0) / 2)
    const L = Math.sqrt(Math.max(0, r * r - GAP * GAP))
    const p0 = [cx + d0[0] * L + n0[0] * GAP, cy + d0[1] * L + n0[1] * GAP]
    const p1 = [cx + d1[0] * L + n1[0] * GAP, cy + d1[1] * L + n1[1] * GAP]
    const t0 = Math.atan2(p0[1] - cy, p0[0] - cx)
    const t1 = Math.atan2(p1[1] - cy, p1[0] - cx)
    const dc = corner / r
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(mid) * s, cy + Math.sin(mid) * s)
    ctx.lineTo(p0[0] - d0[0] * corner, p0[1] - d0[1] * corner)
    ctx.arcTo(p0[0], p0[1], cx + Math.cos(t0 + dc) * r, cy + Math.sin(t0 + dc) * r, corner)
    ctx.arc(cx, cy, r, t0 + dc, t1 - dc)
    ctx.arcTo(p1[0], p1[1], p1[0] - d1[0] * corner, p1[1] - d1[1] * corner, corner)
    ctx.closePath()
  }

  values.forEach((level, i) => {
    const b0 = -Math.PI / 2 + (i / values.length) * Math.PI * 2
    const b1 = -Math.PI / 2 + ((i + 1) / values.length) * Math.PI * 2
    const r = level * R - (level < 1 ? 3 : 0)
    sector(b0, b1, r)
    ctx.fillStyle = css.getPropertyValue(TONE_VAR[tones[i]]).trim() || '#fff'
    ctx.fill()
    ctx.save()
    sector(b0, b1, r)
    ctx.clip()
    for (const ring of PETAL_LEVELS) {
      const lr = R * ring
      if (lr >= r - 2) continue
      ctx.beginPath()
      ctx.arc(cx, cy, lr, b0, b1)
      ctx.strokeStyle = 'rgba(0,0,0,0.28)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    ctx.restore()
  })
}

/**
 * Flat petal chart; petals go clockwise from the top-right, labels sit in the corners.
 * `bare` drops the card background (chart used inside a section rather than a card).
 * `hints` shows a «?» next to labels with tips; otherwise the label itself carries the tip.
 */
export function ScorePetals({
  petals,
  label,
  bare = false,
  hints = false,
  className,
}: {
  petals: Petal[]
  label: string
  bare?: boolean
  hints?: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shown = useRef<number[] | null>(null)
  const key = petals.map((petal) => `${petal.value}:${petal.tone}`).join(',')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const target = petals.map((petal) => petal.value)
    const tones = petals.map((petal) => petal.tone)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = shown.current?.length === target.length ? shown.current : target.map(() => 0.14)
    let current = reduced ? target : from
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - p, 3)
      current = target.map((value, i) => from[i] + (value - from[i]) * eased)
      shown.current = current
      draw(canvas, current, tones)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    if (reduced) {
      shown.current = target
      draw(canvas, target, tones)
    } else frame = requestAnimationFrame(tick)
    const observer = new ResizeObserver(() => draw(canvas, current, tones))
    observer.observe(canvas)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redraw only when values or tones change
  }, [key])

  const positions = POSITIONS[petals.length] ?? POSITIONS[5]

  return (
    <figure className={clsx(styles.card, bare && styles.bare, className)}>
      <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={label} />
      {petals.map((petal, i) => {
        const corner = positions[i]
        const text = <span className={styles.text}>{petal.label}</span>
        if (!petal.tip) {
          return (
            <span key={petal.id} className={clsx(styles.label, styles[corner])}>
              {text}
            </span>
          )
        }
        if (hints) {
          return (
            <span key={petal.id} className={clsx(styles.label, styles.withHint, styles[corner])}>
              {text}
              <Hint text={petal.tip} />
            </span>
          )
        }
        return (
          <HintTooltip key={petal.id} text={petal.tip}>
            <span tabIndex={0} className={clsx(styles.label, styles.help, styles[corner])}>
              {text}
            </span>
          </HintTooltip>
        )
      })}
    </figure>
  )
}
