import Image from 'next/image'
import clsx from 'clsx'
import { AccentSurface, Button, CaseList, Section } from '@/shared/ds'
import type { CountryId, DigitalAssetsContent } from '@/shared/content/digitalAssets'
import type { ReadinessContent } from '@/shared/content/readiness'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import { situationItems } from '@/widgets/Readiness/art'
import { CoverCard } from '@/widgets/ServicePages/blocks/CoverCard'
import { ServiceFaq } from '@/widgets/ServicePages/blocks/ServiceFaq'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { SituationTabs } from '@/widgets/ServicePages/blocks/SituationTabs'
import { TeamCta } from '@/widgets/ServicePages/blocks/TeamCta'
import caseGold from '@/widgets/ServicePages/assets/case-gold.webp'
import caseHarvest from '@/widgets/ServicePages/assets/case-harvest.webp'
import caseMill from '@/widgets/ServicePages/assets/case-mill.webp'
import { FLAGS } from './flags'
import { Jurisdictions } from './Jurisdictions'
import hero from './assets/hero.webp'
import tower from './assets/tower.webp'
import dubai from './assets/dubai.webp'
import srcMoney from './assets/src-money.webp'
import srcJustice from './assets/src-justice.webp'
import styles from './DigitalAssetsPage.module.scss'

const CASE_IMAGES = [caseGold, caseHarvest, caseMill]
const MARKET_IMAGES = [srcMoney, srcJustice]
const MARKET_FLAGS: CountryId[] = ['us', 'eu']
const DEPTH_GLYPHS = ['compass', 'crane', 'team']
/** The middle depth is the recommended one. */
const FEATURED_DEPTH = 1
const GRID_GLYPHS = ['clock', 'coin', 'flag', 'kettlebell']
const LIST_GLYPHS = ['gear', 'blueprint', 'orbit', 'twin']

const isExternal = (href: string) => /^https?:\/\//.test(href)
const external = (href: string) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

function Source({ id, place, date, className }: { id: CountryId; place: string; date: string; className?: string }) {
  return (
    <p className={clsx(styles.source, className)}>
      <span className={styles.sourceFlag} aria-hidden="true">
        {FLAGS[id]}
      </span>
      <span>{place}</span>
      <span aria-hidden="true">·</span>
      <span>{date}</span>
    </p>
  )
}

interface DigitalAssetsPageProps {
  content: DigitalAssetsContent
  paths: ReadinessContent['paths']
}

