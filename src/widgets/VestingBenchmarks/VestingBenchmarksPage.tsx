import Image, { type StaticImageData } from 'next/image'
import { Button, Carousel, Section, type FaqItem } from '@/shared/ds'
import type { PublicAuditCard } from '@/entities/public-audit'
import { lang } from '@/shared/i18n'
import { platformPagesContent } from '@/shared/content/platformPages'
import { servicePages } from '@/shared/content/servicePages'
import { vestingBenchmarksContent as page } from '@/shared/content/vestingBenchmarks'
import enProjects from '@/shared/lib/platform/benchmarks/projects.json'
import ruProjects from '@/shared/lib/platform/benchmarks/projects.ru.json'
import { AuditCards } from '@/widgets/AuditsArchive/AuditCards'
import { FitCards } from '@/widgets/ServicePages/blocks/FitCards'
import { ServiceFaq } from '@/widgets/ServicePages/blocks/ServiceFaq'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { IndexedRows, SplitList } from '@/widgets/ServicePages/blocks/SplitList'
import { BucketExplorer, type AllocationBucket } from './BucketExplorer'
import { CategoryExplorer, type BenchmarkCategory } from './CategoryExplorer'
import sol from './assets/logo-sol.svg'
import uni from './assets/logo-uni.svg'
import arb from './assets/logo-arb.svg'
import op from './assets/logo-op.svg'
import hype from './assets/logo-hype.svg'
import sui from './assets/logo-sui.svg'
import apt from './assets/logo-apt.svg'
import srcLauren from './assets/src-lauren.svg'
import srcBinance from './assets/src-binance.svg'
import srcChain from './assets/src-chain.png'
import srcCnews from './assets/src-cnews.svg'
import srcCrypt from './assets/src-crypt.png'
import icBrain from './assets/ic-brain.svg'
import icMoney from './assets/ic-money.svg'
import icEye from './assets/ic-eye.svg'
import styles from './VestingBenchmarksPage.module.scss'

const HERO_TOKENS = [
  { name: 'Solana', logo: sol },
  { name: 'Uniswap', logo: uni },
  { name: 'Arbitrum', logo: arb },
  { name: 'Optimism', logo: op },
  { name: 'Hyperliquid', logo: hype },
  { name: 'Sui', logo: sui },
  { name: 'Aptos', logo: apt },
]

/** Publisher logo per market-data entry, in content.json order. */
const PUBLISHERS: { name: string; logo: StaticImageData; height: number; muted?: boolean }[] = [
  { name: 'Lauren Stephanian', logo: srcLauren, height: 29 },
  { name: 'Binance', logo: srcBinance, height: 33 },
  { name: 'ChainCatcher', logo: srcChain, height: 45, muted: true },
  { name: 'crypto.news', logo: srcCnews, height: 37 },
  { name: 'The Cryptonomist', logo: srcCrypt, height: 36, muted: true },
]
const MARKET_ORDER = [1, 3, 4, 2, 0]
const PUBLISHER_PREFIX = /^(Binance Research|crypto\.news|The Cryptonomist|Lauren Stephanian|Keyrock) [-—] /

const CTA_ICONS = [icBrain, icMoney, icEye]
const CALCULATOR_HREF = '/product/calculator'
const AI_HREF = '/product/tokenomics-ai'

const ChevronRight = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface Source {
  title: string
  url: string
}

export interface BenchmarksContent {
  buckets: AllocationBucket[]
  vestingNorms: { figure: string; claim: string; source?: Source; source2?: Source }[]
  trends: { claim: string; source: Source; source2?: Source }[]
  methodologyNote: string
}

function sourcesOf(...items: (Source | undefined)[]) {
  return items.filter((s): s is Source => Boolean(s?.url))
}

function SourceLinks({ sources, strip = false }: { sources: Source[]; strip?: boolean }) {
  return (
    <div className={styles.sources}>
      {sources.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="nofollow noopener noreferrer" className={styles.source}>
          {strip ? source.title.replace(PUBLISHER_PREFIX, '') : source.title}
        </a>
      ))}
    </div>
  )
}

