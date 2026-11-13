import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { AccentSurface, Button, CaseList, Cta, ScorePetals, Section, petalTone, type Petal } from '@/shared/ds'
import type { ReadinessContent } from '@/shared/content/readiness'
import {
  PILLARS,
  QUESTIONS,
  encodeAnswers,
  evaluate,
  type Answers,
  type StatusId,
} from '@/shared/lib/platform/readiness/scoring'
import { CallSteps } from '@/widgets/ServicePages/blocks/CallSteps'
import { CoverCard } from '@/widgets/ServicePages/blocks/CoverCard'
import { ServiceFaq } from '@/widgets/ServicePages/blocks/ServiceFaq'
import { PATH_ART } from './art'
import { PencilIcon, SourceIcon, StrengthIcon, ValidateIcon } from './icons'
import { CHECK_PATH } from './paths'
import solar from './assets/precedent-solar.webp'
import caseGold from '@/widgets/ServicePages/assets/case-gold.webp'
import caseHarvest from '@/widgets/ServicePages/assets/case-harvest.webp'
import caseMill from '@/widgets/ServicePages/assets/case-mill.webp'
import envelope from './assets/guide-envelope.webp'
import styles from './ReadinessResultPage.module.scss'

const MAX_STRENGTHS = 4
const MAX_VALIDATE = 3
const CASE_IMAGES = [caseGold, caseHarvest, caseMill]
const TONE: Record<StatusId, string> = { strong: styles.good, explore: styles.medium, notYet: styles.bad }
/** Fragments of the summary's first sentence, in reading order. */
const CASE_PHRASES = ['objective', 'size', 'asset', 'rights'] as const

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

