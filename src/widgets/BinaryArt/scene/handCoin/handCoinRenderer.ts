import { cellH, cellW, glyphBars, H, W, hash, type HandCoinScene } from './handCoinScene'
import type { SceneRenderer, SceneSurface, SceneViewport } from '../types'

/** Compatibility renderer. Geometry, digit state and pixel rectangles are cached. */
export function createHandCoinRenderer(canvas: SceneSurface, scene: HandCoinScene): SceneRenderer | null {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  if (!ctx) return null
  const { cols, rows, kind, base, ringF, bgA, bgPhase, nzArr, digitPhase, palette, bgPal, LEVELS, BG_LEVELS } = scene
  let firstColumn = 0, lastColumn = cols
  const cycles = new Int32Array(cols * rows).fill(-1)
  const digits = new Uint8Array(cols * rows * 2)
  const rectangles = new Int32Array(cols * rows * 20)
  const buckets = Array.from({ length: LEVELS + 1 }, () => [[], []] as number[][])
  const bgBuckets = Array.from({ length: BG_LEVELS + 1 }, () => [[], []] as number[][])

  const resize = ({ width, height, sceneWidth, offsetX }: SceneViewport) => {
    if (canvas.width !== width) canvas.width = width
    if (canvas.height !== height) canvas.height = height
    ctx.imageSmoothingEnabled = false
    const sx = sceneWidth / W, sy = height / H
    firstColumn = Math.max(0, Math.floor(offsetX / sx / cellW))
    lastColumn = Math.min(cols, Math.ceil((offsetX + width) / sx / cellW))
    for (let gy = 0; gy < rows; gy++) for (let gx = firstColumn; gx < lastColumn; gx++) {
      const k = gy * cols + gx
      for (let shape = 0; shape < 5; shape++) {
        const [x, y, w, h] = glyphBars[shape]
        const left = Math.round((gx * cellW + x) * sx)
        const top = Math.round((gy * cellH + y) * sy)
        rectangles.set([left - offsetX, top,
          Math.max(1, Math.round((gx * cellW + x + w) * sx) - left),
          Math.max(1, Math.round((gy * cellH + y + h) * sy) - top)], k * 20 + shape * 4)
      }
    }
  }

  const add = (list: number[][][], level: number, k: number, d0: number, d1: number, mix: number) => {
    if (d0 === d1 || mix === 0) list[level][d0].push(k)
    else {
      const l1 = Math.round(level * (1 - mix)), l2 = Math.round(level * mix)
      if (l1) list[l1][d0].push(k)
      if (l2) list[l2][d1].push(k)
    }
  }
  const rect = (k: number, shape: number) => {
    const p = k * 20 + shape * 4
    ctx.rect(rectangles[p], rectangles[p + 1], rectangles[p + 2], rectangles[p + 3])
  }
  const flush = (list: number[][][], colors: string[]) => {
    for (let level = 0; level < list.length; level++) {
      const [zeros, ones] = list[level]
      if (!zeros.length && !ones.length) continue
      ctx.fillStyle = colors[level]
      ctx.beginPath()
      for (const k of ones) rect(k, 0)
      ctx.fill()
      ctx.beginPath()
      for (const k of zeros) { rect(k, 1); rect(k, 2) }
      ctx.fill()
      ctx.beginPath()
      for (const k of zeros) { rect(k, 3); rect(k, 4) }
      ctx.fill()
      zeros.length = 0
      ones.length = 0
    }
  }

  const draw = (now: number) => {
    const t = now / 1000 * 0.7, tf = t * 1.5 * 0.25, tw = t * 2.2, tb = t * 0.35
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let gy = 0; gy < rows; gy++) {
      const v0 = gy * cellH, rowWave = 0.6 * Math.sin(v0 * 0.02 + tw * 0.7)
      for (let gx = firstColumn; gx < lastColumn; gx++) {
        const k = gy * cols + gx, kd = kind[k], u0 = gx * cellW
        if (!kd) continue
        const ph = tf + digitPhase[k], kk = Math.floor(ph), f = ph - kk
        if (cycles[k] !== kk) {
          digits[k * 2] = hash(gx, gy, kk * 7) < 0.5 ? 0 : 1
          digits[k * 2 + 1] = hash(gx, gy, kk * 7 + 7) < 0.5 ? 0 : 1
          cycles[k] = kk
        }
        const d0 = digits[k * 2], d1 = digits[k * 2 + 1]
        let mix = f < 0.65 ? 0 : (f - 0.65) / 0.35
        mix = mix * mix * (3 - 2 * mix)
        if (kd === 3) {
          const field = 0.5 + 0.5 * Math.sin(u0 * 0.006 + tb + 0.8 * Math.sin(v0 * 0.004 - tb * 0.6))
            * (0.5 + 0.5 * Math.cos(v0 * 0.005 - tb * 0.8 + u0 * 0.002))
          const dens = 0.12 + 0.45 * field * field
          let al = bgA[k]
          if (nzArr[k] < dens) al = Math.max(al, 0.02 + 0.06 * field * (0.5 + 0.5 * Math.sin(bgPhase[k] + tb * 2)))
          if (al < 0.02) continue
          add(bgBuckets, Math.min(BG_LEVELS, Math.round(al / 0.3 * BG_LEVELS)), k, d0, d1, mix)
        } else {
          let lum = base[k]
          if (!ringF[k]) {
            const shm = 0.5 + 0.5 * Math.sin(u0 * 0.045 - tw * 2.2 + rowWave)
              * (0.6 + 0.4 * Math.sin(u0 * 0.012 + tw * 0.9 + v0 * 0.006))
            lum *= 0.7 + 0.8 * Math.pow(shm, 1.6)
          } else lum *= 1.5
          if (lum < 0.05) continue
          add(buckets, Math.round(Math.min(1, lum / 1.15) * LEVELS), k, d0, d1, mix)
        }
      }
    }
    flush(bgBuckets, bgPal)
    flush(buckets, palette)
  }
  return { backend: '2d', draw, resize, dispose() { /* No external resources. */ } }
}
