'use client'

import { useState } from 'react'
import { t } from '@/shared/i18n'
import { getDefaultVestingConfigs, STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import type { StandardBucketKey } from '@/shared/lib/platform/tokenlab/types'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { pagePath } from '@/widgets/TokenomicsAi/paths'
import { BenchmarkBubbleCard, type BubbleBucket } from './BenchmarkBubbleCard'
import styles from './BenchmarkSectors.module.scss'

export type SectorId = 'l1' | 'l2' | 'defi' | 'gaming' | 'ai'

interface VestingSpec {
  tgePercent: number
  cliffMonths: number
  vestingMonths: number
}

interface RawProject {
  name: string
  symbol: string
  launchYear: number
  buckets: BubbleBucket[]
  vestingFacts: string[]
  tgeFloat?: string
  templateMapping: Record<StandardBucketKey, number>
  vestingMapping?: Partial<Record<StandardBucketKey, VestingSpec>>
  audited?: boolean
  auditUrl?: string
}

export interface RawCategory {
  category: string
  categoryInsight: string
  projects: RawProject[]
}

const SECTOR_META: { id: SectorId; icon: string }[] = [
  { id: 'l1', icon: '/img/benchmarks/tab-layers.svg' },
  { id: 'l2', icon: '/img/benchmarks/tab-layers.svg' },
  { id: 'defi', icon: '/img/benchmarks/tab-trade.svg' },
  { id: 'gaming', icon: '/img/benchmarks/tab-gaming.svg' },
  { id: 'ai', icon: '/img/benchmarks/tab-ai.svg' },
]

const JPG_SYMBOLS = new Set(['GRASS', 'SAND', 'STON', 'TIA', 'WLD', 'HYPE', 'ARB'])

function getTokenLogoPath(symbol: string): string {
  const ext = JPG_SYMBOLS.has(symbol) ? 'jpg' : 'png'
  return `/logos/tokens/${symbol}.${ext}`
}

const PROJECT_ADVICE: Record<string, { en: string; ru: string }> = {
  SOL: {
    en: 'A large community allocation that can withstand potential asset outflows. Because early sale rounds unlocked rapidly in 2021, copying this setup without strong organic validator and developer demand risks heavy early sell pressure.',
    ru: 'Крупный резерв сообщества помогает сгладить отток ликвидности. Но ранние раунды разблокировались уже в 2021 году — слепое копирование без сильного органического спроса создаст сильное давление продаж.',
  },
  APT: {
    en: '51% in community with a strict 1-year cliff for insiders sets a clean institutional baseline, though ongoing staking rewards on locked tokens can still create secondary sell pressure before cliffs expire.',
    ru: '51% для сообщества и жёсткий годовой клифф для инсайдеров задают чистый институциональный стандарт, однако награды за стейкинг заблокированных токенов всё равно могут создавать давление на цену.',
  },
  SUI: {
    en: 'Skipping an initial airdrop avoided day-one mercenary dumping, while back-loading over half of the supply past 2030 keeps medium-term inflation predictable.',
    ru: 'Отказ от аирдропа на старте позволил избежать мгновенного слива, а перенос более половины эмиссии за 2030 год делает среднесрочное предложение предсказуемым.',
  },
  TIA: {
    en: 'A 20% fully liquid public allocation created deep day-one float, but unlocking a third of insider tokens at the 1-year cliff requires strong staking and modular ecosystem demand to absorb.',
    ru: '20% полностью ликвидной публичной аллокации обеспечили глубокий флоат с первого дня, но разблокировка трети токенов инсайдеров через год требует мощного спроса со стороны экосистемы.',
  },
  ARB: {
    en: 'A textbook L2 structure: 12.75% liquid airdrop float paired with a 1-year cliff and 3-year monthly vest for insiders, leaving the DAO treasury with ample runway.',
    ru: 'Эталонная структура L2: 12.75% ликвидного аирдропа на старте в сочетании с годовым клиффом и 3-летним помесячным вестингом инсайдеров при крупном казначействе DAO.',
  },
  OP: {
    en: 'Splitting user airdrops across multiple waves (5% initial, 14% reserved) sustains long-term user retention better than a single one-off genesis drop.',
    ru: 'Разделение аирдропа на несколько волн (5% на старте и 14% в резерве) удерживает пользователей значительно лучше, чем разовая раздача всех токенов на TGE.',
  },
  STRK: {
    en: 'Starting insider unlocks just two months after the community launch triggered severe market backlash — avoid short effective cliffs when launch float is low.',
    ru: 'Старт разблокировок инсайдеров всего через два месяца после запуска вызвал негативную реакцию рынка — избегайте коротких клиффов при низком стартовом флоате.',
  },
  ZK: {
    en: 'Allocating nearly half of total supply to governance and ecosystem alongside a 17.5% liquid airdrop balances immediate community ownership with a 4-year insider lockup.',
    ru: 'Выделение почти половины предложения на управление и экосистему вместе с 17.5% ликвидного аирдропа балансирует интерес сообщества и 4-летний вестинг команды.',
  },
  UNI: {
    en: 'A 60/40 split favoring community with a 15% instant airdrop and 4-year linear vesting set the classic DeFi benchmark, though pure governance tokens need fee-capture utility to sustain demand.',
    ru: 'Пропорция 60/40 в пользу сообщества с 15% мгновенного аирдропа задала классический стандарт DeFi, но чистому токену управления необходима привязка к доходам протокола.',
  },
  DYDX: {
    en: 'Delaying insider unlocks to month 27 concentrated a massive 30% cliff release at once — smoother linear unlocks after a 12-month cliff prevent violent supply shocks.',
    ru: 'Перенос разблокировок инсайдеров на 27-й месяц создал резкий обрыв в 30% предложения — плавный линейный вестинг после 12 месяцев клиффа безопаснее для цены.',
  },
  ENA: {
    en: 'A 55% combined insider share is high for DeFi, making the 1-year cliff and 3-year linear schedule essential to keep supply growth aligned with protocol revenue.',
    ru: 'Совокупная доля инсайдеров в 55% высока для DeFi, поэтому годовой клифф и 3-летний линейный вестинг критически важны для баланса предложения.',
  },
  HYPE: {
    en: 'Zero VC allocation and a 31% fully unlocked genesis airdrop eliminated investor overhang, though the second unlock phase still requires strong buyback capacity to absorb contributor tokens.',
    ru: 'Отсутствие VC-аллокации и 31% ликвидного аирдропа убрали навес инвесторов, однако фаза разблокировки команды требует сопоставимого объёма обратного выкупа.',
  },
  STON: {
    en: 'Long 24-month locks for team and DAO treasury protect early price action, but overlapping unlock windows in months 24–36 create a concentrated supply pressure peak.',
    ru: 'Двухлетняя блокировка команды и казначейства защищает цену на старте, но наложение окон разблокировки на 24–36 месяцах создаёт пиковое давление предложения.',
  },
  AXS: {
    en: 'Routing 49% of supply into staking and gameplay emissions fueled rapid user growth, but high reward emissions require matching token sinks to prevent hyperinflation.',
    ru: 'Направление 49% предложения на стейкинг и игровые награды ускорило рост базы игроков, но высокая эмиссия требует сопоставимых механик сжигания и вывода токенов.',
  },
  SAND: {
    en: 'Biannual 20% unlock tranches after a 1-year cliff created predictable step-ups in circulating supply; monthly or continuous vesting reduces event-driven sell-offs.',
    ru: 'Полугодовые транши по 20% после годового клиффа создавали ступенчатые скачки предложения; ежемесячный линейный вестинг снижает риск резких распродаж.',
  },
  IMX: {
    en: 'Dedicating over 51% to ecosystem grants and voluntarily extending developer lockups demonstrated strong long-term alignment with builders and token holders.',
    ru: 'Выделение более 51% на развитие экосистемы и добровольное продление блокировки разработчиков показали сильную долгосрочную мотивацию команды.',
  },
  BEAM: {
    en: 'Combining active token burns with re-cliffed contributor schedules helped transition a legacy gaming treasury into a healthier, high-float network economy.',
    ru: 'Сочетание сжигания токенов с продлением клиффа команды помогло трансформировать казначейство в здоровую экономику с высокой долей токенов в обращении.',
  },
  WLD: {
    en: 'Launching with ~1% float against a 10B cap created an extreme low-float/high-FDV profile — even with a 15-year community schedule, tiny initial floats amplify volatility and dilution risk.',
    ru: 'Запуск с ~1% флоата при капе в 10B создал экстремальный профиль low-float/high-FDV — слишком узкое начальное обращение усиливает волатильность и риск размытия.',
  },
  IO: {
    en: 'Stretching GPU supplier emissions over 20 years while locking insiders for a 1-year cliff aligns token issuance with real hardware network scaling.',
    ru: 'Растягивание эмиссии для поставщиков GPU на 20 лет при годовом клиффе инсайдеров синхронизирует выпуск токенов с реальным ростом аппаратной сети.',
  },
  GRASS: {
    en: 'A ~24% TGE float anchored by a 10% liquid airdrop gave the market healthier initial price discovery than ultra-low-float DePIN peers.',
    ru: 'Стартовый флоат ~24% с полностью ликвидным аирдропом на 10% обеспечил более здоровое ценообразование, чем у проектов с экстремально низким обращением.',
  },
  RENDER: {
    en: 'Holding 65% in network escrow for demand flowback worked for an early utility token, though modern launches require explicit smart-contract vesting schedules.',
    ru: 'Хранение 65% на эскроу-счёте под потоки сети сработало для раннего utility-токена, но современным запускам необходим прозрачный смарт-контракт вестинга.',
  },
  VIRTUAL: {
    en: 'Having 100% of public tokens unlocked removes cliff-unlock overhang, shifting the primary tokenomics risk to transparent governance rules for the 35% DAO treasury.',
    ru: 'Полная разблокировка публичных токенов снимает риск клиффов, смещая фокус токеномики на прозрачные правила расходования 35% казначейства DAO.',
  },
}

function buildCalculatorUrl(project: RawProject): string {
  const vestings = getDefaultVestingConfigs().map((vesting) => {
    const custom = project.vestingMapping?.[vesting.bucketKey]
    return custom ? { bucketKey: vesting.bucketKey, ...custom } : vesting
  })
  const allocations = STANDARD_BUCKETS.map((bucket) => {
    const percent = project.templateMapping[bucket.key] ?? 0
    return { key: bucket.key, percent, enabled: percent > 0 }
  })
  return pagePath(
    `/product/calculator?m=${encodeModel({
      name: project.name,
      symbol: project.symbol,
      totalSupply: 1_000_000_000,
      fdv: null,
      allocations,
      vestings,
    })}&fork=1`,
  )
}

export function BenchmarkSectors({
  fontClass,
  categories: rawCategories,
}: {
  fontClass: string
  categories: RawCategory[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeCategory = rawCategories[activeIndex] ?? rawCategories[0]

  if (!activeCategory) return null

  return (
    <section className={`${styles.sectors} ${fontClass}`} aria-labelledby="benchmark-sectors-title">
      <h2 id="benchmark-sectors-title">
        {t({ en: 'Benchmarks by sectors', ru: 'Бенчмарки по секторам' })}
      </h2>

      <div className={styles.tabs} role="tablist" aria-label={t({ en: 'Sectors', ru: 'Секторы' })}>
        {rawCategories.map((cat, idx) => {
          const isActive = idx === activeIndex
          const meta = SECTOR_META[idx] ?? SECTOR_META[0]
          return (
            <button
              key={cat.category}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.tabActive : styles.tab}
              onClick={() => {
                setActiveIndex(idx)
                trackPlatformEvent('benchmark_category_selected', { category: cat.category })
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pagePath(meta.icon)} alt="" width={24} height={24} />
              <span>{cat.category}</span>
            </button>
          )
        })}
      </div>

      <div key={activeCategory.category} className={styles.rows} role="tabpanel">
        {activeCategory.projects.map((project, index) => {
          const adviceEntry = PROJECT_ADVICE[project.symbol]
          const adviceText = adviceEntry
            ? t(adviceEntry)
            : project.vestingFacts[0] ?? activeCategory.categoryInsight

          return (
            <div key={project.symbol} className={styles.rowGroup}>
              {index > 0 && <div className={styles.divider} aria-hidden="true" />}
              <article className={styles.row}>
                <div className={styles.leftCol}>
                  <div className={styles.brandBlock}>
                    {project.symbol === 'SOL' ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        className={styles.wordmark}
                        src={pagePath('/img/benchmarks/solana-wordmark.svg')}
                        alt={project.name}
                        width={206}
                        height={39}
                      />
                    ) : (
                      <div className={styles.brandIdentity}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={styles.tokenLogo}
                          src={pagePath(getTokenLogoPath(project.symbol))}
                          alt={project.name}
                          width={40}
                          height={40}
                        />
                        <h3 className={styles.projectName}>{project.name}</h3>
                      </div>
                    )}
                    <p className={styles.listed}>
                      {t({
                        en: `listed as $${project.symbol} since ${project.launchYear}`,
                        ru: `листинг $${project.symbol} с ${project.launchYear}`,
                      })}
                    </p>
                  </div>

                  <div className={styles.facts}>
                    {project.vestingFacts.map((fact) => (
                      <p key={fact}>{fact}</p>
                    ))}
                  </div>

                  <div className={styles.actions}>
                    <a className={styles.btnPrimary} href={pagePath('/product/tokenomics-ai')}>
                      {t({ en: 'Copy to Tokenomics AI', ru: 'Скопировать в Tokenomics AI' })}
                    </a>
                    <a
                      className={styles.btnSecondary}
                      href={buildCalculatorUrl(project)}
                      onClick={() =>
                        trackPlatformEvent('benchmark_fork_clicked', {
                          project: project.symbol,
                          category: activeCategory.category,
                        })
                      }
                    >
                      {t({ en: 'Copy to Calculator', ru: 'Скопировать в калькулятор' })}
                    </a>
                  </div>
                </div>

                <div className={styles.rightCol}>
                  <BenchmarkBubbleCard buckets={project.buckets} advice={adviceText} />
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}
