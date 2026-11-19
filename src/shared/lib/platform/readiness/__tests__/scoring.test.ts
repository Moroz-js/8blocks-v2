import { describe, expect, it } from 'vitest'
import {
  QUESTIONS,
  SAMPLE_ANSWERS,
  bestFitPath,
  decodeAnswers,
  encodeAnswers,
  evaluate,
  scorePillars,
  type Answers,
} from '../scoring'

const answers = (over: Partial<Answers>): Answers => ({ ...SAMPLE_ANSWERS, ...over })

describe('readiness scoring', () => {
  it('has seven questions', () => {
    expect(QUESTIONS).toHaveLength(7)
  })

  it('rates the sample as a strong asset-backed case', () => {
    const result = evaluate(SAMPLE_ANSWERS)
    expect(result.status).toBe('strong')
    expect(result.path).toBe('asset_backed')
    expect(result.pillars).toEqual({ asset: 1, demand: 1, execution: 0.78, objective: 1 })
  })

  it('holds a case back when there is nothing behind the instrument', () => {
    expect(evaluate(answers({ asset: 'nothing' })).status).toBe('notYet')
  })

  it('holds a case back when capital is needed within months', () => {
    const result = evaluate(answers({ execution: 'urgent' }))
    expect(result.pillars.execution).toBe(0.34)
    expect(result.status).toBe('notYet')
  })

  it('asks to explore first when one pillar is middling', () => {
    expect(evaluate(answers({ objective: 'explore' })).status).toBe('explore')
    expect(evaluate(answers({ rights: 'complex' })).status).toBe('explore')
  })

  it('does not call a sub-$250k case strong', () => {
    expect(evaluate(answers({ size: 'under_250k', evidence: 'established', demand: 'existing' })).status).toBe('explore')
  })

  it('weak demand and economics drop the pillar to the inner ring', () => {
    expect(scorePillars(answers({ size: 'under_250k', evidence: 'projections', demand: 'unknown' })).demand).toBe(0.34)
  })

  it('picks the path by asset, then by objective', () => {
    expect(bestFitPath(answers({ asset: 'receivables' }))).toBe('credit')
    expect(bestFitPath(answers({ asset: 'inventory' }))).toBe('credit')
    expect(bestFitPath(answers({ asset: 'securities' }))).toBe('funds')
    expect(bestFitPath(answers({ asset: 'other_right', objective: 'transferability' }))).toBe('funds')
    expect(bestFitPath(answers({ asset: 'other_right', objective: 'raise_capital' }))).toBe('asset_backed')
    expect(bestFitPath(answers({ asset: 'nothing', objective: 'raise_capital' }))).toBe('other')
    expect(bestFitPath(answers({ asset: 'nothing', objective: 'working_capital' }))).toBe('credit')
  })

  it('round-trips answers through the URL', () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS)
    expect(encoded).toBe('aaacaab')
    expect(decodeAnswers(encoded)).toEqual(SAMPLE_ANSWERS)
  })

  it('rejects broken URL state', () => {
    expect(decodeAnswers('')).toBeNull()
    expect(decodeAnswers('aaacaa')).toBeNull()
    expect(decodeAnswers('aaacaaz')).toBeNull()
    expect(decodeAnswers('raise_capital.real_assets')).toBeNull()
  })
})
