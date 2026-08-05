import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/shared/ui'
import styles from './AboutPage.module.scss'

type Locale = 'ru' | 'en'

interface AboutPageProps {
  locale: Locale
}

const content = {
  en: {
    label: 'About 8Blocks',
    heroTitle: "Digital asset strategy for businesses that don't have time to get it wrong",
    heroText:
      '8Blocks designs the financial and strategic architecture behind digital assets for companies that treat this as a capital-allocation decision, not an experiment. We have been building token economies and onchain strategy since 2017 for teams that answer to investors, boards, and shareholders.',
    primaryCta: 'Talk to the team',
    secondaryCta: 'What we do',
    why: {
      label: 'Why we exist',
      title: 'Most of the market treats a token as a fundraising event. We treat it as a financial instrument.',
      paragraphs: [
        'A token has to work inside a real business, the way any other financial instrument would. That is why established companies, RWA and finance projects, and family offices bring us in before they bring in anyone else.',
        "We are not here to help you launch a token. We are here to tell you, with the rigor you would expect from a financial advisor, whether a token is the right structure for what you are building — and, if it is, how to build it for investors, regulators, and the market.",
        'The work starts with the business, not the whitepaper. We look at the balance sheet, capital structure, and growth model before deciding whether a digital asset belongs in that picture.',
        'About a third of our first conversations end with us recommending against a token. We have turned down work that would have paid us well and damaged the client. That honesty is why the rest trust us.',
      ],
    },
    servicesTitle: 'Four areas. Most engagements touch more than one.',
    clientTitle: 'Three kinds of clients. Increasingly, the same client at different stages.',
    clientNote:
      'What unites them is not the sector. It is that they are accountable to someone: a board, an investment committee, or a shareholder base. They need a partner who understands that a digital asset strategy has to survive that scrutiny.',
    trackTitle: 'The market matured. So did we.',
    trackText:
      '8Blocks was founded in 2017, when token economy design was still a niche discipline inside crypto. We built our practice through multiple market cycles, shifting regulatory regimes, and a steady stream of projects that got the fundamentals wrong before they came to us. Today, our approach looks less like a crypto shop and more like a strategy firm that specializes in digital assets.',
    casesCta: 'See our cases',
    geography: 'Operating from Dubai and Berlin, with clients across the US, Europe, and MENA.',
    approachTitle: 'Like a financial advisory firm, not a crypto agency',
    approachNote: 'And we stay involved past the point most consultancies exit. Strategy that is not implemented is just a document.',
    expertiseTitle: 'Most of our work is under NDA. So we prove our expertise in public.',
    expertiseText:
      "The models we build belong to our clients, so we cannot show them. Confidentiality is part of the service, and we are comfortable staying invisible in our clients' success. We publish public audits, research, and articles that show exactly how we reason. Judge for yourself.",
    rating: 'When clients can speak publicly, they do. Verified 5.0 rating on Clutch',
    nextLabel: 'Next step',
    finalTitle: "Let's talk about your situation",
    finalText:
      'Evaluating whether digital assets fit your business, structuring a real-world asset, or reviewing a token model that is not working? We will look at the specifics before telling you what we think you should do.',
    finalCta: 'Get in touch',
  },
  ru: {
    label: 'О А8А9',
    heroTitle: 'Стратегия цифровых активов для бизнеса, которому нельзя ошибиться',
    heroText:
      'А8А9 проектирует финансовую и стратегическую архитектуру цифровых активов для компаний, которые рассматривают это как решение по распределению капитала, а не как эксперимент. С 2017 года мы строим токен-экономики и onchain-стратегии для команд, подотчётных инвесторам, советам директоров и акционерам.',
    primaryCta: 'Обсудить с командой',
    secondaryCta: 'Что мы делаем',
    why: {
      label: 'Зачем мы нужны',
      title: 'Большая часть рынка считает токен способом привлечь деньги. Мы считаем его финансовым инструментом.',
      paragraphs: [
        'Токен должен работать внутри реального бизнеса — как любой другой финансовый инструмент. Поэтому компании, RWA- и финтех-проекты, а также family offices приходят к нам до того, как привлекают других консультантов.',
        'Мы не помогаем запустить токен любой ценой. Мы с тщательностью финансового советника отвечаем, подходит ли токен для вашей задачи, а если подходит — как сделать модель устойчивой для инвесторов, регуляторов и рынка.',
        'Работа начинается с бизнеса, а не с whitepaper. Мы изучаем баланс, структуру капитала и модель роста, и только затем определяем, есть ли в этой картине место цифровому активу.',
        'Около трети первых разговоров заканчиваются рекомендацией не выпускать токен. Мы отказывались от прибыльных проектов, если они могли навредить клиенту. Именно эта честность создаёт доверие.',
      ],
    },
    servicesTitle: 'Четыре направления. В большинстве проектов пересекаются сразу несколько.',
    clientTitle: 'Три типа клиентов. Всё чаще — один клиент на разных этапах.',
    clientNote:
      'Их объединяет не индустрия, а ответственность перед советом директоров, инвестиционным комитетом или акционерами. Им нужен партнёр, который понимает: стратегия цифровых активов должна выдерживать такую проверку.',
    trackTitle: 'Рынок вырос. Вместе с ним выросли и мы.',
    trackText:
      'А8А9 была основана в 2017 году, когда дизайн токен-экономики был нишевой дисциплиной внутри криптоиндустрии. Мы прошли несколько рыночных циклов, изменения регулирования и проекты, в которых фундаментальные ошибки были допущены ещё до обращения к нам. Сегодня наш подход ближе к стратегическому консалтингу, специализирующемуся на цифровых активах, чем к крипто-агентству.',
    casesCta: 'Смотреть кейсы',
    geography: 'Работаем из Дубая и Берлина с клиентами из США, Европы и MENA.',
    approachTitle: 'Как финансовый консультант, а не крипто-агентство',
    approachNote: 'Мы остаёмся в проекте после точки, где большинство консультантов завершают работу. Стратегия без реализации — просто документ.',
    expertiseTitle: 'Большая часть нашей работы под NDA. Поэтому экспертизу мы доказываем публично.',
    expertiseText:
      'Модели, которые мы строим, принадлежат клиентам, поэтому мы не можем их показывать. Конфиденциальность — часть сервиса, и нам комфортно оставаться незаметными в успехе клиентов. Вместо этого мы публикуем аудиты, исследования и статьи, в которых открыто показываем ход рассуждений.',
    rating: 'Когда клиенты могут говорить публично, они это делают. Подтверждённый рейтинг 5.0 на Clutch',
    nextLabel: 'Следующий шаг',
    finalTitle: 'Давайте обсудим вашу ситуацию',
    finalText:
      'Оцениваете, подходят ли цифровые активы вашему бизнесу, структурируете реальный актив или пересматриваете неработающую токен-модель? Сначала разберёмся в деталях, а затем дадим рекомендацию.',
    finalCta: 'Связаться с нами',
  },
} as const

