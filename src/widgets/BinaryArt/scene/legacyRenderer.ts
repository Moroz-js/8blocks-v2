import type { SceneRenderer, SceneSurface, SceneViewport } from './types'

const W = 1280, H = 800

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
export type SceneImage = ImageBitmap | HTMLImageElement
export type SceneFrame = (ctx: Context2D, elapsedMs: number) => void
export type SceneBuilder = (image: SceneImage | undefined, makeCanvas: () => SceneSurface) => SceneFrame

const makeCanvas = (): SceneSurface => typeof OffscreenCanvas !== 'undefined'
  ? new OffscreenCanvas(1, 1)
  : document.createElement('canvas')

/** Canvas 2D host for the 1280 × 800 scenes drawn in scene coordinates. */
export function createLegacyRenderer(canvas: SceneSurface, build: SceneBuilder, image?: SceneImage): SceneRenderer | null {
  const ctx = canvas.getContext('2d') as Context2D | null
  if (!ctx) return null
  const frame = build(image, makeCanvas)
  let sx = 1, sy = 1, offsetX = 0

  const resize = (viewport: SceneViewport) => {
    if (canvas.width !== viewport.width) canvas.width = viewport.width
    if (canvas.height !== viewport.height) canvas.height = viewport.height
    sx = viewport.sceneWidth / W
    sy = viewport.height / H
    offsetX = viewport.offsetX
  }
  const draw = (elapsedMs: number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(sx, 0, 0, sy, -offsetX, 0)
    frame(ctx, elapsedMs)
  }
  return { backend: '2d', draw, resize, dispose() { /* No external resources. */ } }
}
