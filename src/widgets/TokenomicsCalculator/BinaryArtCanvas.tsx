'use client'

import { useEffect, useRef } from 'react'
import { createHandCoinRenderer } from './handCoinRenderer'
import styles from './TokenomicsCalculator.module.scss'

/** Native canvas port of the supplied Binary Hand Coin animation. */
export function BinaryArtCanvas({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const image = new Image()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let renderer: ReturnType<typeof createHandCoinRenderer> = null
    let visible = false
    let disposed = false
    let frame = 0
    let lastDraw = -Infinity
    const startedAt = performance.now()

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const draw = (now: number) => {
      if (!renderer || disposed || !visible || document.hidden) return
      if (motion.matches || now - lastDraw >= 1000 / 30) {
        renderer.draw(motion.matches ? 0 : now - startedAt)
        lastDraw = now
      }
      if (!motion.matches) frame = requestAnimationFrame(draw)
    }

    const play = () => {
      stop()
      lastDraw = -Infinity
      draw(performance.now())
    }

    const resize = () => {
      renderer?.resize()
      play()
    }

    const initialise = (reference?: HTMLImageElement) => {
      if (disposed) return
      renderer = createHandCoinRenderer(canvas, reference)
      if (renderer) canvas.dataset.ready = 'true'
      play()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      play()
    })
    intersectionObserver.observe(canvas)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', play)
    motion.addEventListener('change', play)
    image.onload = () => initialise(image)
    image.onerror = () => initialise()
    image.src = src

    return () => {
      disposed = true
      stop()
      image.onload = null
      image.onerror = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', play)
      motion.removeEventListener('change', play)
    }
  }, [src])

  return <canvas ref={canvasRef} className={styles.artCanvas} aria-hidden="true" />
}
