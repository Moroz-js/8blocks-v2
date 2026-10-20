'use client'

import { t } from '@/shared/i18n'
import { pagePath } from '@/widgets/TokenomicsAi/paths'
import styles from './BenchmarkIntro.module.scss'

const works = t({
  en: [
    'Evidence of demand for this token type or business model',
    'Insight into the terms on which investors joined the project',
    'Insight into the lockup periods and vesting terms investors accepted at TGE',
    'How projects learned from mistakes: their TGE terms and how those terms have changed since',
  ],
  ru: [
    'Подтверждение спроса на такой тип токена или модель бизнеса',
    'Понимание условий, на которых инвесторы заходили в проект',
    'Понимание локапов и вестинга, которые инвесторы приняли на TGE',
    'Как проекты учились на ошибках: условия на TGE и как они менялись потом',
  ],
})

const limits = t({
  en: [
    'A guarantee of repeating success. Time has passed, the market has changed, and market leadership has shifted.',
    'Copying terms will not work. No two projects are alike.',
    'The reasons behind a project’s final terms or the alternatives it considered',
  ],
  ru: [
    'Гарантия повторить успех. Время прошло, рынок изменился, лидерство сместилось.',
    'Копировать условия не получится. Двух одинаковых проектов не бывает.',
    'Причины итоговых условий проекта и альтернативы, которые он рассматривал',
  ],
})

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M1.6 6.2 4.5 9.1 10.4 2.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BenchmarkIntro({ fontClass }: { fontClass: string }) {
  return (
    <section className={`${styles.intro} ${fontClass}`}>
      <div className={styles.hero}>
        <div className={styles.heroMedia} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroCoin} src={pagePath('/img/benchmarks/hero-coin.png')} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroOverlay} src={pagePath('/img/benchmarks/hero-overlay.png')} alt="" />
          <div className={styles.heroFadeTop} />
          <div className={styles.heroFadeBottom} />
        </div>
        <div className={styles.heroCopy}>
          <h1>
            <span>{t({ en: 'Benchmark Your Tokenomics', ru: 'Сверьте токеномику' })}</span>
            <span>{t({ en: 'Before You Launch', ru: 'до запуска' })}</span>
          </h1>
          <p className={styles.lead}>{t({
            en: 'How much supply top launches gave the team, investors, and community — and how fast it unlocked. Set numbers you can defend, with published sources throughout.',
            ru: 'Сколько токенов ведущие запуски отдали команде, инвесторам и сообществу и как быстро они разблокировались. Цифры, которые можно защитить, со ссылками на источники.',
          })}</p>
        </div>
      </div>
      <h2>{t({ en: 'A smart approach to using benchmarks', ru: 'Как пользоваться бенчмарками' })}</h2>
      <p className={styles.quote}>{t({
        en: 'Many have tried to replicate BNB. Many exchanges launched tokens that copied BNB almost entirely. Yet in eight years, no second BNB has emerged. The same is now happening with HYPE.',
        ru: 'Многие пытались повторить BNB. Биржи запускали токены, почти полностью скопировав BNB. За восемь лет второго BNB так и не появилось. Сейчас то же самое происходит с HYPE.',
      })}</p>
      <div className={styles.cards}>
        <article className={styles.works}>
          <h3>{t({ en: 'What benchmarks work', ru: 'Что бенчмарки дают' })}</h3>
          <ul>
            {works.map((item) => <li key={item}><Check /><span>{item}</span></li>)}
          </ul>
        </article>
        <article className={styles.limits}>
          <h3>{t({ en: 'What benchmarks do not work:', ru: 'Чего бенчмарки не дают:' })}</h3>
          <ul>
            {limits.map((item) => <li key={item}><Check /><span>{item}</span></li>)}
          </ul>
        </article>
      </div>
    </section>
  )
}
