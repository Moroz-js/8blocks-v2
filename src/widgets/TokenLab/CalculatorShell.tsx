'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { createDefaultModel } from '@/shared/lib/platform/tokenlab/model'
import type {
  AllocationBucket,
  VestingConfig,
} from '@/shared/lib/platform/tokenlab/types'
import { calcInitialCircPercent } from '@/shared/lib/platform/tokenlab/calc'
import { isFullyAllocated } from '@/shared/lib/platform/tokenlab/validate'
import { computeStructureScore } from '@/shared/lib/platform/tokenlab/scoringV3'
import {
  calcCumulativeCirculating,
  calcPeakMonthlyUnlock,
  calcTotalMonthlyUnlocks,
} from '@/shared/lib/platform/tokenlab/unlocks'
import { calcUnlockPressure12m } from '@/shared/lib/platform/tokenlab/pressure'
import { detectSpikes } from '@/shared/lib/platform/tokenlab/spikes'
import { fmtShort } from '@/shared/lib/platform/tokenlab/format'
import {
  decodeModel,
  encodeModel,
} from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { Button } from '@/shared/ui/Button'
import { BasicsStep } from './BasicsStep'
import { AllocationsStep } from './AllocationsStep'
import { VestingStep } from './VestingStep'
import { ResultsStep } from './ResultsStep'
import { DonutChart } from './DonutChart'
import { UnlockChart } from './UnlockChart'
import { copy, localizeTier } from './copy'
import styles from './TokenLab.module.scss'

type StepKey = 'basics' | 'allocation' | 'vesting' | 'results'

const STEPS: { key: StepKey; number: string }[] = [
  { key: 'basics', number: '01' },
  { key: 'allocation', number: '02' },
  { key: 'vesting', number: '03' },
  { key: 'results', number: '04' },
]

const DRAFT_KEY = 'tokenlab-draft'

