'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useTheme } from 'next-themes'

const OPACITY_MIN = 0.18
const OPACITY_MAX = 1

interface CharProps {
  char: string
  progress: MotionValue<number>
  index: number
  total: number
}

function Char({ char, progress, index, total }: CharProps) {
  const windowSize = 2.2 / total
  const center = (index + 0.5) / total
  const start = Math.max(0, center - windowSize / 2)
  const end = Math.min(1, center + windowSize / 2)

  const opacity = useTransform(progress, [start, end], [OPACITY_MIN, OPACITY_MAX])

  if (char === ' ') {
    return <span style={{ display: 'inline' }}>{' '}</span>
  }

  return (
    <motion.span style={{ opacity, display: 'inline' }}>
      {char}
    </motion.span>
  )
}

interface Props {
  text: string
  className?: string
  startOffset?: string
  endOffset?: string
  /** @deprecated Цвет берётся из className; оставлено для совместимости */
  dark?: boolean
  progress?: MotionValue<number>
}

export function ScrollRevealText({
  text,
  className,
  startOffset = 'start 0.88',
  endOffset = 'end 0.35',
  progress: progressProp,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!resolvedTheme) return
    const id = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })
    return () => cancelAnimationFrame(id)
  }, [resolvedTheme])

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
        />
      ))}
    </div>
  )
}
