import type { CSSProperties } from 'react'
import { AccentSurface, Button, ComparisonTable, Cta, Section, StepNumber } from '@/shared/ds'
import { tokenomicsAiContent as page } from '@/shared/content/tokenomicsAi'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { EarlyAccessDialog } from './EarlyAccessDialog'
import { EARLY_ACCESS_HASH } from './earlyAccess'
import { LimitedPill } from './LimitedPill'
import styles from './TokenomicsAiPage.module.scss'

const CONTACT_HREF = '/contact'

/** 12 monthly bars, six stacked allocations unlocking at different speeds (designer's chart). */
const VESTING_BARS = Array.from({ length: 12 }, (_, month) => {
  const k = (month + 1) / 12
  const parts = [0.1 + 0.05 * k, 0.12, 0.05 * k, 0.12 * Math.min(1, k * 1.6), 0.1 * Math.min(1, k * 2), 0.16 * Math.min(1, k * 1.3)]
  const total = parts.reduce((a, b) => a + b, 0)
  return { height: Math.round(30 + (70 * total) / 0.9), parts: parts.map((p) => Math.round(p * 1000) / 1000) }
})

/** Circulation scheme boxes: x, y, width (334 × 260 frame). */
const FLOW_NODES: [number, number, number][] = [
  [117, 2, 100],
  [12, 78, 90],
  [122, 78, 90],
  [232, 78, 90],
  [12, 118, 90],
  [12, 170, 90],
  [177, 170, 90],
  [12, 226, 90],
]
const FLOW_TONE = ['strong', 'base', 'base', 'base', 'base', 'mid', 'base', 'soft']

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="currentColor" />
      <path d="M5.2 9.2l2.5 2.4 5-5.1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="8.5" stroke="currentColor" />
      <path d="M6.3 6.3l5.4 5.4M11.7 6.3l-5.4 5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function Actions() {
  return (
    <div className={styles.actions}>
      <Button href={EARLY_ACCESS_HASH}>{page.actions.access}</Button>
      <Button href={CONTACT_HREF} variant="secondary">
        {page.actions.sales}
      </Button>
    </div>
  )
}

