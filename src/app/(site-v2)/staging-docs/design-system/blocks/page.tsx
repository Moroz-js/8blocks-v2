import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  AccentCard,
  Carousel,
  CaseList,
  ComparisonTable,
  Cta,
  Faq,
  FeatureCards,
  FormBlock,
  FormRow,
  Metrics,
  QuoteCard,
  Roadmap,
  Section,
  TextField,
  Textarea,
} from '@/shared/ds'
import binanceLogo from '../demo/demo-binance-logo.svg'
import caseImage from '../demo/demo-case.webp'
import styles from './Blocks.module.scss'

const IS_STAGING = process.env.NEXT_PUBLIC_STAGING === 'true'

export const metadata: Metadata = {
  title: 'Дизайн-система v2 — блоки',
  robots: { index: false, follow: false, nocache: true },
}

// Demo content copied from the Figma frames.
const DESC = 'We design models that can evolve with new mechanics, product changes, and ecosystem growth'

const COMPACT = Array.from({ length: 8 }, (_, i) =>
  i === 5
    ? {
        title: 'We account for financial and technical systems',
        description: 'We connect tokenomics to on-chain and off-chain logic, liquidity, and the internal rules the system runs on',
      }
    : { title: 'We build for change', description: DESC },
)

const ACTION = [
  { title: 'Check your assets in Token Lab', description: DESC, action: { label: 'Discuss your property', href: '/contact' } },
  { title: 'The owner’s guide, on one page', description: DESC, action: { label: 'Discuss your property', href: '/contact' } },
  { title: 'The owner’s guide, on one page', description: DESC, action: { label: 'Discuss your property', href: '/contact' } },
]

const ILLUSTRATED = [
  { title: 'Check your assets in Token Lab', description: DESC },
  { title: 'The owner’s guide, on one page', description: DESC },
]

const METRICS = [
  { value: '6 weeks', label: 'average time to build a working tokenomics model' },
  { value: '$180M+', label: 'raised by client projects before TGE' },
  { value: 'Since 2017', label: 'developing tokenomics' },
  { value: '100%', label: 'of projects have tokens built into the project' },
]

const ROADMAP = Array.from({ length: 3 }, () => ({ title: 'We build for change', description: DESC }))

const FAQ = [
  { question: 'What does “tokenization” actually mean, in plain terms?', answer: DESC },
  { question: 'Is this legal?', answer: DESC },
  { question: 'Who buys the fractions?', answer: DESC },
  { question: 'What rights do fraction holders get over my asset?', answer: DESC },
  { question: 'Will this unsettle my bank or my existing investors?', answer: DESC },
  { question: 'Will anyone need a crypto wallet?', answer: DESC },
]

const CASES = [1, 2].map((n) => ({
  href: `/cases#demo-${n}`,
  image: { src: caseImage, alt: 'Solar farm at sunset' },
  category: 'RWA · COMMODITIES',
  title: 'Gold as collateral',
  description: 'High-purity metal structured across three jurisdictions.',
  meta: 'Читать 12 минут',
  cta: 'View case',
}))

const TABLE_ROWS = [
  ['Preparation and Asset Valuation', '$10-50K', '$10-30K', '$20-50K'],
  ['Legal Structure and Taxes', '$50-250K', '$50-120K', '$100-250K'],
  ['Documents and Prospectus', '$15-200K', '$15-40K', '$80-200K'],
  ['Technology and Issuance', '$15-150K', '$15-40K', '$60-150K'],
  ['Investors and Sales', '$30-250K', '$30-80K', '$100-250K'],
  ['Secondary Market', '$0-100K', '$0-10K', '$30-100K'],
  ['Total One-Time Cost', '$120K-1M', '$120-320K', '$390K-1M'],
].map(([label, ...values]) => ({ label, values }))

const ACCENT = Array.from({ length: 5 }, () => ({
  title: '4 years / 1-year cliff',
  text: 'The most common team vesting structure is a four-year schedule with a one-year cliff, mirroring traditional tech equity; 25% typically vests at the cliff.',
  source: { label: 'Toku - How Do Token Vesting Schedules Work', href: 'https://www.toku.com' },
}))

const QUOTES = Array.from({ length: 5 }, () => ({
  title: 'The 2024 ‘low float, high FDV’ structure left large overhangs',
  text: 'Binance Research estimated ~US$155B of tokens unlocking from 2024 to 2030, and calculated ~US$80B of new demand would be needed just for 2024-vintage tokens to hold their prices as supply unlocks.',
  source: { label: 'Low Float & High FDV: How Did We Get Here? (May 2024)', href: 'https://www.binance.com/en/research' },
}))

