'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const VARS = [
  'placeholder-stroke-weak',
  'placeholder-stroke',
  'placeholder-stroke-mid',
  'placeholder-stroke-strong',
  'placeholder-fill',
  'text-secondary',
  'accent-purple',
] as const

const COVER_VARS = ['placeholder-cover-1', 'placeholder-cover-2', 'placeholder-cover-3'] as const

export type ThemeColorKey = (typeof VARS)[number]

const FALLBACK_COLORS: Record<ThemeColorKey, string> = {
  'placeholder-stroke-weak': 'rgba(255,255,255,0.04)',
  'placeholder-stroke': 'rgba(255,255,255,0.06)',
  'placeholder-stroke-mid': 'rgba(255,255,255,0.07)',
  'placeholder-stroke-strong': 'rgba(255,255,255,0.09)',
  'placeholder-fill': 'rgba(255,255,255,0.12)',
  'text-secondary': 'rgba(255,255,255,0.5)',
  'accent-purple': '#C24E88',
}

const FALLBACK_COVERS = [
  'linear-gradient(135deg, rgba(197,61,255,0.18) 0%, rgba(99,62,220,0.10) 100%)',
  'linear-gradient(135deg, rgba(99,142,251,0.18) 0%, rgba(197,61,255,0.10) 100%)',
  'linear-gradient(135deg, rgba(117,251,99,0.12) 0%, rgba(99,142,251,0.12) 100%)',
] as const

function readVars(): Record<ThemeColorKey, string> {
  if (typeof document === 'undefined') return FALLBACK_COLORS
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    VARS.map((key) => [key, style.getPropertyValue(`--${key}`).trim() || FALLBACK_COLORS[key]]),
  ) as Record<ThemeColorKey, string>
}

function readCoverGradients(): readonly [string, string, string] {
  if (typeof document === 'undefined') return FALLBACK_COVERS
  const style = getComputedStyle(document.documentElement)
  return COVER_VARS.map(
    (key, i) => style.getPropertyValue(`--${key}`).trim() || FALLBACK_COVERS[i],
  ) as [string, string, string]
}

export function useThemeColors() {
  const { resolvedTheme } = useTheme()
  const [colors, setColors] = useState(readVars)

  useEffect(() => {
    setColors(readVars())
  }, [resolvedTheme])

  return colors
}

export function usePlaceholderGradients() {
  const { resolvedTheme } = useTheme()
  const [gradients, setGradients] = useState<readonly [string, string, string]>(readCoverGradients)

  useEffect(() => {
    setGradients(readCoverGradients())
  }, [resolvedTheme])

  return gradients
}

/** @deprecated Use usePlaceholderGradients() */
export const PLACEHOLDER_GRADIENTS = FALLBACK_COVERS
