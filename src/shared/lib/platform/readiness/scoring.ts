/**
 * Tokenization readiness check: seven questions → four pillars → status and best-fit path.
 * Ids only; every text lives in `@/shared/content/{en,ru}/readiness.ts`.
 */

export const QUESTIONS = [
  { id: 'objective', options: ['raise_capital', 'working_capital', 'investor_access', 'transferability', 'explore', 'other'] },
  { id: 'asset', options: ['real_assets', 'receivables', 'securities', 'inventory', 'other_right', 'nothing'] },
  { id: 'rights', options: ['clear', 'mostly', 'complex', 'none'] },
  { id: 'size', options: ['under_250k', '250k_1m', '1m_5m', '5m_plus', 'unsure'] },
  { id: 'evidence', options: ['established', 'operating', 'limited', 'projections'] },
  { id: 'demand', options: ['existing', 'institutional', 'unvalidated', 'retail', 'unknown'] },
  { id: 'execution', options: ['ready', 'serious', 'early', 'urgent'] },
] as const

export type QuestionId = (typeof QUESTIONS)[number]['id']
export type OptionId<Q extends QuestionId> = Extract<(typeof QUESTIONS)[number], { id: Q }>['options'][number]
export type Answers = { [Q in QuestionId]: OptionId<Q> }

/** Petal order on the chart, clockwise from the top-right corner. */
export const PILLARS = ['asset', 'demand', 'execution', 'objective'] as const
export type PillarId = (typeof PILLARS)[number]
export type StatusId = 'strong' | 'explore' | 'notYet'
export const PATHS = ['asset_backed', 'credit', 'funds', 'other'] as const
export type PathId = (typeof PATHS)[number]

/** Points per answer; a pillar's share of its maximum decides its ring. */
const POINTS: { [Q in QuestionId]: { pillar: PillarId; points: Record<OptionId<Q>, number> } } = {
  objective: {
    pillar: 'objective',
    points: { raise_capital: 3, working_capital: 3, investor_access: 3, transferability: 2, explore: 1, other: 1 },
  },
  asset: {
    pillar: 'asset',
    points: { real_assets: 2, receivables: 2, securities: 2, inventory: 2, other_right: 1, nothing: 0 },
  },
  rights: { pillar: 'asset', points: { clear: 2, mostly: 1, complex: 0, none: 0 } },
  size: { pillar: 'demand', points: { under_250k: 0, '250k_1m': 1, '1m_5m': 2, '5m_plus': 2, unsure: 1 } },
  evidence: { pillar: 'demand', points: { established: 2, operating: 1, limited: 0, projections: 0 } },
  demand: { pillar: 'demand', points: { existing: 3, institutional: 3, unvalidated: 1, retail: 0, unknown: 0 } },
  execution: { pillar: 'execution', points: { ready: 3, serious: 2, early: 1, urgent: 0 } },
}

/** Rings of the chart, inner to outer. */
export const LEVELS = [0.34, 0.56, 0.78, 1] as const

function levelFor(share: number): number {
  if (share >= 0.85) return 1
  if (share >= 0.6) return 0.78
  if (share >= 0.3) return 0.56
  return 0.34
}

export interface ReadinessResult {
  status: StatusId
  path: PathId
  /** Ring per pillar (one of `LEVELS`). */
  pillars: Record<PillarId, number>
}

export function scorePillars(answers: Answers): Record<PillarId, number> {
  const earned: Record<PillarId, number> = { asset: 0, demand: 0, execution: 0, objective: 0 }
  const max: Record<PillarId, number> = { asset: 0, demand: 0, execution: 0, objective: 0 }
  for (const { id } of QUESTIONS) {
    const rule = POINTS[id] as { pillar: PillarId; points: Record<string, number> }
    earned[rule.pillar] += rule.points[answers[id]]
    max[rule.pillar] += Math.max(...Object.values(rule.points))
  }
  return {
    asset: levelFor(earned.asset / max.asset),
    demand: levelFor(earned.demand / max.demand),
    execution: levelFor(earned.execution / max.execution),
    objective: levelFor(earned.objective / max.objective),
  }
}

/** Which structure is worth testing first: the asset decides, the objective breaks ties. */
export function bestFitPath(answers: Answers): PathId {
  switch (answers.asset) {
    case 'real_assets':
      return 'asset_backed'
    case 'receivables':
    case 'inventory':
      return 'credit'
    case 'securities':
      return 'funds'
  }
  switch (answers.objective) {
    case 'raise_capital':
      return answers.asset === 'other_right' ? 'asset_backed' : 'other'
    case 'working_capital':
      return 'credit'
    case 'investor_access':
    case 'transferability':
      return 'funds'
    default:
      return 'other'
  }
}

export function evaluate(answers: Answers): ReadinessResult {
  const pillars = scorePillars(answers)
  const levels = Object.values(pillars)
  const blocked = answers.asset === 'nothing' || levels.some((level) => level === LEVELS[0])
  let status: StatusId = 'explore'
  if (blocked) status = 'notYet'
  else if (levels.every((level) => level >= LEVELS[2]) && answers.size !== 'under_250k') status = 'strong'
  return { status, path: bestFitPath(answers), pillars }
}

/* ── URL state: one option letter per question, in question order (`aaabaab`). ── */

export function encodeAnswers(answers: Answers): string {
  return QUESTIONS.map(({ id, options }) =>
    String.fromCharCode(97 + (options as readonly string[]).indexOf(answers[id])),
  ).join('')
}

export function decodeAnswers(encoded: string | null | undefined): Answers | null {
  if (!encoded || encoded.length !== QUESTIONS.length) return null
  const answers: Record<string, string> = {}
  for (let i = 0; i < QUESTIONS.length; i++) {
    const { id, options } = QUESTIONS[i]
    const option = options[encoded.charCodeAt(i) - 97]
    if (!option) return null
    answers[id] = option
  }
  return answers as Answers
}

/** «See a sample result»: a real-estate owner with a strong case. */
export const SAMPLE_ANSWERS: Answers = {
  objective: 'raise_capital',
  asset: 'real_assets',
  rights: 'clear',
  size: '1m_5m',
  evidence: 'established',
  demand: 'existing',
  execution: 'serious',
}
