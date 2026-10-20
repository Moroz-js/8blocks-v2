'use client'

import { useRef, useState } from 'react'
import { lang, t } from '@/shared/i18n'
import enContent from '@/shared/lib/platform/benchmarks/content.json'
import ruContent from '@/shared/lib/platform/benchmarks/content.ru.json'
import { digitalAssetsContent as enDigitalAssets } from '@/shared/content/en/digitalAssets'
import { digitalAssetsContent as ruDigitalAssets } from '@/shared/content/ru/digitalAssets'
import { pagePath } from '@/widgets/TokenomicsAi/paths'
import styles from './BenchmarkLowerSections.module.scss'

interface Source {
  title: string
  url: string
}

interface VestingNorm {
  figure: string
  claim: string
  source: Source
  source2?: Source
}

interface MarketCardSpec {
  id: string
  logoSrc: string
  logoWidth: number
  logoHeight: number
  logoDimmed?: boolean
  title: string
  body: string
  linkLabel: string
  url: string
}

const content = (lang === 'ru' ? ruContent : enContent) as {
  vestingNorms: VestingNorm[]
  methodologyNote: string
}

const ctaFeatures = t({
  en: [
    {
      icon: '/img/benchmarks/cta-brain.svg',
      title: 'Your personal tokenomist',
      subtitle: 'Working for you 24/7',
    },
    {
      icon: '/img/benchmarks/cta-coins.svg',
      title: 'Save 50× on costs',
      subtitle: 'Without sacrificing quality or time',
    },
    {
      icon: '/img/benchmarks/cta-eyes.svg',
      title: 'A personalized approach',
      subtitle: 'Tailored to all your project requirements',
    },
  ],
  ru: [
    {
      icon: '/img/benchmarks/cta-brain.svg',
      title: 'Ваш персональный токеномист',
      subtitle: 'Работает для вас 24/7',
    },
    {
      icon: '/img/benchmarks/cta-coins.svg',
      title: 'Экономия в 50× на затратах',
      subtitle: 'Без потери качества и времени',
    },
    {
      icon: '/img/benchmarks/cta-eyes.svg',
      title: 'Индивидуальный подход',
      subtitle: 'Под все требования вашего проекта',
    },
  ],
})

const vestingHeadingBreaks: Record<string, string> = {
  '38% one-year cliff; 31% no cliff': '38% one-year cliff;\n31% no cliff',
  '4 years most common for teams': '4 years most\ncommon for teams',
  'Team TGE unlock: 0% (>5% = red flag)': 'Team TGE unlock:\n0% (>5% = red flag)',
  'Seed: 6mo cliff + 24mo; Private: 3-6mo cliff + 18-24mo':
    'Seed: 6mo cliff +\n24mo; Private: 3-6mo\ncliff + 18-24mo',
  'Seed TGE 0-5%; private TGE 0-10%; public sale largely unlocked':
    'Seed TGE 0-5%;\nprivate TGE 0-10%;\npublic sale largely unlocked',
}

