'use client'

import { useEffect, useRef } from 'react'
import type { HandCoinRenderer, HandCoinViewport, HandCoinWorkerMessage, HandCoinWorkerReply } from './handCoinTypes'
import styles from './TokenomicsCalculator.module.scss'

/** GPU animation in a dedicated worker, with a cached Canvas 2D compatibility path. */
export function BinaryArtCanvas({ src }: { src: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    // Each effect owns its canvas: transferred canvases cannot be transferred again
    // during React Strict Mode remounts, HMR or recovery from a worker failure.
    let canvas = document.createElement('canvas')
    host.appendChild(canvas)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let worker: Worker | null = null
    let renderer: HandCoinRenderer | null = null
    let visible = false, disposed = false, fallingBack = false
    let frame = 0, lastDraw = -Infinity
    let startupTimeout: ReturnType<typeof setTimeout> | undefined
    let viewport: HandCoinViewport = { width: 1, height: 1, sceneWidth: 1, offsetX: 0 }
    const startedAt = performance.now(), interval = 1000 / 30
    const active = () => visible && !document.hidden
    const send = (message: HandCoinWorkerMessage) => worker?.postMessage(message)
    const ready = (backend: HandCoinRenderer['backend'], thread: string) => {
      clearTimeout(startupTimeout)
      canvas.dataset.ready = 'true'
      canvas.dataset.renderer = backend
      canvas.dataset.thread = thread
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const draw = (now: number) => {
      if (!renderer || disposed || !active()) return
      const delta = now - lastDraw
      if (motion.matches || delta >= interval - 0.5) {
        renderer.draw(motion.matches ? 0 : now - startedAt)
        lastDraw = Number.isFinite(delta)
          ? lastDraw + Math.max(1, Math.floor((delta + 0.5) / interval)) * interval
          : now
      }
      if (!motion.matches) frame = requestAnimationFrame(draw)
    }
    const play = () => {
      if (disposed) return
      send({ type: 'activity', active: active(), reducedMotion: motion.matches })
      stop()
      lastDraw = -Infinity
      if (renderer) draw(performance.now())
    }
    const resize = () => {
      const rect = host.getBoundingClientRect(), dpr = window.devicePixelRatio || 1
      const cropLeft = Math.min(rect.width, Math.max(0, -rect.left))
      const cropRight = Math.max(cropLeft, Math.min(rect.width, document.documentElement.clientWidth - rect.left))
      const offsetX = Math.round(cropLeft * dpr)
      viewport = {
        width: Math.max(1, Math.round(cropRight * dpr) - offsetX),
        height: Math.max(1, Math.round(rect.height * dpr)),
        sceneWidth: Math.max(1, Math.round(rect.width * dpr)),
        offsetX,
      }
      canvas.style.left = `${offsetX / dpr}px`
      canvas.style.width = `${viewport.width / dpr}px`
      send({ type: 'viewport', viewport })
      renderer?.resize(viewport)
      play()
    }
    const fallback = async () => {
      if (disposed || fallingBack) return
      fallingBack = true
      clearTimeout(startupTimeout)
      worker?.terminate()
      worker = null
      stop()
      renderer?.dispose()
      renderer = null
      const replacement = document.createElement('canvas')
      canvas.replaceWith(replacement)
      canvas = replacement
      resize()
      const [modules, image] = await Promise.all([
        Promise.all([import('./handCoinScene'), import('./handCoinRenderer')]),
        new Promise<HTMLImageElement | undefined>(resolve => {
          const reference = new Image()
          reference.onload = () => resolve(reference)
          reference.onerror = () => resolve(undefined)
          reference.src = src
        }),
      ])
      if (disposed) return
      const [{ createHandCoinScene }, { createHandCoinRenderer }] = modules
      renderer = createHandCoinRenderer(canvas, createHandCoinScene(image))
      renderer?.resize(viewport)
      play()
      if (renderer) ready(renderer.backend, 'main')
    }
    resize()
    if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
      && typeof createImageBitmap !== 'undefined' && canvas.transferControlToOffscreen) {
      try {
        worker = new Worker(new URL('./handCoin.worker.ts', import.meta.url), { type: 'module' })
        worker.onmessage = ({ data }: MessageEvent<HandCoinWorkerReply>) => {
          if (disposed || fallingBack) return
          if (data.type === 'ready') ready(data.backend, 'worker')
          else void fallback()
        }
        worker.onerror = event => { event.preventDefault(); void fallback() }
        const offscreen = canvas.transferControlToOffscreen()
        const message: HandCoinWorkerMessage = {
          type: 'init', canvas: offscreen, src: new URL(src, window.location.href).href,
          viewport, active: active(), reducedMotion: motion.matches,
        }
        worker.postMessage(message, [offscreen])
        startupTimeout = setTimeout(() => { void fallback() }, 30000)
      } catch { void fallback() }
    } else void fallback()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      play()
    })
    intersectionObserver.observe(host)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', play)
    motion.addEventListener('change', play)
    return () => {
      disposed = true
      clearTimeout(startupTimeout)
      stop()
      worker?.terminate()
      renderer?.dispose()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', play)
      motion.removeEventListener('change', play)
      canvas.remove()
    }
  }, [src])

  return <div ref={hostRef} className={styles.artCanvas} aria-hidden="true" />
}