const serviceCards = {
  en: [
    {
      title: 'Digital Asset Strategy & Market Entry',
      text: 'We determine whether a digital asset makes sense for your business and, if it does, what form it should take. This strategic layer needs to be right before anything else is built.',
      links: [{ label: 'Digital Asset Strategy', href: '/product/digital-assets' }],
    },
    {
      title: 'RWA Structuring & Tokenization',
      text: 'We turn illiquid assets — from real estate and commodities to receivables and funds — into structured instruments. RWA tokenization requires legal and jurisdictional structuring, not just a token contract.',
      links: [{ label: 'See RWA cases', href: '/cases' }],
    },
    {
      title: 'Treasury & Digital Asset Allocation',
      text: 'For corporates and family offices evaluating digital assets in a broader portfolio, we build allocation, custody, and risk-exposure frameworks grounded in financial modelling, not market sentiment.',
      links: [{ label: 'Talk to us', href: '/contact' }],
    },
    {
      title: 'Token Economy Design & Audits',
      text: 'Where a token is the right answer, we build the full economic model: supply, incentives, vesting, and mechanisms tied to real usage. We also audit existing models to find what is broken and confirm what is strong.',
      links: [
        { label: 'Tokenomics service', href: '/services/tokenomics' },
        { label: 'Audit service', href: '/services/audit' },
      ],
    },
  ],
  ru: [
    {
      title: 'Стратегия цифровых активов и выход на рынок',
      text: 'Определяем, нужен ли цифровой актив вашему бизнесу и в какой форме. Этот стратегический уровень должен быть выстроен до начала любой реализации.',
      links: [{ label: 'Стратегия цифровых активов', href: '/product/digital-assets' }],
    },
    {
      title: 'Структурирование и токенизация RWA',
      text: 'Превращаем неликвидные активы — от недвижимости и сырья до дебиторской задолженности и фондов — в структурированные инструменты. Токенизация RWA требует юридической и юрисдикционной структуры, а не только токен-контракта.',
      links: [{ label: 'Кейсы RWA', href: '/cases' }],
    },
    {
      title: 'Казначейство и аллокация цифровых активов',
      text: 'Для компаний и family offices, рассматривающих цифровые активы в широком портфеле, мы формируем подход к аллокации, хранению и риску на основе финансового моделирования, а не рыночных настроений.',
      links: [{ label: 'Обсудить задачу', href: '/contact' }],
    },
    {
      title: 'Дизайн и аудит токен-экономики',
      text: 'Когда токен действительно нужен, мы строим экономическую модель: предложение, стимулы, вестинг и механизмы, привязанные к реальному использованию. Также аудируем существующие модели, чтобы найти слабые места и подтвердить сильные.',
      links: [
        { label: 'Токеномика', href: '/services/tokenomics' },
        { label: 'Аудит', href: '/services/audit' },
      ],
    },
  ],
} as const

