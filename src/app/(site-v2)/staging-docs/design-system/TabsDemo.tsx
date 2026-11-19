'use client'

import { useState } from 'react'
import { Tabs } from '@/shared/ds'

const ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'audits', label: 'Audits' },
  { value: 'research', label: 'Research' },
  { value: 'cases', label: 'Cases' },
] as const

type Value = (typeof ITEMS)[number]['value']

export function TabsDemo({ variant }: { variant?: 'pill' | 'glass' | 'ghost' }) {
  const [value, setValue] = useState<Value>('all')
  return <Tabs items={ITEMS} value={value} onChange={setValue} label="Фильтр материалов" variant={variant} />
}
