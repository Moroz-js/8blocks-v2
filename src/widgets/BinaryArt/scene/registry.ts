import { createLegacyRenderer, type SceneBuilder, type SceneImage } from './legacyRenderer'
import type { BinarySceneId, SceneRenderer, SceneSurface } from './types'

/** Reference photos the scenes are traced from; `null` scenes are fully procedural. */
export const SCENE_IMAGES: Record<BinarySceneId, string | null> = {
  'hand-coin': '/img/calculator/hand-reference.png',
  'coin-stacks': '/img/binary/coin-stacks.png',
  'hand-coins': '/img/binary/hand-coins.png',
  'light-bulb': '/img/binary/lightBulb.webp',
  'coin-pedestal': null,
  skyline: '/img/binary/skyline.png',
  profiles: '/img/binary/profiles.webp',
  'gold-coin': '/img/binary/goldCoin.webp',
  bulb: '/img/binary/bulb.webp',
  briefcase: '/img/binary/briefcase.webp',
  'broken-coin': '/img/binary/brokenCoin.webp',
  'way-file': '/img/binary/wayFile.webp',
  'way-scales': '/img/binary/wayScales.webp',
  'way-puzzle': '/img/binary/wayPuzzle.webp',
  brain: '/img/binary/brain.webp',
  shuttle: '/img/binary/shuttle.webp',
  'city-coins': '/img/binary/cityCoins.webp',
  office: '/img/binary/office.webp',
  unicorn: '/img/binary/unicorn.webp',
}

const builders: Record<Exclude<BinarySceneId, 'hand-coin'>, () => Promise<{ buildScene: SceneBuilder }>> = {
  'coin-stacks': () => import('./scenes/coinStacks.js'),
  'hand-coins': () => import('./scenes/handCoins.js'),
  'light-bulb': () => import('./scenes/lightBulb.js'),
  'coin-pedestal': () => import('./scenes/coinPedestal.js'),
  skyline: () => import('./scenes/skyline.js'),
  profiles: () => import('./scenes/profiles.js'),
  'gold-coin': () => import('./scenes/goldCoin.js'),
  bulb: () => import('./scenes/bulb.js'),
  briefcase: () => import('./scenes/briefcase.js'),
  'broken-coin': () => import('./scenes/brokenCoin.js'),
  'way-file': () => import('./scenes/wayFile.js'),
  'way-scales': () => import('./scenes/wayScales.js'),
  'way-puzzle': () => import('./scenes/wayPuzzle.js'),
  brain: () => import('./scenes/brain.js'),
  shuttle: () => import('./scenes/shuttle.js'),
  'city-coins': () => import('./scenes/cityCoins.js'),
  office: () => import('./scenes/office.js'),
  unicorn: () => import('./scenes/unicorn.js'),
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