export function ReadinessResultPage({ answers, content }: { answers: Answers; content: ReadinessContent }) {
  const { status, path, pillars } = evaluate(answers)
  const { result, quiz } = content
  const pathCopy = content.paths.items[path]
  const option = (id: (typeof QUESTIONS)[number]['id']) =>
    (quiz.questions[id].options as Record<string, { label: string; strength?: string; concern?: string; phrase?: string }>)[
      answers[id]
    ]

  const strengths = QUESTIONS.map(({ id }) => option(id).strength)
    .filter((line): line is string => Boolean(line))
    .slice(0, MAX_STRENGTHS)
  const validate = [...QUESTIONS.map(({ id }) => option(id).concern), pathCopy.validate]
    .filter((line): line is string => Boolean(line))
    .slice(0, MAX_VALIDATE)
  const summary = result.summary[status]
    .replace('{case}', CASE_PHRASES.map((id) => option(id).phrase ?? '').join(''))
    .replace('{path}', lowerFirst(pathCopy.name))
    .replace('{Path}', pathCopy.name)
    .replace('{question}', lowerFirst(validate[0]))

  const petals: Petal[] = PILLARS.map((id) => ({
    id,
    label: content.pillars[id].label,
    tip: content.pillars[id].tip,
    value: pillars[id],
    tone: petalTone(pillars[id]),
  }))
  const encoded = encodeAnswers(answers)
  const precedent = pathCopy.precedent

  return (
    <>
      <Section className={styles.topSection}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <p className={styles.direction}>{result.direction}</p>
            <h1 className={styles.title}>{pathCopy.name}</h1>
            <p className={styles.readiness}>
              {result.readiness} <span className={TONE[status]}>{content.statuses[status].short}</span>
            </p>
            <p className={styles.summary}>{summary}</p>
          </div>

          <div className={styles.cards}>
            <ScorePetals petals={petals} label={content.chartLabel} hints />

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>{result.strengthsTitle}</h2>
              {strengths.length > 0 ? (
                <ul className={styles.strengths}>
                  {strengths.map((line) => (
                    <li key={line} className={styles.strength}>
                      {StrengthIcon}
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={clsx(styles.muted, styles.noStrengths)}>{result.noStrengths}</p>
              )}
              <h2 className={clsx(styles.cardTitle, styles.validateTitle)}>{result.validateTitle}</h2>
              <ul className={styles.validate}>
                {validate.map((line) => (
                  <li key={line} className={styles.validateItem}>
                    <span className={styles.validateIcon}>{ValidateIcon}</span>
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <section className={clsx(styles.card, styles.inputs)}>
              <h2 className={styles.cardTitle}>{result.inputs.title}</h2>
              <p className={clsx(styles.muted, styles.inputsLine)}>
                {QUESTIONS.map(({ id }) => option(id).label).join(' · ')}
              </p>
              <Link href={`${CHECK_PATH}?a=${encoded}#quiz`} className={styles.edit}>
                {PencilIcon}
                {result.inputs.edit}
              </Link>
            </section>
          </div>
        </div>
      </Section>

      <Section title={result.precedent.title}>
        <div className={styles.precedent}>
          <Image
            src={path === 'asset_backed' ? solar : PATH_ART[path].image}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className={styles.precedentImage}
          />
          <div className={styles.precedentText}>
            <h3 className={styles.precedentTitle}>
              <span className={styles.kicker}>{precedent.kicker}</span>
              {precedent.title}
            </h3>
            <p className={styles.precedentDescription}>{precedent.description}</p>
          </div>
          {precedent.stat && (
            <p className={styles.stat}>
              {SourceIcon}
              {precedent.stat}
            </p>
          )}
        </div>
        <p className={clsx(styles.muted, styles.note)}>{result.precedent.note}</p>
      </Section>

      <Section>
        <Cta
          size="md"
          title={result.feasibility.title}
          description={result.feasibility.description}
          primary={result.feasibility.primary}
          secondary={{ label: result.feasibility.restart, href: `${CHECK_PATH}#quiz` }}
        />
      </Section>

      <Section>
        <h2 className={styles.widenTitle}>{pathCopy.widen.title}</h2>
        <div className={styles.widen}>
          {[pathCopy.widen.conventional, pathCopy.widen.digital].map((side, i) => (
            <div key={side.label} className={clsx(styles.widenCard, i === 1 && styles.digital)}>
              {i === 1 && <AccentSurface />}
              <p className={styles.cardTitle}>{side.label}</p>
              <div className={styles.widenValue}>
                <p className={styles.widenNumber}>{side.value}</p>
                <p className={styles.widenText}>{side.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={result.route.title} description={result.route.description}>
        <div className={styles.route}>
          <AccentSurface />
          <ol className={styles.routeSteps}>
            {result.route.steps.map((step, i) => (
              <li key={step.title} className={styles.routeStep}>
                <p className={styles.routeTitle}>
                  {i + 1}. {step.title}
                </p>
                <p className={styles.routeText}>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section title={result.casework.title}>
        <CaseList
          items={result.casework.items.map((item, i) => ({
            ...item,
            image: { src: CASE_IMAGES[i % CASE_IMAGES.length], alt: '' },
            cta: result.casework.cta,
          }))}
        />
      </Section>

      <CallSteps
        title={result.call.title}
        imageAlt={result.call.imageAlt}
        steps={result.call.steps}
        action={result.call.action}
        imageFirst
      />

      <CoverCard
        title={result.guide.title}
        description={result.guide.description}
        action={result.guide.action}
        image={envelope}
        imageAlt={result.guide.imageAlt}
        art={{ width: 587, height: 483, right: 5 }}
      />

      <ServiceFaq title={result.faq.title} items={result.faq.items} footer={result.faq.footer} />
    </>
  )
}

export function ReadinessResultInvalid({ content }: { content: ReadinessContent['result']['invalid'] }) {
  return (
    <Section className={styles.topSection}>
      <div className={styles.invalid}>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.muted}>{content.description}</p>
        <Button href={content.action.href}>{content.action.label}</Button>
      </div>
    </Section>
  )
}
