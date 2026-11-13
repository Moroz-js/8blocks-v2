import { Button, Cta } from '@/shared/ds'
import { HeroBadge } from '@/widgets/ServicePages/blocks/HeroBadge'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { CaseStats, CasesLibrary, type CasesData } from './CasesLibrary'
import styles from './TokenizationCasesPage.module.scss'

const LOGOS = [
  { name: 'blackrock', height: 18 },
  { name: 'jpmorgan', height: 20 },
  { name: 'visa', height: 22 },
  { name: 'mastercard', height: 26 },
  { name: 'hsbc', height: 22 },
  { name: 'robinhood', height: 24 },
]

export interface TokenizationCasesCopy {
  badges: readonly string[]
  headline: string
  lead: string
  sectionTitle: string
  scaleLabel: string
  scaleText: string
  ctaTitle: string
  readiness: string
  contact: string
}

const READINESS_HREF = '/product/tokenization-readiness'
const CONTACT_HREF = '/contact'

/** Tokenization case library (project 2 «Tokenization Cases»). */
export function TokenizationCasesPage({ copy, data }: { copy: TokenizationCasesCopy; data: CasesData }) {
  const [sourced, ...badges] = copy.badges

  return (
    <>
      <ServiceHero
        scene="office"
        artTop={80}
        artLeft={190}
        titleSize="md"
        eyebrow={<HeroBadge accent={sourced}>{badges.join(' · ')}</HeroBadge>}
        title={copy.headline}
        description={copy.lead}
        aside={
          <div className={styles.logos} aria-hidden="true">
            {LOGOS.map((logo) => (
              // Curated local brand assets.
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.name} src={`/logos/orgs/${logo.name}.svg`} alt="" style={{ height: logo.height }} />
            ))}
          </div>
        }
      >
        <Button href={READINESS_HREF}>{copy.readiness}</Button>
        <Button href={CONTACT_HREF} variant="tertiary">
          {copy.contact}
        </Button>
      </ServiceHero>

      <div className={styles.page}>
        <CaseStats stats={data.stats} />
        <CasesLibrary data={data} title={copy.sectionTitle} />
        <Cta
          size="md"
          title={
            <>
              {copy.scaleLabel}
              <br />
              {copy.ctaTitle}
            </>
          }
          description={copy.scaleText}
          primary={{ label: copy.readiness, href: READINESS_HREF }}
          secondary={{ label: copy.contact, href: CONTACT_HREF }}
        />
      </div>
    </>
  )
}
