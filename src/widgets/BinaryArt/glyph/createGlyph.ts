import { BANG, COIN8, DEED_HI, HANDS, hash, NEEDLE, NONE, SHAPES, TARGET_HI } from './shapes'

type ShapeFn = (x: number, y: number) => number
type HighlightFn = (x: number, y: number) => boolean

export type GlyphOptions = {
  shape: string
  /** Shape centre, share of width / height. */
  ox?: number
  oy?: number
  /** Shape scale. */
  os?: number
  /** Cell width, px. */
  grid?: number
}

export type Glyph = { draw: (elapsedMs: number) => void }

const shapes = SHAPES as Record<string, ShapeFn>
const highlights: Record<string, HighlightFn> = {
  clock: HANDS, coin: COIN8, gauge: NEEDLE, warn: BANG, target: TARGET_HI, deed: DEED_HI,
}

const LEVELS = 40
const BG_LEVELS = 10
const palette = Array.from({ length: LEVELS + 1 }, (_, i) => `rgba(255,255,255,${(0.03 + 0.97 * Math.pow(i / LEVELS, 2.1)).toFixed(3)})`)
const bgPalette = Array.from({ length: BG_LEVELS + 1 }, (_, i) => `rgba(255,255,255,${(0.28 * i / BG_LEVELS).toFixed(3)})`)

/**
 * White binary-digit relief icon (port of project/binary-glyph-wide.js).
 * Lighting is computed once per size; a frame only re-buckets visible cells and
 * fills one path per brightness level instead of a rectangle per stroke.
 */
