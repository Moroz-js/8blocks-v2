import Link from 'next/link'
import clsx from 'clsx'
import {
  Button,
  ComparisonTable,
  Cta,
  Hint,
  ScorePetals,
  Section,
  type Petal,
  type PetalTone,
} from '@/shared/ds'
import type { CalculatorResultContent } from '@/shared/content/calculatorResult'
import type { TokenModel } from '@/shared/lib/platform/tokenlab/model'
import { computeStructureScore, type DimensionResult } from '@/shared/lib/platform/tokenlab/scoringV3'
import { calcUnlockPressure12m, getPressureTag } from '@/shared/lib/platform/tokenlab/pressure'
import { calcInitialCircPercent } from '@/shared/lib/platform/tokenlab/calc'
import { compareWithMarket } from '@/shared/lib/platform/tokenlab/benchmarkNorms'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { fmtShort } from '@/shared/lib/platform/tokenlab/format'
import { CallSteps } from '@/widgets/ServicePages/blocks/CallSteps'
import { CoverCard } from '@/widgets/ServicePages/blocks/CoverCard'
import { ServiceFaq } from '@/widgets/ServicePages/blocks/ServiceFaq'
import { localizeCap, localizeDimension, localizeFix, localizeTier } from '../copy'
import { UnlockChart } from '../UnlockChart'
import { DownloadReport } from './DownloadReport'
import { FixCards } from './FixCards'
import checklistCover from '../assets/checklist-cover.webp'
import styles from './CalculatorResultPage.module.scss'

/** Fixes held back for the call; the designer's narrative is «3 open + 11 on the call». */
const CALL_FIXES = 11
/** Petal order, clockwise from the top-right corner. */
const PETAL_ORDER: DimensionResult['id'][] = ['overhang', 'discipline', 'float', 'shock', 'community']

export interface BenchmarkReference {
  name: string
  values: Record<string, string>
}

function tone(score: number): PetalTone {
  return score >= 70 ? 'good' : score >= 55 ? 'medium' : 'bad'
}

function petalValue(score: number) {
  if (score >= 85) return 1
  return { good: 0.78, medium: 0.56, bad: 0.34 }[tone(score)]
}

function lines(text: string) {
  return text.split('\n').flatMap((line, i) => (i ? [<br key={i} />, line] : [line]))
}

const PencilIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.87 6.63 4.5 14H2v-2.5l7.37-7.37 2.5 2.5Zm-.56-4.44a.66.66 0 0 1 .94 0l1.56 1.56c.26.26.26.68 0 .94l-1.22 1.22-2.5-2.5 1.22-1.22Z" />
  </svg>
)

