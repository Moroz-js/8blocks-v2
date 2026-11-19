import Image from 'next/image'
import type { CountryId } from '@/shared/content/digitalAssets'
import us from './assets/flag-us.webp'
import vg from './assets/flag-bvi.webp'
import sg from './assets/flag-sg.webp'

const EU_STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return [15 + Math.sin(a) * 6.5, 10 - Math.cos(a) * 6.5]
})

/** Square flag art (designer's markers); fills its box. */
export const FLAGS: Record<CountryId, React.ReactNode> = {
  uk: (
    <svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice">
      <rect width="60" height="36" fill="#012169" />
      <path d="M0 0l60 36M60 0L0 36" stroke="#fff" strokeWidth="7" />
      <path d="M0 0l60 36M60 0L0 36" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v36M0 18h60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0v36M0 18h60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  ),
  eu: (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#039" />
      {EU_STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="#FC0" />
      ))}
    </svg>
  ),
  ch: (
    <svg viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#D52B1E" />
      <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
    </svg>
  ),
  kz: (
    <svg viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#00AFCA" />
      <circle cx="16" cy="16" r="7" fill="#FEC50C" />
    </svg>
  ),
  ae: (
    <svg viewBox="0 0 32 32">
      <rect width="32" height="11" fill="#00732F" />
      <rect y="11" width="32" height="10" fill="#fff" />
      <rect y="21" width="32" height="11" fill="#000" />
      <rect width="9" height="32" fill="#F00" />
    </svg>
  ),
  jp: (
    <svg viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#fff" />
      <circle cx="16" cy="16" r="8" fill="#BC002D" />
    </svg>
  ),
  us: <Image src={us} alt="" fill sizes="52px" />,
  vg: <Image src={vg} alt="" fill sizes="52px" />,
  sg: <Image src={sg} alt="" fill sizes="52px" />,
}
