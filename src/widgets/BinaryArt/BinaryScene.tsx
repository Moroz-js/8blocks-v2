'use client'

import { useEffect, useRef } from 'react'
import { createSceneRenderer, SCENE_IMAGES } from './scene/registry'
import type { BinarySceneId, SceneRenderer, SceneViewport, SceneWorkerMessage, SceneWorkerReply } from './scene/types'
import styles from './BinaryScene.module.scss'

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
// The 2D scenes were tuned at the designer's 1.5× cap; only the hand coin has a GPU path.
const MAX_DPR: Partial<Record<BinarySceneId, number>> = { 'hand-coin': Infinity }

type BinarySceneProps = {
  scene: BinarySceneId
  className?: string
}

/** Animated binary art in a dedicated worker, with a main-thread Canvas 2D fallback. */
export function BinaryScene({ scene, className }: BinarySceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const src = SCENE_IMAGES[scene] && `${basePath}${SCENE_IMAGES[scene]}`
    // Each effect owns its canvas: transferred canvases cannot be transferred again
    // during React Strict Mode remounts, HMR or recovery from a worker failure.
    let canvas = document.createElement('canvas')
    host.appendChild(canvas)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let worker: Worker | null = null
    let renderer: SceneRenderer | null = null
    let visible = false, disposed = false, fallingBack = false
    let frame = 0, lastDraw = -Infinity
    let startupTimeout: ReturnType<typeof setTimeout> | undefined
    let viewport: SceneViewport = { width: 1, height: 1, sceneWidth: 1, offsetX: 0 }
    const startedAt = performance.now(), interval = 1000 / 30
    const active = () => visible && !document.hidden
    const send = (message: SceneWorkerMessage) => worker?.postMessage(message)
    const ready = (backend: SceneRenderer['backend'], thread: string) => {
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
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(MAX_DPR[scene] ?? 1.5, window.devicePixelRatio || 1)
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
      const image = src ? await new Promise<HTMLImageElement | undefined>(resolve => {
        const reference = new Image()
        reference.onload = () => resolve(reference)
        reference.onerror = () => resolve(undefined)
        reference.src = src
      }) : undefined
      if (disposed) return
      renderer = await createSceneRenderer(scene, canvas, image, false)
      if (disposed) return
      renderer?.resize(viewport)
      play()
      if (renderer) ready(renderer.backend, 'main')
    }
    resize()
    if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
      && typeof createImageBitmap !== 'undefined' && canvas.transferControlToOffscreen) {
      try {
        worker = new Worker(new URL('./scene/scene.worker.ts', import.meta.url), { type: 'module' })
        worker.onmessage = ({ data }: MessageEvent<SceneWorkerReply>) => {
          if (disposed || fallingBack) return
          if (data.type === 'ready') ready(data.backend, 'worker')
          else void fallback()
        }
        worker.onerror = event => { event.preventDefault(); void fallback() }
        const offscreen = canvas.transferControlToOffscreen()
        const message: SceneWorkerMessage = {
          type: 'init', scene, canvas: offscreen, src: src && new URL(src, window.location.href).href,
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
  }, [scene])

  return <div ref={hostRef} className={className ? `${styles.host} ${className}` : styles.host} aria-hidden="true" />
}