export function CalculatorShell() {
  const [model, setModel] = useState<TokenModel>(createDefaultModel)
  const [step, setStep] = useState<StepKey>('basics')
  const [forkBanner, setForkBanner] = useState(false)
  const [invalidBanner, setInvalidBanner] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)

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
        trackPlatformEvent('benchmark_fork_opened', {
          symbol: shared.symbol || undefined,
        })
      } else {
        setStep('results')
        trackPlatformEvent('shared_view_opened', {
          symbol: shared.symbol || undefined,
        })
      }
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
    if (
      !completedRef.current &&
      startedRef.current &&
      isFullyAllocated(model.allocations)
    ) {
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
    setModel(createDefaultModel())
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
    markStarted()
    setModel((current) => ({ ...current, allocations }))
  }

  function setVestings(vestings: VestingConfig[]) {
    markStarted()
    setModel((current) => ({ ...current, vestings }))
  }

  const complete = isFullyAllocated(model.allocations)
  const initialCirculation = calcInitialCircPercent(
    model.allocations,
    model.vestings,
  )
  const insiderShare = useMemo(() => {
    const keys = new Set(['team', 'investors', 'foundation'])
    return model.allocations
      .filter((item) => item.enabled && keys.has(item.key))
      .reduce((sum, item) => sum + item.percent, 0)
  }, [model.allocations])
  const liveScore = useMemo(
    () => computeStructureScore(model.allocations, model.vestings),
    [model.allocations, model.vestings],
  )
  const liveTier = localizeTier(liveScore.tier.name, liveScore.tier.meaning)
  const vestingStats = useMemo(() => {
    const monthly = calcTotalMonthlyUnlocks(
      model.allocations,
      model.vestings,
      model.totalSupply,
    )
    const circulating = calcCumulativeCirculating(monthly)
    return {
      spikes: detectSpikes(monthly, circulating, model.totalSupply),
      peak: calcPeakMonthlyUnlock(monthly),
      pressure: calcUnlockPressure12m(
        model.allocations,
        model.vestings,
        model.totalSupply,
      ),
    }
  }, [model])
  const showSidePanel = step !== 'results'

  return (
    <div className={styles.shell}>
      <nav className={styles.stepNav} aria-label="Steps">
        {STEPS.map((item) => {
          const gated =
            !complete && (item.key === 'vesting' || item.key === 'results')
          return (
            <button
              key={item.key}
              type="button"
              disabled={gated}
              title={gated ? copy.navigation.allocateFirst : undefined}
              onClick={() =>
                item.key === 'results' ? runAnalysis() : goTo(item.key)
              }
              className={`${styles.stepButton} ${
                step === item.key ? styles.stepActive : ''
              } ${gated ? styles.stepDisabled : ''}`}
            >
              {item.number} · {copy.steps[item.key]}
            </button>
          )
        })}
      </nav>

      {invalidBanner && (
        <div className={`${styles.banner} ${styles.bannerError}`}>
          <span>{copy.banners.invalid}</span>
          <button
            type="button"
            onClick={() => setInvalidBanner(false)}
            className={styles.dismiss}
            aria-label={copy.banners.dismiss}
          >
            ✕
          </button>
        </div>
      )}
      {forkBanner && (
        <div className={`${styles.banner} ${styles.bannerWarning}`}>
          <span>{copy.banners.fork}</span>
          <button
            type="button"
            onClick={() => setForkBanner(false)}
            className={styles.dismiss}
            aria-label={copy.banners.dismiss}
          >
            ✕
          </button>
        </div>
      )}
      {draftRestored && (
        <div className={styles.banner}>
          <span>{copy.banners.restored}</span>
          <button
            type="button"
            onClick={startFresh}
            className={styles.dismiss}
          >
            {copy.navigation.startFresh}
          </button>
        </div>
      )}

      {showSidePanel ? (
        <div
          className={`${styles.layout} ${
            step === 'vesting' ? styles.layoutWide : ''
          }`}
        >
          <section>
            {step === 'basics' && (
              <>
                <BasicsStep model={model} onChange={patchModel} />
                <div className={`${styles.actions} ${styles.actionSplit}`}>
                  <span />
                  <Button type="button" onClick={() => goTo('allocation')}>
                    {copy.navigation.continueAllocation} →
                  </Button>
                </div>
              </>
            )}
            {step === 'allocation' && (
              <>
                <AllocationsStep
                  allocations={model.allocations}
                  onChange={setAllocations}
                />
                <div className={styles.actionSplit}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => goTo('basics')}
                  >
                    ← {copy.navigation.backBasics}
                  </Button>
                  <Button
                    type="button"
                    disabled={!complete}
                    onClick={() => goTo('vesting')}
                  >
                    {copy.navigation.continueVesting} →
                  </Button>
                </div>
              </>
            )}
            {step === 'vesting' && (
              <>
                <VestingStep
                  allocations={model.allocations}
                  vestings={model.vestings}
                  onChange={setVestings}
                />
                <div className={styles.actionSplit}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => goTo('allocation')}
                  >
                    ← {copy.navigation.backAllocation}
                  </Button>
                  <Button type="button" onClick={runAnalysis}>
                    {copy.navigation.run} →
                  </Button>
                </div>
              </>
            )}
          </section>

          <aside className={styles.side}>
            {step === 'vesting' ? (
              <div className={`${styles.card} ${styles.preview}`}>
                <div className={styles.label}>
                  {copy.preview.unlockPreview}
                </div>
                <UnlockChart
                  allocations={model.allocations}
                  vestings={model.vestings}
                  totalSupply={model.totalSupply}
                  height={280}
                />
                <dl className={styles.metrics}>
                  <div className={styles.metric}>
                    <dt>{copy.preview.pressure}</dt>
                    <dd>{vestingStats.pressure.toFixed(1)}%</dd>
                  </div>
                  <div className={styles.metric}>
                    <dt>{copy.preview.peak}</dt>
                    <dd>
                      M{vestingStats.peak.month} ·{' '}
                      {fmtShort(vestingStats.peak.amount)}
                    </dd>
                  </div>
                  <div className={styles.metric}>
                    <dt>{copy.preview.spikes}</dt>
                    <dd>{vestingStats.spikes.length}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div
                className={`${styles.card} ${styles.preview} ${styles.previewCentered}`}
              >
                <DonutChart
                  allocations={model.allocations}
                  label={model.symbol || '—'}
                  sublabel={copy.preview.allocation}
                />
                <dl className={styles.metrics}>
                  {step === 'allocation' && (
                    <div className={styles.metric}>
                      <dt>{copy.preview.liveScore}</dt>
                      <dd>
                        {liveScore.score} · {liveTier.name}
                      </dd>
                    </div>
                  )}
                  <div className={styles.metric}>
                    <dt>{copy.preview.supply}</dt>
                    <dd>{fmtShort(model.totalSupply)}</dd>
                  </div>
                  <div className={styles.metric}>
                    <dt>{copy.preview.insider}</dt>
                    <dd>{insiderShare.toFixed(0)}%</dd>
                  </div>
                  <div className={styles.metric}>
                    <dt>{copy.preview.tgeFloat}</dt>
                    <dd>{initialCirculation.toFixed(1)}%</dd>
                  </div>
                </dl>
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div>
          <ResultsStep model={model} />
          <div className={styles.actionSplit}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => goTo('vesting')}
            >
              ← {copy.navigation.adjust}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
