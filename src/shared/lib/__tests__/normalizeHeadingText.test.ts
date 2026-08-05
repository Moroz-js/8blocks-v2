import { describe, expect, it } from 'vitest'
import { normalizeHeadingText } from '../normalizeHeadingText'

describe('normalizeHeadingText', () => {
  it('removes single and hierarchical section numbering', () => {
    expect(normalizeHeadingText('1. Introduction')).toBe('Introduction')
    expect(normalizeHeadingText('1.2 Core issues')).toBe('Core issues')
    expect(normalizeHeadingText('2.1.3. Conclusion')).toBe('Conclusion')
  })

  it('preserves a title whose number is not section numbering', () => {
    expect(normalizeHeadingText('2026 Market outlook')).toBe('2026 Market outlook')
  })
})