const clientGroups = {
  en: [
    ['Established businesses', 'Web2 companies, RWA platforms, financial institutions, and asset managers evaluating whether digital assets belong in their strategy and how to move without unnecessary risk.'],
    ['Family offices and treasuries', 'Assessing digital asset allocation as part of a diversified portfolio, with custody and risk frameworks that hold up in front of an investment committee.'],
    ['Web3-native teams', 'The projects we have supported since 2017, many of whom are now our longest-standing relationships.'],
  ],
  ru: [
    ['Зрелый бизнес', 'Web2-компании, RWA-платформы, финансовые организации и управляющие активами, которые оценивают роль цифровых активов в стратегии и хотят двигаться без лишнего риска.'],
    ['Family offices и казначейства', 'Оценивают аллокацию в цифровые активы в диверсифицированном портфеле, с подходом к хранению и рискам, который выдержит рассмотрение инвестиционным комитетом.'],
    ['Web3-команды', 'Проекты, с которыми мы работаем с 2017 года. Многие из них стали нашими самыми долгими партнёрствами.'],
  ],
} as const

const stats = {
  en: [
    ['2017', 'Building token economies and onchain strategy'],
    ['$180M+', 'Raised by clients before token generation'],
    ['100%', 'Of models integrated into the underlying product'],
    ['5', 'Verticals: DeFi, GameFi, RWA, infrastructure, finance'],
  ],
  ru: [
    ['2017', 'Проектируем токен-экономики и onchain-стратегии'],
    ['$180M+', 'Привлечено клиентами до генерации токенов'],
    ['100%', 'Моделей встроены в базовый продукт'],
    ['5', 'Вертикалей: DeFi, GameFi, RWA, инфраструктура, финансы'],
  ],
} as const

const approachCards = {
  en: [
    ['Diligence first', 'Every engagement starts with the business itself, before any model gets built.'],
    ['Built for scrutiny', 'Deliverables are prepared to withstand investor and regulatory review, alongside vetted legal partners.'],
    ['Vetted partners only', 'Market making, security, smart contracts, listings: every partner is selected against our standards, not referral fees.'],
  ],
  ru: [
    ['Сначала due diligence', 'Каждый проект начинается с изучения бизнеса — до построения любой модели.'],
    ['Рассчитано на проверку', 'Результаты работы готовы к рассмотрению инвесторами и регуляторами вместе с проверенными юридическими партнёрами.'],
    ['Только проверенные партнёры', 'Маркет-мейкинг, безопасность, смарт-контракты, листинги: каждого партнёра отбираем по собственным стандартам, а не по реферальным выплатам.'],
  ],
} as const

