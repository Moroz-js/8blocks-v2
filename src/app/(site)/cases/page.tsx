import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { CasesPage } from '@/widgets/CasesPage'

export const metadata: Metadata = {
  title: 'Портфолио',
  description:
    'Кейсы 8Blocks: токеномики, DeFi, GameFi, RWA и международные финансы. Реальные проекты с результатами.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/cases` },
  openGraph: {
    title: `Портфолио | ${siteConfig.name}`,
    description: 'Кейсы наших клиентов — от DeFi до токенизации реальных активов.',
    url: '/cases',
  },
}

export default function CasesPageRoute() {
  return <CasesPage />
}
