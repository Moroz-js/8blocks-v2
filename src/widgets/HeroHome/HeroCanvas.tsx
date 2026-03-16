'use client'

import { useRef, useEffect } from 'react'
import { CUBE_COLORS as C } from './cubeColors'

// 8 cubes — one for each letter of "8BLOCKS"
interface Cube {
  nx: number    // normalized x (0–1)
  ny: number    // normalized y (0–1)
  s: number     // half-width in px
  pf: number    // parallax factor
  ph: number    // float phase offset
  sp: number    // float speed
  op: number    // base opacity
}

const CUBES: Cube[] = [
  { nx: 0.14, ny: 0.17, s: 52, pf: 0.55, ph: 0.0, sp: 0.8, op: 0.90 },
  { nx: 0.71, ny: 0.12, s: 36, pf: 1.00, ph: 1.2, sp: 1.1, op: 0.60 },
  { nx: 0.52, ny: 0.31, s: 70, pf: 0.20, ph: 2.4, sp: 0.6, op: 0.95 },
  { nx: 0.86, ny: 0.44, s: 42, pf: 0.75, ph: 0.8, sp: 1.3, op: 0.55 },
  { nx: 0.31, ny: 0.55, s: 30, pf: 1.10, ph: 1.8, sp: 1.5, op: 0.45 },
  { nx: 0.63, ny: 0.65, s: 58, pf: 0.30, ph: 3.6, sp: 0.9, op: 0.75 },
  { nx: 0.17, ny: 0.74, s: 40, pf: 0.85, ph: 4.0, sp: 1.0, op: 0.60 },
  { nx: 0.80, ny: 0.80, s: 28, pf: 0.45, ph: 2.8, sp: 1.2, op: 0.50 },
]

type Pt = { x: number; y: number }

/**
 * Draws a face polygon with:
 *   - per-vertex corner rounding (radius=0 → sharp, used for shared interior vertices)
 *   - concave edge bowing: each edge midpoint is pulled toward the face centre by `bow` (0–1)
 *
 * Adjacent faces sharing an edge both bow inward toward their own centres,
 * which creates a natural ridge/bevel line at the boundary.
 */
function facePath(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  radii: number[],
  bow = 0,
) {
  const n   = pts.length
  const fcx = pts.reduce((s, p) => s + p.x, 0) / n
  const fcy = pts.reduce((s, p) => s + p.y, 0) / n

  // Pre-compute the two "arm" endpoints flanking each corner arc.
  // If r=0, both arms collapse to the vertex itself.
  const arms: [Pt, Pt][] = pts.map((cur, i) => {
    const r = radii[i]
    if (r <= 0) return [cur, cur]
    const prev = pts[(i - 1 + n) % n]
    const next = pts[(i + 1) % n]
    const dx1 = prev.x - cur.x, dy1 = prev.y - cur.y
    const dx2 = next.x - cur.x, dy2 = next.y - cur.y
    const d1  = Math.hypot(dx1, dy1), d2 = Math.hypot(dx2, dy2)
    const rc  = Math.min(r, d1 / 2, d2 / 2)
    return [
      { x: cur.x + (dx1 / d1) * rc, y: cur.y + (dy1 / d1) * rc },
      { x: cur.x + (dx2 / d2) * rc, y: cur.y + (dy2 / d2) * rc },
    ]
  })

  ctx.beginPath()
  ctx.moveTo(arms[0][0].x, arms[0][0].y)

  for (let i = 0; i < n; i++) {
    const [, armTo] = arms[i]
    const nextArmFrom = arms[(i + 1) % n][0]

    // Corner arc (or plain lineTo for sharp corners)
    if (radii[i] > 0) {
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, armTo.x, armTo.y)
    } else {
      ctx.lineTo(armTo.x, armTo.y)
    }

    // Edge from armTo → nextArmFrom, bowed toward face centre
    if (bow > 0) {
      const mx  = (armTo.x + nextArmFrom.x) / 2
      const my  = (armTo.y + nextArmFrom.y) / 2
      ctx.quadraticCurveTo(
        mx + (fcx - mx) * bow,
        my + (fcy - my) * bow,
        nextArmFrom.x, nextArmFrom.y,
      )
    } else {
      ctx.lineTo(nextArmFrom.x, nextArmFrom.y)
    }
  }
  ctx.closePath()
}

