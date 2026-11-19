// One requestAnimationFrame loop for every visible binary illustration on the
// page, capped at 30 fps and paused while the tab is hidden.
type Subscriber = (elapsedMs: number) => void

const INTERVAL = 1000 / 30
const subscribers = new Set<Subscriber>()
const startedAt = typeof performance !== 'undefined' ? performance.now() : 0
let frame = 0
let lastDraw = -Infinity

function tick(now: number) {
  frame = 0
  if (!subscribers.size || document.hidden) return
  if (now - lastDraw >= INTERVAL - 0.5) {
    lastDraw = now
    subscribers.forEach(draw => draw(now - startedAt))
  }
  frame = requestAnimationFrame(tick)
}

function start() {
  if (!frame && subscribers.size && !document.hidden) frame = requestAnimationFrame(tick)
}

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', start)

export function subscribe(draw: Subscriber) {
  subscribers.add(draw)
  start()
  return () => {
    subscribers.delete(draw)
    if (!subscribers.size && frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

export function elapsed() {
  return performance.now() - startedAt
}
