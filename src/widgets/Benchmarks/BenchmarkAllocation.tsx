'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { lang, t } from '@/shared/i18n'
import enContent from '@/shared/lib/platform/benchmarks/content.json'
import ruContent from '@/shared/lib/platform/benchmarks/content.ru.json'
import { getDefaultVestingConfigs, STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { pagePath } from '@/widgets/TokenomicsAi/paths'
import styles from './BenchmarkAllocation.module.scss'

interface Source {
  title: string
  url: string
}

interface BucketBenchmark {
  key: string
  label: string
  typicalRange: string
  median: string
  note: string
  source: Source
  source2?: Source
}

const buckets = ((lang === 'ru' ? ruContent : enContent) as { buckets: BucketBenchmark[] }).buckets

function shortRange(typicalRange: string) {
  const match = typicalRange.match(/^\d+(?:\.\d+)?-\d+(?:\.\d+)?%/)
  return match ? match[0] : typicalRange
}

function parsePercent(typicalRange: string) {
  const match = typicalRange.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)%/)
  if (!match) return 15
  return (Number(match[1]) + Number(match[2])) / 2
}

function shortMedian(median: string, typicalRange: string) {
  if (!median.startsWith('n/a') && !median.startsWith('н/д')) {
    return `${t({ en: 'median', ru: 'медиана' })} · ${median}`
  }
  const paren = typicalRange.match(/\(([^)]+)\)/)
  if (paren) return paren[1]
  return ''
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

function describeAnnularSector(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngleDeg: number,
  endAngleDeg: number,
) {
  const sweep = Math.max(0.5, endAngleDeg - startAngleDeg)
  const effectiveEnd = startAngleDeg + sweep
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngleDeg)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, effectiveEnd)
  const innerEnd = polarToCartesian(cx, cy, innerRadius, effectiveEnd)
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngleDeg)
  const largeArc = sweep > 180 ? 1 : 0

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    'Z',
  ].join(' ')
}

interface ComputedSlice {
  key: string
  label: string
  startAngle: number
  endAngle: number
  path: string
}

function AllocationDonut({
  activeKey,
  onSelect,
}: {
  activeKey: string
  onSelect: (key: string) => void
}) {
  const cx = 247
  const cy = 247
  const outerR = 175
  const innerR = 15.1
  const baseStartDeg = 202

  const slices = useMemo<ComputedSlice[]>(() => {
    const weights = buckets.map((b) => parsePercent(b.typicalRange))
    const totalWeight = weights.reduce((acc, w) => acc + w, 0) || 100
    let cursor = baseStartDeg

    return buckets.map((b, idx) => {
      const sweep = (weights[idx] / totalWeight) * 360
      const startAngle = cursor
      const endAngle = idx === buckets.length - 1 ? baseStartDeg + 360 : cursor + sweep
      cursor = endAngle
      return {
        key: b.key,
        label: b.label,
        startAngle,
        endAngle,
        path: describeAnnularSector(cx, cy, innerR, outerR, startAngle, endAngle),
      }
    })
  }, [])

  const activeSlice = slices.find((s) => s.key === activeKey) ?? slices[0]
  const [renderedArc, setRenderedArc] = useState(() => ({
    start: activeSlice?.startAngle ?? baseStartDeg,
    end: activeSlice?.endAngle ?? baseStartDeg + 40,
  }))
  const currentArcRef = useRef(renderedArc)

  useEffect(() => {
    if (!activeSlice) return
    const fromStart = currentArcRef.current.start
    const fromEnd = currentArcRef.current.end
    const toStart = activeSlice.startAngle
    const toEnd = activeSlice.endAngle

    if (Math.abs(fromStart - toStart) < 0.05 && Math.abs(fromEnd - toEnd) < 0.05) {
      return
    }

    let raf = 0
    const duration = 420
    const t0 = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = {
        start: fromStart + (toStart - fromStart) * eased,
        end: fromEnd + (toEnd - fromEnd) * eased,
      }
      currentArcRef.current = next
      setRenderedArc(next)
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [activeSlice])

  const animatedSlicePath = describeAnnularSector(cx, cy, innerR, outerR, renderedArc.start, renderedArc.end)

  const ringPath = [
    `M ${cx + outerR} ${cy}`,
    `A ${outerR} ${outerR} 0 1 1 ${cx - outerR} ${cy}`,
    `A ${outerR} ${outerR} 0 1 1 ${cx + outerR} ${cy}`,
    `M ${cx - innerR} ${cy}`,
    `A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`,
    `A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy}`,
    'Z',
  ].join(' ')

  return (
    <svg className={styles.donutSvg} viewBox="0 0 494 494" fill="none">
      <defs>
        <filter id="donut-ring-inner" x="60" y="60" width="374" height="374" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="14.53" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="shape" result="innerShadow" />
        </filter>

        <radialGradient id="donut-slice-grad" cx={cx} cy={cy} r={outerR} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8f0040" />
          <stop offset="55%" stopColor="#b80052" />
          <stop offset="100%" stopColor="#d4005e" />
        </radialGradient>

        <filter id="donut-slice-shadow" x="60" y="60" width="374" height="374" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.72 0 0 0 0 0.86 0 0 0 0.38 0" />
          <feBlend mode="screen" in2="shape" result="sliceInnerGlow" />
        </filter>
      </defs>

      <g opacity="0.4" filter="url(#donut-ring-inner)">
        <path d={ringPath} fill="#181818" fillOpacity="0.01" fillRule="evenodd" />
      </g>

      {slices.map((slice) => (
        <path
          key={slice.key}
          d={slice.path}
          className={styles.inactiveSlice}
          onClick={() => onSelect(slice.key)}
        >
          <title>{slice.label}</title>
        </path>
      ))}

      {activeSlice && (
        <g filter="url(#donut-slice-shadow)" pointerEvents="none">
          <path className={styles.slicePath} d={animatedSlicePath} fill="url(#donut-slice-grad)" />
        </g>
      )}
    </svg>
  )
}

function renderTextWithArrow(text: string, arrowClassName: string) {
  const trimmed = text.trim()
  const lastSpace = trimmed.lastIndexOf(' ')
  const arrow = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={arrowClassName}
      src={pagePath('/img/benchmarks/arrow-top-right.svg')}
      alt=""
      width={16}
      height={16}
    />
  )
  if (lastSpace === -1) {
    return (
      <span className={styles.nowrapTail}>
        {trimmed}
        {arrow}
      </span>
    )
  }
  return (
    <>
      {trimmed.slice(0, lastSpace + 1)}
      <span className={styles.nowrapTail}>
        {trimmed.slice(lastSpace + 1)}
        {arrow}
      </span>
    </>
  )
}

