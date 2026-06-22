'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import styles from './HeroLetters.module.scss'

interface HeroLettersProps {
  className?: string
}

type Glyph = {
  char: string
  /** Position in % of the container. */
  x: number
  y: number
  /** Relative font size factor. */
  size: number
  /** Resting rotation in degrees. */
  rotate: number
  /** Parallax depth: bigger = moves more with the cursor. */
  depth: number
  /** Float animation timing. */
  duration: number
  delay: number
}

const GLYPHS: Glyph[] = [
  { char: 'А', x: 6,  y: 8,  size: 0.95, rotate: -4, depth: 30, duration: 7,   delay: 0   },
  { char: '8', x: 70, y: 0,  size: 0.72, rotate: 6,  depth: 60, duration: 8.5, delay: 0.6 },
  { char: 'А', x: 14, y: 62, size: 0.8,  rotate: 5,  depth: 44, duration: 9,   delay: 1.1 },
  { char: '9', x: 78, y: 58, size: 1.0,  rotate: -7, depth: 18, duration: 7.8, delay: 0.3 },
]

export function HeroLetters({ className }: HeroLettersProps) {
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      mx.set((e.clientX - rect.left) / rect.width - 0.5)
      my.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [mx, my],
  )

  const handleLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  return (
    <div
      ref={ref}
      className={`${styles.stage} ${className ?? ''}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-hidden="true"
    >
      <div className={styles.glow} />
      <div className={styles.grid} />

      {GLYPHS.map((g, i) => (
        <ParallaxGlyph key={i} glyph={g} sx={sx} sy={sy} />
      ))}
    </div>
  )
}

function ParallaxGlyph({
  glyph,
  sx,
  sy,
}: {
  glyph: Glyph
  sx: ReturnType<typeof useSpring>
  sy: ReturnType<typeof useSpring>
}) {
  const tx = useTransform(sx, (v) => v * glyph.depth)
  const ty = useTransform(sy, (v) => v * glyph.depth)

  return (
    <motion.span
      className={styles.glyph}
      style={{
        left: `${glyph.x}%`,
        top: `${glyph.y}%`,
        x: tx,
        y: ty,
        fontSize: `${glyph.size * 230}px`,
        rotate: glyph.rotate,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        translateY: [0, -18, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay: glyph.delay, ease: 'easeOut' },
        scale: { duration: 0.8, delay: glyph.delay, ease: 'easeOut' },
        translateY: {
          duration: glyph.duration,
          delay: glyph.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {glyph.char}
    </motion.span>
  )
}
