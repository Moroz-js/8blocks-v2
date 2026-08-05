'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { computeStructureScore } from '@/shared/lib/platform/tokenlab/scoringV3'
import {
  calcUnlockPressure12m,
  getPressureTag,
} from '@/shared/lib/platform/tokenlab/pressure'
import { calcInitialCircPercent } from '@/shared/lib/platform/tokenlab/calc'
import { fmtShort } from '@/shared/lib/platform/tokenlab/format'
import { compareWithMarket } from '@/shared/lib/platform/tokenlab/benchmarkNorms'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { Button } from '@/shared/ui/Button'
import { t } from '@/shared/i18n'
import {
  copy,
  localizeArchetype,
  localizeCap,
  localizeDimension,
  localizeFix,
  localizeTier,
} from './copy'
import { UnlockChart } from './UnlockChart'
import { CtaLadder } from './CtaLadder'
import styles from './TokenLab.module.scss'

const local = t({
  ru: {
    pressure: { Low: 'Низкое', Elevated: 'Повышенное', High: 'Высокое' },
    market: {
      team: 'Доля команды',
      investors: 'Доля инвесторов',
      tgeFloat: 'Float на TGE',
      teamCliff: 'Клифф команды',
      teamVesting: 'Вестинг команды',
    },
    above: 'выше',
    below: 'ниже',
    model: 'Модель токена',
    token: 'TOKEN',
  },
  en: {
    pressure: { Low: 'Low', Elevated: 'Elevated', High: 'High' },
    market: {
      team: 'Team share',
      investors: 'Investor share',
      tgeFloat: 'TGE float',
      teamCliff: 'Team cliff',
      teamVesting: 'Team vesting',
    },
    above: 'above',
    below: 'below',
    model: 'Token model',
    token: 'TOKEN',
  },
})

function scoreColor(score: number) {
  if (score >= 70) return 'var(--success-fg)'
  if (score >= 55) return '#d69e35'
  return 'var(--error-fg)'
}

function ScoreRing({ score }: { score: number }) {
  const radius = 84
  const circumference = 2 * Math.PI * radius
  const color = scoreColor(score)
  return (
    <div className={styles.scoreRing}>
      <svg viewBox="0 0 200 200" aria-hidden>
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--border-secondary)"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
        />
      </svg>
      <div className={styles.scoreCenter}>
        <strong className={styles.scoreValue} style={{ color }}>
          {score}
        </strong>
        <span className={styles.label}>/ 100</span>
      </div>
    </div>
  )
}

