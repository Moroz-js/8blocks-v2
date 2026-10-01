'use client'

import { useEffect, useRef } from 'react'
import styles from './TokenomicsAi.module.scss'

type Digit = {
  x: number
  y: number
  ch: '0' | '1'
  brightness: number
  colorIndex?: number
  opacity: number
  phase: number
  scatter: boolean
  dust?: boolean
}

const SOURCE = '/img/tokenomics-ai/unicorn-reference-source.png'

export function BinaryUnicornCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !container || !context) return

    const source = new Image()
    const mask = document.createElement('canvas')
    const sampling = document.createElement('canvas')
    const glyphAtlas = document.createElement('canvas')
    glyphAtlas.dataset.binaryAtlas = 'true'
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let digits: Digit[] = []
    let width = 0
    let height = 0
    let dpr = 0
    let fontSize = 7
    let glyphTile = 0
    let lastDraw = -Infinity
    let frame = 0
    let mutationTimer = 0
    let visible = false
    let ready = false
    let disposed = false

    const draw = (now: number) => {
      if (!motion.matches && now - lastDraw < 1000 / 30) {
        if (visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw)
        return
      }
      lastDraw = now
      context.clearRect(0, 0, width, height)
      const time = motion.matches ? 0 : now / 1000
      const tileSize = glyphTile / dpr
      for (const digit of digits) {
        const flicker = motion.matches ? 1 : digit.dust ? .55 + .45 * Math.sin(time * 1.2 + digit.phase) : .85 + .15 * Math.sin(time * 1.6 + digit.phase)
        context.globalAlpha = Math.min(1, digit.opacity * flicker)
        const driftY = digit.dust && !motion.matches ? Math.sin(time * .6 + digit.phase) * 6 : 0
        const colorIndex = digit.colorIndex ?? Math.round(digit.brightness * 255)
        const atlasX = (Math.floor(colorIndex / 32) * 2 + Number(digit.ch)) * glyphTile
        const atlasY = colorIndex % 32 * glyphTile
        context.drawImage(glyphAtlas, atlasX, atlasY, glyphTile, glyphTile, digit.x - tileSize / 2, digit.y + driftY - tileSize / 2, tileSize, tileSize)
      }
      context.globalAlpha = 1
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
      if (!motion.matches) {
        mutationTimer = window.setInterval(() => {
          for (const digit of digits) {
            if (!digit.dust && Math.random() < 0.01) digit.ch = digit.ch === '0' ? '1' : '0'
          }
        }, 90)
      }
    }

    const resample = () => {
      if (!ready || disposed) return
      const rect = container.getBoundingClientRect()
      const nextDpr = window.devicePixelRatio || 1
      if (rect.width === width && rect.height === height && nextDpr === dpr && digits.length) return
      width = rect.width
      height = rect.height
      dpr = nextDpr
      if (!width || !height) return
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Preserve the original source aspect ratio and mirrored Figma placement.
      const scale = Math.min(width / mask.width, height / mask.height)
      const imageWidth = mask.width * scale
      const imageHeight = mask.height * scale
      const left = (width - imageWidth) / 2
      const top = (height - imageHeight) / 2
      const cell = Math.max(4, Math.min(5.5, width / 180))
      fontSize = cell * 1.2
      // Palette and both particle systems follow 8Blocks Binary Unicorn.html.
      glyphTile = Math.ceil(fontSize * dpr * 1.8)
      const palette: string[] = []
      for (let shade = 0; shade < 256; shade++) {
        const tone = (shade / 255) ** .65
        const highlight = Math.max(0, (shade / 255 - .72) / .28)
        palette.push(`rgb(${Math.round(155 + 100 * Math.min(1, tone * 1.4))},${Math.round(8 + 65 * tone + 170 * highlight ** 2)},${Math.round(75 + 100 * tone + 75 * highlight ** 2)})`)
      }
      palette.push('rgb(229,45,154)')
      palette.push('rgb(190,25,110)')
      const columns = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)
      sampling.width = columns
      sampling.height = rows
      const sampleContext = sampling.getContext('2d', { willReadFrequently: true })
      if (!sampleContext) return
      sampleContext.drawImage(mask, left / cell, top / cell, imageWidth / cell, imageHeight / cell)
      const { data } = sampleContext.getImageData(0, 0, columns, rows)
      const blurred = document.createElement('canvas')
      blurred.width = columns
      blurred.height = rows
      const blurContext = blurred.getContext('2d', { willReadFrequently: true })
      if (!blurContext) return
      blurContext.filter = `blur(${Math.max(6, columns / 10)}px)`
      blurContext.drawImage(sampling, 0, 0)
      const halo = blurContext.getImageData(0, 0, columns, rows).data
      const next: Digit[] = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const index = (y * columns + x) * 4
          const alpha = data[index + 3] / 255
          if (alpha < .35) {
            const near = halo[index + 3] / 255
            const emptyBackground = near < .03
            if (Math.random() > (emptyBackground ? .025 : .75)) continue
            next.push({ x: (x + .5) * cell, y: (y + .5) * cell, ch: Math.random() < .5 ? '0' : '1', brightness: .35, colorIndex: emptyBackground ? 256 : 257, opacity: emptyBackground ? .1 + Math.random() * .12 : Math.min(.5, near * 1.3), phase: Math.random() * Math.PI * 2, scatter: true })
            continue
          }
          const luminance = (.3 * data[index] + .59 * data[index + 1] + .11 * data[index + 2]) / 255
          const normalized = Math.min(1, Math.max(0, (luminance - .12) / .62))
          const brightness = normalized * normalized * (3 - 2 * normalized)
          // A sparse pink field also passes through deep shadow regions.
          // Reuse one glyph per cell, keeping the sampled detail between them.
          const shadowScatter = brightness < .12 && Math.random() < .35
          next.push({ x: (x + .5) * cell, y: (y + .5) * cell, ch: Math.random() < .5 ? '0' : '1', brightness, colorIndex: shadowScatter ? 256 : undefined, opacity: shadowScatter ? .65 + Math.random() * .15 : alpha * (.9 + .32 * brightness), phase: Math.random() * Math.PI * 2, scatter: shadowScatter })
        }
      }
      // More visible binary scatter close to the surrounding halo.
      const anchors = next.filter(digit => digit.scatter)
      for (let k = 0; k < 1000 && anchors.length; k++) {
        const anchor = anchors[Math.floor(Math.random() * anchors.length)]
        const radius = 20 + Math.random() ** 1.7 * 180
        const angle = Math.random() * Math.PI * 2
        next.push({ x: anchor.x + Math.cos(angle) * radius, y: anchor.y + Math.sin(angle) * radius, ch: Math.random() < .5 ? '0' : '1', brightness: .35, colorIndex: 256, opacity: .12 + .32 * (1 - radius / 200), phase: Math.random() * Math.PI * 2, scatter: true, dust: true })
      }
      glyphAtlas.width = Math.ceil(palette.length / 32) * 2 * glyphTile
      glyphAtlas.height = 32 * glyphTile
      const atlasContext = glyphAtlas.getContext('2d')
      if (!atlasContext) return
      atlasContext.font = `700 ${fontSize * dpr}px ui-monospace, SFMono-Regular, Consolas, monospace`
      atlasContext.textAlign = 'center'
      atlasContext.textBaseline = 'middle'
      palette.forEach((color, index) => {
        atlasContext.fillStyle = color
        for (let ch = 0; ch < 2; ch++) {
          atlasContext.fillText(String(ch), (Math.floor(index / 32) * 2 + ch + .5) * glyphTile, (index % 32 + .5) * glyphTile)
        }
      })
      digits = next
      canvas.dataset.digitCount = String(digits.length)
      canvas.dataset.sourceReady = 'true'
      play()
    }

    source.onload = () => {
      if (disposed) return
      // Keep the previously verified upright mirrored Figma composition.
      mask.width = 1024
      mask.height = 757
      const maskContext = mask.getContext('2d', { willReadFrequently: true })
      if (!maskContext) return
      const sourceScale = .37 * 2748 / source.naturalHeight
      maskContext.translate(127 + source.naturalWidth * sourceScale, 0)
      maskContext.scale(-sourceScale, sourceScale)
      maskContext.drawImage(source, 0, 0)
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
    window.addEventListener('resize', resample)
    source.src = SOURCE

    return () => {
      disposed = true
      stop()
      source.onload = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motion.removeEventListener('change', play)
      document.removeEventListener('visibilitychange', play)
      window.removeEventListener('resize', resample)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.unicornCanvas} aria-hidden="true" />
}
