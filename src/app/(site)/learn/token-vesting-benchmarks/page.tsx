import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { lang, t } from '@/shared/i18n'
import { BenchmarkIntro } from '@/widgets/Benchmarks/BenchmarkIntro'
import { BenchmarkSectors } from '@/widgets/Benchmarks/BenchmarkSectors'
import { BenchmarkAllocation } from '@/widgets/Benchmarks/BenchmarkAllocation'
import { BenchmarkLowerSections } from '@/widgets/Benchmarks/BenchmarkLowerSections'
import enContent from '@/shared/lib/platform/benchmarks/content.json'
import ruContent from '@/shared/lib/platform/benchmarks/content.ru.json'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, datasetNode } from '@/shared/lib/page-schema'

const geist = Geist({ subsets: ['latin', 'cyrillic'], weight: '400', display: 'swap', variable: '--font-tokenomics-geist' })

const content = lang === 'ru' ? ruContent : enContent
const copy = platformPagesContent.benchmarks

const faq = t({
  en: [
    {
      q: 'What is the standard team vesting schedule?',
      a: 'A four-year schedule with a one-year cliff remains the most common reference. Roughly 25% vests at the cliff; project-specific terms vary.',
    },
    {
      q: 'How much token supply usually goes to the team?',
      a: 'Typical team allocations run 15–25% of supply, with common practice around 17.5–20% in the cited datasets.',
    },
    {
      q: 'What TGE unlock is considered normal?',
      a: 'Team: 0% at TGE. Seed investors: 0–5%; private rounds: 0–10%. Larger early unlocks increase sell-pressure risk.',
    },
    {
      q: 'Do token unlocks affect price?',
      a: 'Keyrock’s study of 16,000+ unlock events found roughly 90% were followed by price declines, with pressure often beginning before the unlock.',
    },
  ],
  ru: [
    {
      q: 'Какой график вестинга команды считается стандартным?',
      a: 'Чаще всего ориентируются на четыре года с клиффом один год. Около 25% разблокируется в конце клиффа, но условия зависят от проекта.',
    },
    {
      q: 'Какую долю предложения обычно получает команда?',
      a: 'В приведённых исследованиях типичный диапазон составляет 15–25%, а распространённое значение — около 17,5–20%.',
    },
    {
      q: 'Какая разблокировка на TGE считается нормальной?',
      a: 'Для команды — 0%, для seed-инвесторов — 0–5%, для private-раундов — 0–10%. Большая ранняя разблокировка повышает риск давления продаж.',
    },
    {
      q: 'Влияют ли разблокировки токенов на цену?',
      a: 'Исследование Keyrock более 16 000 событий показало снижение цены примерно после 90% разблокировок; давление часто начинается заранее.',
    },
  ],
})

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/learn/token-vesting-benchmarks', {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteConfig.url.replace(/\/$/, '')}/learn/token-vesting-benchmarks`,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: '/learn/token-vesting-benchmarks',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [siteConfig.ogImage],
    },
  })
}

export default function TokenVestingBenchmarksPage() {
  const path = '/learn/token-vesting-benchmarks'
  const buckets = (content as { buckets: { label: string; source?: { title: string; url: string }; source2?: { title: string; url: string } }[] }).buckets
  const citations = buckets
    .flatMap((b) => [b.source, b.source2])
    .filter((c): c is { title: string; url: string } => Boolean(c && c.url))
    .filter((c, i, arr) => arr.findIndex((x) => x.url === c.url) === i)
  const schema = buildPageGraph({
    path,
    name: copy.title,
    description: copy.description,
    crumbs: [{ name: copy.title, path }],
    faq: faq.map((item) => ({ question: item.q, answer: item.a })),
    extra: [
      datasetNode(path, {
        name: copy.title,
        description: copy.description,
        temporalCoverage: '2024/2026',
        variableMeasured: buckets.map((b) => b.label),
        citations,
        keywords: ['token vesting', 'token allocation', 'tokenomics benchmarks'],
      }),
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BenchmarkIntro fontClass={geist.variable} />
      <BenchmarkSectors fontClass={geist.variable} />
      <BenchmarkAllocation fontClass={geist.variable} />
      <BenchmarkLowerSections fontClass={geist.variable} />
    </>
  )
}
