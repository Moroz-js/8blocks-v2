'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { servicesShowcaseContent } from '@/shared/content/homePage'
import { t } from '@/shared/i18n'
import styles from './ServicesShowcase.module.scss'

const ease = 'easeOut' as const
const CX = 240
const CY = 240

const ARCS = [
  { pct: 30, color: '#C24E88', r: 155, w: 6 },
  { pct: 18, color: '#8E4ABD', r: 155, w: 6 },
  { pct: 14, color: '#D9ADD0', r: 155, w: 6 },
  { pct: 15, color: '#a85ccc', r: 155, w: 6 },
  { pct: 10, color: '#e07db8', r: 155, w: 6 },
  { pct: 8, color: '#7a3da8', r: 155, w: 6 },
  { pct: 5, color: '#b876c9', r: 155, w: 6 },
]

const OUTER_ARCS = [
  { pct: 40, color: '#C24E88', r: 175, w: 2 },
  { pct: 25, color: '#8E4ABD', r: 175, w: 2 },
  { pct: 35, color: '#D9ADD0', r: 175, w: 2 },
]

const INNER_ARCS = [
  { pct: 50, color: '#C24E88', r: 130, w: 1.5 },
  { pct: 50, color: '#8E4ABD', r: 130, w: 1.5 },
]

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = ((startDeg - 90) * Math.PI) / 180
  const e = ((endDeg - 90) * Math.PI) / 180
  const x1 = cx + r * Math.cos(s)
  const y1 = cy + r * Math.sin(s)
  const x2 = cx + r * Math.cos(e)
  const y2 = cy + r * Math.sin(e)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

function buildPaths(segments: typeof ARCS, gap: number) {
  let angle = 0
  return segments.map((seg) => {
    const sweep = (seg.pct / 100) * 360 - gap
    const d = arcPath(CX, CY, seg.r, angle, angle + sweep)
    const result = { ...seg, d, startAngle: angle }
    angle += sweep + gap
    return result
  })
}

function TokenAnimation({ visible }: { visible: boolean }) {
  const main = buildPaths(ARCS, 3)
  const outer = buildPaths(OUTER_ARCS, 8)
  const inner = buildPaths(INNER_ARCS, 6)

  return (
    <svg viewBox="0 0 480 480" className={styles.svg} aria-hidden="true">
      <defs>
        <radialGradient id="ta-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C24E88" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#8E4ABD" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#8E4ABD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ta-coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D9ADD0" />
          <stop offset="50%" stopColor="#C24E88" />
          <stop offset="100%" stopColor="#8E4ABD" />
        </linearGradient>
        <filter id="ta-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="ta-blur-lg">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={200} fill="url(#ta-glow)" />

      {/* outer ring */}
      <motion.g
        animate={visible ? { rotate: [0, -360] } : undefined}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {outer.map((a, i) => (
          <motion.path
            key={`o${i}`}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={a.w}
            strokeLinecap="round"
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
          />
        ))}
      </motion.g>

      {/* main donut */}
      <motion.g
        animate={visible ? { rotate: [0, 360] } : undefined}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {main.map((a, i) => (
          <motion.path
            key={`m${i}`}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={a.w}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={visible ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
          />
        ))}
        {main.map((a, i) => (
          <motion.path
            key={`mg${i}`}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={14}
            strokeLinecap="round"
            filter="url(#ta-blur)"
            animate={visible ? { opacity: [0.06, 0.14, 0.06] } : { opacity: 0 }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </motion.g>

      {/* inner ring */}
      <motion.g
        animate={visible ? { rotate: [0, 360] } : undefined}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {inner.map((a, i) => (
          <motion.path
            key={`i${i}`}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={a.w}
            strokeLinecap="round"
            opacity={0.25}
            initial={{ pathLength: 0 }}
            animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
          />
        ))}
      </motion.g>

      {/* center coin */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.5, type: 'spring', stiffness: 120 }}
      >
        <circle cx={CX} cy={CY} r={60} fill="#C24E88" opacity={0.08} filter="url(#ta-blur-lg)" />
        <circle cx={CX} cy={CY} r={44} fill="none" stroke="url(#ta-coin)" strokeWidth={2} opacity={0.6} />
        <circle cx={CX} cy={CY} r={38} fill="none" stroke="url(#ta-coin)" strokeWidth={1} opacity={0.3} />
        <motion.path
          d="M25.789 27.31H0V23.69H25.789V27.31ZM14.736 21.887H11.052V12.847H14.736V21.887ZM20.263 21.887H16.579V7.424H20.263V21.887ZM25.789 2V21.887H22.105V2H25.789ZM9.211 21.887H0V18.271H9.211V21.887ZM9.211 16.463H0V12.847H9.211V16.463ZM14.736 11.039H0V7.424H14.736V11.039ZM20.263 5.616H0V2H20.263V5.616Z"
          fill="url(#ta-coin)"
          transform={`translate(${CX - 18}, ${CY - 18}) scale(1.4)`}
          animate={visible ? { opacity: [0.6, 1, 0.6] } : { opacity: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {/* orbiting dots */}
      {visible && (
        <>
          <motion.circle
            r={3}
            fill="#D9ADD0"
            animate={{
              cx: [CX + 155, CX, CX - 155, CX, CX + 155],
              cy: [CY, CY - 155, CY, CY + 155, CY],
              opacity: [0.8, 0.4, 0.8, 0.4, 0.8],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            r={2}
            fill="#8E4ABD"
            animate={{
              cx: [CX - 175, CX, CX + 175, CX, CX - 175],
              cy: [CY, CY + 175, CY, CY - 175, CY],
              opacity: [0.6, 0.3, 0.6, 0.3, 0.6],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />

          {[0, 1].map((i) => (
            <motion.circle
              key={`p${i}`}
              cx={CX}
              cy={CY}
              fill="none"
              stroke="rgba(194,78,136,0.1)"
              strokeWidth={1}
              animate={{ r: [44, 120 + i * 40], opacity: [0.2, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 2, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </svg>
  )
}

export function ServicesShowcase() {
  const [active, setActive] = useState(0)
  const { headline, items } = servicesShowcaseContent
  const animRef = useRef<HTMLDivElement>(null)
  const inView = useInView(animRef, { once: true, margin: '-100px' })

  return (
    <section className={styles.section} aria-label={t({ ru: 'Услуги', en: 'Services' })}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          {headline}
        </motion.h2>

        <div className={styles.layout}>
          <div className={styles.list}>
            {items.map((item, i) => (
              <Link key={item.id} href={item.href} className={styles.itemLink}>
                <motion.div
                  className={`${styles.item} ${active === i ? styles.itemActive : ''}`}
                  onMouseEnter={() => setActive(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, ease, delay: i * 0.08 }}
                >
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDesc}>{item.description}</p>
                  <span className={styles.itemCta}>
                    {t({ ru: 'Подробнее', en: 'Learn more' })}
                    <span className={styles.itemArrow} aria-hidden="true">→</span>
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>

          <div ref={animRef} className={styles.animation}>
            <TokenAnimation visible={inView} />
          </div>
        </div>
      </div>
    </section>
  )
}
