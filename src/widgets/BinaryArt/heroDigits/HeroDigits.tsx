'use client'

import Image, { type StaticImageData } from 'next/image'
import { useEffect, useRef } from 'react'
import { createHeroDigits } from './createHeroDigits'
import styles from './HeroDigits.module.scss'

type HeroDigitsProps = {
  src: StaticImageData
  alt?: string
  sizes?: string
  priority?: boolean
  className?: string
}

/** Photo with the hover survey-quad overlay from the designer's hero-digits. */
export function HeroDigits({ src, alt = '', sizes = '(max-width: 1024px) 100vw, 600px', priority, className }: HeroDigitsProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current, image = imageRef.current, canvas = canvasRef.current
    if (!host || !image || !canvas) return
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const digits = createHeroDigits(canvas, image)
    const fit = () => {
      const rect = host.getBoundingClientRect()
      digits.resize(rect.width, rect.height)
    }
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      digits.pointer(event.clientX - rect.left, event.clientY - rect.top, true)
    }
    const leave = () => digits.pointer(0, 0, false)
    const observer = new ResizeObserver(fit)
    observer.observe(host)
    if (!image.complete) image.addEventListener('load', fit, { once: true })
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => {
      observer.disconnect()
      image.removeEventListener('load', fit)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      digits.dispose()
    }
  }, [src])

  return (
    <div ref={hostRef} className={className ? `${styles.host} ${className}` : styles.host}>
      <Image ref={imageRef} src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.image} />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  )
}
