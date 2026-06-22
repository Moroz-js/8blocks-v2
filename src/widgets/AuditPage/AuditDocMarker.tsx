'use client'

import { useEffect } from 'react'

/**
 * Flags the document as an audit detail page so global styles can drop the
 * decorative grid/bloom background and use a flat document surface (Figma).
 */
export function AuditDocMarker() {
  useEffect(() => {
    const el = document.documentElement
    el.classList.add('audit-doc')
    return () => {
      el.classList.remove('audit-doc')
    }
  }, [])

  return null
}
