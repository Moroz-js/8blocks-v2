'use client'

import { useState } from 'react'
import { t } from '@/shared/i18n'
import { getDefaultVestingConfigs, STANDARD_BUCKETS } from '@/shared/lib/platform/tokenlab/buckets'
import type { StandardBucketKey } from '@/shared/lib/platform/tokenlab/types'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { pagePath } from '@/widgets/TokenomicsAi/paths'
import styles from './BenchmarkSectors.module.scss'

export type SectorId = 'l1' | 'l2' | 'defi' | 'gaming' | 'ai'

interface SectorProjectCard {
  id: string
  name: string
  symbol: string
  logoSrc: string
  subtitle: string
  facts: string[]
  chartImage: string
  templateMapping: Record<StandardBucketKey, number>
  vestingMapping: Partial<Record<StandardBucketKey, { tgePercent: number; cliffMonths: number; vestingMonths: number }>>
}

interface SectorGroup {
  id: SectorId
  label: string
  icon: string
  cards: SectorProjectCard[]
}

const solanaCardBase: Omit<SectorProjectCard, 'id'> = {
  name: 'Solana',
  symbol: 'SOL',
  logoSrc: '/img/benchmarks/solana-wordmark.svg',
  subtitle: t({
    en: 'listed as $SOL since 2020',
    ru: 'листинг $SOL с 2020',
  }),
  facts: t({
    en: [
      'No fixed supply: 500M genesis SOL plus ongoing inflation; genesis percentages dilute over time.',
      'No official allocation doc; trackers disagree (Seed 13.3-15.9%, Foundation 8.6-12.5%, Founding 9.8- 12.9%).',
      'Sale rounds fully unlocked Jan 2021; team vested linearly over 22 months to Nov 2022.',
    ],
    ru: [
      'Фиксированного предложения нет: 500M SOL в генезисе плюс постоянная инфляция; исходные доли со временем размываются.',
      'Официального документа о распределении нет; данные трекеров расходятся (Seed — 13.3-15.9%, Foundation — 8.6-12.5%, Founding — 9.8-12.9%).',
      'Раунды продаж полностью разблокированы в январе 2021 года; токены команды разблокировались линейно за 22 месяца до ноября 2022 года.',
    ],
  }),
  chartImage: '/img/benchmarks/sector-card-right.png',
  templateMapping: {
    team: 13,
    investors: 35,
    community: 38,
    ecosystem: 0,
    treasury: 0,
    liquidity: 0,
    foundation: 12,
    publicSale: 2,
  },
  vestingMapping: {
    team: { tgePercent: 0, cliffMonths: 0, vestingMonths: 22 },
    investors: { tgePercent: 0, cliffMonths: 9, vestingMonths: 0 },
    community: { tgePercent: 0, cliffMonths: 0, vestingMonths: 96 },
    foundation: { tgePercent: 0, cliffMonths: 10, vestingMonths: 0 },
    publicSale: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
  },
}

const sectorGroups: SectorGroup[] = [
  {
    id: 'l1',
    label: t({ en: 'Layer 1', ru: 'Уровень 1' }),
    icon: '/img/benchmarks/tab-layers.svg',
    cards: [
      { ...solanaCardBase, id: 'l1-sol-1' },
      { ...solanaCardBase, id: 'l1-sol-2' },
    ],
  },
  {
    id: 'l2',
    label: t({ en: 'Layer 2 / Scaling', ru: 'Уровень 2 / Масштабирование' }),
    icon: '/img/benchmarks/tab-layers.svg',
    cards: [
      { ...solanaCardBase, id: 'l2-sol-1' },
      { ...solanaCardBase, id: 'l2-sol-2' },
    ],
  },
  {
    id: 'defi',
    label: t({ en: 'DeFi & Trading', ru: 'DeFi и трейдинг' }),
    icon: '/img/benchmarks/tab-trade.svg',
    cards: [
      { ...solanaCardBase, id: 'defi-sol-1' },
      { ...solanaCardBase, id: 'defi-sol-2' },
    ],
  },
  {
    id: 'gaming',
    label: t({ en: 'Gaming & Metaverse', ru: 'Игры и метавселенные' }),
    icon: '/img/benchmarks/tab-gaming.svg',
    cards: [
      { ...solanaCardBase, id: 'gaming-sol-1' },
      { ...solanaCardBase, id: 'gaming-sol-2' },
    ],
  },
  {
    id: 'ai',
    label: t({ en: 'AI & DePIN', ru: 'ИИ и DePIN' }),
    icon: '/img/benchmarks/tab-ai.svg',
    cards: [
      { ...solanaCardBase, id: 'ai-sol-1' },
      { ...solanaCardBase, id: 'ai-sol-2' },
    ],
  },
]

