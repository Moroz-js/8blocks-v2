import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { t } from '@/shared/i18n'
import { CasesPage } from '@/widgets/CasesPage'

export const metadata: Metadata = {
  title: t({ ru: 'Портфолио', en: 'Portfolio' }),
  description: t({
    ru: 'Кейсы 8Blocks: токеномики, DeFi, GameFi, RWA и международные финансы. Реальные проекты с результатами.',
    en: '8Blocks case studies: tokenomics, DeFi, GameFi, RWA, and international finance. Real projects with results.',
  }),
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/cases` },
  openGraph: {
    title: `${t({ ru: 'Портфолио', en: 'Portfolio' })} | ${siteConfig.name}`,
    description: t({
      ru: 'Кейсы наших клиентов — от DeFi до токенизации реальных активов.',
      en: "Our clients' case studies — from DeFi to real-world asset tokenization.",
    }),
    url: '/cases',
  },
}

export default function CasesPageRoute() {
  return <CasesPage />
}