function buildBucketCalculatorUrl() {
  const allocations = STANDARD_BUCKETS.map((b) => ({
    key: b.key,
    percent: b.defaultPercent,
    enabled: b.defaultEnabled,
  }))
  const vestings = getDefaultVestingConfigs()
  return pagePath(
    `/product/calculator?m=${encodeModel({
      name: '8Blocks Benchmark',
      symbol: 'BENCH',
      totalSupply: 1_000_000_000,
      fdv: null,
      allocations,
      vestings,
    })}&fork=1`,
  )
}

export function BenchmarkAllocation({ fontClass }: { fontClass: string }) {
  const [activeKey, setActiveKey] = useState(buckets[0]?.key ?? 'team')
  const activeBucket = buckets.find((item) => item.key === activeKey) ?? buckets[0]
  const calculatorUrl = useMemo(() => buildBucketCalculatorUrl(), [])

  if (!activeBucket) return null

  const rangeText = shortRange(activeBucket.typicalRange)
  const subText = shortMedian(activeBucket.median, activeBucket.typicalRange)

  return (
    <section className={`${styles.allocation} ${fontClass}`} aria-labelledby="benchmark-allocation-title">
      <div className={styles.inner}>
        <h2 id="benchmark-allocation-title">
          {t({ en: 'Allocation', ru: 'Бенчмарки' })}
          <br />
          {t({ en: 'benchmarks by bucket', ru: 'аллокаций по корзинам' })}
        </h2>

        <div className={styles.grid}>
          <div className={styles.sidebar} role="tablist" aria-label={t({ en: 'Allocation buckets', ru: 'Корзины аллокаций' })}>
            {buckets.map((bucket) => {
              const isActive = bucket.key === activeBucket.key
              return (
                <button
                  key={bucket.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={isActive ? styles.bucketActive : styles.bucket}
                  onClick={() => setActiveKey(bucket.key)}
                >
                  {bucket.label}
                </button>
              )
            })}
          </div>

          <div className={styles.centerCol}>
            <div className={styles.donutWrap}>
              <AllocationDonut activeKey={activeBucket.key} onSelect={setActiveKey} />
              <div key={activeBucket.key} className={styles.donutText}>
                <p className={styles.range}>{rangeText}</p>
                {subText && <p className={styles.median}>{subText}</p>}
              </div>
              <div className={styles.actions}>
                <a className={styles.btnPrimary} href={pagePath('/product/tokenomics-ai')}>
                  {t({ en: 'Copy to Tokenomics AI', ru: 'Скопировать в Tokenomics AI' })}
                </a>
                <a
                  className={styles.btnSecondary}
                  href={calculatorUrl}
                  onClick={() =>
                    trackPlatformEvent('benchmark_fork_clicked', {
                      project: 'BENCH',
                      category: activeBucket.label,
                    })
                  }
                >
                  {t({ en: 'Copy to Calculator', ru: 'Скопировать в калькулятор' })}
                </a>
              </div>
            </div>
          </div>

          <article key={activeBucket.key} className={styles.rightCol}>
            <h3>{activeBucket.label}</h3>
            <p className={styles.note}>{activeBucket.note}</p>

            <div className={styles.sources}>
              <a
                className={styles.sourceLink}
                href={activeBucket.source.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {activeBucket.source2
                  ? activeBucket.source.title
                  : renderTextWithArrow(activeBucket.source.title, styles.arrow)}
              </a>
              {activeBucket.source2 && (
                <>
                  {' · '}
                  <a
                    className={styles.sourceLink}
                    href={activeBucket.source2.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {renderTextWithArrow(activeBucket.source2.title, styles.arrow)}
                  </a>
                </>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
