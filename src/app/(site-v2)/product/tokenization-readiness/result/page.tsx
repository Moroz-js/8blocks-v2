import type { Metadata } from 'next'
import { readiness as content } from '@/shared/content/readiness'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { decodeAnswers } from '@/shared/lib/platform/readiness/scoring'
import { ReadinessResultInvalid, ReadinessResultPage } from '@/widgets/Readiness/ReadinessResultPage'
import { CHECK_PATH, RESULT_PATH } from '@/widgets/Readiness/paths'

type SearchParams = Promise<{ a?: string | string[] }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { a } = await searchParams
  const og = typeof a === 'string' && decodeAnswers(a) ? `/api/og?a=${a}` : '/api/og'
  return withPayloadPageMetadata(RESULT_PATH, {
    title: content.resultMeta.title,
    description: content.resultMeta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}${CHECK_PATH}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: content.resultMeta.title,
      description: content.resultMeta.description,
      url: RESULT_PATH,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.resultMeta.title,
      description: content.resultMeta.description,
      images: [og],
    },
  })
}

export default async function ReadinessResultRoute({ searchParams }: { searchParams: SearchParams }) {
  const { a } = await searchParams
  const answers = typeof a === 'string' ? decodeAnswers(a) : null
  if (!answers) return <ReadinessResultInvalid content={content.result.invalid} />
  return <ReadinessResultPage answers={answers} content={content} />
}
