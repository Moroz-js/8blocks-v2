import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { casesMeta } from '@/shared/content/casesPage'
import { CasesPage } from '@/widgets/CasesPage'

export const metadata: Metadata = {
  title: casesMeta.title,
  description: casesMeta.description,
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/cases` },
  openGraph: {
    title: casesMeta.ogTitle,
    description: casesMeta.ogDescription,
    url: '/cases',
  },
}

export default function CasesPageRoute() {
  return <CasesPage />
}
