'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/shared/lib/ThemeProvider'
import { readCssVar } from '@/shared/lib/readCssVar'

/** Shows the computed value of a CSS custom property for the active theme. */
export function CssVarValue({ name }: { name: string }) {
  const { theme } = useTheme()
  const [value, setValue] = useState('')

  useEffect(() => {
    // data-theme is applied in the same tick as the context update — read on the next frame.
    const id = requestAnimationFrame(() => setValue(readCssVar(name, '—')))
    return () => cancelAnimationFrame(id)
  }, [name, theme])

  return <>{value}</>
}