export function DigitalAssetsPage({ content, paths }: DigitalAssetsPageProps) {
  const { hero: heroContent, widen, owners, realEstate, steps, market, depths, blocks, resources } = content

  return (
    <>
      <ServiceHero image={hero} layout="spread" title={heroContent.title}>
        <Button href={heroContent.action.href} {...external(heroContent.action.href)}>
          {heroContent.action.label}
        </Button>
      </ServiceHero>

      <Section title={widen.title} align="center">
        <ul className={styles.widen}>
          {widen.cards.map((card, i) => {
            const last = i === widen.cards.length - 1
            return (
              <li key={card.title} className={clsx(styles.widenCard, last && styles.widenAccent)}>
                {last && <AccentSurface />}
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <ul className={styles.points}>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
        <p className={styles.note}>{widen.note}</p>
      </Section>

      <Section title={owners.title} align="center">
        <SituationTabs label={owners.title} labels={paths.labels} items={situationItems(paths, owners.tabs)} tabsVariant="ghost" />
      </Section>

      <CoverCard
        layout="row"
        title={realEstate.title}
        description={realEstate.description}
        action={realEstate.action}
        image={tower}
        imageAlt={realEstate.imageAlt}
        art={{ width: 396, height: 509, right: -44, bottom: -40 }}
      />

      <Section title={steps.title}>
        <div className={styles.stepsBlock}>
          <ol className={styles.steps}>
            {steps.items.map((step, i) => (
              <li key={step.lead} className={styles.step}>
                <span className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.stepText}>
                  <span className={styles.lead}>{step.lead}</span> {step.text}
                </p>
                <p className={styles.stepText}>
                  <span className={styles.lead}>{steps.result}</span> {step.result}
                </p>
                <div className={styles.stepAction}>
                  {step.action && (
                    <Button variant="secondary" href={step.action.href} {...external(step.action.href)}>
                      {step.action.label}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.selfServe}>
            <h3 className={styles.selfServeTitle}>{steps.selfServe.title}</h3>
            <div className={styles.selfServeActions}>
              {steps.selfServe.actions.map((action) => (
                <Button key={action.href} variant="secondary" href={action.href}>
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className={styles.market}>
          <article className={styles.marketLead}>
            <Image src={dubai} alt="" fill sizes="(max-width: 640px) 100vw, 600px" className={styles.marketImage} />
            <Source id="ae" place={market.lead.place} date={market.lead.date} />
            <h3 className={styles.marketLeadTitle}>{market.lead.title}</h3>
            <p className={styles.marketLeadText}>{market.lead.description}</p>
            <Button href={market.lead.href} target="_blank" rel="noopener noreferrer" className={styles.marketLeadAction}>
              {market.source}
            </Button>
          </article>
          <div className={styles.marketList}>
            {market.items.map((item, i) => (
              <article key={item.title} className={styles.marketCard}>
                <Image src={MARKET_IMAGES[i]} alt="" fill sizes="(max-width: 640px) 100vw, 600px" className={styles.marketImage} />
                <div className={styles.marketText}>
                  <h3 className={styles.marketTitle}>{item.title}</h3>
                  <p className={styles.marketDescription}>{item.description}</p>
                </div>
                <div className={styles.marketFoot}>
                  <Button variant="tertiary" href={item.href} target="_blank" rel="noopener noreferrer">
                    {market.source}
                  </Button>
                  <Source id={MARKET_FLAGS[i]} place={item.place} date={item.date} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section title={content.jurisdictions.title} description={content.jurisdictions.description} align="center" className={styles.jurisdictions}>
        <Jurisdictions content={content.jurisdictions} />
      </Section>

      <Section title={depths.title} align="center">
        <ul className={styles.depths}>
          {depths.items.map((depth, i) => {
            const featured = i === FEATURED_DEPTH
            return (
              <li key={depth.title} className={styles.depth}>
                {featured && <span className={styles.badge}>{depths.badge}</span>}
                <div className={styles.depthHead}>
                  <h3 className={styles.depthTitle}>{depth.title}</h3>
                  <p className={styles.depthSubtitle}>{depth.subtitle}</p>
                </div>
                <div className={styles.depthGlyph} aria-hidden="true">
                  <BinaryGlyph shape={DEPTH_GLYPHS[i]} os={0.92} />
                </div>
                <dl className={styles.depthFacts}>
                  <div>
                    <dt>{depths.labels.provide}</dt>
                    <dd>{depth.provide}</dd>
                  </div>
                  <div>
                    <dt>{depths.labels.executes}</dt>
                    <dd>{depth.executes}</dd>
                  </div>
                  <div className={styles.depthEnds}>
                    <dt>{depths.labels.ends}</dt>
                    <dd>{depth.ends}</dd>
                  </div>
                </dl>
                <Button
                  variant={featured ? 'primary' : 'secondary'}
                  href={depths.action.href}
                  {...external(depths.action.href)}
                  fullWidth
                >
                  {depths.action.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title={blocks.title}>
        <div className={styles.blocks}>
          <ul className={styles.blocksGrid}>
            {blocks.items.slice(0, 4).map((item, i) => (
              <li key={item.title} className={styles.block}>
                <div className={styles.blockGlyph} aria-hidden="true">
                  <BinaryGlyph shape={GRID_GLYPHS[i]} ox={0.25} oy={0.36} os={0.5} />
                </div>
                <div className={styles.blockText}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.blockDescription}>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <ul className={styles.blocksList}>
            {blocks.items.slice(4).map((item, i) => (
              <li key={item.title} className={clsx(styles.block, styles.blockRow)}>
                <div className={styles.blockGlyph} aria-hidden="true">
                  <BinaryGlyph shape={LIST_GLYPHS[i]} ox={0.2} oy={0.5} os={0.78} />
                </div>
                <div className={styles.blockText}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.blockDescription}>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title={content.casework.title}>
        <CaseList
          items={content.casework.items.map((item, i) => ({
            ...item,
            image: { src: CASE_IMAGES[i % CASE_IMAGES.length], alt: '' },
            cta: content.casework.cta,
          }))}
        />
      </Section>

      <TeamCta {...content.team} />

      <Section>
        <div className={styles.resources}>
          {resources.map((resource, i) => (
            <article key={resource.title} className={clsx(styles.resource, i === 0 && styles.resourceLight)}>
              <div className={styles.resourceText}>
                <p className={styles.resourceEyebrow}>{resource.eyebrow}</p>
                <h3 className={styles.resourceTitle}>{resource.title}</h3>
                <p className={styles.resourceDescription}>{resource.description}</p>
              </div>
              <Button variant={i === 0 ? 'secondary' : 'tertiary'} href={resource.action.href}>
                {resource.action.label}
              </Button>
            </article>
          ))}
        </div>
      </Section>

      <ServiceFaq title={content.faq.title} items={content.faq.items} footer={content.faq.footer} />
    </>
  )
}