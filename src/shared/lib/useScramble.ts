'use client'

import { useEffect, useRef, useState } from 'react'

const POOL = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/** Swaps text through random characters, revealing it left to right (designer's glitch). */
export function useScramble(text: string, duration = 900) {
  const [shown, setShown] = useState(text)
  const previous = useRef(text)

  useEffect(() => {
    if (previous.current === text) return
    previous.current = text
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = -Infinity
    const start = performance.now()
    const tick = (now: number) => {
      const progress = (now - start) / duration
      if (instant || progress >= 1) {
        setShown(text)
        return
      }
      if (now - last > 95) {
        last = now
        const reveal = Math.max(0, (progress - 0.35) / 0.65)
        setShown(
          Array.from(text, (char, k) =>
            char === ' ' || char === '\n' || k / text.length < reveal ? char : POOL[(Math.random() * POOL.length) | 0],
          ).join(''),
        )
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, duration])

  return shown
}
