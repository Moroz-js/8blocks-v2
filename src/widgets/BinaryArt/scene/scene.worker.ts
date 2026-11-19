import { createSceneRenderer } from './registry'
import type { SceneRenderer, SceneViewport, SceneWorkerMessage, SceneWorkerReply } from './types'

// Avoid mixing DOM and WebWorker global lib declarations in the app's tsconfig.
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<SceneWorkerMessage>) => void) | null
  postMessage: (message: SceneWorkerReply) => void
  requestAnimationFrame?: (callback: (now: number) => void) => number
  cancelAnimationFrame?: (id: number) => void
  setTimeout: (callback: () => void, delay: number) => number
  clearTimeout: (id: number) => void
}
let renderer: SceneRenderer | null = null
let viewport: SceneViewport
let active = false, reducedMotion = false, frame = 0
let lastDraw = -Infinity
const startedAt = performance.now()
const interval = 1000 / 30

function stop() {
  if (scope.requestAnimationFrame) scope.cancelAnimationFrame?.(frame)
  else scope.clearTimeout(frame)
  frame = 0
}
function draw(now: number) {
  if (!renderer || !active) return
  const delta = now - lastDraw
  if (reducedMotion || delta >= interval - 0.5) {
    renderer.draw(reducedMotion ? 0 : now - startedAt)
    lastDraw = Number.isFinite(delta)
      ? lastDraw + Math.max(1, Math.floor((delta + 0.5) / interval)) * interval
      : now
  }
  if (!reducedMotion) frame = scope.requestAnimationFrame
    ? scope.requestAnimationFrame(draw)
    : scope.setTimeout(() => draw(performance.now()), interval)
}
function play() {
  stop()
  lastDraw = -Infinity
  draw(performance.now())
}

scope.onmessage = async ({ data }) => {
  if (data.type === 'activity') {
    active = data.active
    reducedMotion = data.reducedMotion
    play()
  } else if (data.type === 'viewport') {
    viewport = data.viewport
    renderer?.resize(viewport)
    play()
  } else {
    viewport = data.viewport
    active = data.active
    reducedMotion = data.reducedMotion
    let image: ImageBitmap | undefined
    try {
      if (data.src) try {
        const response = await fetch(data.src)
        if (response.ok) image = await createImageBitmap(await response.blob())
      } catch { /* Scenes keep their procedural fallback if the photo is unavailable. */ }
      renderer = await createSceneRenderer(data.scene, data.canvas, image, true)
      image?.close()
      image = undefined
      if (!renderer) throw new Error('No canvas renderer')
      data.canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault()
        stop()
        scope.postMessage({ type: 'error' })
      })
      renderer.resize(viewport)
      play()
      scope.postMessage({ type: 'ready', backend: renderer.backend })
    } catch {
      image?.close()
      stop()
      renderer?.dispose()
      scope.postMessage({ type: 'error' })
    }
  }
}
