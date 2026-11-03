'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { Button } from '@/shared/ds'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import { computeStructureScore } from '@/shared/lib/platform/tokenlab/scoringV3'
import { calcUnlockPressure12m, getPressureTag } from '@/shared/lib/platform/tokenlab/pressure'
import { calcInitialCircPercent } from '@/shared/lib/platform/tokenlab/calc'
import { fmtShort, fmtSpace } from '@/shared/lib/platform/tokenlab/format'
import { compareWithMarket } from '@/shared/lib/platform/tokenlab/benchmarkNorms'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { apiPath } from '@/shared/lib/apiPath'
import { t } from '@/shared/i18n'
import { bucketCopy, copy, localizeArchetype, localizeCap, localizeDimension, localizeFix, localizeTier } from './copy'
import { CtaLadder } from './CtaLadder'
import { Hint } from './Hint'
import { RadarChart } from './RadarChart'
import { UnlockChart } from './UnlockChart'
import styles from './Results.module.scss'

const local = t({
  ru: {
    pressure: { Low: 'Низкое', Moderate: 'Умеренное', Elevated: 'Повышенное', High: 'Высокое' },
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
    improvement: 'Улучшение №{n}',
    radar: 'Пять измерений Structure Score',
    leadName: 'Отчёт Token Lab',
    leadMessage: 'Запрос PDF-отчёта Token Lab. Оценка структуры: {score}; уровень: {tier}; тикер: {symbol}.',
  },
  en: {
    pressure: { Low: 'Low', Moderate: 'Moderate', Elevated: 'Elevated', High: 'High' },
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
    improvement: 'Improvement #{n}:',
    radar: 'The five Structure Score dimensions',
    leadName: 'Token Lab report',
    leadMessage: 'Token Lab PDF follow-up. Structure score: {score}; tier: {tier}; symbol: {symbol}.',
  },
})

function level(score: number): 'good' | 'medium' | 'bad' {
  return score >= 70 ? 'good' : score >= 55 ? 'medium' : 'bad'
}

const COLOR = { good: 'var(--ds-success)', medium: 'var(--ds-warning)', bad: 'var(--ds-danger)' } as const
const TONE_CLASS = { good: styles.good, medium: styles.medium, bad: styles.bad } as const