const marketCards: MarketCardSpec[] = t({
  en: [
    {
      id: 'binance',
      logoSrc: '/img/benchmarks/logo-binance.svg',
      logoWidth: 165,
      logoHeight: 33,
      title: "The 2024 'low float, high FDV' structure left large overhangs",
      body: 'Binance Research estimated ~US$155B of tokens unlocking from 2024 to 2030, and calculated ~US$80B of new demand would be needed just for 2024-vintage tokens to hold their prices as supply unlocks.',
      linkLabel: 'Low Float & High FDV: How Did We Get Here? (May 2024)',
      url: 'https://www.binance.com/research/analysis/low-float-and-high-fdv-how-did-we-get-here',
    },
    {
      id: 'cryptonews',
      logoSrc: '/img/benchmarks/logo-cryptonews.svg',
      logoWidth: 184,
      logoHeight: 37,
      title: 'Unlocks are almost always bearish',
      body: "Keyrock's study of 16,000+ unlock events found ~90% resulted in price declines, with ~$600M of new tokens hitting the market weekly, price pressure starting ~30 days before the unlock date, and uncoordinated team unlocks the most disruptive category.",
      linkLabel: "Token unlocks 'almost always negative for price,' Keyrock's study reveals",
      url: 'https://crypto.news/token-unlocks-almost-always-negative-for-price-keyrocks-study-reveals/',
    },
    {
      id: 'cryptonomist',
      logoSrc: '/img/benchmarks/logo-cryptonomist.png',
      logoWidth: 245,
      logoHeight: 36,
      logoDimmed: true,
      title: 'New listings underperformed in 2024',
      body: 'Animoca Brands Research analyzed 773 tokens listed on five major CEXs (Jan-Sep 2024) and found average post-listing ROI between -27% and -50%, with the best outcomes among tokens listing in the 0.4-0.6 MC/FDV band - i.e., higher floats performed better.',
      linkLabel: 'Animoca Brands explores the performance of new tokens listed in 2024',
      url: 'https://en.cryptonomist.ch/2024/10/30/animoca-brands-explores-the-performance-of-the-new-tokens-listed-on-crypto-exchanges-in-2024/',
    },
    {
      id: 'chaincatcher',
      logoSrc: '/img/benchmarks/logo-chaincatcher.png',
      logoWidth: 126,
      logoHeight: 45,
      logoDimmed: true,
      title: 'The market corrected during 2024',
      body: "per Tokenomist's 2024 Annual Report (378 tokens tracked), the average circulating-supply-to-FDV ratio at token issuance rose to about 35% by end of 2024, after roughly $82B of unlocks were absorbed during the year.",
      linkLabel: 'Summary of Tokenomist 2024 Annual Report',
      url: 'https://www.chaincatcher.com/en/article/2166161',
    },
    {
      id: 'stephanian',
      logoSrc: '/img/benchmarks/logo-lauren.svg',
      logoWidth: 266,
      logoHeight: 29,
      title: "Insider share has risen sharply over crypto's history",
      body: 'team allocations roughly tripled from 5% of supply (2013) to ~20% (2021), treasuries grew from ~20% to 40%+, while public sales collapsed from 25% to near 0% - supply shifted from public buyers to insiders and project-controlled reserves.',
      linkLabel: 'Lauren Stephanian - Optimizing Your Token Distribution (60-project study)',
      url: 'https://offchaindata.substack.com/p/optimizing-your-token-distribution',
    },
  ],
  ru: [
    {
      id: 'binance',
      logoSrc: '/img/benchmarks/logo-binance.svg',
      logoWidth: 165,
      logoHeight: 33,
      title: 'Структура 2024 года «низкий флоат, высокая FDV» оставила огромный навес',
      body: 'По оценке Binance Research, с 2024 по 2030 год разблокируется токенов примерно на $155 млрд, и только для удержания цен токенов выпуска 2024 года потребуется около $80 млрд нового спроса.',
      linkLabel: 'Low Float & High FDV: How Did We Get Here? (май 2024)',
      url: 'https://www.binance.com/research/analysis/low-float-and-high-fdv-how-did-we-get-here',
    },
    {
      id: 'cryptonews',
      logoSrc: '/img/benchmarks/logo-cryptonews.svg',
      logoWidth: 184,
      logoHeight: 37,
      title: 'Разблокировки почти всегда давят на цену',
      body: 'Исследование Keyrock по 16 000+ разблокировкам показало снижение цены примерно в 90% случаев: на рынок выходит около $600 млн новых токенов в неделю, а давление начинается за ~30 дней до даты разблокировки.',
      linkLabel: "Token unlocks 'almost always negative for price,' Keyrock's study reveals",
      url: 'https://crypto.news/token-unlocks-almost-always-negative-for-price-keyrocks-study-reveals/',
    },
    {
      id: 'cryptonomist',
      logoSrc: '/img/benchmarks/logo-cryptonomist.png',
      logoWidth: 245,
      logoHeight: 36,
      logoDimmed: true,
      title: 'Новые листинги показали слабый результат в 2024 году',
      body: 'Animoca Brands Research проанализировала 773 токена на пяти крупных CEX (янв–сен 2024) и выявила средний ROI после листинга от -27% до -50%; лучше всего держались токены с MC/FDV в диапазоне 0.4–0.6.',
      linkLabel: 'Animoca Brands explores the performance of new tokens listed in 2024',
      url: 'https://en.cryptonomist.ch/2024/10/30/animoca-brands-explores-the-performance-of-the-new-tokens-listed-on-crypto-exchanges-in-2024/',
    },
    {
      id: 'chaincatcher',
      logoSrc: '/img/benchmarks/logo-chaincatcher.png',
      logoWidth: 126,
      logoHeight: 45,
      logoDimmed: true,
      title: 'Рынок скорректировался в течение 2024 года',
      body: 'По годовому отчёту Tokenomist за 2024 год (378 токенов), среднее отношение обращения к FDV на выпуске выросло примерно до 35% к концу 2024 года после поглощения разблокировок на ~$82 млрд.',
      linkLabel: 'Summary of Tokenomist 2024 Annual Report',
      url: 'https://www.chaincatcher.com/en/article/2166161',
    },
    {
      id: 'stephanian',
      logoSrc: '/img/benchmarks/logo-lauren.svg',
      logoWidth: 266,
      logoHeight: 29,
      title: 'Доля инсайдеров резко выросла за историю крипторынка',
      body: 'Аллокации команды утроились с 5% предложения (2013) до ~20% (2021), казначейства выросли с ~20% до 40%+, а публичные продажи сжались с 25% почти до 0%.',
      linkLabel: 'Lauren Stephanian - Optimizing Your Token Distribution (60-project study)',
      url: 'https://offchaindata.substack.com/p/optimizing-your-token-distribution',
    },
  ],
})

