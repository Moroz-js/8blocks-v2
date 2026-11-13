// Bubble packing from the designer's mockup: the largest share sits bottom-right,
// the rest pack around it in a 367 × 400 frame.

export interface Bubble {
  label: string
  percent: string
  x: number
  y: number
  d: number
  glow: number
  fontSize: number
  labelSize: number
  showLabel: boolean
}

const W = 367
const H = 400
const GAP = 8

export const BUBBLE_FRAME = { width: W, height: H }

export function packBubbles(buckets: readonly { label: string; percent: number }[]): Bubble[] {
  const maxp = Math.max(...buckets.map((b) => b.percent))
  let placed: { l: string; v: number; r: number; x: number; y: number }[] = []
  let R = 116
  for (let attempt = 0; attempt < 14; attempt++, R *= 0.92) {
    const items = buckets
      .map((b) => ({ l: b.label, v: b.percent, r: Math.max(22, Math.pow(b.percent / maxp, 0.8) * R), x: 0, y: 0 }))
      .sort((a, b) => b.v - a.v)
    const cx0 = W - items[0].r - 8
    const cy0 = Math.min(H - items[0].r - 8, H / 2 + 50)
    placed = []
    let fail = false
    for (let k = 0; k < items.length; k++) {
      const it = items[k]
      if (k === 0) {
        it.x = cx0
        it.y = cy0
        placed.push(it)
        continue
      }
      let best: [number, number] | null = null
      let bd = Infinity
      for (let y = it.r; y <= H - it.r; y += 3) {
        for (let x = it.r; x <= W - it.r; x += 3) {
          let ok = true
          for (const q of placed) {
            const dx = q.x - x
            const dy = q.y - y
            if (dx * dx + dy * dy < (q.r + it.r + GAP) ** 2) {
              ok = false
              break
            }
          }
          if (!ok) continue
          const d = (x - cx0) ** 2 + (y - cy0) ** 2
          if (d < bd) {
            bd = d
            best = [x, y]
          }
        }
      }
      if (!best) {
        fail = true
        break
      }
      it.x = best[0]
      it.y = best[1]
      placed.push(it)
    }
    if (!fail) break
  }

  // Rounded so server and client render identical style strings.
  const round = (value: number) => Math.round(value * 10) / 10
  return placed.map((it) => {
    const percent = `${Math.round(it.v * 100) / 100}%`
    return {
      label: it.l,
      percent,
      x: round(it.x - it.r),
      y: round(it.y - it.r),
      d: round(it.r * 2),
      glow: round(Math.max(6, it.r * 0.28)),
      fontSize: round(Math.min(76, Math.max(11, it.r * (percent.length > 5 ? 0.5 : 0.62)))),
      labelSize: round(Math.max(8, Math.min(11, it.r * 0.13))),
      showLabel: it.r >= 34,
    }
  })
}
