/**
 * English seed script for local development.
 * Creates: admin user, categories, articles (published + draft)
 *
 * Usage: npm run seed:en
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
  heading('What is tokenomics', 'h2'),
  paragraph(
    'Tokenomics is the economic architecture of a token: how it is issued, distributed, used, and destroyed. It is not just a set of numbers about supply and allocation — it is an incentive system that governs the behaviour of every participant in the ecosystem.',
  ),
  heading('Why most tokenomics models fail', 'h2'),
  paragraph(
    'The most common mistake is designing tokenomics as a fundraising tool rather than as the economic mechanism of a product. The token is created for the sake of the token, not for the sake of value.',
  ),
  blockquote(
    'A token must generate value for the project throughout its entire existence. That is only possible when you clearly understand why it exists and who needs it.',
  ),
  heading('Key components of sustainable tokenomics', 'h2'),
  paragraph(
    'Sustainable tokenomics is built on three principles: structural linkage to product usage, controlled circulation, and mechanisms that protect against sell pressure.',
  ),
  heading('Emission and distribution', 'h3'),
  paragraph(
    'Well-designed emission determines not only how many tokens will be issued, but also when, to whom, and under what conditions. Vesting schedules, cliff periods, and linear unlocks are tools that directly influence price pressure.',
  ),
  heading('Treasury and reserves', 'h3'),
  paragraph(
    'The treasury is a stability mechanism. A properly structured reserve enables a project to fund development, support liquidity, and respond to market shocks.',
  ),
])

const auditArticleContent = makeRichText([
  heading('Why a tokenomics audit matters', 'h2'),
  paragraph(
    'A tokenomics audit is not just a check of the numbers. It is a systematic analysis of the entire economic architecture of a token: how resilient it is and how it will behave under different growth and crisis scenarios.',
  ),
  heading('What an audit covers', 'h2'),
  paragraph(
    'A full audit covers emission structure, vesting mechanics, distribution logic, utility mechanics, product linkage, resistance to sell pressure, and readiness to scale.',
  ),
  heading('Common tokenomics mistakes', 'h3'),
  paragraph(
    'The most frequent issues are: unbalanced allocation (team and investors receive too large a share with short cliff periods), lack of genuine user demand for the token, and an inflationary model with no burn mechanisms.',
  ),
  blockquote(
    'It is better to identify weaknesses before the token sale than to face them in front of investors or on the open market.',
  ),
])

const strategyArticleContent = makeRichText([
  heading('Strategic consulting in Web3', 'h2'),
  paragraph(
    'Launching a token is not a technical process — it is a strategic one. A successful token market entry requires alignment between the economics, the product, the investment narrative, and the partner ecosystem.',
  ),
  heading('What strategic consulting includes', 'h2'),
  paragraph(
    'Strategic consulting covers token business model development, creation of investor-ready materials, building the partner ecosystem, and TGE preparation. It is a holistic effort where every element connects to the others.',
  ),
  heading('How the partner ecosystem is built', 'h3'),
  paragraph(
    'A proper partner ecosystem includes market makers, marketing partners, smart contract auditors, and strategic investors. Each type of partner fulfils a specific function in the TGE preparation process.',
  ),
])

// ── Seed runner ────────────────────────────────────────────────────────────
async function seed() {
  if (!SEED_ALLOWED) {
    console.error('❌ Seed is not allowed in this environment. Set NODE_ENV=development or SEED_ALLOWED=true.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  console.log('🌱 Starting English seed...')

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
      title: 'Tokenomics',
      slug: 'tokenomics',
      description: 'Design and analysis of token economic models',
      seo: { seoTitle: 'Tokenomics | 8Blocks', seoDescription: 'Articles on tokenomics design for Web3 projects' },
    },
    {
      title: 'Strategy',
      slug: 'strategy',
      description: 'Strategic consulting and TGE preparation',
      seo: { seoTitle: 'Strategy | 8Blocks', seoDescription: 'Materials on strategic planning for token projects' },
    },
    {
      title: 'Audit',
      slug: 'audit',
      description: 'Tokenomics audits and analysis of existing models',
      seo: { seoTitle: 'Tokenomics Audit | 8Blocks', seoDescription: 'Expert analysis and evaluation of token economies' },
    },
    {
      title: 'Web3 Trends',
      slug: 'web3-trends',
      description: 'Trends and developments in the Web3 market',
      seo: { seoTitle: 'Web3 Trends | 8Blocks', seoDescription: 'Latest trends in Web3 and crypto markets' },
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
      title: 'What is tokenomics and why it matters for your project',
      slug: 'what-is-tokenomics',
      excerpt:
        'Tokenomics is not just token distribution. It is the economic architecture that governs the behaviour of every participant in the ecosystem. We break down what it consists of and why most tokenomics models fail.',
      content: tokenomicsArticleContent,
      categoryId: categories['tokenomics'],
      status: 'published' as const,
      publishedAt: days(14),
      seo: {
        seoTitle: 'What is tokenomics | 8Blocks',
        seoDescription:
          'We break down what tokenomics is, what components it consists of, and why most tokenomics models fail after launch.',
        noindex: false,
      },
    },
    {
      title: 'Tokenomics audit: why you need one and when to order it',
      slug: 'tokenomics-audit-why-and-when',
      excerpt:
        'A tokenomics audit is a systematic analysis of a token\'s economic architecture. We explain what is covered during an audit and the most common mistakes found.',
      content: auditArticleContent,
      categoryId: categories['audit'],
      status: 'published' as const,
      publishedAt: days(7),
      seo: {
        seoTitle: 'Tokenomics Audit | 8Blocks',
        seoDescription: 'Why a tokenomics audit is needed and what it covers. Common mistakes and how to avoid them.',
        noindex: false,
      },
    },
    {
      title: 'Strategic consulting for token launch: what you need to know',
      slug: 'strategic-consulting-token-launch',
      excerpt:
        'Launching a token is a strategic process that requires all elements to be aligned. We break down what strategic consulting includes and how it helps you prepare for TGE.',
      content: strategyArticleContent,
      categoryId: categories['strategy'],
      status: 'published' as const,
      publishedAt: days(3),
      seo: {
        seoTitle: 'Strategic Consulting | 8Blocks',
        seoDescription: 'What strategic consulting for a token launch includes and how to prepare for TGE.',
        noindex: false,
      },
    },
    {
      title: 'Vesting and cliff: how the unlock schedule affects token price',
      slug: 'vesting-cliff-unlock-price',
      excerpt:
        'A poorly configured vesting schedule is one of the main causes of post-TGE price pressure. We explain the principles behind a proper unlock structure.',
      content: makeRichText([
        heading('What vesting is and why it matters', 'h2'),
        paragraph(
          'Vesting is the mechanism for gradually unlocking tokens for the team, investors, and other participants. Its purpose is to align the long-term interests of token holders with the fate of the project.',
        ),
        heading('Cliff: the waiting period before unlocking begins', 'h3'),
        paragraph(
          'A cliff is the period between receiving an allocation and the start of unlocking. The standard cliff for a team is 12 months. Without a cliff, the team can sell tokens immediately after TGE.',
        ),
      ]),
      categoryId: categories['tokenomics'],
      status: 'published' as const,
      publishedAt: days(21),
      seo: {
        seoTitle: 'Token Vesting and Cliff | 8Blocks',
        seoDescription: 'How vesting structure affects token price and post-TGE sell pressure.',
        noindex: false,
      },
    },
    {
      title: 'RWA tokenisation: new opportunities and risks',
      slug: 'rwa-tokenisation-opportunities-risks',
      excerpt:
        'Real World Assets (RWA) is one of the fastest-growing segments of Web3. We break down what it is and how to properly design tokenomics for RWA projects.',
      content: makeRichText([
        heading('What RWA tokenisation is', 'h2'),
        paragraph(
          'RWA (Real World Assets) refers to the tokenisation of real-world assets: real estate, bonds, commodities, and art. This makes illiquid assets accessible to a broad range of investors.',
        ),
        blockquote('Asset tokenisation changes the rules of the game: any asset with a stable cash flow can become a token.'),
      ]),
      categoryId: categories['web3-trends'],
      status: 'published' as const,
      publishedAt: days(30),
      seo: {
        seoTitle: 'RWA Tokenisation | 8Blocks',
        seoDescription: 'What RWA tokenisation is and how to design tokenomics for real-world asset projects.',
        noindex: false,
      },
    },
    // Draft article — should NOT appear on frontend
    {
      title: 'Treasury management: how to manage project reserves (draft)',
      slug: 'treasury-management-reserves',
      excerpt: 'Treasury management is a critically important aspect of a project\'s long-term sustainability. Article in progress.',
      content: makeRichText([
        paragraph('Article in progress. Coming soon.'),
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
      name: 'James Carter',
      email: 'james@defi-protocol.io',
      message: 'We are interested in developing tokenomics for our DeFi protocol. Happy to discuss the details.',
      source: 'homepage',
    },
    {
      name: 'Maria Johnson',
      email: 'maria@gamefi-project.io',
      phone: '+1 555 123 4567',
      message: 'We are building a GameFi project and need help designing the token economy. Looking for strategic consulting.',
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

  console.log('✅ English seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