export function ResultsStep({ model, onEdit }: { model: TokenModel; onEdit: () => void }) {
  const { allocations, vestings, totalSupply } = model
  const result = useMemo(() => computeStructureScore(allocations, vestings), [allocations, vestings])
  const pressure = useMemo(() => calcUnlockPressure12m(allocations, vestings, totalSupply), [allocations, vestings, totalSupply])
  const pressureTag = getPressureTag(pressure)
  const initialCirculation = calcInitialCircPercent(allocations, vestings)
  const worst = [...result.dimensions].sort((a, b) => a.score - b.score)[0]
  const tier = localizeTier(result.tier.name, result.tier.meaning)
  const archetype = localizeArchetype(result.archetype.id, result.archetype.label, result.archetype.explain)
  const scoreLevel = level(result.score)
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [pdfBusy, setPdfBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function copyShareLink() {
    const url = `${window.location.origin}${window.location.pathname}?m=${encodeModel(model)}`
    await navigator.clipboard.writeText(url)
    setShareState('copied')
    trackPlatformEvent('share_link_created', { score: result.score, tier: result.tier.name })
    window.setTimeout(() => setShareState('idle'), 2000)
  }

  async function downloadPdf() {
    if (pdfBusy) return
    setPdfBusy(true)
    try {
      const { generatePdfReportV3 } = await import('@/shared/lib/platform/tokenlab/export-pdf-v3')
      generatePdfReportV3({
        name: model.name || local.model,
        symbol: model.symbol || local.token,
        totalSupply,
        allocations,
        vestings,
        result,
      })
      trackPlatformEvent('pdf_exported', { score: result.score, tier: result.tier.name })
    } finally {
      setPdfBusy(false)
    }
  }

  async function emailReport(event: React.FormEvent) {
    event.preventDefault()
    if (reportState === 'sending') return
    setReportState('sending')
    try {
      const response = await fetch(apiPath('/api/contact'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: model.name || local.leadName,
          email,
          message: local.leadMessage
            .replace('{score}', String(result.score))
            .replace('{tier}', result.tier.name)
            .replace('{symbol}', model.symbol || local.token),
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      await downloadPdf()
      setReportState('done')
      trackPlatformEvent('lead_form_submit', { form: 'email_report', tier: result.tier.name })
    } catch {
      setReportState('error')
    }
  }

  const activeBuckets = STANDARD_BUCKETS.filter((definition) =>
    allocations.some((item) => item.key === definition.key && item.enabled && item.percent > 0),
  )
  const vestingLine = (key: (typeof STANDARD_BUCKETS)[number]['key']) => {
    const config = vestings.find((item) => item.bucketKey === key)
    if (!config) return '—'
    if (config.tgePercent >= 100) return `100% TGE`
    return [
      `${config.tgePercent}% TGE`,
      config.cliffMonths ? copy.results.cliff.replace('{value}', String(config.cliffMonths)) : copy.results.noCliff,
      copy.results.vestingMonths.replace('{value}', String(config.vestingMonths)),
    ].join(' · ')
  }

  return (
    <div className={styles.results}>
      <div className={styles.row2}>
        <section className={clsx(styles.card, styles.readiness)}>
          <p className={styles.eyebrow}>{copy.results.readiness}</p>
          <h3 className={clsx(styles.tier, TONE_CLASS[scoreLevel])}>{tier.name}</h3>
          <p className={styles.score}>
            <strong>{result.score}</strong> / 100 · {copy.results.structureScore}
          </p>
          <p className={styles.body}>{tier.meaning}</p>
          <p className={styles.note}>
            {copy.results.scoredAs}: {archetype.label}. {archetype.explanation} {copy.results.archetypeNote}
          </p>
          {result.caps.map((cap) => (
            <p key={cap.id} className={styles.cap}>
              {localizeCap(cap.id, cap.message)}
            </p>
          ))}
          <div className={styles.actions}>
            <Button onClick={downloadPdf} disabled={pdfBusy}>
              {pdfBusy ? copy.results.preparing : copy.results.download}
            </Button>
            <Button variant="secondary" onClick={copyShareLink}>
              {shareState === 'copied' ? copy.results.copied : copy.results.copyLink}
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
              <Button type="submit" variant="secondary" disabled={reportState === 'sending'}>
                {reportState === 'sending' ? copy.results.sending : copy.results.send}
              </Button>
            </form>
          )}
          {reportState === 'error' && <p className={styles.bad}>{copy.cta.error}</p>}
        </section>

        <section className={clsx(styles.card, styles.radarCard)}>
          <RadarChart
            label={local.radar}
            color={COLOR[scoreLevel]}
            axes={result.dimensions.map((dimension) => ({
              id: dimension.id,
              label: localizeDimension(dimension).name,
              score: dimension.score,
            }))}
          />
        </section>
      </div>

      <div className={styles.row2}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>{copy.results.keyMetrics}</h3>
          <dl className={styles.rows}>
            <div className={styles.rowItem}>
              <dt>
                <Hint text={copy.preview.hints.tgeFloat} />
                {copy.preview.tgeFloat}
              </dt>
              <dd>{initialCirculation.toFixed(1)}%</dd>
            </div>
            <div className={styles.rowItem}>
              <dt>
                <Hint text={copy.preview.hints.pressure} />
                {copy.results.pressure}
              </dt>
              <dd>
                {pressure.toFixed(1)}% · {local.pressure[pressureTag as keyof typeof local.pressure] ?? pressureTag}
              </dd>
            </div>
            <div className={styles.rowItem}>
              <dt>
                <Hint text={copy.preview.hints.supply} />
                {copy.results.supply}
              </dt>
              <dd>{fmtShort(totalSupply)}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>{copy.results.inputs}</h3>
            <button type="button" className={styles.edit} onClick={onEdit}>
              {copy.results.edit}
            </button>
          </div>
          <dl className={styles.rows}>
            <div className={styles.rowItem}>
              <dt>{copy.results.token}</dt>
              <dd>{[model.name, model.symbol].filter(Boolean).join(' · ') || '—'}</dd>
            </div>
            <div className={styles.rowItem}>
              <dt>{copy.results.supply}</dt>
              <dd>{fmtSpace(totalSupply)}</dd>
            </div>
            <div className={styles.rowItem}>
              <dt>{copy.results.allocation}</dt>
              <dd>
                {activeBuckets
                  .map((definition) => `${bucketCopy[definition.key][0]} ${allocations.find((item) => item.key === definition.key)?.percent}%`)
                  .join(' · ')}
              </dd>
            </div>
            {activeBuckets.map((definition) => (
              <div key={definition.key} className={styles.rowItem}>
                <dt>{bucketCopy[definition.key][0]}</dt>
                <dd>{vestingLine(definition.key)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{copy.results.dimensions}</h3>
        <ul className={styles.dimensions}>
          {result.dimensions.map((dimension) => {
            const localized = localizeDimension(dimension)
            const dimensionLevel = level(dimension.score)
            return (
              <li key={dimension.id} className={styles.dimension}>
                <div className={styles.dimensionHead}>
                  <span>{localized.name}</span>
                  <strong className={TONE_CLASS[dimensionLevel]}>{dimension.score}</strong>
                </div>
                <span className={styles.bar} aria-hidden="true">
                  <span className={styles.barFill} style={{ width: `${dimension.score}%`, background: COLOR[dimensionLevel] }} />
                </span>
                <p className={styles.note}>{localized.description}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>{copy.results.unlockTitle}</h3>
        </div>
        <UnlockChart allocations={allocations} vestings={vestings} totalSupply={totalSupply} />
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>{copy.results.benchmarksTitle}</h3>
          <Link
            href="/learn/token-vesting-benchmarks"
            className={styles.link}
            onClick={() => trackPlatformEvent('cta_click', { target: 'benchmarks_from_results' })}
          >
            {copy.results.benchmarks}
          </Link>
        </div>
        <ul className={styles.market}>
          {compareWithMarket(allocations, vestings).map((check) => (
            <li key={check.key} className={styles.marketItem}>
              <span className={styles.eyebrow}>{local.market[check.key as keyof typeof local.market] ?? check.label}</span>
              <strong className={styles.marketValue}>{check.yours}</strong>
              <span className={styles.note}>
                {copy.results.average} {check.norm} ·{' '}
                <span className={check.status === 'within' ? styles.good : styles.medium}>
                  {check.status === 'within' ? copy.results.within : check.status === 'above' ? local.above : local.below}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {result.topFixes.length > 0 && (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>{copy.results.fixes}</h3>
          <ol className={styles.fixes}>
            {result.topFixes.map((fix, index) => (
              <li key={fix.label} className={styles.fix}>
                <span className={styles.eyebrow}>{local.improvement.replace('{n}', String(index + 1))}</span>
                <span className={styles.fixTitle}>{localizeFix(fix.label)}</span>
                <strong className={styles.good}>
                  +{fix.gain} {copy.results.points}
                </strong>
              </li>
            ))}
          </ol>
        </section>
      )}

      <CtaLadder
        grade={result.tier.name}
        score={result.score}
        worst={worst.score < 70 ? { name: localizeDimension(worst).name, score: worst.score } : null}
      />
      <p className={styles.note}>{copy.results.disclaimer}</p>
    </div>
  )
}