/** Tokenomics AI product page (project 2 «Tokenomics AI»). */
export function TokenomicsAiPage() {
  const { hero, steps, outputs, compare } = page

  return (
    <>
      <ServiceHero
        scene="unicorn"
        titleSize="md"
        eyebrow={<LimitedPill>{page.limited}</LimitedPill>}
        title={
          <>
            <span className={styles.titleLead}>{hero.titleLead}</span>
            <span className={styles.titleMain}>
              {hero.title.split(/(?<=\.) /).map((sentence, i) => (
                <span key={i} className={styles.titleLine}>
                  {i > 0 && ' '}
                  {sentence}
                </span>
              ))}
            </span>
          </>
        }
        description={hero.description}
        cornerAlign="left"
        corner={
          <ul className={styles.facts}>
            {hero.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        }
      >
        <Button href={EARLY_ACCESS_HASH}>{page.actions.access}</Button>
      </ServiceHero>

      <div className={styles.body}>
        <Section>
          <div className={styles.how}>
            <div className={styles.howText}>
              <h2 className={styles.howTitle}>{steps.title}</h2>
              <ol className={styles.steps}>
                {steps.items.map((step, i) => (
                  <li key={step.title} className={styles.step}>
                    <StepNumber>{i + 1}</StepNumber>
                    <div className={styles.stepText}>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepSubtitle}>{step.subtitle}</p>
                      <p className={styles.stepDescription}>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Actions />
            </div>
            <figure className={styles.demo}>
              <div className={styles.demoStage} role="img" aria-label={steps.demo.label}>
                <AccentSurface />
                <div className={styles.window}>
                  <div className={styles.windowBar}>
                    <span className={styles.windowDots} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>8Blocks AI</span>
                  </div>
                  <div className={styles.windowChat}>
                    <span className={styles.orb} aria-hidden="true" />
                    <p className={styles.greeting}>{steps.demo.greeting}</p>
                  </div>
                  <div className={styles.model}>
                    <p className={styles.modelHead}>
                      <span className={styles.modelName}>{steps.demo.project}</span>
                      <span className={styles.modelMeta}>{steps.demo.meta}</span>
                    </p>
                    <span className={styles.modelBar} aria-hidden="true">
                      {[18, 14, 10, 22, 16, 20].map((flex, i) => (
                        <i key={i} style={{ flex }} />
                      ))}
                    </span>
                    <p className={styles.modelMeta}>{steps.demo.ready}</p>
                  </div>
                </div>
                <p className={styles.demoInput}>{steps.demo.input}</p>
              </div>
              <figcaption className={styles.demoNote}>{steps.demo.note}</figcaption>
            </figure>
          </div>
        </Section>

        <Section
          align="center"
          title={
            <>
              {outputs.title}
              <span className={styles.titleMuted}>{outputs.accent}</span>
            </>
          }
        >
          <ul className={styles.outputs} data-accent-group>
            <li className={styles.output}>
              <AccentSurface />
              <div className={styles.outputHead}>
                <h3 className={styles.outputTitle}>{outputs.vesting.title}</h3>
                <p className={styles.outputText}>{outputs.vesting.text}</p>
              </div>
              <div className={styles.vesting}>
                <div className={styles.bars} role="img" aria-label={outputs.vesting.chartLabel}>
                  {VESTING_BARS.map((bar, i) => (
                    <span key={i} className={styles.bar} style={{ height: `${bar.height}%` }}>
                      {bar.parts.map((part, j) => (
                        <i key={j} style={{ flex: part } as CSSProperties} data-tone={j} />
                      ))}
                    </span>
                  ))}
                </div>
                <ul className={styles.legend}>
                  {outputs.vesting.legend.map((name, j) => (
                    <li key={name}>
                      <i data-tone={j} />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className={styles.output}>
              <AccentSurface />
              <div className={styles.outputHead}>
                <h3 className={styles.outputTitle}>{outputs.circulation.title}</h3>
                <p className={styles.outputText}>{outputs.circulation.text}</p>
              </div>
              <div className={styles.flow} role="img" aria-label={outputs.circulation.title}>
                <svg width="100%" height="260" viewBox="0 0 334 260" fill="none" aria-hidden="true">
                  <path
                    d="M167 34V56M57 56H277M57 56V78M167 56V78M277 56V78M57 110V150M57 150V170M167 110V150M277 110V150M57 150H277M222 150V170M57 202V226"
                    stroke="currentColor"
                  />
                </svg>
                {outputs.circulation.nodes.map((name, i) => {
                  const [x, y, w] = FLOW_NODES[i]
                  return (
                    <span key={name} className={styles.node} data-tone={FLOW_TONE[i]} style={{ left: x, top: y, width: w }}>
                      {name}
                    </span>
                  )
                })}
              </div>
            </li>
            <li className={styles.output}>
              <AccentSurface />
              <div className={styles.outputHead}>
                <h3 className={styles.outputTitle}>{outputs.utility.title}</h3>
                <p className={styles.outputText}>{outputs.utility.text}</p>
              </div>
              <ul className={styles.checks}>
                {outputs.utility.checks.map((item) => (
                  <li key={item}>
                    <span className={styles.checkIcon}>
                      <Check />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </Section>

        <Section id="early-access" className={styles.compare}>
          <div className={styles.compareHead}>
            <LimitedPill>{page.limited}</LimitedPill>
            <h2 className={styles.compareTitle}>{compare.title}</h2>
            <p className={styles.compareText}>{compare.description}</p>
            <Actions />
          </div>
          <ComparisonTable
            caption={compare.caption}
            columns={compare.columns}
            highlight={1}
            accent
            rows={compare.rows.map((row) => ({
              label: <span className={styles.rowLabel}>{row.label}</span>,
              values: row.cells.map((cell, i) =>
                cell === 'yes' ? (
                  <span key={i} className={styles.yes} data-on-accent={i === 1 || undefined} title={compare.included}>
                    <Check />
                    <span className={styles.srOnly}>{compare.included}</span>
                  </span>
                ) : cell === 'no' ? (
                  <span key={i} className={styles.no} title={compare.notIncluded}>
                    <Cross />
                    <span className={styles.srOnly}>{compare.notIncluded}</span>
                  </span>
                ) : cell === 'maybe' ? (
                  <span key={i} className={styles.maybe}>
                    {compare.possible}
                  </span>
                ) : (
                  cell
                ),
              ),
            }))}
          />
        </Section>

        <Section>
          <Cta
            variant="center"
            title={page.cta}
            primary={{ label: page.actions.access, href: EARLY_ACCESS_HASH }}
            secondary={{ label: page.actions.sales, href: CONTACT_HREF }}
          />
        </Section>
      </div>

      <EarlyAccessDialog copy={page.form} limited={page.limited} />
    </>
  )
}
