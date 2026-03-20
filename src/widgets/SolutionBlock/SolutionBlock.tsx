'use client'

import { motion } from 'framer-motion'
import styles from './SolutionBlock.module.scss'

export interface SolutionItem {
  id: string
  label: string
  description?: string
}

type SolutionVariant = 'tokenomics' | 'audit' | 'consulting'

interface SolutionBlockProps {
  headline: string
  description?: string
  variant: SolutionVariant
  items: readonly SolutionItem[]
}

// ── Tokenomics: 4 panel icons ────────────────────────────────────

function IconProductLayers() {
  return (
    <svg className={styles.panelIcon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="44" width="48" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="29" width="36" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="20" y="14" width="24" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconCircularFlow() {
  return (
    <svg className={styles.panelIcon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="56" cy="32" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="56" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="32" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 36 11 Q 52 16 51 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 54 37 Q 48 52 37 53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 27 53 Q 12 48 13 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 13 27 Q 16 12 27 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function IconLinkedLedger() {
  return (
    <svg className={styles.panelIcon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <line x1="8" y1="14" x2="38" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="26" x2="38" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="38" x2="38" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="50" x2="38" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="10" x2="50" y2="54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="14" x2="50" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" strokeLinecap="round" />
      <line x1="38" y1="26" x2="50" y2="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" strokeLinecap="round" />
      <line x1="38" y1="38" x2="50" y2="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" strokeLinecap="round" />
      <line x1="38" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" strokeLinecap="round" />
      <circle cx="50" cy="14" r="2.5" fill="currentColor" />
      <circle cx="50" cy="26" r="2.5" fill="currentColor" />
      <circle cx="50" cy="38" r="2.5" fill="currentColor" />
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
    </svg>
  )
}

function IconFlexibleGrid() {
  return (
    <svg className={styles.panelIcon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="26" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="40" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="54" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="12" cy="26" r="2.5" fill="currentColor" />
      <circle cx="26" cy="26" r="2.5" fill="currentColor" />
      <circle cx="42" cy="26" r="2" fill="currentColor" fillOpacity="0.6" />
      <circle cx="56" cy="24" r="2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="10" cy="40" r="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="28" cy="38" r="2.5" fill="currentColor" />
      <circle cx="42" cy="40" r="2.5" fill="currentColor" />
      <circle cx="54" cy="42" r="2" fill="currentColor" fillOpacity="0.6" />
      <circle cx="12" cy="54" r="2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="26" cy="54" r="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="42" cy="52" r="2" fill="currentColor" />
      <circle cx="54" cy="54" r="2.5" fill="currentColor" />
      <line x1="12" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <line x1="26" y1="26" x2="42" y2="40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <line x1="28" y1="38" x2="42" y2="40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <line x1="42" y1="40" x2="54" y2="54" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
    </svg>
  )
}

const panelIcons = [IconProductLayers, IconCircularFlow, IconLinkedLedger, IconFlexibleGrid]

// ── Audit: background SVG ────────────────────────────────────────

function AuditBgSvg() {
  return (
    <svg
      className={styles.auditBg}
      viewBox="0 0 560 460"
      fill="none"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
    >
      <circle cx="420" cy="230" r="210" stroke="white" strokeWidth="1" strokeOpacity="0.035" />
      <circle cx="420" cy="230" r="150" stroke="white" strokeWidth="1" strokeOpacity="0.045" />
      <circle cx="420" cy="230" r="90"  stroke="white" strokeWidth="1" strokeOpacity="0.055" />
      <circle cx="420" cy="230" r="40"  stroke="white" strokeWidth="1" strokeOpacity="0.065" />
      <line x1="420" y1="20"  x2="420" y2="440" stroke="white" strokeWidth="1" strokeOpacity="0.025" />
      <line x1="210" y1="230" x2="560" y2="230" stroke="white" strokeWidth="1" strokeOpacity="0.025" />
      <line x1="270" y1="80"  x2="560" y2="380" stroke="white" strokeWidth="1" strokeOpacity="0.02" />
    </svg>
  )
}

// ── Audit: stagger config ────────────────────────────────────────

const auditStagger = [
  { ml: '0%',   w: '88%' },
  { ml: '15%',  w: '82%' },
  { ml: '4%',   w: '89%' },
  { ml: '20%',  w: '76%' },
  { ml: '9%',   w: '84%' },
  { ml: '2%',   w: '91%' },
  { ml: '14%',  w: '81%' },
]

// ── Consulting: connection map SVG ───────────────────────────────

type MapNode = {
  id: string
  lines: string[]
  cx: number
  cy: number
  w: number
  h: number
}

const mapNodes: MapNode[] = [
  { id: 'business',    lines: ['Бизнес-модель'],           cx: 95,  cy: 70,  w: 162, h: 40 },
  { id: 'tokenomics',  lines: ['Токеномика'],              cx: 305, cy: 50,  w: 126, h: 40 },
  { id: 'investment',  lines: ['Инвестиционная', 'упаковка'], cx: 440, cy: 168, w: 168, h: 52 },
  { id: 'partners',    lines: ['Партнерская', 'экосистема'],  cx: 378, cy: 298, w: 168, h: 52 },
  { id: 'tge',         lines: ['Подготовка', 'к TGE'],     cx: 196, cy: 330, w: 144, h: 52 },
  { id: 'launch',      lines: ['Запуск'],                  cx: 70,  cy: 224, w: 104, h: 40 },
]

// Main flow paths: N1→N2→N3→N4→N5→N6
const mainPaths = [
  // Бизнес-модель → Токеномика
  'M 176,70 C 212,70 224,50 242,50',
  // Токеномика → Инвест. упаковка
  'M 305,70 C 305,115 348,150 356,168',
  // Инвест. упаковка → Партнерская экосистема
  'M 440,194 C 440,240 378,258 378,272',
  // Партнерская экосистема → Подготовка к TGE
  'M 294,298 C 250,295 196,288 196,304',
  // Подготовка к TGE → Запуск
  'M 124,330 C 86,330 70,288 70,264',
]

function ConsultingMap() {
  return (
    <svg
      className={styles.consultingMap}
      viewBox="0 0 520 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.45)" />
        </marker>
      </defs>

      {/* Main flow paths */}
      {mainPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
          markerEnd="url(#arrow)"
        />
      ))}

      {/* Nodes */}
      {mapNodes.map((node) => {
        const x = node.cx - node.w / 2
        const y = node.cy - node.h / 2
        const midY = node.h === 52
          ? node.cy - 7
          : node.cy
        return (
          <g key={node.id}>
            <rect
              x={x}
              y={y}
              width={node.w}
              height={node.h}
              rx={node.h / 2}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
            {node.lines.length === 1 ? (
              <text
                x={node.cx}
                y={node.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize="13"
                fontFamily="Manrope, sans-serif"
                fontWeight="500"
                letterSpacing="-0.01em"
              >
                {node.lines[0]}
              </text>
            ) : (
              <>
                <text
                  x={node.cx}
                  y={midY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.9)"
                  fontSize="13"
                  fontFamily="Manrope, sans-serif"
                  fontWeight="500"
                  letterSpacing="-0.01em"
                >
                  {node.lines[0]}
                </text>
                <text
                  x={node.cx}
                  y={midY + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.9)"
                  fontSize="13"
                  fontFamily="Manrope, sans-serif"
                  fontWeight="500"
                  letterSpacing="-0.01em"
                >
                  {node.lines[1]}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Main component ───────────────────────────────────────────────

export function SolutionBlock({ headline, description, variant, items }: SolutionBlockProps) {
  if (variant === 'tokenomics') {
    return (
      <section className={styles.section} aria-label="Решение">
        <div className={styles.inner}>
          <motion.div
            className={styles.headerCenter}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className={styles.headline}>{headline}</h2>
            {description && <p className={styles.descriptionCenter}>{description}</p>}
          </motion.div>

          <div className={styles.panelsGrid}>
            {items.map((item, i) => {
              const Icon = panelIcons[i % panelIcons.length]
              return (
                <motion.article
                  key={item.id}
                  className={styles.panel}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.09 }}
                >
                  <div className={styles.panelIconWrap}>
                    <Icon />
                  </div>
                  <h3 className={styles.panelTitle}>{item.label}</h3>
                  {item.description && (
                    <p className={styles.panelDesc}>{item.description}</p>
                  )}
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'audit') {
    return (
      <section className={styles.section} aria-label="Когда нужен аудит">
        <div className={styles.inner}>
          <div className={styles.auditSplit}>

            {/* Left: text */}
            <motion.div
              className={styles.auditText}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <h2 className={styles.headline}>{headline}</h2>
              {description && <p className={styles.description}>{description}</p>}
            </motion.div>

            {/* Right: staggered panels */}
            <div className={styles.auditComposition}>
              <AuditBgSvg />
              {items.map((item, i) => {
                const s = auditStagger[i] ?? { ml: '0%', w: '88%' }
                return (
                  <motion.div
                    key={item.id}
                    className={styles.staggerPanel}
                    style={{ marginLeft: s.ml, width: s.w }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 + i * 0.07 }}
                  >
                    <span className={styles.staggerText}>{item.label}</span>
                  </motion.div>
                )
              })}
            </div>

          </div>
        </div>
      </section>
    )
  }

  // consulting
  return (
    <section className={styles.section} aria-label="Решение">
      <div className={styles.inner}>
        <div className={styles.consultingLayout}>
          <motion.div
            className={styles.consultingLeft}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className={styles.headline}>{headline}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </motion.div>

          <motion.div
            className={styles.consultingRight}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <ConsultingMap />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
