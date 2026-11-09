'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/ds'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { computeStructureScore } from '@/shared/lib/platform/tokenlab/scoringV3'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'

const DownloadIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12" />
  </svg>
)

/** PDF report of the model; also reports the result view once. */
export function DownloadReport({
  model,
  label,
  preparing,
  fallbackName,
  className,
}: {
  model: TokenModel
  label: string
  preparing: string
  fallbackName: { name: string; symbol: string }
  className?: string
}) {
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    trackPlatformEvent('shared_view_opened', { symbol: model.symbol || undefined })
  }, [model.symbol])

  async function download() {
    if (busy) return
    setBusy(true)
    try {
      const result = computeStructureScore(model.allocations, model.vestings)
      const { generatePdfReportV3 } = await import('@/shared/lib/platform/tokenlab/export-pdf-v3')
      generatePdfReportV3({
        name: model.name || fallbackName.name,
        symbol: model.symbol || fallbackName.symbol,
        totalSupply: model.totalSupply,
        allocations: model.allocations,
        vestings: model.vestings,
        result,
      })
      trackPlatformEvent('pdf_exported', { score: result.score, tier: result.tier.name })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button variant="tertiary" onClick={download} disabled={busy} icon={DownloadIcon} iconPosition="left" className={className}>
      {busy ? preparing : label}
    </Button>
  )
}