export default function BlocksPage() {
  if (!IS_STAGING) notFound()

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>
          <Link href="/staging-docs/design-system">← Дизайн-система v2</Link>
        </p>
        <h1 className={styles.title}>Блоки</h1>
        <p className={styles.lead}>
          Блоки из Figma на демо-данных. Каждый — компонент из <code>@/shared/ds</code>; подпись над блоком — имя
          фрейма в Figma и компонент.
        </p>
      </header>

      <Label figma="Карточка - компактная (38:978)" code="<FeatureCards variant=&quot;compact&quot;>" />
      <Section title="What we do">
        <FeatureCards variant="compact" items={COMPACT} />
      </Section>

      <Label figma="Карточка - кнопка (38:1033)" code="<FeatureCards variant=&quot;action&quot;>" />
      <Section>
        <FeatureCards variant="action" items={ACTION} />
      </Section>

      <Label figma="Иллюстрация содержания (38:1089)" code="<FeatureCards variant=&quot;illustrated&quot; columns={2 | 3}>" />
      <Section>
        <div className={styles.stack}>
          <FeatureCards variant="illustrated" columns={2} items={ILLUSTRATED} />
          <FeatureCards variant="illustrated" columns={3} items={[...ILLUSTRATED, ILLUSTRATED[1]]} />
        </div>
      </Section>

      <Label figma="Карточка - крупная цифра / метрики (38:964)" code="<Metrics>" />
      <Section>
        <Metrics items={METRICS} />
      </Section>

      <Label figma="Карточка - акцент (54:2632)" code="<Carousel> + <AccentCard>" />
      <Carousel title="Key Stages" slideWidth={394}>
        {ACCENT.map((card, i) => (
          <AccentCard key={i} {...card} />
        ))}
      </Carousel>

      <Label figma="Карточка - цитата (54:2858)" code="<Carousel> + <QuoteCard>" />
      <Carousel title="Key Stages" slideWidth={450}>
        {QUOTES.map((card, i) => (
          <QuoteCard key={i} logo={{ src: binanceLogo, alt: 'Binance', width: 165, height: 33 }} {...card} />
        ))}
      </Carousel>

      <Label figma="FAQ (41:1069)" code="<Faq>" />
      <Section title="The questions owners ask us first." align="center" narrow>
        <Faq
          items={FAQ}
          footer={
            <>
              Have other questions not mentioned? <Link href="/contact">Contact us</Link>
            </>
          }
        />
      </Section>

      <Label figma="Форма (54:2453)" code="<FormBlock> + <FormRow> + <TextField>" />
      <Section title="Tell us about your project" align="center" narrow>
        <FormBlock submitLabel="Discuss your property" action="#" method="post">
          <FormRow>
            <TextField label="Имя *" name="name" placeholder="Введите имя" />
            <TextField label="Компания" name="company" placeholder="Название компании" />
          </FormRow>
          <FormRow>
            <TextField label="Email *" name="email" type="email" placeholder="you@company.com" />
            <TextField label="Telegram" name="telegram" placeholder="@username" />
          </FormRow>
          <TextField label="Сайт проекта" name="site" placeholder="https://" />
          <Textarea label="Сообщение *" name="message" placeholder="Расскажите о проекте" />
        </FormBlock>
      </Section>

      <Label figma="CTA - левый край (40:549)" code="<Cta variant=&quot;left&quot;>" />
      <Section>
        <Cta
          title="A token utility is only limited by the way you think about it"
          description={DESC}
          primary={{ label: 'Discuss your property', href: '/contact' }}
          secondary={{ label: 'Discuss your property', href: '/contact' }}
        />
      </Section>

      <Label figma="CTA - цена (40:757)" code="<Cta variant=&quot;price&quot; facts>" />
      <Section>
        <Cta
          variant="price"
          facts={['$2500', '1-3 hours', 'full team']}
          title="A token utility is only limited by the way you think about it"
          description={DESC}
          primary={{ label: 'Discuss your property', href: '/contact' }}
          secondary={{ label: 'Discuss your property', href: '/contact' }}
        />
      </Section>

      <Label figma="Roadmap (45:2055)" code="<Roadmap>" />
      <Section title="Roadmap">
        <Roadmap steps={ROADMAP} />
      </Section>

      <Label figma="Кейс (43:1602)" code="<CaseList>" />
      <Section title="From our casework" align="center">
        <CaseList items={CASES} />
      </Section>

      <Label figma="Таблица (42:1286)" code="<ComparisonTable>" />
      <Section title="Key Stages" align="center" sheen>
        <ComparisonTable
          caption="Cost of tokenization by stage"
          columns={['Overall Range', 'Scenario A', 'Scenario B']}
          rows={TABLE_ROWS}
        />
      </Section>

      <Label figma="Таблица - с выделением сегмента (43:1391)" code="<ComparisonTable highlight={0}>" />
      <Section title="Key Stages" align="center" sheen>
        <ComparisonTable
          caption="Cost of tokenization by stage"
          columns={['Overall Range', 'Scenario A', 'Scenario B']}
          rows={TABLE_ROWS}
          highlight={0}
        />
      </Section>
    </div>
  )
}

function Label({ figma, code }: { figma: string; code: string }) {
  return (
    <p className={styles.label}>
      <span>Figma: {figma}</span>
      <code>{code}</code>
    </p>
  )
}
