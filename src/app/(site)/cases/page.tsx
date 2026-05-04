import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { casesMeta } from '@/shared/content/casesPage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { CasesPage } from '@/widgets/CasesPage'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/cases', {
    title: casesMeta.title,
    description: casesMeta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/cases` },
    openGraph: {
      title: casesMeta.ogTitle,
      description: casesMeta.ogDescription,
      url: '/cases',
    },
  })
}

export default function CasesPageRoute() {
  return <CasesPage />
}
