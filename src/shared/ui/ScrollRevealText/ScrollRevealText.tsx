'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface WordProps {
  word: string
  progress: MotionValue<number>
  index: number
  total: number
}

function Word({ word, progress, index, total }: WordProps) {
  // Each word transitions within a window centered on its position.
  // windowSize = 1.8 / total  →  ~2 words are mid-transition at any time → smooth wave.
  const windowSize = 1.8 / total
  const center = (index + 0.5) / total
  const start = Math.max(0, center - windowSize / 2)
  const end = Math.min(1, center + windowSize / 2)

  // Only color changes: gray → white. No opacity — text is always readable.
  const color = useTransform(
    progress,
    [start, end],
    ['rgba(255,255,255,0.18)', 'rgba(255,255,255,1)'],
  )

  return (
    <motion.span style={{ color, display: 'inline' }}>
      {word}{' '}
    </motion.span>
  )
}

interface Props {
  text: string
  className?: string
  startOffset?: string
  endOffset?: string
}

export function ScrollRevealText({
  text,
  className,
  startOffset = 'start 0.88',
  endOffset = 'end 0.35',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollOptions = { target: ref, offset: [startOffset, endOffset] } as any
  const { scrollYProgress } = useScroll(scrollOptions)

  const words = text.split(' ')

  return (
    <div ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          progress={scrollYProgress}
          index={i}
          total={words.length}
        />
      ))}
    </div>
  )
}