const faqItems = (lang === 'ru' ? ruDigitalAssets : enDigitalAssets).faq.items.slice(0, 6)

function formatVestingFigure(figure: string) {
  return vestingHeadingBreaks[figure] ?? figure
}

function renderTextWithArrow(text: string) {
  const trimmed = text.trim()
  const lastSpace = trimmed.lastIndexOf(' ')
  const arrow = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={styles.extArrow}
      src={pagePath('/img/benchmarks/arrow-top-right.svg')}
      alt=""
      width={16}
      height={16}
    />
  )
  if (lastSpace === -1) {
    return (
      <span className={styles.nowrapTail}>
        {trimmed}
        {arrow}
      </span>
    )
  }
  return (
    <>
      {trimmed.slice(0, lastSpace + 1)}
      <span className={styles.nowrapTail}>
        {trimmed.slice(lastSpace + 1)}
        {arrow}
      </span>
    </>
  )
}

export function BenchmarkLowerSections({ fontClass }: { fontClass: string }) {
  const vestingRailRef = useRef<HTMLDivElement>(null)
  const marketRailRef = useRef<HTMLDivElement>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const scrollRail = (rail: HTMLDivElement | null, direction: -1 | 1, stepPx: number) => {
    rail?.scrollBy({ left: direction * stepPx, behavior: 'smooth' })
  }

  return (
    <div className={`${styles.wrapper} ${fontClass}`}>
      {/* 1. Vesting norms */}
      <section className={styles.railSection} aria-labelledby="benchmark-vesting-title">
        <div className={styles.railHeader}>
          <h2 id="benchmark-vesting-title" className={styles.vestingHeading}>
            {t({
              en: (
                <>
                  Vesting norms that shows
                  <br />
                  what you should do
                </>
              ),
              ru: (
                <>
                  Нормы вестинга,
                  <br />
                  на которые стоит опираться
                </>
              ),
            })}
          </h2>

          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrowBtn}
              aria-label={t({ en: 'Previous cards', ru: 'Предыдущие карточки' })}
              onClick={() => scrollRail(vestingRailRef.current, -1, 390)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pagePath('/img/benchmarks/chevron-left.svg')} alt="" width={32} height={32} />
            </button>
            <button
              type="button"
              className={styles.arrowBtn}
              aria-label={t({ en: 'Next cards', ru: 'Следующие карточки' })}
              onClick={() => scrollRail(vestingRailRef.current, 1, 390)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pagePath('/img/benchmarks/chevron-right.svg')} alt="" width={32} height={32} />
            </button>
          </div>
        </div>

        <div className={styles.railViewport} ref={vestingRailRef}>
          <div className={styles.railTrack}>
            {content.vestingNorms.map((norm, idx) => (
              <article
                key={norm.figure}
                className={`${styles.vestingCard} ${idx === 0 ? styles.vestingCardFirst : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.vestingBg}
                  src={pagePath('/img/benchmarks/vesting-card-bg.png')}
                  alt=""
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.asterisk}
                  src={pagePath('/img/benchmarks/asterisk.svg')}
                  alt=""
                  width={24}
                  height={24}
                />

                <div className={styles.vestingCopy}>
                  <h3>{formatVestingFigure(norm.figure)}</h3>
                  <p>{norm.claim}</p>
                </div>

                <div className={styles.cardFooter}>
                  <a
                    className={styles.footerLink}
                    href={norm.source.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {norm.source2 ? norm.source.title : renderTextWithArrow(norm.source.title)}
                  </a>
                  {norm.source2 && (
                    <>
                      {' · '}
                      <a
                        className={styles.footerLink}
                        href={norm.source2.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                      >
                        {renderTextWithArrow(norm.source2.title)}
                      </a>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. What the market data shows */}
      <section className={styles.marketSection} aria-labelledby="benchmark-market-title">
        <div className={styles.railHeader}>
          <h2 id="benchmark-market-title" className={styles.marketHeading}>
            {t({ en: 'What the market data shows', ru: 'Что показывают рыночные данные' })}
          </h2>

          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrowBtn}
              aria-label={t({ en: 'Previous cards', ru: 'Предыдущие карточки' })}
              onClick={() => scrollRail(marketRailRef.current, -1, 460)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pagePath('/img/benchmarks/chevron-left.svg')} alt="" width={32} height={32} />
            </button>
            <button
              type="button"
              className={styles.arrowBtn}
              aria-label={t({ en: 'Next cards', ru: 'Следующие карточки' })}
              onClick={() => scrollRail(marketRailRef.current, 1, 460)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pagePath('/img/benchmarks/chevron-right.svg')} alt="" width={32} height={32} />
            </button>
          </div>
        </div>

        <div className={styles.railViewport} ref={marketRailRef}>
          <div className={styles.railTrack}>
            {marketCards.map((card) => (
              <article key={card.id} className={styles.marketCard}>
                <div className={styles.marketLogoWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={card.logoDimmed ? styles.marketLogoDimmed : styles.marketLogo}
                    src={pagePath(card.logoSrc)}
                    alt=""
                    width={card.logoWidth}
                    height={card.logoHeight}
                  />
                </div>

                <div className={styles.marketCopy}>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>

                <div className={styles.marketFooter}>
                  <a
                    className={styles.footerLink}
                    href={card.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {renderTextWithArrow(card.linkLabel)}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FAQ */}
      <section className={styles.faqSection} aria-labelledby="benchmark-faq-title">
        <h2 id="benchmark-faq-title">
          {t({
            en: (
              <>
                The questions
                <br />
                owners ask us first.
              </>
            ),
            ru: (
              <>
                Вопросы, которые владельцы
                <br />
                задают нам первыми.
              </>
            ),
          })}
        </h2>

        <div className={styles.faqList}>
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={item.question}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
              >
                <button
                  type="button"
                  className={styles.faqTrigger}
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                >
                  <span>{item.question}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={isOpen ? styles.faqChevronOpen : styles.faqChevron}
                    src={pagePath('/img/benchmarks/faq-chevron.svg')}
                    alt=""
                    width={13}
                    height={7}
                  />
                </button>
                <div className={isOpen ? styles.faqPanelOpen : styles.faqPanel} aria-hidden={!isOpen}>
                  <div className={styles.faqPanelInner}>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className={styles.faqContact}>
          <span>{t({ en: 'Have other questions not mentioned? ', ru: 'Остались вопросы, которых здесь нет? ' })}</span>
          <a href={pagePath('/contact')}>{t({ en: 'Contact us', ru: 'Связаться с нами' })}</a>
        </p>
      </section>

      {/* 4. Bottom AI CTA + Methodology */}
      <section className={styles.ctaSection} aria-labelledby="benchmark-cta-title">
        <div className={styles.ctaHero}>
          <div className={styles.ctaMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.ctaCoin} src={pagePath('/img/benchmarks/hero-coin.png')} alt="" />
            <div className={styles.ctaFadeTop} />
            <div className={styles.ctaFadeRadial} />
            <div className={styles.ctaFadeBottom} />
          </div>

          <div className={styles.ctaContent}>
            <h2 id="benchmark-cta-title">
              <span>{t({ en: 'Create Your Tokenomics', ru: 'Создайте свою токеномику' })}</span>
              <span>{t({ en: 'with a single request to our AI', ru: 'одним запросом к нашему ИИ' })}</span>
            </h2>

            <div className={styles.ctaFeatures}>
              {ctaFeatures.map((feat) => (
                <div key={feat.title} className={styles.ctaFeature}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.ctaFeatureIcon}
                    src={pagePath(feat.icon)}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <div className={styles.ctaFeatureCopy}>
                    <p className={styles.ctaFeatureTitle}>{feat.title}</p>
                    <p className={styles.ctaFeatureSub}>{feat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.ctaActions}>
              <a className={styles.ctaBtn} href={pagePath('/product/tokenomics-ai')}>
                {t({ en: 'Open Tokenomics AI', ru: 'Открыть Tokenomics AI' })}
              </a>
            </div>
          </div>
        </div>

        <p className={styles.methodology}>
          {t({ en: 'Methodology and limitations: ', ru: 'Методология и ограничения: ' })}
          {content.methodologyNote}
        </p>
      </section>
    </div>
  )
}