export function createGlyph(ctx: CanvasRenderingContext2D, W: number, H: number, options: GlyphOptions): Glyph {
  const cellW = options.grid ?? 3.2, cellH = cellW * 1.25
  const cols = Math.ceil(W / cellW), rows = Math.ceil(H / cellH), N = cols * rows
  const fn = shapes[options.shape] ?? shapes.ring
  const half = Math.min(W, H) / 2 * 0.92 * (options.os ?? 1)
  const cx = W * (options.ox ?? 0.5), cy = H * (options.oy ?? 0.5)

  const depth = new Float32Array(N)
  for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
    const z = fn((gx * cellW + cellW / 2 - cx) / half, (gy * cellH + cellH / 2 - cy) / half)
    depth[gy * cols + gx] = z === NONE ? Infinity : -z * half
  }
  const D = (gx: number, gy: number) => (gx < 0 || gy < 0 || gx >= cols || gy >= rows) ? Infinity : depth[gy * cols + gx]
  const fadeR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) / half
  const bgFade = new Float32Array(N), edgeA = new Uint8Array(N), hiA = new Uint8Array(N)
  const kind = new Uint8Array(N), base = new Float32Array(N), bgA = new Float32Array(N), ph = new Float32Array(N)
  for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
    const k = gy * cols + gx, z = depth[k], nz = hash(gx, gy, 99)
    ph[k] = hash(gx, gy, 5) * 6.2832
    if (z === Infinity) {
      const gd = Math.hypot(gx * cellW - cx, gy * cellH - cy) / half
      bgFade[k] = 0.45 + 0.55 * Math.pow(Math.max(0, 1 - gd / fadeR), 1.2)
      bgA[k] = nz < 0.06 ? 0.08 + 0.2 * hash(gx, gy, 17) : 0
      kind[k] = bgA[k] ? 2 : 0
      continue
    }
    const zl = D(gx - 1, gy), zr = D(gx + 1, gy), zu = D(gx, gy - 1), zd = D(gx, gy + 1)
    const dzx = (zl === Infinity || zr === Infinity) ? 30 : (zr - zl) / (2 * cellW)
    const dzy = (zu === Infinity || zd === Infinity) ? 30 : (zd - zu) / (2 * cellH)
    const len = Math.sqrt(1 + dzx * dzx + dzy * dzy), nzv = 1 / len
    const lamRaw = (0.6 * dzx + 0.6 * dzy + 0.5) / len, lam = Math.max(0.08, lamRaw), spec = Math.pow(Math.max(0, lamRaw), 6)
    let ao = 0
    const nb = [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1], [-1, 1], [1, -1]]
    for (const [dx, dy] of nb) {
      const zq = D(gx + dx, gy + dy)
      if (zq !== Infinity) ao += Math.min(1, Math.max(0, (z + dzx * dx * cellW + dzy * dy * cellH - zq) / 8))
    }
    ao /= nb.length
    edgeA[k] = zl === Infinity || zr === Infinity || zu === Infinity || zd === Infinity ? 1 : 0
    const shade = 0.02 + 1.2 * Math.pow(lam, 1.5) + 0.8 * spec - 1.1 * ao - 0.3 * Math.pow(1 - nzv, 2)
    base[k] = Math.max(0.06, Math.min(1.3, shade)) * (0.96 + 0.08 * nz)
    kind[k] = 1
  }
  const smooth = new Float32Array(base)
  for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
    const k = gy * cols + gx
    if (kind[k] !== 1) continue
    let s = 0, n = 0
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = gx + dx, yy = gy + dy
      if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue
      const kk = yy * cols + xx
      if (kind[kk] !== 1) continue
      const w = dx || dy ? 1 : 2
      s += smooth[kk] * w
      n += w
    }
    base[k] = s / n
  }
  for (let k = 0; k < N; k++) if (kind[k] === 1 && edgeA[k]) base[k] = Math.max(base[k], 1.15)
  const hiFn = highlights[options.shape]
  if (hiFn) for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
    const k = gy * cols + gx
    if (kind[k] === 1 && hiFn((gx * cellW + cellW / 2 - cx) / half, (gy * cellH + cellH / 2 - cy) / half)) hiA[k] = 1
  }

  // Only cells that can ever draw, with their glyph strokes precomputed.
  const live = Int32Array.from(Array.from({ length: N }, (_, k) => k).filter(k => kind[k]))
  const gw = Math.max(2, cellW * 0.62), gh = Math.max(3, cellH * 0.72), sw = Math.max(1, cellW * 0.22)
  const ox = (cellW - gw) / 2, oy = (cellH - gh) / 2
  const phase0 = new Float32Array(N), cycle = new Int32Array(N).fill(-1), digits = new Uint8Array(N * 2)
  for (const k of live) phase0[k] = hash(k % cols, (k / cols) | 0, 0)
  const buckets = Array.from({ length: LEVELS + 1 }, () => [[], []] as number[][])
  const bgBuckets = Array.from({ length: BG_LEVELS + 1 }, () => [[], []] as number[][])

  const push = (list: number[][][], level: number, k: number, d0: number, d1: number, mix: number) => {
    if (d0 === d1 || mix === 0) list[level][d0].push(k)
    else {
      const l1 = Math.round(level * (1 - mix)), l2 = Math.round(level * mix)
      if (l1) list[l1][d0].push(k)
      if (l2) list[l2][d1].push(k)
    }
  }
  const flush = (list: number[][][], colors: string[]) => {
    for (let level = 0; level < list.length; level++) {
      const [zeros, ones] = list[level]
      if (!zeros.length && !ones.length) continue
      ctx.fillStyle = colors[level]
      ctx.beginPath()
      for (const k of ones) {
        const x = (k % cols) * cellW + ox, y = ((k / cols) | 0) * cellH + oy
        ctx.rect(x + (gw - sw) / 2, y, sw, gh)
      }
      for (const k of zeros) {
        const x = (k % cols) * cellW + ox, y = ((k / cols) | 0) * cellH + oy
        ctx.rect(x, y, gw, sw)
        ctx.rect(x, y + gh - sw, gw, sw)
        ctx.rect(x, y + sw, sw, gh - 2 * sw)
        ctx.rect(x + gw - sw, y + sw, sw, gh - 2 * sw)
      }
      ctx.fill()
      zeros.length = 0
      ones.length = 0
    }
  }

  return {
    draw(elapsedMs) {
      const t = elapsedMs / 1000 * 0.7, tf = t * 0.375, tw = t * 2.2, tb = t * 0.35
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < live.length; i++) {
        const k = live[i], gy = (k / cols) | 0, gx = k - gy * cols
        const u0 = gx * cellW, v0 = gy * cellH
        const p = tf + phase0[k], kk = Math.floor(p), f = p - kk
        if (cycle[k] !== kk) {
          cycle[k] = kk
          digits[k * 2] = hash(gx, gy, kk * 7) < 0.5 ? 0 : 1
          digits[k * 2 + 1] = hash(gx, gy, kk * 7 + 7) < 0.5 ? 0 : 1
        }
        const d0 = digits[k * 2], d1 = digits[k * 2 + 1]
        let mix = f < 0.65 ? 0 : (f - 0.65) / 0.35
        mix = mix * mix * (3 - 2 * mix)
        if (kind[k] === 2) {
          const al = bgA[k] * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ph[k] + tb * 3))) * bgFade[k] * 0.3
          if (al < 0.012) continue
          push(bgBuckets, Math.min(BG_LEVELS, Math.round(al / 0.28 * BG_LEVELS)), k, d0, d1, mix)
          continue
        }
        const rowWave = 0.6 * Math.sin(v0 * 0.02 + tw * 0.7)
        const shm = 0.5 + 0.5 * Math.sin(u0 * 0.045 - tw * 2.2 + rowWave) * (0.6 + 0.4 * Math.sin(u0 * 0.012 + tw * 0.9 + v0 * 0.006))
        const lum = hiA[k] ? 1.3 : base[k] * (0.55 + 0.9 * Math.pow(shm, 1.8))
        if (lum < 0.03) continue
        push(buckets, Math.round(Math.min(1, lum / 1.2) * LEVELS), k, d0, d1, mix)
      }
      flush(bgBuckets, bgPalette)
      flush(buckets, palette)
    },
  }
}
