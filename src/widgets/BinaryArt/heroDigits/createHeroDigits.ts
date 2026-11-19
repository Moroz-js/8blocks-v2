// Port of the designer's project/hero-digits.js: under the pointer, a survey quad
// snaps to the photo's relief and fills with dim digits. The photo is analysed
// once per size; frames run only while the pointer is over the image or the
// overlay is still fading out.

type Cell = { x: number; y: number; ch: string; w: number; m: number }
type Point = [number, number]

const COL = 6 // edge-map column pitch, px
const GLYPHS = '822002802208'
const DIGIT_FONT = "500 9px ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace"
const LABEL_FONT = "500 11px ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace"

export type HeroDigitsOptions = { step?: number }

export function createHeroDigits(canvas: HTMLCanvasElement, image: HTMLImageElement, { step = 11 }: HeroDigitsOptions = {}) {
  const ctx = canvas.getContext('2d')!
  let w = 0, h = 0
  let cells: Cell[] = []
  let edges: number[][] | null = null, vEdges: number[][] | null = null
  const m = { x: -999, y: -999 }, target = { x: -999, y: -999 }
  let hover = 0, active = false, raf = 0
  let p: { x: number; y: number; x2: number; y2: number } | null = null
  let roll = -Infinity, label = { w1: 220, h1: 70, text: '' }
  const smooth: Record<string, number | undefined> = {}

  const luminance = (scale: number) => {
    const off = document.createElement('canvas')
    off.width = Math.max(1, Math.round(w * scale))
    off.height = Math.max(1, Math.round(h * scale))
    const c = off.getContext('2d', { willReadFrequently: true })!
    // object-fit: cover, centred — the same crop the page shows.
    const nw = image.naturalWidth, nh = image.naturalHeight
    const k = Math.max(w / nw, h / nh) * scale
    c.drawImage(image, (off.width - nw * k) / 2, (off.height - nh * k) / 2, nw * k, nh * k)
    const { width: W, height: H } = off
    const d = c.getImageData(0, 0, W, H).data
    const L = new Float32Array(W * H)
    for (let i = 0, n = W * H; i < n; i++) L[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) / 255
    return { L, W, H }
  }

  const buildEdges = () => {
    const s = 0.25
    const { L, W, H } = luminance(s)
    edges = []
    for (let ci = 0, cols = Math.ceil(w / COL) + 1; ci < cols; ci++) {
      const px = Math.min(W - 1, Math.round(ci * COL * s)), list: number[] = []
      for (let y = 3; y < H - 3; y++) {
        const g = Math.abs(L[(y + 2) * W + px] - L[(y - 2) * W + px])
        const gp = Math.abs(L[(y + 1) * W + px] - L[(y - 3) * W + px])
        const gn = Math.abs(L[(y + 3) * W + px] - L[(y - 1) * W + px])
        if (g > 0.055 && g >= gp && g >= gn) list.push(y / s)
      }
      edges.push(list)
    }
    vEdges = []
    for (let ri = 0, rows = Math.ceil(h / COL) + 1; ri < rows; ri++) {
      const py = Math.min(H - 1, Math.round(ri * COL * s)), list: number[] = []
      for (let x = 3; x < W - 3; x++) {
        const g = Math.abs(L[py * W + x + 2] - L[py * W + x - 2])
        const gp = Math.abs(L[py * W + x + 1] - L[py * W + x - 3])
        const gn = Math.abs(L[py * W + x + 3] - L[py * W + x - 1])
        if (g > 0.055 && g >= gp && g >= gn) list.push(x / s)
      }
      vEdges.push(list)
    }
  }

  // Textured structure keeps digits, flat sky drops them.
  const buildMask = () => {
    const s = 0.3
    const { L, W, H } = luminance(s)
    const E = new Float32Array(W * H)
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x
      E[i] = Math.abs(L[i + 1] - L[i - 1]) + Math.abs(L[i + W] - L[i - W])
    }
    const rad = Math.max(2, Math.round(step * s))
    for (const cell of cells) {
      const cx = Math.round(cell.x * s), cy = Math.round(cell.y * s)
      let e = 0
      for (let y = Math.max(1, cy - rad); y <= Math.min(H - 2, cy + rad); y++)
        for (let x = Math.max(1, cx - rad); x <= Math.min(W - 2, cx + rad); x++) e = Math.max(e, E[y * W + x])
      cell.m = Math.min(1, Math.max(0, (e - 0.045) / 0.1))
    }
    const byKey = new Map(cells.map((cell, i) => [`${Math.round(cell.x)}:${Math.round(cell.y)}`, i]))
    const prev = cells.map(cell => cell.m)
    cells.forEach((cell, i) => {
      let mx = prev[i]
      for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
        const nb = byKey.get(`${Math.round(cell.x + dx)}:${Math.round(cell.y + dy)}`)
        if (nb !== undefined) mx = Math.max(mx, prev[nb] * 0.72)
      }
      cell.m = mx
    })
  }

  const snapY = (x: number, refY: number) => {
    if (!edges) return refY
    const list = edges[Math.max(0, Math.min(edges.length - 1, Math.round(x / COL)))]
    if (!list?.length) return refY
    let best = refY, bd = 1e9
    for (const y of list) { const dd = Math.abs(y - refY); if (dd < bd) { bd = dd; best = y } }
    return bd > 70 ? refY : best
  }
  const snapX = (y: number, refX: number, dir: number) => {
    if (!vEdges) return refX
    const list = vEdges[Math.max(0, Math.min(vEdges.length - 1, Math.round(y / COL)))]
    if (!list?.length) return refX
    let best = refX, bd = 1e9
    for (const x of list) {
      if ((dir < 0 && x > refX) || (dir > 0 && x < refX)) continue
      const dd = Math.abs(x - refX)
      if (dd < bd) { bd = dd; best = x }
    }
    return bd > 120 ? refX : best
  }
  const lerp = (key: string, t: number, v: number) => (smooth[key] = smooth[key] == null ? v : smooth[key]! + (v - smooth[key]!) * t)
  const clamp = (v: number, ref: number, d: number) => Math.max(ref - d, Math.min(ref + d, v))

  // Left/right sides sit on facade edges, each corner on its own relief break.
  const quad = (x0: number, qw: number, qh: number, refY: number): Point[] => {
    const L0 = lerp('bL', 0.05, snapX(refY + qh * 0.5, x0, -1))
    const R0raw = lerp('bR', 0.05, snapX(refY + qh * 0.5, x0 + qw, 1))
    const R0 = L0 + Math.max(110, Math.min(360, R0raw - L0))
    const tyL = snapY(L0, refY), tyR = snapY(R0, refY)
    const byL = snapY(L0, refY + qh), byR = snapY(R0, refY + qh)
    const yTL = lerp('ytl', 0.05, tyL)
    const yTR = lerp('ytr', 0.05, clamp(tyR, tyL, 30))
    const yBL = lerp('ybl', 0.05, Math.max(byL, tyL + qh * 0.7))
    const yBR = lerp('ybr', 0.05, clamp(Math.max(byR, tyR + qh * 0.7), Math.max(byL, tyL + qh * 0.7), 30))
    return [[L0, yTL], [R0, yTR], [R0, yBR], [L0, yBL]]
  }

  const draw = (now: number) => {
    ctx.clearRect(0, 0, w, h)
    if (!p) p = { x: m.x, y: m.y, x2: m.x, y2: m.y }
    if (now - roll > 2600) {
      roll = now
      const rnd = (a: number, b: number) => a + Math.random() * (b - a)
      label = { w1: Math.round(rnd(190, 260)), h1: Math.round(rnd(58, 82)), text: '$' + Math.round(rnd(120000, 985000)).toLocaleString('en-US') }
    }
    p.x += (m.x - p.x) * 0.07; p.y += (m.y - p.y) * 0.07
    p.x2 += (p.x - p.x2) * 0.035; p.y2 += (p.y - p.y2) * 0.035
    const q = quad(p.x2 - label.w1 * 0.62, label.w1, label.h1, p.y2)
    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(255,255,255,${(0.42 * hover).toFixed(3)})`
    ctx.beginPath()
    ctx.moveTo(q[0][0], q[0][1])
    for (let i = 1; i < 4; i++) ctx.lineTo(q[i][0], q[i][1])
    ctx.closePath()
    ctx.stroke()

    const inside = (x: number, y: number) => {
      let ins = false
      for (let i = 0, j = 3; i < 4; j = i++) {
        const [xi, yi] = q[i], [xj, yj] = q[j]
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins
      }
      return ins
    }
    const minX = Math.min(q[0][0], q[3][0]), maxX = Math.max(q[1][0], q[2][0])
    const minY = Math.min(q[0][1], q[1][1]), maxY = Math.max(q[2][1], q[3][1])
    ctx.font = DIGIT_FONT
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const cell of cells) {
      if (cell.x < minX || cell.x > maxX || cell.y < minY || cell.y > maxY || cell.m < 0.22 || !inside(cell.x, cell.y)) continue
      const a = 0.5 * cell.w * hover * cell.m
      if (a < 0.012) continue
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
      ctx.fillText(cell.ch, cell.x, cell.y)
    }
    ctx.fillStyle = `rgba(255,255,255,${(0.62 * hover).toFixed(3)})`
    ctx.font = LABEL_FONT
    ctx.textAlign = 'left'
    ctx.fillText(label.text, q[0][0], q[0][1] - 10)
  }

  const loop = (now: number) => {
    hover += ((active ? 1 : 0) - hover) * 0.07
    if (hover < 0.004 && !active) {
      ctx.clearRect(0, 0, w, h)
      raf = 0
      return
    }
    m.x += (target.x - m.x) * 0.16
    m.y += (target.y - m.y) * 0.16
    draw(now)
    raf = requestAnimationFrame(loop)
  }

  return {
    resize(width: number, height: number) {
      w = width; h = height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cells = []
      for (let r = 0, rows = Math.ceil(h / step) + 1; r < rows; r++)
        for (let c = 0, cols = Math.ceil(w / step) + 1; c < cols; c++)
          cells.push({ x: c * step + (r % 2 ? step * 0.5 : 0), y: r * step, ch: GLYPHS[(c * 7 + r * 3) % GLYPHS.length], w: 0.5 + 0.5 * Math.sin(c * 1.7 + r * 2.3), m: 1 })
      if (!image.naturalWidth) return
      try { buildEdges(); buildMask() } catch { edges = vEdges = null }
    },
    pointer(x: number, y: number, isInside: boolean) {
      active = isInside
      if (isInside) { target.x = x; target.y = y }
      if (!raf && (active || hover >= 0.004)) raf = requestAnimationFrame(loop)
    },
    dispose() { cancelAnimationFrame(raf) },
  }
}
