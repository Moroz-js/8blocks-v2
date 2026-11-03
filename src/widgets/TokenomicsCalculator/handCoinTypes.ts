export type HandCoinSurface = HTMLCanvasElement | OffscreenCanvas

/** Buffer covers only visible columns; scale/offset retain the full scene's pixel grid. */
export type HandCoinViewport = {
  width: number
  height: number
  sceneWidth: number
  offsetX: number
}

export type HandCoinRenderer = {
  backend: 'webgl2' | '2d'
  draw: (elapsedMs: number) => void
  resize: (viewport: HandCoinViewport) => void
  dispose: () => void
}

export type HandCoinWorkerMessage =
  | { type: 'init'; canvas: OffscreenCanvas; src: string; viewport: HandCoinViewport; active: boolean; reducedMotion: boolean }
  | { type: 'viewport'; viewport: HandCoinViewport }
  | { type: 'activity'; active: boolean; reducedMotion: boolean }

export type HandCoinWorkerReply =
  | { type: 'ready'; backend: HandCoinRenderer['backend'] }
  | { type: 'error' }
