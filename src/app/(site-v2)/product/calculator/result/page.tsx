import type { Metadata } from 'next'
import { calculatorResult as content } from '@/shared/content/calculatorResult'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { decodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { compareWithMarket } from '@/shared/lib/platform/tokenlab/benchmarkNorms'
import { getDefaultVestingConfigs, STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import type { StandardBucketKey, VestingConfig } from '@/shared/lib/platform/tokenlab/types'
import benchmarks from '@/shared/lib/platform/benchmarks/projects.json'
import {
  CalculatorResultInvalid,
  CalculatorResultPage,
  type BenchmarkReference,
} from '@/widgets/TokenomicsCalculator/result/CalculatorResultPage'

const REFERENCE_SYMBOL = 'HYPE'

interface BenchmarkProject {
  name: string
  symbol: string
  templateMapping: Partial<Record<StandardBucketKey, number>>
  vestingMapping?: Partial<Record<StandardBucketKey, Omit<VestingConfig, 'bucketKey'>>>
}

/** «Top in category» column: the reference project run through the same norms as the user's model. */
function benchmarkReference(): BenchmarkReference | null {
  const projects = (benchmarks as { categories: { projects: BenchmarkProject[] }[] }).categories.flatMap(
    (category) => category.projects,
  )
  const project = projects.find((item) => item.symbol === REFERENCE_SYMBOL)
  if (!project) return null
  const allocations = STANDARD_BUCKETS.map((bucket) => {
    const percent = project.templateMapping[bucket.key] ?? 0
    return { key: bucket.key, percent, enabled: percent > 0 }
  })
  const vestings = getDefaultVestingConfigs().map((vesting) => {
    const real = project.vestingMapping?.[vesting.bucketKey]
    return real ? { ...real, bucketKey: vesting.bucketKey } : vesting
  })
  const values = Object.fromEntries(compareWithMarket(allocations, vestings).map((check) => [check.key, check.yours]))
  return { name: project.name, values }
}

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/calculator/result', {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/product/calculator` },
    robots: { index: false, follow: true },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: '/product/calculator/result',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.title,
      description: content.meta.description,
      images: [siteConfig.ogImage],
    },
  })
}

export default async function CalculatorResultRoute({ searchParams }: { searchParams: Promise<{ m?: string | string[] }> }) {
  const { m } = await searchParams
  const model = typeof m === 'string' ? decodeModel(m) : null
  if (!model) return <CalculatorResultInvalid content={content} />
  return <CalculatorResultPage model={model} content={content} reference={benchmarkReference()} />
}
