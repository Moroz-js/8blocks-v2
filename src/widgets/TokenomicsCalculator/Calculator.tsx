'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/shared/ds'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { createDefaultModel } from '@/shared/lib/platform/tokenlab/model'
import type {
  AllocationBucket,
  VestingConfig,
} from '@/shared/lib/platform/tokenlab/types'
import { calcInitialCircPercent } from '@/shared/lib/platform/tokenlab/calc'
import { calcTotalPercent, isFullyAllocated } from '@/shared/lib/platform/tokenlab/validate'
import { autoBalance } from '@/shared/lib/platform/tokenlab/autoBalance'
import { computeStructureScore } from '@/shared/lib/platform/tokenlab/scoringV3'
import {
  calcCumulativeCirculating,
  calcPeakMonthlyUnlock,
  calcTotalMonthlyUnlocks,
} from '@/shared/lib/platform/tokenlab/unlocks'
import { calcUnlockPressure12m } from '@/shared/lib/platform/tokenlab/pressure'
import { detectSpikes } from '@/shared/lib/platform/tokenlab/spikes'
import { fmtShort } from '@/shared/lib/platform/tokenlab/format'
import { decodeModel, encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { INSIDER_KEYS } from './bucketColors'
import { copy, localizeTier } from './copy'
import { AllocationStep } from './AllocationStep'
import { BasicsStep } from './BasicsStep'
import { DonutChart } from './DonutChart'
import { Hint } from './Hint'
import { ResultsStep } from './ResultsStep'
import { UnlockChart } from './UnlockChart'
import { VestingStep } from './VestingStep'
import styles from './Calculator.module.scss'

type StepKey = 'basics' | 'allocation' | 'vesting' | 'results'

const STEPS: StepKey[] = ['basics', 'allocation', 'vesting', 'results']
const DRAFT_KEY = 'tokenlab-draft'

// Figma preview opens on 10M supply.
const createInitialModel = (): TokenModel => ({ ...createDefaultModel(), totalSupply: 10_000_000 })

function tone(level: 'good' | 'medium' | 'bad') {
  return level === 'good' ? styles.good : level === 'medium' ? styles.medium : styles.bad
}

/**
 * The calculator: three input steps with a live preview and the results step.
 * Logic and state handling are the v1 calculator's; the markup follows the
 * Figma preview (3608:10896) and design system v2.
 */
export function Calculator() {
  const [model, setModel] = useState<TokenModel>(createInitialModel)
  const [step, setStep] = useState<StepKey>('basics')
  const [forkBanner, setForkBanner] = useState(false)
  const [invalidBanner, setInvalidBanner] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [hovered, setHovered] = useState<AllocationBucket['key'] | null>(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('m')
    if (encoded) {
      const shared = decodeModel(encoded)
      if (!shared) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot URL hydration
        setInvalidBanner(true)
        return
      }
      setModel(shared)
      startedRef.current = true
      window.dispatchEvent(new CustomEvent('tokenlab:started'))
      if (params.get('fork') === '1') {
        setStep('vesting')
        setForkBanner(true)
        trackPlatformEvent('benchmark_fork_opened', { symbol: shared.symbol || undefined })
      } else {
        setStep('results')
        trackPlatformEvent('shared_view_opened', { symbol: shared.symbol || undefined })
      }
      // A shared link lands on the tool, not on the hero.
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: 'start' }))
      return
    }
    try {
      const draft = window.localStorage.getItem(DRAFT_KEY)
      if (!draft) return
      const saved = decodeModel(draft)
      if (saved) {
        setModel(saved)
        setDraftRestored(true)
      } else {
        window.localStorage.removeItem(DRAFT_KEY)
      }
    } catch {
      // Draft persistence is best-effort.
    }
  }, [])

  useEffect(() => {
    if (!startedRef.current) return
    try {
      window.localStorage.setItem(DRAFT_KEY, encodeModel(model))
    } catch {
      // Draft persistence is best-effort.
    }
  }, [model])

  function markStarted() {
    if (startedRef.current) return
    startedRef.current = true
    trackPlatformEvent('tool_start', { tool: 'tokenlab' })
    window.dispatchEvent(new CustomEvent('tokenlab:started'))
  }

  function goTo(next: StepKey) {
    markStarted()
    setStep(next)
    trackPlatformEvent('tool_step', { tool: 'tokenlab', step: next })
  }

  function runAnalysis() {
    goTo('results')
    if (!completedRef.current && startedRef.current && isFullyAllocated(model.allocations)) {
      completedRef.current = true
      trackPlatformEvent('tool_complete', { tool: 'tokenlab' })
    }
  }

  function startFresh() {
    try {
      window.localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Ignore storage restrictions.
    }
    setModel(createInitialModel())
    setDraftRestored(false)
    setInvalidBanner(false)
    setForkBanner(false)
    setStep('basics')
    startedRef.current = false
    completedRef.current = false
    window.history.replaceState({}, '', window.location.pathname)
  }

  function patchModel(patch: Partial<TokenModel>) {
    markStarted()
    setModel((current) => ({ ...current, ...patch }))
  }

  function setAllocations(allocations: AllocationBucket[]) {
    patchModel({ allocations })
  }

  function setVestings(vestings: VestingConfig[]) {
    patchModel({ vestings })
  }

  const total = calcTotalPercent(model.allocations)
  const complete = isFullyAllocated(model.allocations)
  const initialCirculation = calcInitialCircPercent(model.allocations, model.vestings)
  const insiderShare = useMemo(
    () =>
      model.allocations
        .filter((item) => item.enabled && INSIDER_KEYS.includes(item.key))
        .reduce((sum, item) => sum + item.percent, 0),
    [model.allocations],
  )
  const liveScore = useMemo(
    () => computeStructureScore(model.allocations, model.vestings),
    [model.allocations, model.vestings],
  )
  const liveTier = localizeTier(liveScore.tier.name, liveScore.tier.meaning)
  const vestingStats = useMemo(() => {
    const monthly = calcTotalMonthlyUnlocks(model.allocations, model.vestings, model.totalSupply)
    const circulating = calcCumulativeCirculating(monthly)
    return {
      spikes: detectSpikes(monthly, circulating, model.totalSupply),
      peak: calcPeakMonthlyUnlock(monthly),
      pressure: calcUnlockPressure12m(model.allocations, model.vestings, model.totalSupply),
    }
  }, [model])

  const stepper = (
    <ol className={styles.stepper}>
      {STEPS.map((key, index) => (
        <li
          key={key}
          aria-current={step === key ? 'step' : undefined}
          className={clsx(styles.stepperItem, step === key && styles.stepperOn)}
        >
          {index + 1}. {copy.steps[key]}
        </li>
      ))}
    </ol>
  )

  const banners = (
    <>
      {invalidBanner && (
        <p className={clsx(styles.banner, styles.bannerBad)} role="alert">
          <span>{copy.banners.invalid}</span>
          <button type="button" className={styles.bannerAction} onClick={() => setInvalidBanner(false)}>
            {copy.banners.dismiss}
          </button>
        </p>
      )}
      {forkBanner && (
        <p className={clsx(styles.banner, styles.bannerWarn)}>
          <span>{copy.banners.fork}</span>
          <button type="button" className={styles.bannerAction} onClick={() => setForkBanner(false)}>
            {copy.banners.dismiss}
          </button>
        </p>
      )}
      {draftRestored && (
        <p className={styles.banner}>
          <span>{copy.banners.restored}</span>
          <button type="button" className={styles.bannerAction} onClick={startFresh}>
            {copy.navigation.startFresh}
          </button>
        </p>
      )}
    </>
  )

  if (step === 'results') {
    return (
      <div ref={rootRef} className={styles.calculator}>
        <div className={styles.resultsNav}>{stepper}</div>
        {banners}
        <ResultsStep model={model} onEdit={() => goTo('basics')} />
        <div className={styles.actionsStart}>
          <Button variant="secondary" onClick={() => goTo('vesting')} icon={<span aria-hidden="true">←</span>} iconPosition="left">
            {copy.navigation.adjust}
          </Button>
        </div>
      </div>
    )
  }

  const allocationMessage = !complete
    ? (total > 100 ? copy.allocation.remove : copy.allocation.remaining).replace('{value}', Math.abs(total > 100 ? total - 100 : 100 - total).toFixed(0))
    : null

  return (
    <div ref={rootRef} className={styles.calculator}>
      <div className={styles.layout}>
        <section className={clsx(styles.panel, styles.form)}>
          {stepper}
          {banners}
          <div className={styles.stepContent} key={step}>
            {step === 'basics' && <BasicsStep model={model} onChange={patchModel} />}
            {step === 'allocation' && <AllocationStep allocations={model.allocations} onChange={setAllocations} hovered={hovered} />}
            {step === 'vesting' && <VestingStep allocations={model.allocations} vestings={model.vestings} onChange={setVestings} />}
          </div>
          <div className={step === 'basics' ? styles.actionsEnd : styles.actionsSplit}>
            {step !== 'basics' && (
              <Button
                variant="secondary"
                onClick={() => goTo(step === 'vesting' ? 'allocation' : 'basics')}
                icon={<span aria-hidden="true">←</span>}
                iconPosition="left"
              >
                {step === 'vesting' ? copy.navigation.backAllocation : copy.navigation.backBasics}
              </Button>
            )}
            {step === 'basics' && (
              <Button onClick={() => goTo('allocation')} icon={<span aria-hidden="true">→</span>}>
                {copy.navigation.continueAllocation}
              </Button>
            )}
            {step === 'allocation' && (
              <Button disabled={!complete} onClick={() => goTo('vesting')} icon={<span aria-hidden="true">→</span>}>
                {copy.navigation.continueVesting}
              </Button>
            )}
            {step === 'vesting' && (
              <Button onClick={runAnalysis} icon={<span aria-hidden="true">→</span>}>
                {copy.navigation.run}
              </Button>
            )}
          </div>
        </section>

        <aside className={clsx(styles.panel, styles.side)}>
          {step === 'vesting' ? (
            <>
              <h3 className={styles.sideTitle}>{copy.preview.unlockPreview}</h3>
              <UnlockChart allocations={model.allocations} vestings={model.vestings} totalSupply={model.totalSupply} height={280} labelSize={16} />
              <dl className={styles.stats}>
                <div className={styles.stat}>
                  <dt>
                    <Hint text={copy.preview.hints.pressure} />
                    {copy.preview.pressure}
                  </dt>
                  <dd>{vestingStats.pressure.toFixed(1)}%</dd>
                </div>
                <div className={styles.stat}>
                  <dt>
                    <Hint text={copy.preview.hints.peak} />
                    {copy.preview.peak}
                  </dt>
                  <dd>
                    M{vestingStats.peak.month} · {fmtShort(vestingStats.peak.amount)}
                  </dd>
                </div>
                <div className={styles.stat}>
                  <dt>
                    <Hint text={copy.preview.hints.spikes} />
                    {copy.preview.spikes}
                  </dt>
                  <dd className={vestingStats.spikes.length ? styles.bad : undefined}>{vestingStats.spikes.length}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <DonutChart allocations={model.allocations} label={model.symbol || copy.preview.ticker} sliceNote={copy.preview.sliceNote} onHover={setHovered} />
              <div className={styles.total}>
                <div className={styles.totalRow}>
                  <span>{copy.allocation.total}</span>
                  <span className={styles.totalValue}>
                    {!complete && (
                      <button
                        type="button"
                        className={styles.autoBalance}
                        onClick={() => {
                          setAllocations(autoBalance(model.allocations))
                          trackPlatformEvent('auto_balance_used')
                        }}
                      >
                        {copy.allocation.auto}
                      </button>
                    )}
                    <span className={tone(complete ? 'good' : total > 100 ? 'bad' : 'medium')}>{total.toFixed(0)}%</span>
                  </span>
                </div>
                <span className={styles.bar} aria-hidden="true">
                  <span
                    className={clsx(styles.barFill, complete ? styles.barGood : total > 100 ? styles.barBad : styles.barMedium)}
                    style={{ width: `${Math.min(total, 100)}%` }}
                  />
                </span>
                {allocationMessage && (
                  <p className={styles.note} role="status">
                    {allocationMessage}
                  </p>
                )}
              </div>
              <dl className={styles.stats}>
                {step === 'allocation' && (
                  <div className={styles.stat}>
                    <dt>
                      <Hint text={copy.preview.hints.liveScore} />
                      {copy.preview.liveScore}
                    </dt>
                    <dd className={tone(liveScore.score >= 70 ? 'good' : liveScore.score >= 55 ? 'medium' : 'bad')}>
                      {liveScore.score} · {liveTier.name}
                    </dd>
                  </div>
                )}
                <div className={styles.stat}>
                  <dt>
                    <Hint text={copy.preview.hints.supply} />
                    {copy.preview.supply}
                  </dt>
                  <dd>{fmtShort(model.totalSupply)}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>
                    <Hint text={copy.preview.hints.insider} />
                    {copy.preview.insider}
                  </dt>
                  <dd className={tone(insiderShare > 30 ? 'bad' : insiderShare > 25 ? 'medium' : 'good')}>{insiderShare.toFixed(0)}%</dd>
                </div>
                <div className={styles.stat}>
                  <dt>
                    <Hint text={copy.preview.hints.tgeFloat} />
                    {copy.preview.tgeFloat}
                  </dt>
                  <dd className={tone(initialCirculation < 6 ? 'bad' : initialCirculation < 10 ? 'medium' : 'good')}>
                    {initialCirculation.toFixed(1)}%
                  </dd>
                </div>
              </dl>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