export function CalculatorResultPage({
  model,
  content,
  reference,
}: {
  model: TokenModel
  content: CalculatorResultContent
  reference: BenchmarkReference | null
}) {
  const { allocations, vestings, totalSupply } = model
  const result = computeStructureScore(allocations, vestings)
  const tier = localizeTier(result.tier.name, result.tier.meaning)
  const pressure = calcUnlockPressure12m(allocations, vestings, totalSupply)
  const pressureTag = getPressureTag(pressure) as keyof typeof content.bestFit.pressureTags
  const tgeFloat = calcInitialCircPercent(allocations, vestings)
  const encoded = encodeModel(model)
  const activeBuckets = allocations.filter((item) => item.enabled && item.percent > 0).length

  const petals: Petal[] = PETAL_ORDER.map((id) => {
    const dimension = result.dimensions.find((item) => item.id === id)!
    return {
      id,
      label: localizeDimension(dimension).name,
      tip: content.dimensionTips[id],
      value: petalValue(dimension.score),
      tone: tone(dimension.score),
    }
  })

  const metrics = [
    {
      label: content.bestFit.tgeFloat,
      tip: content.bestFit.tips.tgeFloat,
      value: `${tgeFloat.toFixed(1)}%`,
      tone: tgeFloat < 6 ? 'bad' : tgeFloat < 10 ? 'medium' : 'good',
    },
    {
      label: content.bestFit.pressure,
      tip: content.bestFit.tips.pressure,
      value: `${pressure.toFixed(1)}% · ${content.bestFit.pressureTags[pressureTag] ?? pressureTag}`,
      tone: pressureTag === 'Low' ? 'good' : pressureTag === 'Moderate' ? 'medium' : 'bad',
    },
    { label: content.bestFit.supply, tip: content.bestFit.tips.supply, value: fmtShort(totalSupply), tone: null },
  ] as const

  const benchmarks = compareWithMarket(allocations, vestings)
  const columns = [content.benchmarks.average, content.benchmarks.yours]
  if (reference) columns.push(content.benchmarks.top.replace('{name}', reference.name))

  const openFixes = result.topFixes.map((fix) => ({
    title: localizeFix(fix.label),
    result: content.growth.result
      .replace('{gain}', String(fix.gain))
      .replace('{from}', String(result.score))
      .replace('{to}', String(Math.min(100, result.score + fix.gain))),
  }))
  const growthCount = openFixes.length + CALL_FIXES

  return (
    <>
      <Section className={styles.topSection}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <h1 className={styles.title}>{content.title}</h1>
            <p className={styles.readiness}>
              {content.readiness} <span className={styles[tone(result.score)]}>{tier.name}</span>
            </p>
            <p className={styles.meaning}>{tier.meaning}</p>
            {result.caps.length > 0 && (
              <ul className={styles.caps}>
                {result.caps.map((cap) => (
                  <li key={cap.id}>{localizeCap(cap.id, cap.message)}</li>
                ))}
              </ul>
            )}
            <DownloadReport
              model={model}
              label={content.download}
              preparing={content.preparing}
              fallbackName={content.reportFallback}
              className={styles.download}
            />
          </div>

          <div className={styles.cards}>
            <ScorePetals petals={petals} label={content.radarLabel} />

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>{content.bestFit.title}</h2>
              <dl className={styles.rows}>
                {metrics.map((metric) => (
                  <div key={metric.label} className={styles.row}>
                    <dt>
                      <Hint text={metric.tip} />
                      {metric.label}
                    </dt>
                    <dd className={metric.tone ? styles[metric.tone] : undefined}>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={clsx(styles.card, styles.inputs)}>
              <h2 className={styles.cardTitle}>{content.inputs.title}</h2>
              <p className={styles.muted}>
                {content.inputs.summary
                  .replace('{supply}', totalSupply.toLocaleString('en-US'))
                  .replace('{count}', String(activeBuckets))}
              </p>
              <Link href={`/product/calculator?m=${encoded}&edit=1#calculator`} className={styles.edit}>
                {PencilIcon}
                {content.inputs.edit}
              </Link>
            </section>

            <Cta size="xs" title={content.tired.title} description={content.tired.description} primary={content.tired.action} />
          </div>
        </div>
      </Section>

      <Section title={content.unlock.title}>
        <div className={styles.chartCard}>
          <UnlockChart allocations={allocations} vestings={vestings} totalSupply={totalSupply} height={270} labelSize={8} variant="mono" />
          <Button variant="secondary" href={content.unlock.action.href} className={styles.chartAction}>
            {content.unlock.action.label}
          </Button>
        </div>
      </Section>

      <Section
        title={
          <span className={styles.benchTitle}>
            <Hint text={content.benchmarks.tip} />
            {content.benchmarks.title}
          </span>
        }
      >
        <ComparisonTable
          caption={content.benchmarks.caption}
          columns={columns.map((column) => lines(column))}
          rows={benchmarks.map((check) => {
            const row = content.benchmarks.rows[check.key as keyof typeof content.benchmarks.rows]
            const within = check.status === 'within'
            const values = [
              check.norm.replace(' standard', '').replace('-', '–'),
              <span key="yours" className={within ? styles.good : styles.bad}>
                {within ? check.yours : `${check.yours}, ${check.status === 'above' ? content.benchmarks.above : content.benchmarks.below}`}
              </span>,
            ]
            if (reference) values.push(reference.values[check.key] ?? '—')
            return {
              label: (
                <span className={styles.benchLabel}>
                  <Hint text={row?.tip ?? check.label} />
                  {row?.label ?? check.label}
                </span>
              ),
              values,
            }
          })}
        />
      </Section>

      <Section
        title={content.growth.title.replace('{count}', String(growthCount))}
        description={
          openFixes.length > 0
            ? content.growth.description.replace('{open}', String(openFixes.length))
            : content.growth.descriptionLocked
        }
        align="center"
      >
        <FixCards
          open={openFixes}
          locked={content.growth.lockedTitles}
          copy={{
            improvement: content.growth.improvement,
            leaveWith: content.growth.leaveWith,
            see: content.growth.see,
            hide: content.growth.hide,
            locked: content.growth.locked,
            lockedHref: content.growth.lockedHref,
          }}
        />
      </Section>

      <CallSteps
        title={content.call.title.replace('{count}', String(CALL_FIXES))}
        imageAlt={content.call.imageAlt}
        steps={content.call.steps}
        action={content.call.action}
      />

      <CoverCard
        title={content.checklist.title}
        description={content.checklist.description}
        action={content.checklist.action}
        image={checklistCover}
        imageAlt={content.checklist.coverAlt}
        art={{ width: 440, height: 389, right: 128 }}
      />

      <ServiceFaq title={content.faq.title} items={content.faq.items} footer={content.faq.footer} />
    </>
  )
}

/** Broken or missing `?m=` link. */
export function CalculatorResultInvalid({ content }: { content: CalculatorResultContent }) {
  return (
    <Section className={styles.topSection}>
      <div className={styles.invalid}>
        <h1 className={styles.title}>{content.invalid.title}</h1>
        <p className={styles.meaning}>{content.invalid.description}</p>
        <Button href={content.invalid.action.href}>{content.invalid.action.label}</Button>
      </div>
    </Section>
  )
}
