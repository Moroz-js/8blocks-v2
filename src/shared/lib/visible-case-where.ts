import type { Where } from 'payload'

export const visibleCaseConditions: Where[] = [
  { status: { equals: 'published' } },
  { hidden: { not_equals: true } },
]

export const visibleCaseWhere: Where = {
  and: visibleCaseConditions,
}

export const visibleFullCaseWhere: Where = {
  and: [...visibleCaseConditions, { format: { equals: 'full' } }],
}
