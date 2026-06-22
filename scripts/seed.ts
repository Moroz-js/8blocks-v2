/**
 * Seed script for local development.
 * Creates: admin user, categories, articles (published + draft)
 *
 * Usage: npm run seed
 * Only runs in development mode or when SEED_ALLOWED=true is set.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const SEED_ALLOWED = process.env.NODE_ENV === 'development' || process.env.SEED_ALLOWED === 'true'

// ── Rich text helpers ──────────────────────────────────────────────────────
function makeRichText(blocks: object[]) {
  return {
    root: {
      type: 'root',
      children: blocks,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function paragraph(text: string) {
  return {
    type: 'paragraph',
    children: [{ type: 'text', text, version: 1 }],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function heading(text: string, tag: 'h2' | 'h3') {
  return {
    type: 'heading',
    tag,
    children: [{ type: 'text', text, version: 1 }],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function blockquote(text: string) {
  return {
    type: 'quote',
    children: [{ type: 'text', text, version: 1 }],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

// ── Lexical block-node helpers ─────────────────────────────────────────────
let blockSeq = 0
function blockNode(fields: Record<string, unknown>) {
  blockSeq += 1
  return {
    type: 'block',
    fields: { id: `seed-block-${blockSeq}`, ...fields },
    format: '',
    version: 2,
  }
}

function calloutBlock(severity: 'important' | 'critical', label: string, text: string) {
  return blockNode({ blockType: 'callout', severity, label, text })
}

function formulaBlock(formula: string, caption?: string) {
  return blockNode({ blockType: 'formula', formula, caption })
}

function chartBlock(
  type: 'line' | 'area' | 'bar' | 'donut',
  caption: string,
  dataPoints: { label: string; value: number; color?: string }[],
  opts: { seriesLabel?: string; color?: string } = {},
) {
  return blockNode({
    blockType: 'chart',
    type,
    caption,
    seriesLabel: opts.seriesLabel ?? 'Значение',
    color: opts.color ?? '#E6007A',
    dataPoints: dataPoints.map((p, i) => ({ id: `seed-dp-${blockSeq}-${i}`, ...p })),
  })
}

function tableBlock(headers: string[], rows: string[][]) {
  return blockNode({
    blockType: 'auditTable',
    headers: headers.map((cell, i) => ({ id: `seed-th-${blockSeq}-${i}`, cell })),
    rows: rows.map((cells, r) => ({
      id: `seed-tr-${blockSeq}-${r}`,
      cells: cells.map((cell, c) => ({ id: `seed-td-${blockSeq}-${r}-${c}`, cell })),
    })),
  })
}

function riskProfileBlock(
  title: string,
  criteria: { name: string; score: number; max: number; comment?: string }[],
  totalScore: number,
  rating: string,
  interpretation: string,
) {
  return blockNode({
    blockType: 'riskProfile',
    title,
    criteria: criteria.map((c, i) => ({ id: `seed-rc-${blockSeq}-${i}`, ...c })),
    totalScore,
    rating,
    interpretation,
  })
}

type ChartKind = 'line' | 'area' | 'bar' | 'hbar' | 'donut'

function chartRowBlock(
  charts: {
    type: ChartKind
    caption?: string
    seriesLabel?: string
    color?: string
    dataPoints: { label: string; value: number; color?: string }[]
  }[],
) {
  return blockNode({
    blockType: 'chartRow',
    charts: charts.map((c, ci) => ({
      id: `seed-chart-${blockSeq}-${ci}`,
      type: c.type,
      caption: c.caption ?? '',
      seriesLabel: c.seriesLabel ?? 'Значение',
      color: c.color ?? '#C24E88',
      dataPoints: c.dataPoints.map((p, i) => ({ id: `seed-dp-${blockSeq}-${ci}-${i}`, ...p })),
    })),
  })
}

function metricStripBlock(items: { label: string; sub?: string; value: string }[]) {
  return blockNode({
    blockType: 'metricStrip',
    items: items.map((it, i) => ({ id: `seed-ms-${blockSeq}-${i}`, ...it })),
  })
}

function checklistBlock(
  items: { variant: 'check' | 'cross' | 'warn'; text: string }[],
  title?: string,
) {
  return blockNode({
    blockType: 'checklist',
    title: title ?? '',
    items: items.map((it, i) => ({ id: `seed-cl-${blockSeq}-${i}`, ...it })),
  })
}

function statColumnsBlock(
  columns: {
    title?: string
    note?: string
    rows: { label: string; value?: string; percent?: number }[]
  }[],
) {
  return blockNode({
    blockType: 'statColumns',
    columns: columns.map((col, ci) => ({
      id: `seed-scol-${blockSeq}-${ci}`,
      title: col.title ?? '',
      note: col.note ?? '',
      rows: (col.rows ?? []).map((r, i) => ({ id: `seed-srow-${blockSeq}-${ci}-${i}`, ...r })),
    })),
  })
}

function infoColumnsBlock(items: { title: string; formula?: string; body?: string }[]) {
  return blockNode({
    blockType: 'infoColumns',
    items: items.map((it, i) => ({ id: `seed-ifc-${blockSeq}-${i}`, ...it })),
  })
}

function numberedNotesBlock(items: { title: string; text: string }[]) {
  return blockNode({
    blockType: 'numberedNotes',
    items: items.map((it, i) => ({ id: `seed-nn-${blockSeq}-${i}`, ...it })),
  })
}

// ── Article content templates ──────────────────────────────────────────────
const tokenomicsArticleContent = makeRichText([
  heading('Что такое токеномика', 'h2'),
  paragraph(
    'Токеномика — это экономическая архитектура токена: как он выпускается, распределяется, используется и уничтожается. Это не просто набор цифр о предложении и распределении — это система стимулов, которая определяет поведение всех участников экосистемы.',
  ),
  heading('Почему большинство токеномик не работает', 'h2'),
  paragraph(
    'Самая распространённая ошибка — проектирование токеномики как инструмента привлечения инвестиций, а не как экономического механизма продукта. Токен создаётся ради токена, а не ради ценности.',
  ),
  blockquote(
    'Токен должен генерировать ценность для проекта на протяжении всего его существования. И это возможно только тогда, когда вы чётко понимаете, зачем он существует и кому он нужен.',
  ),
  heading('Ключевые компоненты устойчивой токеномики', 'h2'),
  paragraph(
    'Устойчивая токеномика строится на трёх принципах: структурная привязка к использованию продукта, контролируемая циркуляция и механизмы защиты от давления продаж.',
  ),
  heading('Эмиссия и распределение', 'h3'),
  paragraph(
    'Правильно спроектированная эмиссия определяет не только сколько токенов будет выпущено, но и когда, кому и на каких условиях. Вестинг, клиффы и линейное распределение — инструменты, которые влияют на ценовое давление.',
  ),
  heading('Treasury и резервы', 'h3'),
  paragraph(
    'Treasury — это механизм устойчивости. Правильно структурированный резерв позволяет проекту финансировать разработку, поддерживать ликвидность и реагировать на рыночные шоки.',
  ),
])

const auditArticleContent = makeRichText([
  heading('Зачем нужен аудит токеномики', 'h2'),
  paragraph(
    'Аудит токеномики — это не просто проверка цифр. Это системный анализ всей экономической архитектуры токена: насколько она устойчива, как поведёт себя при разных сценариях роста и кризиса.',
  ),
  heading('Что проверяется в ходе аудита', 'h2'),
  paragraph(
    'Полный аудит охватывает структуру эмиссии, механику вестинга, логику распределения, utility-механики, связь с продуктом, устойчивость к давлению продаж и готовность к масштабированию.',
  ),
  heading('Типичные ошибки в токеномике', 'h3'),
  paragraph(
    'Самые частые проблемы: несбалансированное распределение (команда и инвесторы получают слишком большую долю с короткими клиффами), отсутствие реального спроса на токен со стороны пользователей и инфляционная модель без механизмов сжигания.',
  ),
  blockquote(
    'Лучше обнаружить слабые места до токенсейла, чем столкнуться с ними перед инвесторами или на открытом рынке.',
  ),
])

const strategyArticleContent = makeRichText([
  heading('Стратегический консалтинг в Web3', 'h2'),
  paragraph(
    'Запуск токена — это не технический процесс, это стратегический. Успешный выход токена на рынок требует согласованности между экономикой, продуктом, инвестиционной упаковкой и партнёрской экосистемой.',
  ),
  heading('Что входит в стратегический консалтинг', 'h2'),
  paragraph(
    'Стратегический консалтинг охватывает разработку бизнес-модели токена, создание investor-ready материалов, построение партнёрской экосистемы и подготовку к TGE. Это комплексная работа, где каждый элемент связан с остальными.',
  ),
  heading('Как строится партнёрская экосистема', 'h3'),
  paragraph(
    'Правильная партнёрская экосистема включает маркетмейкеров, маркетинговых партнёров, аудиторов смарт-контрактов и стратегических инвесторов. Каждый тип партнёра выполняет свою функцию в подготовке к TGE.',
  ),
])

// ── Seed runner ────────────────────────────────────────────────────────────
async function seed() {
  if (!SEED_ALLOWED) {
    console.error('❌ Seed is not allowed in this environment. Set NODE_ENV=development or SEED_ALLOWED=true.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  console.log('🌱 Starting seed...')

  // ── 0. Admin user ────────────────────────────────────────────────────────
  console.log('  Creating admin user...')
  const adminEmail    = process.env.ADMIN_EMAIL    
  const adminPassword = process.env.ADMIN_PASSWORD

  try {
    const existing = await payload.find({ collection: 'users', limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        },
      })
      console.log(`    + Created admin user: ${adminEmail}`)
    } else {
      console.log('    ✓ Admin user already exists')
    }
  } catch (err) {
    console.warn('    ⚠ Failed to create admin user:', err)
  }

  // ── 1. Categories ───────────────────────────────────────────────────────
  console.log('  Creating categories...')

  const categoryDefs = [
    {
      title: 'Токеномика',
      slug: 'tokenomics',
      description: 'Разработка и анализ токен-экономических моделей',
      seo: { seoTitle: 'Токеномика | 8Blocks', seoDescription: 'Статьи о разработке токеномики для Web3-проектов' },
    },
    {
      title: 'Стратегия',
      slug: 'strategy',
      description: 'Стратегический консалтинг и подготовка к TGE',
      seo: { seoTitle: 'Стратегия | 8Blocks', seoDescription: 'Материалы о стратегическом планировании токен-проектов' },
    },
    {
      title: 'Аудит',
      slug: 'audit',
      description: 'Аудит токеномики и анализ существующих моделей',
      seo: { seoTitle: 'Аудит токеномики | 8Blocks', seoDescription: 'Экспертный анализ и оценка токен-экономик' },
    },
    {
      title: 'Web3 тренды',
      slug: 'web3-trends',
      description: 'Тенденции и развитие рынка Web3',
      seo: { seoTitle: 'Web3 тренды | 8Blocks', seoDescription: 'Актуальные тренды в мире Web3 и крипторынков' },
    },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoryDefs) {
    try {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        categories[cat.slug] = existing.docs[0].id as string
        console.log(`    ✓ Category "${cat.title}" already exists`)
        continue
      }
      const created = await payload.create({
        collection: 'categories',
        data: cat,
      })
      categories[cat.slug] = created.id as string
      console.log(`    + Created category "${cat.title}"`)
    } catch (err) {
      console.warn(`    ⚠ Failed to create category "${cat.title}":`, err)
    }
  }

  // ── 2. Articles ──────────────────────────────────────────────────────────
  console.log('  Creating articles...')

  const now = new Date()
  const days = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString()

  const articleDefs = [
    {
      title: 'Что такое токеномика и почему она важна для вашего проекта',
      slug: 'chto-takoe-tokenomika',
      excerpt: 'Токеномика — это не просто распределение токенов. Это экономическая архитектура, которая определяет поведение всех участников экосистемы. Разбираемся, из чего она состоит и почему большинство токеномик не работает.',
      content: tokenomicsArticleContent,
      categoryId: categories['tokenomics'],
      status: 'published' as const,
      publishedAt: days(14),
      seo: {
        seoTitle: 'Что такое токеномика | 8Blocks',
        seoDescription: 'Разбираем, что такое токеномика, из каких компонентов она состоит и почему большинство токеномик не работает после запуска.',
        noindex: false,
      },
    },
    {
      title: 'Аудит токеномики: зачем он нужен и когда его заказывать',
      slug: 'audit-tokenomiki-zachem-i-kogda',
      excerpt: 'Аудит токеномики — это системный анализ экономической архитектуры токена. Рассказываем, что проверяется в ходе аудита и какие ошибки встречаются чаще всего.',
      content: auditArticleContent,
      categoryId: categories['audit'],
      status: 'published' as const,
      publishedAt: days(7),
      seo: {
        seoTitle: 'Аудит токеномики | 8Blocks',
        seoDescription: 'Зачем нужен аудит токеномики и что в нём проверяется. Типичные ошибки и как их избежать.',
        noindex: false,
      },
    },
    {
      title: 'Стратегический консалтинг при запуске токена: что важно знать',
      slug: 'strategicheskiy-konsalting-zapusk-tokena',
      excerpt: 'Запуск токена — стратегический процесс, требующий согласованности всех элементов. Разбираем, что включает стратегический консалтинг и как он помогает подготовиться к TGE.',
      content: strategyArticleContent,
      categoryId: categories['strategy'],
      status: 'published' as const,
      publishedAt: days(3),
      seo: {
        seoTitle: 'Стратегический консалтинг | 8Blocks',
        seoDescription: 'Что включает стратегический консалтинг при запуске токена и как подготовиться к TGE.',
        noindex: false,
      },
    },
    {
      title: 'Vesting и cliff: как структура разблокировки влияет на цену токена',
      slug: 'vesting-cliff-razblokirovka-cena',
      excerpt: 'Неправильно настроенный вестинг — одна из главных причин ценового давления после TGE. Объясняем принципы правильной структуры разблокировки.',
      content: makeRichText([
        heading('Что такое вестинг и зачем он нужен', 'h2'),
        paragraph('Вестинг — это механизм постепенного разблокирования токенов для команды, инвесторов и других участников. Его цель — привязать долгосрочные интересы держателей к судьбе проекта.'),
        heading('Cliff: период ожидания перед началом разблокировки', 'h3'),
        paragraph('Клифф (cliff) — это период между получением аллокации и началом разблокировки. Стандартный клифф для команды — 12 месяцев. Без клиффа команда может продать токены сразу после TGE.'),
      ]),
      categoryId: categories['tokenomics'],
      status: 'published' as const,
      publishedAt: days(21),
      seo: {
        seoTitle: 'Vesting и cliff токена | 8Blocks',
        seoDescription: 'Как структура вестинга влияет на цену токена и ценовое давление после TGE.',
        noindex: false,
      },
    },
    {
      title: 'RWA токенизация: новые возможности и риски',
      slug: 'rwa-tokenizatsiya-vozmozhnosti-riski',
      excerpt: 'Real World Assets (RWA) — один из самых быстрорастущих сегментов Web3. Разбираем, что это такое и как правильно проектировать токеномику для RWA-проектов.',
      content: makeRichText([
        heading('Что такое RWA токенизация', 'h2'),
        paragraph('RWA (Real World Assets) — это токенизация реальных активов: недвижимости, облигаций, товаров, предметов искусства. Это позволяет сделать неликвидные активы доступными для широкого круга инвесторов.'),
        blockquote('Токенизация активов меняет правила игры: любой актив с устойчивым денежным потоком может стать токеном.'),
      ]),
      categoryId: categories['web3-trends'],
      status: 'published' as const,
      publishedAt: days(30),
      seo: {
        seoTitle: 'RWA токенизация | 8Blocks',
        seoDescription: 'Что такое RWA токенизация и как проектировать токеномику для проектов с реальными активами.',
        noindex: false,
      },
    },
    // Draft article — should NOT appear on frontend
    {
      title: 'Treasury management: как управлять резервами проекта (черновик)',
      slug: 'treasury-management-rezervy',
      excerpt: 'Управление treasury — критически важный аспект долгосрочной устойчивости проекта. Статья в разработке.',
      content: makeRichText([
        paragraph('Статья в разработке. Скоро опубликуем.'),
      ]),
      categoryId: categories['tokenomics'],
      status: 'draft' as const,
      publishedAt: null,
      seo: {
        seoTitle: undefined,
        seoDescription: undefined,
        noindex: true,
      },
    },
  ]

  for (const article of articleDefs) {
    try {
      const existing = await payload.find({
        collection: 'articles',
        where: { slug: { equals: article.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`    ✓ Article "${article.title}" already exists`)
        continue
      }

      const { categoryId, ...rest } = article
      await payload.create({
        collection: 'articles',
        data: {
          ...rest,
          category: categoryId || undefined,
        },
      })
      console.log(`    + Created article "${article.title}"`)
    } catch (err) {
      console.warn(`    ⚠ Failed to create article "${article.title}":`, err)
    }
  }

  // ── 4. Sample leads ──────────────────────────────────────────────────────
  console.log('  Creating sample leads...')

  const leadDefs = [
    {
      name: 'Алексей Смирнов',
      email: 'alex@example.com',
      message: 'Нас интересует разработка токеномики для нашего DeFi-протокола. Готовы обсудить детали.',
      source: 'homepage',
    },
    {
      name: 'Maria Johnson',
      email: 'maria@gamefi-project.io',
      phone: '+1 555 123 4567',
      message: 'We are building a GameFi project and need help designing token economy. Looking for strategic consulting.',
      source: 'services/strategic-consulting',
    },
  ]

  for (const lead of leadDefs) {
    try {
      const existing = await payload.find({
        collection: 'leads',
        where: { email: { equals: lead.email } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`    ✓ Lead "${lead.email}" already exists`)
        continue
      }
      await payload.create({ collection: 'leads', data: lead })
      console.log(`    + Created lead "${lead.email}"`)
    } catch (err) {
      console.warn(`    ⚠ Failed to create lead:`, err)
    }
  }

  // ── 5. Sample newsletter subscriptions ────────────────────────────────────
  console.log('  Creating sample newsletter subscriptions...')

  const subDefs = [
    { email: 'subscriber1@example.com', source: 'footer' },
    { email: 'subscriber2@example.com', source: 'blog' },
  ]

  for (const sub of subDefs) {
    try {
      const existing = await payload.find({
        collection: 'newsletter-subscriptions',
        where: { email: { equals: sub.email } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`    ✓ Subscription "${sub.email}" already exists`)
        continue
      }
      await payload.create({ collection: 'newsletter-subscriptions', data: sub })
      console.log(`    + Created subscription "${sub.email}"`)
    } catch (err) {
      console.warn(`    ⚠ Failed to create subscription:`, err)
    }
  }

  // ── 6. Public audits (VIRTUAL, HYPE, STON) ───────────────────────────────
  console.log('  Creating public audits...')

  const auditDefs = [
    {
      title: 'Аудит токеномики Virtuals Protocol ($VIRTUAL)',
      slug: 'virtual-tokenomics-audit',
      excerpt:
        'Разбираем токеномику Virtuals Protocol: utility-механики агентов, инфляцию, распределение и устойчивость к давлению продаж.',
      publishedAt: days(20),
      ctaText: 'Хотите такой же разбор токеномики вашего проекта?',
      hero: {
        company: 'Virtuals Protocol',
        tokenName: '$VIRTUAL',
        tokenStandard: 'ERC-20 / Base',
        projectDescription:
          'Virtuals Protocol — платформа для создания и токенизации AI-агентов. $VIRTUAL используется как базовая валюта запуска агентов, обеспечения ликвидности и распределения комиссий.',
        site: 'https://virtuals.io',
        verdict: 'Токен нужен: он структурно завязан на запуск агентов и комиссии.',
        strength:
          'Сильная привязка токена к продукту: каждый новый агент создаёт спрос на $VIRTUAL через бондинг-кривую.',
        weakness:
          'Высокая концентрация ликвидности в нескольких агентах повышает волатильность совокупной капитализации.',
        letterRating: 'BB',
        score: 74,
      },
      heroMetrics: [
        { label: 'FDV', value: '$2.1B' },
        { label: 'MC', value: '$1.4B' },
        { label: 'TVL', value: '$320M' },
        { label: 'Holders', value: '180k' },
        { label: 'Next unlock', value: 'нет (100% in circ.)' },
      ],
      ratingBlocks: [
        { block: 'Полезность', weight: 20, scoreFive: 4 },
        { block: 'Эмиссия', weight: 15, scoreFive: 4.5 },
        { block: 'Распределение', weight: 15, scoreFive: 3 },
        { block: 'Ликвидность', weight: 15, scoreFive: 3.5 },
        { block: 'Спрос', weight: 15, scoreFive: 4 },
        { block: 'Управление', weight: 8, scoreFive: 3 },
        { block: 'Прозрачность', weight: 7, scoreFive: 4 },
        { block: 'Устойчивость', weight: 5, scoreFive: 3.5 },
      ],
      expert: {
        name: 'Артём Иванов',
        role: 'Lead Tokenomics Analyst, 8Blocks',
        rating: 'Уверенность оценки: высокая',
      },
      content: makeRichText([
        heading('Резюме', 'h2'),
        paragraph(
          'Virtuals Protocol демонстрирует одну из наиболее продуктово-связанных токеномик в сегменте AI-агентов. Спрос на токен генерируется самим продуктом, а не только спекулятивным интересом.',
        ),
        calloutBlock(
          'important',
          'Важно',
          'Вся эмиссия уже в обращении — давление будущих разблокировок отсутствует, но это смещает риск в сторону рыночной ликвидности.',
        ),
        heading('Динамика цены и ликвидности', 'h2'),
        chartBlock(
          'area',
          'Цена $VIRTUAL за последние 6 месяцев, USD',
          [
            { label: 'Янв', value: 0.9 },
            { label: 'Фев', value: 1.8 },
            { label: 'Мар', value: 2.4 },
            { label: 'Апр', value: 1.6 },
            { label: 'Май', value: 2.1 },
            { label: 'Июн', value: 2.0 },
          ],
          { seriesLabel: 'Цена, USD', color: '#7C3AED' },
        ),
        chartBlock(
          'donut',
          'Распределение предложения токенов',
          [
            { label: 'Ликвидность', value: 40, color: '#E6007A' },
            { label: 'Экосистема', value: 35, color: '#7C3AED' },
            { label: 'Команда', value: 15, color: '#2563EB' },
            { label: 'Резерв', value: 10, color: '#10B981' },
          ],
        ),
        heading('Модель спроса', 'h2'),
        paragraph(
          'Спрос на токен можно выразить как функцию от количества активных агентов и средней ликвидности на агента.',
        ),
        formulaBlock(
          'D_{VIRTUAL} = \\sum_{i=1}^{n} L_i \\cdot (1 + r_i)',
          'D — совокупный спрос, L_i — ликвидность агента i, r_i — темп роста его TVL',
        ),
        heading('Денежные потоки', 'h2'),
        tableBlock(
          ['Источник', 'Доля комиссии', 'Получатель'],
          [
            ['Запуск агента', '1%', 'Treasury'],
            ['Торговля агентом', '1%', 'LP + Treasury'],
            ['Выкуп', 'переменная', 'Buyback & burn'],
          ],
        ),
        calloutBlock(
          'critical',
          'Критично',
          'Концентрация ликвидности в топ-5 агентах превышает 45% — деградация любого из них приведёт к резкому падению совокупного TVL.',
        ),
        riskProfileBlock(
          'Риск-профиль',
          [
            { name: 'Рыночный риск', score: 65, max: 100, comment: 'Высокая волатильность капитализации' },
            { name: 'Риск ликвидности', score: 58, max: 100, comment: 'Концентрация в нескольких агентах' },
            { name: 'Риск управления', score: 72, max: 100, comment: 'Управление частично централизовано' },
            { name: 'Технологический риск', score: 80, max: 100, comment: 'Аудиты контрактов пройдены' },
          ],
          69,
          'B',
          'Совокупный риск умеренный. Главный фактор — рыночная концентрация ликвидности.',
        ),
      ]),
      seo: {
        seoTitle: 'Аудит токеномики Virtuals Protocol ($VIRTUAL) | 8Blocks',
        seoDescription:
          'Публичный аудит токеномики Virtuals Protocol: utility, эмиссия, распределение, риски.',
        noindex: false,
      },
    },
    {
      title: 'Аудит токеномики Hyperliquid ($HYPE)',
      slug: 'hype-tokenomics-audit',
      excerpt:
        'Экономическая модель токена HYPE хорошо продумана и доказала устойчивость к давлению airdrops и к рыночному шоку 10 ноября 2025 года. Прямая связь цены с операционной выручкой через buyback создаёт реальный спрос, а цена ни разу не опускалась ниже стартового значения.\n\nОднако с каждым годом модель будет испытывать двойное давление: рост разблокировок команды и зависимость от объёмов торгов. Buyback покрывает лишь часть ежедневного притока в обращение, поэтому ключевым фактором остаётся органический спрос.',
      publishedAt: new Date('2026-02-14T00:00:00.000Z').toISOString(),
      ctaText: 'Нужен независимый аудит токеномики? Обсудим ваш проект.',
      hero: {
        company: 'Hyperliquid',
        tokenName: '$HYPE',
        tokenStandard: 'Native L1 (HyperEVM)',
        projectDescription:
          'Hyperliquid — децентрализованная биржа срочных контрактов (perpetual futures) на собственном высокопроизводительном L1. $HYPE — нативный токен сети: используется для стейкинга валидаторов, оплаты газа и аккумулирует ценность через выкупы за счёт комиссий протокола.',
        site: 'app.hyperliquid.xyz',
        verdict:
          'Доля рынка Hyperliquid в торговле DeFi-деривативами стабильно высока, что обеспечивает устойчивый поток комиссий.',
        strength:
          'Ежедневный buyback — 59 655 HYPE. Ежедневная разблокировка команды кратно больше, но почти вся выручка идёт на выкуп.',
        weakness:
          'Когда будет выкуплено >20% эмиссии (3–5 лет), может включиться дефляционный сценарий — но и риск зависимости от объёмов вырастет.',
        letterRating: 'A',
        score: 74,
      },
      heroMetrics: [
        { label: 'FDV', value: '$39.6b' },
        { label: 'MC', value: '$10.4b' },
        { label: 'TVL', value: '$4.7b' },
        { label: 'Комиссии / мес.', value: '$63m' },
        { label: 'Пользователи', value: '1.4m' },
      ],
      ratingBlocks: [
        { block: 'Token Product Linkage', weight: 40, scoreFive: 4.1 },
        { block: 'Tokenomics Sustainability', weight: 20, scoreFive: 2.8 },
        { block: 'Fundamentals', weight: 15, scoreFive: 4.4 },
        { block: 'Governance / Control Risk', weight: 10, scoreFive: 3.0 },
        { block: 'Security', weight: 10, scoreFive: 3.5 },
        { block: 'Market Layer', weight: 5, scoreFive: 4.0 },
      ],
      expert: {
        name: 'Ефименко Антон',
        role: 'Главный эксперт, 8Blocks',
        rating: 'Уверенность оценки: высокая',
      },
      content: makeRichText([
        // ── Цена токена ───────────────────────────────────────────
        heading('1. Цена токена', 'h2'),
        metricStripBlock([
          { label: 'Старт торгов', sub: 'Ноябрь 2024', value: '$3–4' },
          { label: 'Текущая цена', sub: 'Февраль 2026', value: '$29.7' },
          { label: 'ATH', sub: '18 сен 2025', value: '$59.53' },
          { label: 'ATL', sub: '29 ноя 2024', value: '$3.2' },
        ]),
        paragraph(
          'Цена HYPE прошла путь от стартовых $3–4 в ноябре 2024 года до исторического максимума $59.53 в сентябре 2025 года. Несмотря на коррекции, токен ни разу не опускался ниже стартового уровня — текущий спред к старту составляет около 1000%.',
        ),
        chartRowBlock([
          {
            type: 'area',
            caption: 'График цены · CoinGecko',
            seriesLabel: 'Цена, USD',
            color: '#C24E88',
            dataPoints: [
              { label: "Ноя '24", value: 3.5 },
              { label: "Дек '24", value: 5 },
              { label: "Янв '25", value: 18 },
              { label: "Фев '25", value: 22 },
              { label: "Мар '25", value: 16 },
              { label: "Апр '25", value: 14 },
              { label: "Май '25", value: 18 },
              { label: "Июн '25", value: 24 },
              { label: "Июл '25", value: 30 },
              { label: "Авг '25", value: 41 },
              { label: "Сен '25", value: 59.53 },
              { label: "Окт '25", value: 45 },
              { label: "Ноя '25", value: 38 },
              { label: "Дек '25", value: 35 },
              { label: "Янв '26", value: 32 },
              { label: "Фев '26", value: 29.7 },
            ],
          },
        ]),
        chartRowBlock([
          {
            type: 'area',
            caption: 'TVL и Fees · DefiLlama · текущий TVL: $4.23 млрд',
            seriesLabel: 'TVL, $b',
            color: '#2563EB',
            dataPoints: [
              { label: "Ноя '24", value: 0.5 },
              { label: "Дек '24", value: 0.9 },
              { label: "Янв '25", value: 1.6 },
              { label: "Фев '25", value: 2.1 },
              { label: "Мар '25", value: 2.6 },
              { label: "Апр '25", value: 2.9 },
              { label: "Май '25", value: 3.3 },
              { label: "Июн '25", value: 3.7 },
              { label: "Июл '25", value: 4.0 },
              { label: "Авг '25", value: 4.3 },
              { label: "Сен '25", value: 4.7 },
              { label: "Окт '25", value: 4.5 },
              { label: "Ноя '25", value: 4.3 },
              { label: "Дек '25", value: 4.4 },
              { label: "Янв '26", value: 4.2 },
              { label: "Фев '26", value: 4.23 },
            ],
          },
        ]),
        checklistBlock([
          {
            variant: 'check',
            text: 'Токеномика показала устойчивость к давлению airdrops и к «чёрному лебедю» 10 ноября 2025.',
          },
          {
            variant: 'check',
            text: 'Изменение Fees — основной триггер для цены. 99% выручки уходит на buyback.',
          },
          {
            variant: 'check',
            text: 'Цена никогда не опускалась ниже стартового значения. Текущий спред к старту — ~1000%.',
          },
          {
            variant: 'warn',
            text: 'Явный риск: сильное падение Fees или отвязка от buyback может привести к обвалу цены.',
          },
        ], 'Выводы'),

        // ── Распределение токенов ─────────────────────────────────
        heading('2. Распределение токенов', 'h2'),
        paragraph(
          'Всего будет выпущено 1 000 000 000 токенов HYPE. Около трети эмиссии распределена через Genesis-аирдроп сообществу, ещё около четверти зарезервировано за core-контрибьюторами. Значимая доля остаётся нераспределённой и поступает в обращение по графику эмиссии.',
        ),
        chartRowBlock([
          {
            type: 'donut',
            caption: 'Распределение Genesis, %',
            dataPoints: [
              { label: 'Genesis Distribution', value: 31.0, color: '#C24E88' },
              { label: 'Core Contributors', value: 23.8, color: '#8E4ABD' },
              { label: 'Hyper Foundation', value: 6.0, color: '#2563EB' },
              { label: 'Community Rewards', value: 3.9, color: '#0EA5E9' },
              { label: 'Community Grants', value: 0.3, color: '#10B981' },
              { label: 'Validator Rewards', value: 1.4, color: '#F59E0B' },
              { label: 'Нераспределено', value: 33.6, color: '#94A3B8' },
            ],
          },
          {
            type: 'bar',
            caption: 'Эмиссия по годам, млн HYPE',
            seriesLabel: 'Эмиссия',
            color: '#8E4ABD',
            dataPoints: [
              { label: '2026', value: 800 },
              { label: '2027', value: 600 },
              { label: '2028', value: 400 },
              { label: '2029', value: 250 },
              { label: '2030', value: 150 },
            ],
          },
        ]),
        checklistBlock([
          { variant: 'check', text: 'Нет давления со стороны ранних покупателей (VC, Angel, Seed).' },
          {
            variant: 'check',
            text: 'Почти половина эмиссии уже в обращении — модель справляется с поддержанием цены.',
          },
          {
            variant: 'cross',
            text: 'Вторичная разблокировка (ноябрь 2025) удваивает circulating supply.',
          },
          { variant: 'cross', text: 'Buyback покрывает лишь 10–15% разблокируемых токенов.' },
          { variant: 'cross', text: 'Команда может использовать токены только для продажи.' },
        ], 'Выводы'),

        // ── Стейкинг и фарминг ─────────────────────────────────────
        heading('3. Стейкинг и фарминг', 'h2'),
        paragraph(
          'Простое хранение HYPE неэффективно: реальная доходность съедается инфляцией от разблокировок. Экосистема предлагает несколько инструментов стейкинга и фарминга с разным профилем риска и доходности.',
        ),
        chartRowBlock([
          {
            type: 'hbar',
            caption: 'APY по инструментам, %',
            seriesLabel: 'APY, %',
            color: '#C24E88',
            dataPoints: [
              { label: 'L1 Staking', value: 18 },
              { label: 'HLP Vault', value: 11 },
              { label: 'Kinetiq (kHYPE)', value: 12 },
              { label: 'DEX Farming', value: 55 },
            ],
          },
        ]),
        statColumnsBlock([
          {
            title: 'Входящие потоки',
            rows: [
              { label: 'Торговые комиссии (с дек 2024)', value: '$1.1 млрд' },
              { label: 'Доход / месяц', value: '$80–110 млн' },
            ],
          },
          {
            title: 'Assistance Fund',
            rows: [
              { label: 'Доля комиссий на buyback', value: '99%' },
              { label: 'Ежемесячный спрос на выкуп', value: '$70–100 млн' },
            ],
            note: 'В декабре 2025 токены Assistance Fund официально признаны permanently burned.',
          },
        ]),
        infoColumnsBlock([
          {
            title: 'Номинальная доходность',
            formula: 'APR = (R_a / S_t) \\times 100\\%',
            body: 'Ra — годовые награды, St — сумма в стейкинге. Чем больше застейкано, тем ниже индивидуальная доходность.',
          },
          {
            title: 'Множитель лояльности',
            formula: 'W_i = S_i \\times M(t)',
            body: 'M(t) растёт пропорционально сроку блокировки (до 9 месяцев) и увеличивает вес наград.',
          },
          {
            title: 'Реальная доходность',
            body: '0–3% годовых при APR ~18% и инфляции от разблокировок ~18–23%.',
          },
        ]),

        // ── Утилизация токенов ─────────────────────────────────────
        heading('4. Утилизация токенов', 'h2'),
        paragraph(
          'HYPE задействован сразу в нескольких контурах протокола — от оплаты газа до участия в аукционах за листинги. Ниже — основные инструменты с доходностью и особенностями.',
        ),
        tableBlock(
          ['Инструмент', 'APY', 'TVL', 'Особенность'],
          [
            ['L1 Staking', '2.3–18%', '—', 'Скидки на комиссии до 40% для трейдеров'],
            ['HLP Vault', '10–12%', '$4.23b', 'Доход в USDC, косвенная поддержка HYPE'],
            ['Kinetiq (kHYPE)', '~12%', '$766m', 'Ликвидный стейкинг, интеграция с Pendle'],
            ['Pendle (PT/YT)', 'переменная', '—', 'Фиксированная ставка, YT-спекуляции'],
            ['DEX Farming', '50–60%', '$180m', 'Высокий риск Impermanent Loss'],
            ['HLend / Felix', '—', '—', 'HYPE как обеспечение, займы в стейблкоинах'],
          ],
        ),
        infoColumnsBlock([
          {
            title: 'Native Gas',
            body: 'HYPE — единственная расчётная единица для оплаты комиссий в HyperEVM и HyperCore.',
          },
          {
            title: 'Fee Discounts',
            body: 'Система уровней, привязанная к стейкингу. Крупные стейкеры получают скидки на торговые комиссии.',
          },
          {
            title: 'HIP-x и Аукционы',
            body: 'Запуск новых токенов требует участия в аукционах за HYPE, создавая дополнительный спрос.',
          },
          {
            title: 'Governance',
            body: 'Держатели напрямую влияют на параметры риск-менеджмента и развитие протокола.',
          },
        ]),

        // ── Обращение токенов ──────────────────────────────────────
        heading('5. Обращение токенов', 'h2'),
        statColumnsBlock([
          {
            title: 'Приток в обращение',
            rows: [
              { label: 'Ежедн. разблокировка команды', value: '325 857 HYPE' },
              { label: 'Ежедн. в USD при $29', value: '~$9.5 млн' },
              { label: 'Награды за стейкинг', value: '~2.3% APY' },
            ],
          },
          {
            title: 'Вывод из обращения',
            rows: [
              { label: 'Ежедн. buyback (AF)', value: '59 655 HYPE' },
              { label: 'HIP-3 стейкинг/рынок', value: '500 000 HYPE' },
              { label: 'Сожжено (дек 2025)', value: '37 млн HYPE' },
            ],
          },
          {
            title: 'Баланс давления',
            rows: [{ label: 'Buyback / Unlock', value: '18.3%', percent: 18.3 }],
            note: 'Buyback покрывает лишь ~18% ежедневных разблокировок. 82% должно поглощаться органическим спросом.',
          },
        ]),
        chartRowBlock([
          {
            type: 'bar',
            caption: 'Приток/вывод токенов из обращения (оценочные данные)',
            seriesLabel: 'Чистый поток, млн',
            color: '#2563EB',
            dataPoints: [
              { label: "Ноя '24", value: 450 },
              { label: "Дек '24", value: -150 },
              { label: "Янв '25", value: -148 },
              { label: "Фев '25", value: -146 },
              { label: "Мар '25", value: -144 },
              { label: "Апр '25", value: -142 },
              { label: "Май '25", value: -140 },
              { label: "Июн '25", value: -138 },
              { label: "Ноя '25", value: 450 },
              { label: "Дек '25", value: 450 },
              { label: "Янв '26", value: 450 },
              { label: "Фев '26", value: 450 },
            ],
          },
        ]),

        // ── Критические замечания ──────────────────────────────────
        heading('6. Критические замечания', 'h2'),
        numberedNotesBlock([
          {
            title: 'Падение доли рынка',
            text: 'Конкуренция в onchain perpetuals усилилась. Доля Hyperliquid может снижаться по мере выхода новых игроков и фрагментации ликвидности.',
          },
          {
            title: 'Риск buyback-механики',
            text: 'Assistance Fund аккумулировал >37 млн HYPE. В декабре 2025 они признаны сожжёнными, но зависимость цены от buyback остаётся высокой.',
          },
          {
            title: 'Скрытая централизация',
            text: 'Первый год показал: большая часть genesis-токенов сосредоточена у команды и фонда, что создаёт потенциальный governance-риск.',
          },
        ]),
        checklistBlock([
          {
            variant: 'check',
            text: 'Используйте стейкинг или ликвидный стейкинг (APY 2–5%) — простое хранение неэффективно.',
          },
          {
            variant: 'check',
            text: 'Рассмотрите HLP Vault в USDC: доход от fees и ликвидаций без прямого риска падения HYPE.',
          },
          {
            variant: 'warn',
            text: 'Ключевой индикатор — объём торгов. Алерт: >$5–7 млрд/сутки — норма. <$3 млрд неделю — тревожный сигнал.',
          },
          {
            variant: 'warn',
            text: 'Мониторьте топ-24 кошелька. Массовое движение HYPE со стороны китов — повод пересмотреть позиции.',
          },
        ], 'Рекомендации'),
      ]),
      seo: {
        seoTitle: 'Аудит токеномики Hyperliquid ($HYPE) | 8Blocks',
        seoDescription:
          'Публичный аудит токеномики Hyperliquid: выкупы, комиссии, распределение и риски.',
        noindex: false,
      },
    },
    {
      title: 'Аудит токеномики STON.fi ($STON)',
      slug: 'ston-tokenomics-audit',
      excerpt:
        'Разбор токеномики STON.fi — ведущего DEX в экосистеме TON: utility, эмиссия и распределение комиссий.',
      publishedAt: days(5),
      ctaText: 'Закажите аудит токеномики вашего проекта на TON.',
      hero: {
        company: 'STON.fi',
        tokenName: '$STON',
        tokenStandard: 'TON Jetton',
        projectDescription:
          'STON.fi — крупнейший AMM-DEX в экосистеме TON. $STON используется для управления, стейкинга и распределения части торговых комиссий.',
        site: 'https://ston.fi',
        verdict: 'Токен полезен, но часть utility пока опциональна.',
        strength:
          'Сильные позиции в экосистеме TON и растущий объём торгов обеспечивают органический спрос на ликвидность.',
        weakness:
          'Доля комиссий, возвращаемая держателям, пока невелика — utility во многом зависит от будущих governance-решений.',
        letterRating: 'BBB',
        score: 79,
      },
      heroMetrics: [
        { label: 'FDV', value: '$240M' },
        { label: 'MC', value: '$95M' },
        { label: 'TVL', value: '$180M' },
        { label: 'Holders', value: '120k' },
        { label: 'Next unlock', value: 'Q3 (команда)' },
      ],
      ratingBlocks: [
        { block: 'Полезность', weight: 20, scoreFive: 3.5 },
        { block: 'Эмиссия', weight: 15, scoreFive: 4 },
        { block: 'Распределение', weight: 15, scoreFive: 3.5 },
        { block: 'Ликвидность', weight: 15, scoreFive: 4.5 },
        { block: 'Спрос', weight: 15, scoreFive: 3.5 },
        { block: 'Управление', weight: 8, scoreFive: 4 },
        { block: 'Прозрачность', weight: 7, scoreFive: 4 },
        { block: 'Устойчивость', weight: 5, scoreFive: 4 },
      ],
      expert: {
        name: 'Дмитрий Орлов',
        role: 'Tokenomics Analyst, 8Blocks',
        rating: 'Уверенность оценки: средняя',
      },
      content: makeRichText([
        heading('Резюме', 'h2'),
        paragraph(
          'STON.fi занимает лидирующую позицию среди DEX в экосистеме TON. Токеномика устойчива, но потенциал utility раскрыт не полностью.',
        ),
        calloutBlock(
          'important',
          'Важно',
          'Ключевой драйвер будущей ценности — увеличение доли комиссий, распределяемой стейкерам $STON.',
        ),
        heading('Рост TVL', 'h2'),
        chartBlock(
          'line',
          'TVL STON.fi за 6 месяцев, $M',
          [
            { label: 'Янв', value: 90 },
            { label: 'Фев', value: 110 },
            { label: 'Мар', value: 135 },
            { label: 'Апр', value: 150 },
            { label: 'Май', value: 168 },
            { label: 'Июн', value: 180 },
          ],
          { seriesLabel: 'TVL, $M', color: '#2563EB' },
        ),
        chartBlock(
          'donut',
          'Распределение предложения токенов',
          [
            { label: 'Сообщество', value: 45, color: '#E6007A' },
            { label: 'Команда', value: 20, color: '#7C3AED' },
            { label: 'Инвесторы', value: 18, color: '#2563EB' },
            { label: 'Ликвидность', value: 17, color: '#10B981' },
          ],
        ),
        heading('Доход стейкера', 'h2'),
        paragraph('Доходность стейкинга зависит от доли комиссий, направляемой держателям, и общего объёма застейканных токенов.'),
        formulaBlock(
          'APR = \\frac{F \\cdot \\beta}{S}',
          'F — годовые комиссии, β — доля для стейкеров, S — объём стейкинга',
        ),
        tableBlock(
          ['Параметр', 'Значение', 'Комментарий'],
          [
            ['Доля комиссий стейкерам (β)', '~10%', 'Может расти через governance'],
            ['Объём стейкинга', '~22%', 'От обращающегося предложения'],
            ['Период анлока команды', 'Q3', 'Линейный вестинг'],
          ],
        ),
        calloutBlock(
          'critical',
          'Критично',
          'Предстоящая разблокировка команды в Q3 может создать заметное давление предложения при недостаточной ликвидности.',
        ),
      ]),
      seo: {
        seoTitle: 'Аудит токеномики STON.fi ($STON) | 8Blocks',
        seoDescription:
          'Публичный аудит токеномики STON.fi: utility, эмиссия, распределение комиссий и риски.',
        noindex: false,
      },
    },
  ]

  for (const audit of auditDefs) {
    try {
      const existing = await payload.find({
        collection: 'public-audits',
        where: { slug: { equals: audit.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'public-audits',
          id: existing.docs[0].id,
          data: {
            ...audit,
            featured: audit.slug === 'hype-tokenomics-audit',
          },
        })
        console.log(`    ↻ Updated audit "${audit.title}"`)
        continue
      }
      await payload.create({
        collection: 'public-audits',
        data: {
          ...audit,
          featured: audit.slug === 'hype-tokenomics-audit',
        },
      })
      console.log(`    + Created audit "${audit.title}"`)
    } catch (err) {
      console.warn(`    ⚠ Failed to create audit "${audit.title}":`, err)
    }
  }

  console.log('✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
