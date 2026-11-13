export type SceneSurface = HTMLCanvasElement | OffscreenCanvas

export type BinarySceneId =
  | 'hand-coin'
  | 'coin-stacks'
  | 'hand-coins'
  | 'light-bulb'
  | 'coin-pedestal'
  | 'skyline'
  | 'profiles'
  | 'gold-coin'
  | 'bulb'
  | 'briefcase'
  | 'broken-coin'
  | 'way-file'
  | 'way-scales'
  | 'way-puzzle'
  | 'brain'
  | 'shuttle'
  | 'city-coins'
  | 'office'
  | 'unicorn'

/** Buffer covers only visible columns; scale/offset retain the full scene's pixel grid. */
export type SceneViewport = {
  width: number
  height: number
  sceneWidth: number
  offsetX: number
}

export type SceneRenderer = {
  backend: 'webgl2' | '2d'
  draw: (elapsedMs: number) => void
  resize: (viewport: SceneViewport) => void
  dispose: () => void
}

export type SceneWorkerMessage =
  | {
    type: 'init'
    scene: BinarySceneId
    canvas: OffscreenCanvas
    src: string | null
    viewport: SceneViewport
    active: boolean
    reducedMotion: boolean
  }
  | { type: 'viewport'; viewport: SceneViewport }
  | { type: 'activity'; active: boolean; reducedMotion: boolean }

export type SceneWorkerReply =
  | { type: 'ready'; backend: SceneRenderer['backend'] }
  | { type: 'error' }