/** Token vesting & allocation benchmarks (project 2 «Token Vesting Benchmarks»). */
export function VestingBenchmarksPage({
  content,
  faq,
  audits,
}: {
  content: BenchmarksContent
  faq: FaqItem[]
  audits: PublicAuditCard[]
}) {
  const copy = platformPagesContent.benchmarks
  const categories = ((lang === 'ru' ? ruProjects : enProjects) as { categories: BenchmarkCategory[] }).categories

  return (
    <>
      <ServiceHero
        scene="city-coins"
        title={copy.headline}
        description={copy.lead}
        aside={
          <div className={styles.heroTokens}>
            <ul className={styles.tokenList}>
              {HERO_TOKENS.map((token) => (
                <li key={token.name} title={token.name} className={styles.token}>
                  <Image src={token.logo} alt={token.name} width={30} height={30} />
                </li>
              ))}
            </ul>
            <p className={styles.tokenNote}>{copy.projectsCount}</p>
          </div>
        }
      />

      <div>
        <Section title={page.approach.title} description={page.approach.description} sheen>
          <FitCards good={page.approach.good} bad={page.approach.bad} />
        </Section>

        <CategoryExplorer
          categories={categories}
          advice={page.advice}
          copy={{
            title: copy.categoryLabel,
            description: copy.categoryLead,
            adviceLabel: page.adviceLabel,
            insiderShare: copy.insiderShare,
            categoryDefinition: copy.categoryDefinition,
            openCalculator: copy.openCalculator,
            dataNote: copy.dataNote,
            carousel: page.carousel,
          }}
        />

        {audits.length > 0 && (
          <Section
            title={copy.audited}
            sheen
            actions={
              <Button variant="secondary" href="/audits" icon={ChevronRight}>
                {copy.publicAudits}
              </Button>
            }
          >
            <AuditCards audits={audits} priorityCount={0} />
          </Section>
        )}

        <Section title={copy.allocationLabel} sheen>
          <BucketExplorer
            buckets={content.buckets}
            medianLabel={page.medianLabel}
            action={{ label: copy.openCalculator, href: CALCULATOR_HREF }}
          />
        </Section>

        <SplitList title={page.vestingTitle}>
          <IndexedRows
            size="lg"
            items={content.vestingNorms.map((norm) => ({
              lead: <span className={styles.normFigure}>{norm.figure}</span>,
              text: '',
              body: (
                <>
                  <p className={styles.normClaim}>{norm.claim}</p>
                  <SourceLinks sources={sourcesOf(norm.source, norm.source2)} />
                </>
              ),
            }))}
          />
        </SplitList>

        <Carousel title={copy.trendsLabel} slideWidth={450} labels={page.carousel}>
          {MARKET_ORDER.map((index) => {
            const trend = content.trends[index]
            const publisher = PUBLISHERS[index]
            const split = trend.claim.indexOf(': ')
            const title = split > 0 ? trend.claim.slice(0, split) : trend.claim
            const text = split > 0 ? trend.claim.slice(split + 2) : ''
            return (
              <article key={trend.source.url} className={styles.market}>
                <div className={styles.marketLogo}>
                  <Image
                    src={publisher.logo}
                    alt={publisher.name}
                    style={{ height: publisher.height, width: 'auto', opacity: publisher.muted ? 0.2 : 1 }}
                  />
                </div>
                <div className={styles.marketText}>
                  <h3 className={styles.marketTitle}>{title}</h3>
                  {text && <p className={styles.marketDescription}>{text}</p>}
                </div>
                <SourceLinks sources={sourcesOf(trend.source, trend.source2)} strip />
              </article>
            )
          })}
        </Carousel>

        <ServiceFaq title={copy.faq} items={faq} footer={servicePages.common.faq.footer} />

        <Section align="center">
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>
              <span>{page.cta.title}</span>
              <span className={styles.ctaAccent}>{page.cta.accent}</span>
            </h2>
            <ul className={styles.ctaFeatures}>
              {page.cta.features.map((feature, i) => (
                <li key={feature.title} className={styles.ctaFeature}>
                  <Image src={CTA_ICONS[i]} alt="" width={24} height={24} />
                  <p className={styles.ctaFeatureTitle}>{feature.title}</p>
                  <p className={styles.ctaFeatureText}>{feature.text}</p>
                </li>
              ))}
            </ul>
            <Button href={AI_HREF}>{page.cta.action}</Button>
            <p className={styles.methodology}>
              {copy.methodology}: {content.methodologyNote}
            </p>
          </div>
        </Section>
      </div>
    </>
  )
}
