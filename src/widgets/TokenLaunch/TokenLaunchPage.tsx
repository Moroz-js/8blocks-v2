import Image from 'next/image'
import { AccentSurface, Button, Section } from '@/shared/ds'
import { tokenLaunchContent as page } from '@/shared/content/tokenLaunch'
import { servicePages } from '@/shared/content/servicePages'
import { Logo } from '@/shared/ui'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import { FitCards } from '@/widgets/ServicePages/blocks/FitCards'
import { HeroBadge } from '@/widgets/ServicePages/blocks/HeroBadge'
import { PartnersMarquee } from '@/widgets/ServicePages/blocks/PartnersMarquee'
import { ServiceFaq } from '@/widgets/ServicePages/blocks/ServiceFaq'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { IndexedRows, SplitList } from '@/widgets/ServicePages/blocks/SplitList'
import { LaunchConfigurator } from './LaunchConfigurator'
import { LaunchLeadForm } from './LaunchLeadForm'
import type { LaunchModuleView } from './types'
import styles from './TokenLaunchPage.module.scss'

const GAP_GLYPHS = [
  { shape: 'padlock', os: 0.8 },
  { shape: 'hourglass', os: 0.8 },
  { shape: 'crackedcoin', os: 0.8 },
  { shape: 'chainbreak', os: 0.95 },
]

const PARTNER_LOGO_HEIGHT: Record<string, number> = { Fibonacci: 32, BingX: 22 }

/** First sentence as the lead, the rest muted. */
function splitSentence(text: string) {
  const end = text.indexOf('. ')
  return end === -1 ? { lead: text, rest: '' } : { lead: text.slice(0, end + 1), rest: text.slice(end + 2) }
}

/** End-to-end token launch track (project 2 «Token Launch»). */
export function TokenLaunchPage({ modules }: { modules: LaunchModuleView[] }) {
  const { hero, gaps, costs, partners, calculator, form, process, fit, faq, finalCta } = page

  return (
    <>
      <ServiceHero
        scene="shuttle"
        titleSize="sm"
        title={hero.headline}
        description={hero.description}
        aside={
          <HeroBadge accent={hero.statBadge} href={hero.statSourceHref} title={hero.statSourceLabel}>
            {hero.statValue} {hero.statCaption}
          </HeroBadge>
        }
        corner={
          <ul className={styles.heroPartners}>
            {hero.partners.map((partner) => (
              <li key={partner.name}>
                {partner.name === '8Blocks' ? (
                  <Logo className={styles.heroLogo} />
                ) : (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={PARTNER_LOGO_HEIGHT[partner.name] ?? 24}
                    style={{ height: PARTNER_LOGO_HEIGHT[partner.name] ?? 24, width: 'auto' }}
                  />
                )}
              </li>
            ))}
          </ul>
        }
      >
        <Button href={hero.ctaHref}>{hero.ctaLabel}</Button>
        <Button href={hero.secondaryHref} variant="tertiary">
          {hero.secondaryLabel}
        </Button>
      </ServiceHero>

      <div className={styles.body}>
        <Section title={gaps.headline} description={gaps.description} align="center" sheen>
          <ul className={styles.gaps}>
            {gaps.items.map((gap, i) => (
              <li key={gap.tag} className={styles.gap}>
                <div className={styles.gapGlyph} aria-hidden="true">
                  <BinaryGlyph shape={GAP_GLYPHS[i].shape} os={GAP_GLYPHS[i].os} />
                </div>
                <div className={styles.gapText}>
                  <p className={styles.gapTag}>{gap.tag}</p>
                  <h3 className={styles.gapTitle}>{gap.question}</h3>
                  <p className={styles.gapDescription}>{gap.text}</p>
                  <p className={styles.gapResult}>
                    <span>{gaps.resultLabel}</span> {gap.result}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <SplitList title={costs.headline} description={costs.description}>
          <IndexedRows
            size="lg"
            items={costs.items.map((item) => ({
              lead: item.question,
              text: item.lead,
              body: (
                <>
                  <p className={styles.rowData}>{item.data}</p>
                  <a href={item.sourceHref} target="_blank" rel="noopener noreferrer" className={styles.source}>
                    {item.sourceLabel}
                  </a>
                </>
              ),
            }))}
          />
        </SplitList>

        <Section title={partners.headline} description={partners.description} sheen>
          <ul className={styles.trio} data-accent-group>
            {partners.items.map((partner) => (
              <li key={partner.name} className={styles.partner}>
                <AccentSurface />
                <div className={styles.partnerHead}>
                  <p className={styles.partnerRole}>{partner.role}</p>
                  <h3 className={styles.partnerName}>{partner.name}</h3>
                </div>
                <div className={styles.partnerText}>
                  <p className={styles.partnerSubtitle}>{partner.subtitle}</p>
                  <p className={styles.partnerDescription}>{partner.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="calculator" title={calculator.headline} description={calculator.description} align="center" sheen narrow className={styles.anchor}>
          <LaunchConfigurator modules={modules} copy={calculator} form={form} />
        </Section>

        <SplitList title={process.headline} description={process.description} titleSize="sm">
          <IndexedRows
            items={process.rows.map((row) => {
              const { lead, rest } = splitSentence(row.text)
              return {
                label: (
                  <>
                    {row.stage}
                    <span className={styles.dot} aria-hidden="true" />
                    {row.duration}
                  </>
                ),
                lead,
                text: rest,
              }
            })}
          />
        </SplitList>

        <Section title={fit.headline} description={fit.description} sheen>
          <FitCards good={{ title: fit.fitTitle, items: fit.fitItems }} bad={{ title: fit.unfitTitle, items: fit.unfitItems }} />
        </Section>

        <Section title={faq.networkTitle} description={faq.geographyText} align="center" sheen className={styles.network}>
          <PartnersMarquee label={faq.networkTitle} className={styles.marquee} />
        </Section>

        <Section id="contact" title={finalCta.headline} description={finalCta.description} align="center" sheen narrow className={styles.anchor}>
          <LaunchLeadForm copy={form} idPrefix="short" submitLabel={form.submitShortLabel} />
        </Section>

        <ServiceFaq title={faq.headline} items={faq.items} footer={servicePages.common.faq.footer} />
      </div>
    </>
  )
}
