import { createLegacyRenderer, type SceneBuilder, type SceneImage } from './legacyRenderer'
import type { BinarySceneId, SceneRenderer, SceneSurface } from './types'

/** Reference photos the scenes are traced from; `null` scenes are fully procedural. */
export const SCENE_IMAGES: Record<BinarySceneId, string | null> = {
  'hand-coin': '/img/calculator/hand-reference.png',
  'coin-stacks': '/img/binary/coin-stacks.png',
  'hand-coins': '/img/binary/hand-coins.png',
  'light-bulb': '/img/binary/light-bulb.png',
  'coin-pedestal': null,
  skyline: '/img/binary/skyline.png',
}

const builders: Record<Exclude<BinarySceneId, 'hand-coin'>, () => Promise<{ buildScene: SceneBuilder }>> = {
  'coin-stacks': () => import('./scenes/coinStacks.js'),
  'hand-coins': () => import('./scenes/handCoins.js'),
  'light-bulb': () => import('./scenes/lightBulb.js'),
  'coin-pedestal': () => import('./scenes/coinPedestal.js'),
  skyline: () => import('./scenes/skyline.js'),
}

/** Prefers WebGL where a scene has a GPU renderer, otherwise Canvas 2D. */
export async function createSceneRenderer(
  id: BinarySceneId,
  canvas: SceneSurface,
  image: SceneImage | undefined,
  gpu: boolean,
): Promise<SceneRenderer | null> {
  if (id === 'hand-coin') {
    const [{ createHandCoinScene }, { createHandCoinRenderer }, webgl] = await Promise.all([
      import('./handCoin/handCoinScene'),
      import('./handCoin/handCoinRenderer'),
      gpu ? import('./handCoin/handCoinWebGL') : null,
    ])
    const scene = createHandCoinScene(image)
    return webgl?.createHandCoinWebGL(canvas, scene) ?? createHandCoinRenderer(canvas, scene)
  }
  const { buildScene } = await builders[id]()
  return createLegacyRenderer(canvas, buildScene, image)
}