const expertiseCards = {
  en: [
    ['Public Audits', 'Reviews of live token economies with a rating, risks, and fixes. Actual analysis, published in full.', 'Browse public audits', '/audits'],
    ['Research', 'Studies of token models, incentives, and market behaviour. Data and mechanics, not narratives.', 'Read the research', '/research'],
    ['Blog', 'Articles on token economics: from audit methodology to breakdowns of why tokens underperform their protocols.', 'Read the blog', '/blog'],
  ],
  ru: [
    ['Публичные аудиты', 'Разборы работающих токен-экономик с рейтингом, рисками и рекомендациями. Полный анализ в открытом доступе.', 'Открыть аудиты', '/audits'],
    ['Исследования', 'Исследования токен-моделей, стимулов и поведения рынка. Данные и механика вместо нарратива.', 'Читать исследования', '/research'],
    ['Блог', 'Статьи о токен-экономике: от методологии аудитов до разбора причин, по которым токены не соответствуют протоколам.', 'Читать блог', '/blog'],
  ],
} as const

export function AboutPage({ locale }: AboutPageProps) {
  const copy = content[locale]

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Container>
          <div className={styles.heroInner}>
            <p className={styles.label}>[{copy.label}]</p>
            <h1>{copy.heroTitle}</h1>
            <p className={styles.heroText}>{copy.heroText}</p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.primaryAction}>
                {copy.primaryCta} <span aria-hidden="true">→</span>
              </Link>
              <a href="#what-we-do" className={styles.secondaryAction}>
                {copy.secondaryCta}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <SectionHeading label={copy.why.label} title={copy.why.title} />
          <div className={styles.prose}>
            {copy.why.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.team} aria-label={locale === 'ru' ? 'Команда А8А9' : '8Blocks team'}>
            {[1, 2, 3, 4, 5].map((member) => (
              <Image
                key={member}
                src={`/team/team-${member}.png`}
                alt=""
                width={64}
                height={64}
                className={styles.avatar}
              />
            ))}
          </div>
        </Container>
      </section>

      <section id="what-we-do" className={styles.section}>
        <Container>
          <SectionHeading label={locale === 'ru' ? 'Что мы делаем' : 'What we do'} title={copy.servicesTitle} />
          <div className={styles.cardsGrid}>
            {serviceCards[locale].map((card, index) => (
              <article key={card.title} className={styles.card}>
                <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <div className={styles.cardLinks}>
                  {card.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <SectionHeading label={locale === 'ru' ? 'С кем мы работаем' : 'Who we work with'} title={copy.clientTitle} />
          <div className={styles.clientList}>
            {clientGroups[locale].map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className={styles.sectionNote}>{copy.clientNote}</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <SectionHeading
            label={locale === 'ru' ? 'С 2017 года' : 'Since 2017'}
            title={copy.trackTitle}
            text={copy.trackText}
          />
          <div className={styles.stats}>
            {stats[locale].map(([value, text]) => (
              <article key={value} className={styles.stat}>
                <span>{value}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className={styles.centeredLink}>
            <Link href="/cases">{copy.casesCta} →</Link>
          </div>
          <p className={styles.geography}>{copy.geography}</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <SectionHeading label={locale === 'ru' ? 'Как мы работаем' : 'How we work'} title={copy.approachTitle} />
          <div className={styles.threeColumnGrid}>
            {approachCards[locale].map(([title, text], index) => (
              <article key={title} className={styles.card}>
                <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className={styles.sectionNote}>{copy.approachNote}</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <SectionHeading
            label={locale === 'ru' ? 'Экспертиза' : 'Expertise'}
            title={copy.expertiseTitle}
            text={copy.expertiseText}
          />
          <a
            className={styles.rating}
            href="https://clutch.co/profile/8blocks-fzco"
            target="_blank"
            rel="noreferrer"
          >
            <strong>5.0</strong>
            <span className={styles.stars} aria-label="5 out of 5 stars">★★★★★</span>
            <span>{copy.rating}</span>
            <span aria-hidden="true">→</span>
          </a>
          <div className={styles.threeColumnGrid}>
            {expertiseCards[locale].map(([title, text, linkLabel, href], index) => (
              <article key={title} className={styles.card}>
                <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className={styles.cardLinks}>
                  <Link href={href}>
                    {linkLabel} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.final}>
        <Container>
          <div className={styles.finalInner}>
            <p className={styles.label}>[{copy.nextLabel}]</p>
            <h2>{copy.finalTitle}</h2>
            <p>{copy.finalText}</p>
            <Link href="/contact" className={styles.primaryAction}>
              {copy.finalCta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </section>

    </main>
  )
}

function SectionHeading({ label, title, text }: { label: string; title: string; text?: string }) {
  return (
    <header className={styles.sectionHeading}>
      <p className={styles.label}>[{label}]</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </header>
  )
}
