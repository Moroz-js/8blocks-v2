'use client'

import { usePathname } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { Header } from '@/widgets/Header'
import styles from './RouteOverrides.module.scss'

const SOLID_HEADER_ROUTES = new Set(['/product/tokenomics-ai'])
const PLAIN_DECOR_ROUTES = new Set(['/product/tokenomics-ai', '/learn/token-vesting-benchmarks'])

// The root layout persists during client navigation: decide here rather than
// using its initial request pathname, so the blur and footer watermark return on leaving.
export function RouteDecor({ children }: { children: ReactNode }) {
  return PLAIN_DECOR_ROUTES.has(usePathname()) ? null : children
}

export function RouteHeader(props: ComponentProps<typeof Header>) {
  const pathname = usePathname()
  return (
    <Header
      {...props}
      className={SOLID_HEADER_ROUTES.has(pathname) ? styles.solidHeader : undefined}
    />
  )
}
