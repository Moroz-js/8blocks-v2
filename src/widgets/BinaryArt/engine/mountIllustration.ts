import { BinaryEngine } from './binaryEngine'
import type { Illustration } from './illustrations'

export interface IllustrationPlacement {
  /** Object centre as a share of the box (the old glyph's ox/oy). */
  ox?: number
  oy?: number
  /** Object size relative to the old glyph (os). */
  os?: number
  /** Home-page coin look: darker body, brighter edges. */
  deep?: boolean
}

// Canvas = DENSITY × its CSS box: on a 2× screen one canvas pixel is one screen pixel, so the 7px digits stay crisp.
// SIZE: object area vs the old glyph; CAP: largest share of the frame an object may cover.
const DENSITY = 2
const SIZE = 1.6
const CAP = 0.45
const DEEP = { contrast: 3.4, tone: 0.52, punch: 0.8, detail: 1, edgeFeather: 0.6 }
const STILL = { reveal: 0.01, flicker: 0, sparkle: 0 }

/** The parts of the (untyped) engine class this adapter drives. */
interface Engine {
  canvasRef: { current: HTMLCanvasElement | null }
  props: Record<string, unknown>
  gridKey: string
  prepared: boolean
  componentDidMount(): void
  componentWillUnmount(): void
}

/**
 * Draws a registered illustration inside `el` (port of BinaryIll.mount from project 2/binary-engine.js).
 * The canvas is the largest box centred on (ox, oy) that fits the element, so the object is never cut off.
 */
export function mountIllustration(el: HTMLElement, ill: Illustration, placement: IllustrationPlacement) {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;display:block;'
  canvas.setAttribute('aria-hidden', 'true')
  el.appendChild(canvas)

  const engine = new BinaryEngine() as unknown as Engine
  engine.canvasRef.current = canvas
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const ax = placement.ox ?? 0.5
  const ay = placement.oy ?? 0.5
  const os = placement.os || 0.85
  let started = false

  const size = () => {
    const W = el.clientWidth
    const H = el.clientHeight
    if (!W || !H) return false
    const cw = Math.max(40, Math.round(2 * Math.min(ax, 1 - ax) * W))
    const ch = Math.max(40, Math.round(2 * Math.min(ay, 1 - ay) * H))
    canvas.style.left = `${Math.round(ax * W - cw / 2)}px`
    canvas.style.top = `${Math.round(ay * H - ch / 2)}px`
    canvas.style.width = `${cw}px`
    canvas.style.height = `${ch}px`
    const side = Math.min(W, H) * 0.92 * os
    const weight = Math.min(CAP, (SIZE * 0.59 * side * side) / (cw * ch))
    const own = typeof ill.weight === 'number' ? Math.min(CAP * 1.2, (ill.weight * weight) / 0.2) : weight
    engine.props = {
      ...ill,
      ...(placement.deep ? DEEP : {}),
      ...(motion.matches ? STILL : {}),
      w: cw * DENSITY,
      h: ch * DENSITY,
      density: DENSITY,
      weight: own,
    }
    canvas.width = cw * DENSITY
    canvas.height = ch * DENSITY
    engine.gridKey = ''
    engine.prepared = false
    return true
  }

  const start = () => {
    if (started) return
    started = true
    engine.componentDidMount()
  }

  if (size()) start()
  const observer = new ResizeObserver(() => {
    if (size()) start()
  })
  observer.observe(el)

  return () => {
    engine.componentWillUnmount()
    observer.disconnect()
    canvas.remove()
  }
}
