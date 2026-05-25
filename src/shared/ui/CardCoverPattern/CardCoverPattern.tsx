'use client'

import { useThemeColors } from '@/shared/lib/useThemeColors'

export function CardCoverPattern({ className }: { className?: string }) {
  const c = useThemeColors()

  return (
    <svg
      className={className}
      viewBox="0 0 420 236"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <line x1="0" y1="118" x2="420" y2="118" stroke={c['placeholder-stroke']} strokeWidth="1" />
      <line x1="210" y1="0" x2="210" y2="236" stroke={c['placeholder-stroke']} strokeWidth="1" />
      <circle cx="210" cy="118" r="60" stroke={c['placeholder-stroke-mid']} strokeWidth="1" />
      <circle cx="210" cy="118" r="32" stroke={c['placeholder-stroke-strong']} strokeWidth="1" />
      <circle cx="210" cy="118" r="10" fill={c['placeholder-fill']} />
      <line x1="80" y1="40" x2="340" y2="196" stroke={c['placeholder-stroke-weak']} strokeWidth="1" />
      <line x1="340" y1="40" x2="80" y2="196" stroke={c['placeholder-stroke-weak']} strokeWidth="1" />
    </svg>
  )
}
