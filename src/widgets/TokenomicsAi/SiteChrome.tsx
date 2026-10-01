'use client'

import { usePathname } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { Header } from '@/widgets/Header'
import styles from './SiteChrome.module.scss'

const PAGE = '/product/tokenomics-ai'

// The root layout persists during client navigation: decide here rather than
// using its initial request pathname, so the blur and footer watermark return on leaving.
export function StandardPageChrome({ children }: { children: ReactNode }) {
  return usePathname() === PAGE ? null : children
}

export function SiteHeader(props: ComponentProps<typeof Header>) {
  const pathname = usePathname()
  return <Header {...props} className={pathname === PAGE ? styles.solidHeader : undefined} />
}
