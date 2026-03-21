'use client'

import { useRef, useEffect } from 'react'

interface Block {
  x: number
  z: number
  w: number
  d: number
}

const BLOCKS: Block[] = [
  { x: 0,   z: 0,   w: 5.5, d: 1 },
  { x: 0,   z: 1.5, w: 4,   d: 1 },
  { x: 0,   z: 3,   w: 2.5, d: 1 },
  { x: 0,   z: 4.5, w: 2.5, d: 1 },
  { x: 3,   z: 3,   w: 1,   d: 2.5 },
  { x: 4.5, z: 1.5, w: 1,   d: 4 },
  { x: 6,   z: 0,   w: 1,   d: 5.5 },
  { x: 0,   z: 6,   w: 7,   d: 1 },
]

const GRID = 7
const BLOCK_H = 0.55
const BASE_H = 0.04
const COS30 = Math.cos(Math.PI / 6)
const SIN30 = 0.5
const PAD = 140
const MAX_ROT = 0.15
const LERP = 0.06
const CX = GRID / 2
const CZ = GRID / 2
const TILT_X = 0.22
const TILT_Y = -0.08

type Pt = { x: number; y: number }

function project(
  gx: number, gz: number, elev: number,
  rotX: number, rotY: number,
  scale: number, ox: number, oy: number,
): Pt {
  let x = gx - CX, y = elev, z = gz - CZ

  const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
  const rx = x * cosY - z * sinY
  const rz = x * sinY + z * cosY

  const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
  const ry = y * cosX - rz * sinX
  const rz2 = y * sinX + rz * cosX

  return {
    x: ox + (rx - rz2) * COS30 * scale,
    y: oy + (rx + rz2) * SIN30 * scale - ry * scale,
  }
}

function blockDepth(b: Block, rotX: number, rotY: number): number {
  const x = b.x + b.w / 2 - CX
  const z = b.z + b.d / 2 - CZ
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
  const rx = x * cosY - z * sinY
  const rz = x * sinY + z * cosY
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
  const rz2 = BASE_H * sinX + rz * cosX
  return rx + rz2
}

function fillPoly(ctx: CanvasRenderingContext2D, pts: Pt[], fill: string | CanvasGradient) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

function strokePoly(ctx: CanvasRenderingContext2D, pts: Pt[], stroke: string, lw: number) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.closePath()
  ctx.strokeStyle = stroke
  ctx.lineWidth = lw
  ctx.stroke()
}

function drawGlassBlock(
  ctx: CanvasRenderingContext2D,
  bx: number, bz: number, bw: number, bd: number,
  baseElev: number, height: number,
  rotX: number, rotY: number,
  scale: number, ox: number, oy: number,
) {
  const p = (x: number, z: number, e: number) =>
    project(x, z, e, rotX, rotY, scale, ox, oy)

  const tBack  = p(bx,      bz,      baseElev + height)
  const tRight = p(bx + bw, bz,      baseElev + height)
  const tFront = p(bx + bw, bz + bd, baseElev + height)
  const tLeft  = p(bx,      bz + bd, baseElev + height)

  const bRight = p(bx + bw, bz,      baseElev)
  const bFront = p(bx + bw, bz + bd, baseElev)
  const bLeft  = p(bx,      bz + bd, baseElev)

  const leftPts  = [tLeft, tFront, bFront, bLeft]
  const rightPts = [tRight, tFront, bFront, bRight]
  const topPts   = [tBack, tRight, tFront, tLeft]

  ctx.save()

  ctx.shadowColor = 'rgba(255, 255, 255, 0.6)'
  ctx.shadowBlur = 120

  fillPoly(ctx, leftPts,  'rgb(200, 200, 205)')
  fillPoly(ctx, rightPts, 'rgb(180, 180, 186)')
  fillPoly(ctx, topPts,   'rgb(235, 235, 240)')

  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'

  const hlGrad = ctx.createLinearGradient(tBack.x, tBack.y, tFront.x, tFront.y)
  hlGrad.addColorStop(0,   'rgba(255,255,255,0.35)')
  hlGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)')
  hlGrad.addColorStop(1,   'rgba(255,255,255,0)')
  fillPoly(ctx, topPts, hlGrad)

  strokePoly(ctx, leftPts,  'rgba(255, 255, 255, 0.5)', 0.8)
  strokePoly(ctx, rightPts, 'rgba(255, 255, 255, 0.4)', 0.8)
  strokePoly(ctx, topPts,   'rgba(255, 255, 255, 0.6)', 0.8)

  ctx.restore()
}

function drawBase(
  ctx: CanvasRenderingContext2D,
  rotX: number, rotY: number,
  scale: number, ox: number, oy: number,
) {
  const p = (x: number, z: number, e: number) =>
    project(x, z, e, rotX, rotY, scale, ox, oy)

  const tBack  = p(0, 0, BASE_H)
  const tRight = p(GRID, 0, BASE_H)
  const tFront = p(GRID, GRID, BASE_H)
  const tLeft  = p(0, GRID, BASE_H)
  const bRight = p(GRID, 0, 0)
  const bFront = p(GRID, GRID, 0)
  const bLeft  = p(0, GRID, 0)

  fillPoly(ctx, [tLeft, tFront, bFront, bLeft], 'rgba(255,255,255,0.08)')
  fillPoly(ctx, [tRight, tFront, bFront, bRight], 'rgba(255,255,255,0.06)')
  fillPoly(ctx, [tBack, tRight, tFront, tLeft], 'rgba(255,255,255,0.07)')
  strokePoly(ctx, [tBack, tRight, tFront, tLeft], 'rgba(255,255,255,0.12)', 0.5)
}

export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef(0)
  const mouseTarget = useRef({ x: 0, y: 0 })
  const mouseCurrent = useRef({ x: 0, y: 0 })

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
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
      mouseTarget.current.x = -ny * MAX_ROT
      mouseTarget.current.y =  nx * MAX_ROT
    }

    window.addEventListener('mousemove', onMouse)

    const startTime = performance.now()

    const draw = () => {
      const t       = (performance.now() - startTime) / 1000
      const scrollY = window.scrollY
      const floatY  = Math.sin(t * 0.6) * 8

      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * LERP
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * LERP
      const rX = mouseCurrent.current.x + TILT_X
      const rY = mouseCurrent.current.y + TILT_Y

      ctx.clearRect(-PAD, -PAD, W + PAD * 2, H + PAD * 2)

      if (W < 1 || H < 1) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const isoW = GRID * 2 * COS30
      const isoH = GRID + BLOCK_H + BASE_H
      const scale = Math.min(W * 1.1 / isoW, H * 0.92 / isoH)

      const ox = W / 2
      const oy = H / 2 + floatY - scrollY * 0.12

      const sorted = [...BLOCKS].sort(
        (a, b) => blockDepth(a, rX, rY) - blockDepth(b, rX, rY),
      )

      for (const b of sorted) {
        drawGlassBlock(
          ctx, b.x, b.z, b.w, b.d,
          BASE_H, BLOCK_H,
          rX, rY, scale, ox, oy,
        )
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouse)
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