function drawCube(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  s: number, op: number,
  t: number,
) {
  const w = s
  const h = s * 0.58  // ~true isometric ratio → cube looks square, not flat
  const r = 0

  const top   = { x: cx,     y: cy - h * 2 }
  const right = { x: cx + w, y: cy - h     }
  const left  = { x: cx - w, y: cy - h     }
  const mid   = { x: cx,     y: cy         }  // interior — always radius 0
  const br    = { x: cx + w, y: cy + h     }
  const bl    = { x: cx - w, y: cy + h     }
  const bot   = { x: cx,     y: cy + h * 2 }

  const topFace   = [top, right, mid, left]
  const leftFace  = [left, mid, bot, bl]
  const rightFace = [mid, right, br, bot]

  // `mid` is the interior vertex shared by all 3 faces — always radius 0.
  // All other vertices are outer or shared on the same edge with the same
  // inset distance, so adjacent face paths connect seamlessly.
  const topR   = [r, r, 0, r]
  const leftR  = [r, 0, r, r]
  const rightR = [0, r, r, r]
  const bow = 0

  // ── Right face (darkest) ──────────────────────────────────
  facePath(ctx, rightFace, rightR, bow)
  const rg = ctx.createLinearGradient(mid.x, mid.y, br.x, br.y)
  rg.addColorStop(0, `rgba(${C.darkPurple}, ${0.75 * op})`)
  rg.addColorStop(1, `rgba(12, 2, 22,       ${0.98 * op})`)
  ctx.fillStyle = rg
  ctx.fill()

  // ── Left face ─────────────────────────────────────────────
  facePath(ctx, leftFace, leftR, bow)
  const lg = ctx.createLinearGradient(left.x, left.y, bot.x, bot.y)
  lg.addColorStop(0, `rgba(${C.purple},     ${0.55 * op})`)
  lg.addColorStop(1, `rgba(${C.darkPurple}, ${0.88 * op})`)
  ctx.fillStyle = lg
  ctx.fill()

  // ── Top face base ─────────────────────────────────────────
  facePath(ctx, topFace, topR, bow)
  const tg = ctx.createLinearGradient(top.x, top.y, mid.x, mid.y)
  tg.addColorStop(0,   `rgba(${C.roseLight}, ${0.58 * op})`)
  tg.addColorStop(0.45, `rgba(${C.magenta},  ${0.42 * op})`)
  tg.addColorStop(1,    `rgba(${C.purple},   ${0.30 * op})`)
  ctx.fillStyle = tg
  ctx.fill()

  // ── Top face glossy sheen ─────────────────────────────────
  const gx = top.x + (right.x - top.x) * 0.30
  const gy = top.y + (mid.y   - top.y) * 0.25
  const shimmer = 0.80 + 0.20 * Math.sin(t * 1.4)
  const gloss = ctx.createRadialGradient(gx, gy, 0, gx, gy, s * 0.70)
  gloss.addColorStop(0,   `rgba(255, 235, 255, ${0.40 * op * shimmer})`)
  gloss.addColorStop(0.35, `rgba(210, 150, 230, ${0.14 * op})`)
  gloss.addColorStop(1,   `rgba(255, 255, 255, 0)`)
  facePath(ctx, topFace, topR, bow)
  ctx.fillStyle = gloss
  ctx.fill()

  // ── Edge strokes ──────────────────────────────────────────
  ctx.lineWidth = 1.5
  facePath(ctx, topFace, topR, bow)
  ctx.strokeStyle = `rgba(${C.roseLight}, ${0.90 * op})`
  ctx.stroke()

  facePath(ctx, leftFace, leftR, bow)
  ctx.strokeStyle = `rgba(${C.magenta}, ${0.45 * op})`
  ctx.stroke()

  facePath(ctx, rightFace, rightR, bow)
  ctx.strokeStyle = `rgba(${C.purple}, ${0.38 * op})`
  ctx.stroke()
}

const PAD = 100 // extra canvas space on each side to prevent hard clipping

export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr  = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas.width  = (W + PAD * 2) * dpr
      canvas.height = (H + PAD * 2) * dpr
      // shift origin so logical (0,0) maps to PAD offset in canvas space
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    const startTime = performance.now()

    const draw = () => {
      const t       = (performance.now() - startTime) / 1000
      const scrollY = window.scrollY

      ctx.clearRect(-PAD, -PAD, W + PAD * 2, H + PAD * 2)

      // Sort cubes back-to-front by Y (painter's algorithm)
      const sorted = [...CUBES].sort((a, b) => {
        const ya = a.ny * H + Math.sin(t * a.sp + a.ph) * 10 - scrollY * a.pf * 0.25
        const yb = b.ny * H + Math.sin(t * b.sp + b.ph) * 10 - scrollY * b.pf * 0.25
        return ya - yb
      })

      for (const cube of sorted) {
        const floatY = Math.sin(t * cube.sp + cube.ph) * 10
        const px     = cube.nx * W
        const py     = cube.ny * H + floatY - scrollY * cube.pf * 0.25

        if (py < -cube.s * 4 - PAD || py > H + cube.s * 4 + PAD) continue

        drawCube(ctx, px, py, cube.s, cube.op, t + cube.ph)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
