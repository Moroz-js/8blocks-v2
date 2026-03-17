'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface WordProps {
  word: string
  progress: MotionValue<number>
  index: number
  total: number
  dark?: boolean
}

function Word({ word, progress, index, total, dark }: WordProps) {
  const windowSize = 1.8 / total
  const center = (index + 0.5) / total
  const start = Math.max(0, center - windowSize / 2)
  const end = Math.min(1, center + windowSize / 2)

  const color = useTransform(
    progress,
    [start, end],
    dark
      ? ['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.9)']
      : ['rgba(255,255,255,0.18)', 'rgba(255,255,255,1)'],
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
  dark?: boolean
}

export function ScrollRevealText({
  text,
  className,
  startOffset = 'start 0.88',
  endOffset = 'end 0.35',
  dark,
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
          dark={dark}
        />
      ))}
    </div>
  )
}
