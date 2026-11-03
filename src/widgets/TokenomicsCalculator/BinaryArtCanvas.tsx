'use client'

import { useEffect, useRef } from 'react'
import styles from './TokenomicsCalculator.module.scss'

type Digit = {
  x: number
  y: number
  ch: 0 | 1
  shade: number
  opacity: number
}

const SHADES = 64
const BANDS = 64
const MAX_DPR = 1.5

/*
 * Live binary rendering of a picture, in the spirit of the Tokenomics AI
 * unicorn: the source is sampled into a grid of 0/1 glyphs that flip and catch
 * a slow diagonal light sweep. The source art is already binary (Figma
 * «image 1926990484»), so it is downsampled as a brightness map and redrawn
 * with live glyphs.
 *
 * Cost per frame stays flat: all glyphs are painted once into an offscreen
 * base layer; a frame blits that layer and redraws only the glyphs inside the
 * sweep band. Flips repaint single cells of the base layer. Reduced motion
 * draws the base layer once.
 */
export function BinaryArtCanvas({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !container || !context) return

    const source = new Image()
    const sampling = document.createElement('canvas')
    const atlas = document.createElement('canvas')
    const base = document.createElement('canvas')
    const baseContext = base.getContext('2d')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let digits: Digit[] = []
    // Digits grouped by diagonal position, so the sweep touches only its band.
    let bands: Digit[][] = []
    let width = 0
    let height = 0
    let dpr = 0
    let tile = 0
    let cell = 0
    let frame = 0
    let mutationTimer = 0
    let lastDraw = -Infinity
    let visible = false
    let ready = false
    let disposed = false

    const glyph = (target: CanvasRenderingContext2D, digit: Digit, shade: number, alpha: number) => {
      const size = tile / dpr
      target.globalAlpha = alpha
      target.drawImage(atlas, digit.ch * tile, shade * tile, tile, tile, digit.x - size / 2, digit.y - size / 2, size, size)
    }

    const paintBase = () => {
      if (!baseContext) return
      baseContext.setTransform(dpr, 0, 0, dpr, 0, 0)
      baseContext.clearRect(0, 0, width, height)
      for (const digit of digits) glyph(baseContext, digit, digit.shade, digit.opacity)
      baseContext.globalAlpha = 1
    }

    const draw = (now: number) => {
      if (!motion.matches && now - lastDraw < 1000 / 30) {
        if (visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw)
        return
      }
      lastDraw = now
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(base, 0, 0)
      if (!motion.matches) {
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        // Light sweep travels along the diagonal every ~7 s.
        const sweep = ((now / 7000) % 1) * 1.6 - 0.3
        const from = Math.max(0, Math.floor((sweep - 0.08) * BANDS))
        const to = Math.min(BANDS - 1, Math.floor((sweep + 0.08) * BANDS))
        for (let band = from; band <= to; band++) {
          for (const digit of bands[band]) {
            const position = (digit.x / width + digit.y / height) / 2
            const glow = 1 - Math.abs(position - sweep) / 0.08
            if (glow <= 0) continue
            glyph(context, digit, Math.min(SHADES - 1, digit.shade + Math.round(glow * 18)), Math.min(1, digit.opacity + glow * 0.25))
          }
        }
        context.globalAlpha = 1
      }
      if (!motion.matches && visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw)
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      window.clearInterval(mutationTimer)
      frame = 0
      mutationTimer = 0
    }

    const play = () => {
      stop()
      if (!ready || !visible || document.hidden) return
      lastDraw = -Infinity
      draw(performance.now())
      if (!motion.matches && baseContext) {
        mutationTimer = window.setInterval(() => {
          baseContext.setTransform(dpr, 0, 0, dpr, 0, 0)
          for (let k = Math.ceil(digits.length * 0.012); k > 0; k--) {
            const digit = digits[Math.floor(Math.random() * digits.length)]
            digit.ch = digit.ch ? 0 : 1
            baseContext.clearRect(digit.x - cell / 2, digit.y - cell / 2, cell, cell)
            glyph(baseContext, digit, digit.shade, digit.opacity)
          }
          baseContext.globalAlpha = 1
        }, 90)
      }
    }

    const resample = () => {
      if (!ready || disposed) return
      const rect = container.getBoundingClientRect()
      const nextDpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
      if (rect.width === width && rect.height === height && nextDpr === dpr && digits.length) return
      width = rect.width
      height = rect.height
      dpr = nextDpr
      if (!width || !height) return
      canvas.width = base.width = Math.round(width * dpr)
      canvas.height = base.height = Math.round(height * dpr)

      // object-fit: cover
      const scale = Math.max(width / source.naturalWidth, height / source.naturalHeight)
      const imageWidth = source.naturalWidth * scale
      const imageHeight = source.naturalHeight * scale
      const left = (width - imageWidth) / 2
      const top = (height - imageHeight) / 2
      cell = Math.max(5, Math.min(7, width / 220))
      const fontSize = cell * 1.25
      const columns = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)
      sampling.width = columns
      sampling.height = rows
      const sampleContext = sampling.getContext('2d', { willReadFrequently: true })
      if (!sampleContext) return
      sampleContext.imageSmoothingQuality = 'high'
      sampleContext.drawImage(source, left / cell, top / cell, imageWidth / cell, imageHeight / cell)
      const { data } = sampleContext.getImageData(0, 0, columns, rows)

      // The source is made of tiny glyphs, so a cell averages to a dim value.
      // Normalise against the 99.5th percentile to bring the shape back.
      const luminance = new Float32Array(columns * rows)
      for (let i = 0; i < luminance.length; i++) {
        luminance[i] = (0.3 * data[i * 4] + 0.59 * data[i * 4 + 1] + 0.11 * data[i * 4 + 2]) / 255
      }
      const sorted = Float32Array.from(luminance).sort()
      const peak = sorted[Math.floor(sorted.length * 0.995)]

      const next: Digit[] = []
      const nextBands: Digit[][] = Array.from({ length: BANDS }, () => [])
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const brightness = Math.min(1, luminance[y * columns + x] / (peak || 1))
          // Cut the background noise floor, lift the mid-tones of the hand.
          const shape = Math.min(1, Math.max(0, (brightness - 0.1) / 0.55)) ** 0.6
          // Dark cells keep a sparse field of faint digits, like the Figma art.
          if (shape < 0.05 && Math.random() > 0.3) continue
          const digit: Digit = {
            x: (x + 0.5) * cell,
            y: (y + 0.5) * cell,
            ch: Math.random() < 0.5 ? 0 : 1,
            shade: Math.round(shape * (SHADES - 1)),
            opacity: 0.12 + 0.88 * shape,
          }
          next.push(digit)
          const position = (x / columns + y / rows) / 2
          nextBands[Math.min(BANDS - 1, Math.floor(position * BANDS))].push(digit)
        }
      }

      // Atlas: two glyphs × SHADES colours, dark plum → pink → white.
      tile = Math.ceil(fontSize * dpr * 1.6)
      atlas.width = 2 * tile
      atlas.height = SHADES * tile
      const atlasContext = atlas.getContext('2d')
      if (!atlasContext) return
      atlasContext.font = `700 ${fontSize * dpr}px ui-monospace, SFMono-Regular, Consolas, monospace`
      atlasContext.textAlign = 'center'
      atlasContext.textBaseline = 'middle'
      for (let shade = 0; shade < SHADES; shade++) {
        const tone = shade / (SHADES - 1)
        const highlight = Math.max(0, (tone - 0.7) / 0.3) ** 2
        atlasContext.fillStyle = `rgb(${Math.round(120 + 135 * Math.min(1, tone * 1.5))},${Math.round(10 + 60 * tone + 185 * highlight)},${Math.round(60 + 90 * tone + 105 * highlight)})`
        for (let ch = 0; ch < 2; ch++) atlasContext.fillText(String(ch), (ch + 0.5) * tile, (shade + 0.5) * tile)
      }

      digits = next
      bands = nextBands
      canvas.dataset.digitCount = String(digits.length)
      paintBase()
      play()
    }

    source.onload = () => {
      if (disposed) return
      ready = true
      resample()
    }
    const resizeObserver = new ResizeObserver(resample)
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      play()
    })
    intersectionObserver.observe(container)
    motion.addEventListener('change', play)
    document.addEventListener('visibilitychange', play)
    source.src = src

    return () => {
      disposed = true
      stop()
      source.onload = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motion.removeEventListener('change', play)
      document.removeEventListener('visibilitychange', play)
    }
  }, [src])

  return <canvas ref={canvasRef} className={styles.artCanvas} aria-hidden="true" />
}
