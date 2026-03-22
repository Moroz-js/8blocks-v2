'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface CharProps {
  char: string
  progress: MotionValue<number>
  index: number
  total: number
  dark?: boolean
}

function Char({ char, progress, index, total, dark }: CharProps) {
  const windowSize = 2.2 / total
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

  if (char === ' ') {
    return <span style={{ display: 'inline' }}>{' '}</span>
  }

  return (
    <motion.span style={{ color, display: 'inline' }}>
      {char}
    </motion.span>
  )
}

interface Props {
  text: string
  className?: string
  startOffset?: string
  endOffset?: string
  dark?: boolean
  progress?: MotionValue<number>
}

export function ScrollRevealText({
  text,
  className,
  startOffset = 'start 0.88',
  endOffset = 'end 0.35',
  dark,
  progress: progressProp,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const resolvedStart = isMobile ? 'start 0.98' : startOffset
  const resolvedEnd = isMobile ? 'end 0.55' : endOffset

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollOptions = { target: ref, offset: [resolvedStart, resolvedEnd] } as any
  const { scrollYProgress: scrollProgress } = useScroll(scrollOptions)
  const progress = progressProp ?? scrollProgress

  const chars = text.split('')

  return (
    <div ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <Char
          key={i}
          char={char}
          progress={progress}
          index={i}
          total={chars.length}
          dark={dark}
        />
      ))}
    </div>
  )
}
