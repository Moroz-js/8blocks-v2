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

  console.log('✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