function buildCalculatorUrl(card: SectorProjectCard) {
  const vestings = getDefaultVestingConfigs().map((vesting) => {
    const custom = card.vestingMapping[vesting.bucketKey]
    return custom ? { bucketKey: vesting.bucketKey, ...custom } : vesting
  })
  const allocations = STANDARD_BUCKETS.map((bucket) => {
    const percent = card.templateMapping[bucket.key] ?? 0
    return { key: bucket.key, percent, enabled: percent > 0 }
  })
  return pagePath(
    `/product/calculator?m=${encodeModel({
      name: card.name,
      symbol: card.symbol,
      totalSupply: 1_000_000_000,
      fdv: null,
      allocations,
      vestings,
    })}&fork=1`,
  )
}

export function BenchmarkSectors({ fontClass }: { fontClass: string }) {
  const [activeSectorId, setActiveSectorId] = useState<SectorId>('l1')
  const activeSector = sectorGroups.find((group) => group.id === activeSectorId) ?? sectorGroups[0]

  return (
    <section className={`${styles.sectors} ${fontClass}`} aria-labelledby="benchmark-sectors-title">
      <h2 id="benchmark-sectors-title">
        {t({ en: 'Benchmarks by sectors', ru: 'Бенчмарки по секторам' })}
      </h2>

      <div className={styles.tabs} role="tablist" aria-label={t({ en: 'Sectors', ru: 'Секторы' })}>
        {sectorGroups.map((group) => {
          const isActive = group.id === activeSector.id
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.tabActive : styles.tab}
              onClick={() => {
                setActiveSectorId(group.id)
                trackPlatformEvent('benchmark_category_selected', { category: group.label })
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pagePath(group.icon)} alt="" width={24} height={24} />
              <span>{group.label}</span>
            </button>
          )
        })}
      </div>

      <div key={activeSector.id} className={styles.rows} role="tabpanel">
        {activeSector.cards.map((card, index) => (
          <div key={card.id} className={styles.rowGroup}>
            {index > 0 && <div className={styles.divider} aria-hidden="true" />}
            <article className={styles.row}>
              <div className={styles.leftCol}>
                <div className={styles.brandBlock}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.wordmark}
                    src={pagePath(card.logoSrc)}
                    alt={card.name}
                    width={206}
                    height={39}
                  />
                  <p className={styles.listed}>{card.subtitle}</p>
                </div>

                <div className={styles.facts}>
                  {card.facts.map((fact) => (
                    <p key={fact}>{fact}</p>
                  ))}
                </div>

                <div className={styles.actions}>
                  <a className={styles.btnPrimary} href={pagePath('/product/tokenomics-ai')}>
                    {t({ en: 'Copy to Tokenomics AI', ru: 'Скопировать в Tokenomics AI' })}
                  </a>
                  <a
                    className={styles.btnSecondary}
                    href={buildCalculatorUrl(card)}
                    onClick={() =>
                      trackPlatformEvent('benchmark_fork_clicked', {
                        project: card.symbol,
                        category: activeSector.label,
                      })
                    }
                  >
                    {t({ en: 'Copy to Calculator', ru: 'Скопировать в калькулятор' })}
                  </a>
                </div>
              </div>

              <div className={styles.rightCol}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.chartArt}
                  src={pagePath(card.chartImage)}
                  alt={`${card.name} allocation and 8Blocks advice`}
                  width={674}
                  height={460}
                />
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