export function ResultsStep({ model }: { model: TokenModel }) {
  const { allocations, vestings, totalSupply } = model
  const result = useMemo(
    () => computeStructureScore(allocations, vestings),
    [allocations, vestings],
  )
  const pressure = useMemo(
    () => calcUnlockPressure12m(allocations, vestings, totalSupply),
    [allocations, vestings, totalSupply],
  )
  const pressureTag = getPressureTag(pressure)
  const initialCirculation = calcInitialCircPercent(allocations, vestings)
  const worst = [...result.dimensions].sort((a, b) => a.score - b.score)[0]
  const tier = localizeTier(result.tier.name, result.tier.meaning)
  const archetype = localizeArchetype(
    result.archetype.id,
    result.archetype.label,
    result.archetype.explain,
  )
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [archetypeOpen, setArchetypeOpen] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [reportState, setReportState] = useState<
    'idle' | 'sending' | 'done' | 'error'
  >('idle')

  async function copyShareLink() {
    const url = `${window.location.origin}${window.location.pathname}?m=${encodeModel(model)}`
    await navigator.clipboard.writeText(url)
    setShareState('copied')
    trackPlatformEvent('share_link_created', {
      score: result.score,
      tier: result.tier.name,
    })
    window.setTimeout(() => setShareState('idle'), 2000)
  }

  async function downloadPdf() {
    if (pdfBusy) return
    setPdfBusy(true)
    try {
      const { generatePdfReportV3 } = await import(
        '@/shared/lib/platform/tokenlab/export-pdf-v3'
      )
      generatePdfReportV3({
        name: model.name || local.model,
        symbol: model.symbol || local.token,
        totalSupply,
        allocations,
        vestings,
        result,
      })
      trackPlatformEvent('pdf_exported', {
        score: result.score,
        tier: result.tier.name,
      })
    } finally {
      setPdfBusy(false)
    }
  }

  async function emailReport(event: React.FormEvent) {
    event.preventDefault()
    if (reportState === 'sending') return
    setReportState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: model.name || 'Token Lab report',
          email,
          message: `Token Lab PDF follow-up. Structure score: ${result.score}; tier: ${result.tier.name}; symbol: ${model.symbol || local.token}.`,
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      await downloadPdf()
      setReportState('done')
      trackPlatformEvent('lead_form_submit', {
        form: 'email_report',
        tier: result.tier.name,
      })
    } catch {
      setReportState('error')
    }
  }

  return (
    <div className={styles.resultStack}>
      <section className={`${styles.card} ${styles.scoreHero}`}>
        <div className={styles.scoreLayout}>
          <ScoreRing score={result.score} />
          <div>
            <div className={styles.label}>{copy.results.structureScore}</div>
            <div className={styles.badges}>
              <span
                className={styles.tierBadge}
                style={{ color: scoreColor(result.score) }}
              >
                {tier.name}
              </span>
              <button
                type="button"
                onClick={() => setArchetypeOpen((value) => !value)}
                className={styles.archetypeButton}
              >
                {copy.results.scoredAs}: {archetype.label}{' '}
                {archetypeOpen ? '−' : '+'}
              </button>
            </div>
            {archetypeOpen && (
              <p className={styles.fine}>
                {archetype.explanation} {copy.results.archetypeNote}
              </p>
            )}
            <p className={styles.scoreMeaning}>{tier.meaning}</p>
            <div className={styles.scoreStats}>
              <span>
                {copy.preview.tgeFloat}{' '}
                <strong>{initialCirculation.toFixed(1)}%</strong>
              </span>
              <span>
                {copy.results.pressure}{' '}
                <strong>
                  {pressure.toFixed(1)}% ·{' '}
                  {local.pressure[pressureTag as keyof typeof local.pressure] ??
                    pressureTag}
                </strong>
              </span>
              <span>
                {copy.results.supply} <strong>{fmtShort(totalSupply)}</strong>
              </span>
            </div>
            <div className={styles.scoreActions}>
              <Button
                type="button"
                onClick={downloadPdf}
                loading={pdfBusy}
              >
                {pdfBusy ? copy.results.preparing : copy.results.download}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={copyShareLink}
              >
                {shareState === 'copied'
                  ? copy.results.copied
                  : copy.results.copyLink}
              </Button>
            </div>
            {reportState === 'done' ? (
              <p className={styles.good}>{copy.results.reportDone}</p>
            ) : (
              <form onSubmit={emailReport} className={styles.emailRow}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={copy.results.emailPlaceholder}
                  aria-label={copy.results.emailAria}
                  className={styles.input}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  loading={reportState === 'sending'}
                >
                  {reportState === 'sending'
                    ? copy.results.sending
                    : copy.results.send}
                </Button>
              </form>
            )}
            {reportState === 'error' && (
              <p className={styles.bad}>{copy.cta.error}</p>
            )}
          </div>
        </div>
      </section>

      {result.caps.map((cap) => (
        <div key={cap.id} className={styles.cap}>
          {localizeCap(cap.id, cap.message)}
        </div>
      ))}

      <section className={styles.card}>
        <div className={styles.label}>{copy.results.dimensions}</div>
        <div className={styles.dimensionList}>
          {result.dimensions.map((dimension) => {
            const localized = localizeDimension(dimension)
            return (
              <div key={dimension.id}>
                <div className={styles.dimensionHeader}>
                  <span className={styles.dimensionName}>{localized.name}</span>
                  <strong style={{ color: scoreColor(dimension.score) }}>
                    {dimension.score}
                  </strong>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${dimension.score}%`,
                      background: scoreColor(dimension.score),
                    }}
                  />
                </div>
                <p className={styles.fine}>{localized.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {result.topFixes.length > 0 && (
        <section className={`${styles.card} ${styles.cardAccent}`}>
          <div className={styles.label}>{copy.results.fixes}</div>
          <ul className={styles.fixList}>
            {result.topFixes.map((fix) => (
              <li key={fix.label} className={styles.fix}>
                <span>{localizeFix(fix.label)}</span>
                <strong className={styles.good}>
                  +{fix.gain} {copy.results.points}
                </strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.card}>
        <div className={styles.marketHeader}>
          <div className={styles.label}>{copy.results.market}</div>
          <Link
            href="/learn/token-vesting-benchmarks"
            onClick={() =>
              trackPlatformEvent('cta_click', {
                target: 'benchmarks_from_results',
              })
            }
          >
            {copy.results.benchmarks}
          </Link>
        </div>
        <div className={styles.marketGrid}>
          {compareWithMarket(allocations, vestings).map((check) => (
            <div key={check.key} className={styles.marketCard}>
              <div className={styles.label}>
                {local.market[check.key as keyof typeof local.market] ??
                  check.label}
              </div>
              <div className={styles.marketValue}>{check.yours}</div>
              <div className={styles.fine}>
                {copy.results.norm} {check.norm} ·{' '}
                {check.status === 'within'
                  ? copy.results.within
                  : check.status === 'above'
                    ? local.above
                    : local.below}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.label}>{copy.results.unlockSchedule}</div>
        <UnlockChart
          allocations={allocations}
          vestings={vestings}
          totalSupply={totalSupply}
        />
      </section>

      <CtaLadder
        grade={result.tier.name}
        score={result.score}
        worst={
          worst.score < 70
            ? {
                name: localizeDimension(worst).name,
                score: worst.score,
              }
            : null
        }
      />
      <p className={styles.fine}>{copy.results.disclaimer}</p>
    </div>
  )
}
