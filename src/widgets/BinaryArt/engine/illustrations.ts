// Card illustrations drawn by the Binary Engine: one entry per shape = engine props (project 2/binary-illustrations.js).
// Monochrome graphite renders on white; see docs/design-system-v2.md → BinaryArt.
import house3dBrushPng from './ill/ill-house3d-brush.webp'
import coinFrontPng from './ill/ill-coin-front.webp'
import coinstacksPng from './ill/ill-coinstacks.webp'
import trailPng from './ill/ill-trail.webp'
import target2Png from './ill/ill-target2.webp'
import puzzlePng from './ill/ill-puzzle.webp'
import gear2Png from './ill/ill-gear2.webp'
import barsPng from './ill/ill-bars.webp'
import barsweakPng from './ill/ill-barsweak.webp'
import dumpchartPng from './ill/ill-dumpchart.webp'
import bubblesPng from './ill/ill-bubbles.webp'
import bucketsPng from './ill/ill-buckets.webp'
import chainbreakPng from './ill/ill-chainbreak.webp'
import chaosPng from './ill/ill-chaos.webp'
import coinPng from './ill/ill-coin.webp'
import crackedcoinPng from './ill/ill-crackedcoin.webp'
import cranePng from './ill/ill-crane.webp'
import drainPng from './ill/ill-drain.webp'
import orbit2Png from './ill/ill-orbit2.webp'
import scalesPng from './ill/ill-scales.webp'
import teamPng from './ill/ill-team.webp'
import timelatePng from './ill/ill-timelate.webp'
import blueprintPng from './ill/ill-blueprint.webp'
import buoyPng from './ill/ill-buoy.webp'
import buysellPng from './ill/ill-buysell.webp'
import clockPng from './ill/ill-clock.webp'
import conceptsPng from './ill/ill-concepts.webp'
import magnifier2Png from './ill/ill-magnifier2.webp'
import deed2Png from './ill/ill-deed2.webp'
import docpagePng from './ill/ill-docpage.webp'
import filePng from './ill/ill-file.webp'
import flagPng from './ill/ill-flag.webp'
import gaugePng from './ill/ill-gauge.webp'
import hourglass2Png from './ill/ill-hourglass2.webp'
import kettlebellPng from './ill/ill-kettlebell.webp'
import misfitPng from './ill/ill-misfit.webp'
import padlock2Png from './ill/ill-padlock2.webp'
import playbtnPng from './ill/ill-playbtn.webp'
import plugoutPng from './ill/ill-plugout.webp'
import returnloopPng from './ill/ill-returnloop.webp'
import rocketpadPng from './ill/ill-rocketpad.webp'
import slabcrackPng from './ill/ill-slabcrack.webp'
import stairsPng from './ill/ill-stairs.webp'
import tagPng from './ill/ill-tag.webp'
import twinPng from './ill/ill-twin.webp'
import warn2Png from './ill/ill-warn2.webp'
import compassPng from './ill/ill-compass.webp'

export interface Illustration {
  src: string
  [prop: string]: unknown
}

export const ILLUSTRATIONS: Record<string, Illustration> = {
  housecube: { src: house3dBrushPng.src, weight: 0.3,sparkle: 0.1,reveal: 2.2,contrast: 3.4,tone: 0.52,edgeFeather: 0.6,punch: 0.8,detail: 1 },
  coinfront: { src: coinFrontPng.src, weight: 0.288,sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  coinstacks: { src: coinstacksPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  trail: { src: trailPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  target: { src: target2Png.src, weight: 0.242,sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  puzzle: { src: puzzlePng.src, sparkle: 0.1,bodyDim: 0.85,accents: [{type: "poly",photo: true,level: 1,pts: [[367,68],[339,76],[325,89],[318,101],[315,131],[322,149],[333,161],[332,170],[222,170],[222,280],[231,280],[243,269],[261,262],[291,265],[303,272],[317,287],[325,315],[317,343],[303,358],[291,365],[261,368],[243,361],[231,350],[222,350],[222,459],[332,459],[333,469],[322,481],[315,499],[318,529],[325,541],[339,554],[367,562],[395,554],[409,541],[416,529],[419,499],[412,481],[401,469],[401,460],[511,459],[511,350],[521,349],[533,360],[551,367],[581,364],[593,357],[606,343],[614,315],[606,287],[593,273],[581,266],[551,263],[533,270],[521,281],[512,281],[511,170],[402,170],[401,161],[412,149],[419,131],[416,101],[409,89],[395,76]]}],reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  gear: { src: gear2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  bars: { src: barsPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  barsweak: { src: barsweakPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  dumpchart: { src: dumpchartPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  bubbles: { src: bubblesPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  buckets: { src: bucketsPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  chainbreak: { src: chainbreakPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  chaos: { src: chaosPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  coin: { src: coinPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  crackedcoin: { src: crackedcoinPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  crane: { src: cranePng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  drain: { src: drainPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  orbit: { src: orbit2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  scales: { src: scalesPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  team: { src: teamPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  timelate: { src: timelatePng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  blueprint: { src: blueprintPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  buoy: { src: buoyPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  buysell: { src: buysellPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  clock: { src: clockPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  concepts: { src: conceptsPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  cube: { src: magnifier2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  deed: { src: deed2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  docpage: { src: docpagePng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  file: { src: filePng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  flag: { src: flagPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  gauge: { src: gaugePng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  hourglass: { src: hourglass2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  kettlebell: { src: kettlebellPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  misfit: { src: misfitPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  padlock: { src: padlock2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  playbtn: { src: playbtnPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  plugout: { src: plugoutPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  returnloop: { src: returnloopPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  rocketpad: { src: rocketpadPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  slabcrack: { src: slabcrackPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  stairs: { src: stairsPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  tag: { src: tagPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  twin: { src: twinPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  warn: { src: warn2Png.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
  compass: { src: compassPng.src, sparkle: 0.1,reveal: 2.2,contrast: 2.8,tone: 0.46,edgeFeather: 0.8,punch: 0.5,detail: 0.7 },
}

export const ILLUSTRATION_ALIASES: Record<string, string> = {"puzzlegap":"puzzle"}

export function findIllustration(shape: string): Illustration | null {
  return ILLUSTRATIONS[ILLUSTRATION_ALIASES[shape] ?? shape] ?? null
}
