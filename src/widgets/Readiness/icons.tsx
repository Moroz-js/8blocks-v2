import type { StatusId } from '@/shared/lib/platform/readiness/scoring'

/** Status marks from the designer's readiness check: flag, compass, stopwatch. */
export const STATUS_ICONS: Record<StatusId, React.ReactNode> = {
  strong: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 2.5h1.5v15H4zM6.5 3.5h9.5l-2.2 3.6 2.2 3.6H6.5z" />
    </svg>
  ),
  explore: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.8 3.2 12.4 12.4 3.2 16.8 7.6 7.6 16.8 3.2ZM10 11.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
      />
    </svg>
  ),
  notYet: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7 1.5h6l.6 3.2A6 6 0 0 1 16 10a6 6 0 0 1-2.4 5.3L13 18.5H7l-.6-3.2A6 6 0 0 1 4 10a6 6 0 0 1 2.4-5.3L7 1.5Zm3 4.3a.8.8 0 0 0-.8.8V10c0 .2.1.4.2.6l2 2 1.1-1.1-1.7-1.8V6.6a.8.8 0 0 0-.8-.8Z"
      />
    </svg>
  ),
}

/** Green plus in a circle (designer's `ic-strength`). */
export const StrengthIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 1.67a8.33 8.33 0 1 1 0 16.66 8.33 8.33 0 0 1 0-16.66ZM9.17 5.83v3.34H5.83v1.66h3.34v3.34h1.66v-3.34h3.34V9.17h-3.34V5.83H9.17Z" />
  </svg>
)

/** Orange cog (designer's `ic-validate`). */
export const ValidateIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M14.17 8c0 .26-.03.53-.06.78l1.74 1.32c.15.13.2.34.1.52l-1.65 2.76a.42.42 0 0 1-.51.17l-2.04-.8c-.43.32-.9.58-1.39.79l-.3 2.11a.42.42 0 0 1-.42.35H6.36a.42.42 0 0 1-.42-.33l-.3-2.12a5.4 5.4 0 0 1-1.39-.79l-2.04.8a.42.42 0 0 1-.5-.17L.06 10.63a.4.4 0 0 1 .1-.51l1.73-1.33A6 6 0 0 1 1.83 8c0-.26.02-.53.06-.78L.15 5.9a.4.4 0 0 1-.1-.52L1.7 2.62a.42.42 0 0 1 .5-.17l2.05.8c.42-.32.9-.58 1.39-.79l.3-2.11A.42.42 0 0 1 6.36 0h3.29c.2 0 .37.15.4.33l.3 2.11c.51.21.97.47 1.4.79l2.04-.8c.19-.07.4 0 .5.17l1.65 2.77c.1.17.06.39-.1.51L14.12 7.2c.03.27.05.53.05.8ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </svg>
)

/** Arrow out of a box (designer's `ic-source`). */
export const SourceIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7.86 3.57H3.57c-.79 0-1.43.64-1.43 1.43v11.43c0 .79.64 1.43 1.43 1.43H15c.79 0 1.43-.64 1.43-1.43v-4.29M17.86 7.86V2.14h-5.72M17.86 2.14l-8.57 8.57" />
  </svg>
)

export const PencilIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.87 6.63 4.5 14H2v-2.5l7.37-7.37 2.5 2.5Zm-.56-4.44a.66.66 0 0 1 .94 0l1.56 1.56c.26.26.26.68 0 .94l-1.22 1.22-2.5-2.5 1.22-1.22Z" />
  </svg>
)
