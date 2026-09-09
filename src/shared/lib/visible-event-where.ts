import type { Where } from 'payload'

export const visibleEventConditions: Where[] = [
  { status: { equals: 'published' } },
  { hidden: { not_equals: true } },
]

export const visibleEventWhere: Where = { and: visibleEventConditions }
