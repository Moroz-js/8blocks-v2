/**
 * Blog seed for frontend review.
 * Creates: 4 categories + 10 published articles (rich content, ToC-ready) + 1 draft
 *
 * Usage:  npm run seed:blog
 * Only runs in development or when SEED_ALLOWED=true.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const SEED_ALLOWED =
  process.env.NODE_ENV === 'development' || process.env.SEED_ALLOWED === 'true'

// ── Rich-text builders ────────────────────────────────────────────────────────

function root(children: object[]) {
  return { root: { type: 'root', children, direction: null, format: '', indent: 0, version: 1 } }
}

function p(text: string) {
  return { type: 'paragraph', children: [{ type: 'text', text, version: 1 }], direction: null, format: '', indent: 0, version: 1 }
}

function h(tag: 'h2' | 'h3', text: string) {
  return { type: 'heading', tag, children: [{ type: 'text', text, version: 1 }], direction: null, format: '', indent: 0, version: 1 }
}

function quote(text: string) {
  return { type: 'quote', children: [{ type: 'text', text, version: 1 }], direction: null, format: '', indent: 0, version: 1 }
}

// ── Article content ───────────────────────────────────────────────────────────

const c_tokenomics_fundamentals = root([
  h('h2', 'What is tokenomics'),
  p('Tokenomics is the economic architecture of a token: how it is issued, distributed, used, and destroyed. It is not just a set of numbers about supply and allocation — it is a system of incentives that determines the behaviour of every participant in the ecosystem.'),
  p('A well-designed tokenomics model creates a self-reinforcing loop: users need the token to access value, and the project benefits from increasing demand. A poorly designed one creates selling pressure that undermines everything else.'),
  h('h2', 'Why most tokenomics fail'),
  p('The most common mistake is designing tokenomics as a fundraising tool rather than as an economic mechanism for the product. The token is created for the sake of the token, not for value.'),
  quote('A token must generate value for the project throughout its entire existence. This is only possible when you clearly understand why it exists and who needs it.'),
  p('Projects that treat their token purely as a fundraising vehicle tend to see a predictable pattern: strong initial price action, followed by sustained sell pressure as early investors unlock, ending in a token that trades far below its issuance price.'),
  h('h2', 'Key components of sustainable tokenomics'),
  p('Sustainable tokenomics is built on three principles: structural alignment with product usage, controlled circulation, and mechanisms to protect against selling pressure.'),
  h('h3', 'Emission and distribution'),
  p('A correctly designed emission schedule determines not only how many tokens will be issued, but when, to whom, and on what terms. Vesting, cliffs, and linear distribution are tools that affect price pressure. The schedule should be public and verifiable on-chain.'),
  h('h3', 'Treasury and reserves'),
  p('Treasury is the mechanism of sustainability. A properly structured reserve allows the project to fund development, maintain liquidity, and respond to market shocks. Projects that deplete their treasury within the first 18 months rarely survive bear markets.'),
  h('h3', 'Demand drivers'),
  p('Every token needs genuine demand from users who need it to access the product\'s core value. Without this, any price appreciation is speculative and temporary. Demand drivers can be utility, governance, staking rewards, or burn mechanics — but they must be tied to real product usage.'),
  h('h2', 'Common anti-patterns'),
  p('Inflated team allocations with short cliffs, infinite inflation with no burn mechanism, governance tokens that have no actual governance power, and staking rewards that are paid entirely in new token emissions — these are the anti-patterns that repeat across failed projects.'),
  p('Understanding these failure modes is the first step to avoiding them. The second step is designing a model that is explicitly resistant to each of them.'),
])

const c_audit_guide = root([
  h('h2', 'What is a tokenomics audit'),
  p('A tokenomics audit is a systematic analysis of a token\'s economic architecture: how sustainable it is, how it will behave under different growth and crisis scenarios.'),
  p('Unlike a smart contract audit, which checks code for vulnerabilities, a tokenomics audit examines whether the economic incentives are aligned, whether the distribution is fair, and whether the model can survive real market conditions.'),
  h('h2', 'When to order an audit'),
  p('The best time for a tokenomics audit is before the token sale — when there is still time to make structural changes. An audit after TGE can still provide value, but the options for remediation are much more limited.'),
  quote('Better to find weaknesses before the token sale than to face them in front of investors or on the open market.'),
  h('h2', 'What an audit covers'),
  p('A full audit covers: emission structure, vesting mechanics, distribution logic, utility mechanics, product alignment, resistance to selling pressure, and readiness for scaling.'),
  h('h3', 'Emission structure'),
  p('We examine the total supply, issuance schedule, and inflation/deflation mechanics. Is the supply capped? Are there minting mechanisms? What happens to burned tokens?'),
  h('h3', 'Vesting and distribution'),
  p('Who holds what percentage? When do their tokens unlock? Are team and investor allocations fair relative to ecosystem and community? Is the vesting schedule structured to minimise cliff events?'),
  h('h3', 'Utility mechanics'),
  p('Does the token have genuine utility within the product? Can users access core product features without holding the token? What creates demand beyond speculation?'),
  h('h2', 'Typical audit findings'),
  p('The most frequent issues: unbalanced distribution (team and investors receive too large a share with short cliffs), absence of real user demand for the token, and inflationary models with no burn mechanisms.'),
  h('h3', 'Red flags'),
  p('Anonymous teams with large unlocked allocations, vesting cliffs shorter than one product cycle, staking rewards that exceed token burn rates, and governance tokens with no actual protocol control are all red flags that should be addressed before launch.'),
  h('h2', 'Audit deliverables'),
  p('A professional audit should produce: a written report with specific findings and recommendations, a financial model stress-tested against bear market scenarios, and a prioritised remediation plan.'),
])

const c_strategic_consulting = root([
  h('h2', 'What strategic consulting covers'),
  p('Strategic consulting for token launches covers: token business model development, creation of investor-ready materials, building the partner ecosystem, and preparation for TGE. It is comprehensive work where every element is connected to the others.'),
  h('h2', 'Token business model'),
  p('The token business model answers the fundamental question: why does this token exist and how does it create sustainable value? This is different from the tokenomics document, which answers the technical question of how the token works.'),
  quote('A token without a business model is a certificate of participation in a lottery. A token with a business model is an instrument that captures and redistributes value.'),
  h('h3', 'Revenue capture'),
  p('Does the protocol generate revenue? How does token value capture a share of that revenue? This can be through fee burns, staking rewards from protocol fees, or governance rights over fee allocation — but the link must be explicit and structural.'),
  h('h3', 'Growth mechanics'),
  p('How does the token model incentivise the behaviours that drive protocol growth? User acquisition, liquidity provision, developer contributions, and content creation can all be incentivised with token rewards — but the economics must be sustainable.'),
  h('h2', 'Investor materials'),
  p('Investor-ready materials for a token project include: a tokenomics document, a financial model, a token distribution schedule, a vesting schedule, a deck covering the token thesis, and a legal memo on token classification.'),
  h('h3', 'Financial model'),
  p('The financial model should include multiple scenarios: base case, bull case, and bear case. Each scenario should model token demand, circulating supply, and implied price at different levels of protocol adoption.'),
  h('h2', 'Partner ecosystem'),
  p('A proper partner ecosystem includes market makers, marketing partners, smart contract auditors, and strategic investors. Each type of partner performs its function in TGE preparation.'),
  h('h3', 'Market makers'),
  p('Market makers provide liquidity on exchanges after listing. Selecting the right market maker — and structuring the agreement correctly — is critical to post-listing price stability.'),
  h('h3', 'Strategic investors'),
  p('The right strategic investors bring more than capital: they bring distribution, credibility, and domain expertise. A strategic investor with a portfolio of 50 relevant projects is worth more than a financial investor with the same ticket size.'),
  h('h2', 'TGE preparation'),
  p('TGE preparation includes: exchange selection and listing application, liquidity strategy, launch marketing, community building, and coordination of all partners on launch day. Preparation typically begins 6-9 months before the planned launch date.'),
])

const c_vesting_cliff = root([
  h('h2', 'What is vesting and why it matters'),
  p('Vesting is the mechanism of gradual token unlocking for teams, investors, and other participants. Its purpose is to align the long-term interests of token holders with the fate of the project.'),
  p('Without vesting, nothing stops early participants from selling their entire allocation immediately after TGE. This creates massive selling pressure at exactly the moment when the project needs price stability most.'),
  h('h2', 'Cliff: the waiting period before unlocking begins'),
  p('A cliff is the period between receiving an allocation and the start of unlocking. The standard cliff for teams is 12 months. Without a cliff, the team can sell tokens immediately after TGE.'),
  quote('The cliff period is the single most important signal about a team\'s conviction in their own project. A team that insists on no cliff is telling you something important.'),
  h('h3', 'Cliff best practices'),
  p('For teams: minimum 12-month cliff, 36-48 month total vesting. For seed investors: 6-12 month cliff, 24 month total vesting. For public sale participants: no cliff or 1-3 month cliff is typical. Advisors should have a 12-month cliff with 24-month linear vesting.'),
  h('h2', 'Linear vs cliff unlocking'),
  p('Linear unlocking means a fixed percentage of tokens is released each month after the cliff. This creates predictable, manageable sell pressure. Non-linear schedules — such as large cliff events followed by linear release — create predictable sell pressure spikes that sophisticated traders arbitrage.'),
  h('h3', 'Cliff events and price impact'),
  p('Every vesting cliff is a known date when a large number of tokens become liquid. These events are tracked by the entire market. Projects with poorly structured vesting often see significant price declines in the weeks before major cliff events as traders position short.'),
  h('h2', 'Treasury vesting'),
  p('Treasury tokens should also have vesting — or at minimum, an explicit governance process required before they can be spent. Unconstrained treasury access is a governance risk and a price risk.'),
  h('h2', 'Modelling vesting impact'),
  p('Every tokenomics model should include a circulating supply schedule that shows the exact amount of tokens that will be liquid at each point in time. This schedule should be public and verifiable. The circulating supply schedule is one of the most important inputs to any financial model of a token project.'),
])

const c_rwa_tokenisation = root([
  h('h2', 'What is RWA tokenisation'),
  p('RWA (Real World Assets) tokenisation is the process of representing ownership of real-world assets — real estate, bonds, commodities, art, private credit — as tokens on a blockchain. This makes traditionally illiquid assets accessible to a global pool of investors.'),
  quote('Tokenisation of assets changes the rules of the game: any asset with a stable cash flow can become a token.'),
  h('h2', 'Why RWA is growing'),
  p('The RWA sector has grown from near zero to tens of billions in TVL in under three years. The primary driver is yield: in a period of elevated interest rates, tokenised US Treasuries and private credit offer yields that DeFi cannot match without accepting protocol risk.'),
  h('h3', 'Institutional demand'),
  p('Institutional investors are increasingly comfortable with blockchain infrastructure, but require the legal clarity and regulatory compliance that comes with tokenised traditional assets. RWA bridges their existing investment frameworks to blockchain settlement.'),
  h('h2', 'Tokenomics for RWA projects'),
  p('Designing tokenomics for an RWA project requires understanding both traditional finance and blockchain mechanics. The token must represent a legally enforceable claim on the underlying asset, or a governance/utility right over the protocol that manages those assets.'),
  h('h3', 'Asset-backed tokens'),
  p('In the simplest model, each token represents a fractional claim on a specific asset. The tokenomics are relatively straightforward: supply is constrained by the total value of the underlying asset, yield flows to token holders, and redemption is possible under defined conditions.'),
  h('h3', 'Protocol tokens for RWA platforms'),
  p('More complex are the governance or utility tokens of platforms that manage RWA. These tokens must capture value from the platform\'s growth — typically through fees on assets under management — while maintaining regulatory compliance.'),
  h('h2', 'Key risks in RWA tokenisation'),
  p('Legal risk is the most significant: the tokenised claim must be enforceable in the jurisdiction where the underlying asset exists. Regulatory risk is also significant, as many jurisdictions classify tokenised securities under existing securities law. Liquidity risk is structural: even if the token is liquid on-chain, the underlying asset may not be.'),
])

const c_treasury_management = root([
  h('h2', 'Why treasury management matters'),
  p('Treasury is the lifeblood of a crypto project between the token sale and sustainable protocol revenue. A poorly managed treasury can destroy a project even if the technology is sound and the community is strong.'),
  h('h2', 'Treasury composition'),
  p('Most project treasuries hold a mix of their native token and stablecoins. The optimal composition depends on the project\'s burn rate, time horizon, and risk tolerance. As a rule, a project should hold at least 24 months of operating runway in stablecoins, regardless of the native token\'s price.'),
  h('h3', 'Diversification strategy'),
  p('Projects that hold 95%+ of their treasury in their native token are making a bet that their token price will remain stable or increase. In practice, this means that a bear market halves their treasury at exactly the moment when they most need stability.'),
  quote('The right time to diversify your treasury is when your token price is high, not when you desperately need stablecoins.'),
  h('h2', 'Treasury governance'),
  p('Who has authority to spend from the treasury? Under what conditions? With what oversight? These questions must be answered in advance and encoded in governance rules. Discretionary treasury spending by anonymous multisig signers is a major governance risk.'),
  h('h3', 'Multisig configuration'),
  p('Standard treasury multisig configuration for a well-governed project: 5-of-9 multisig with known, doxxed signers representing different stakeholder groups (team, investors, community). Large transactions should require a time-lock of at least 48 hours after proposal and approval.'),
  h('h2', 'Treasury investment policy'),
  p('Some treasuries generate yield by deploying stablecoins into DeFi protocols. This is legitimate but requires an explicit investment policy: which protocols are approved, what concentration limits apply, and what risk controls are in place.'),
  h('h2', 'Reporting and transparency'),
  p('Treasury balances and transactions should be public, on-chain, and reported in regular governance updates. Projects that are opaque about treasury management are asking their communities to trust without the ability to verify.'),
])

const c_gamefi_tokenomics = root([
  h('h2', 'The unique challenge of GameFi tokenomics'),
  p('GameFi has produced some of the most spectacular tokenomics failures in crypto history — and a few genuine successes. The difference between success and failure often comes down to a single question: is the game fun to play without the financial incentive?'),
  h('h2', 'Play-to-earn vs play-and-earn'),
  p('The "play-to-earn" model attracted millions of players in 2021-2022, but it had a fatal flaw: most players were playing for the earn, not for the play. When token prices fell, the incentive to play disappeared, and the games collapsed.'),
  quote('"Play-and-earn" is a better framing: a game that is genuinely enjoyable, where token rewards are a bonus, not the primary motivation.'),
  h('h3', 'Sustainable emission'),
  p('GameFi tokens are typically inflationary: new tokens are minted as rewards for playing. Sustainable emission requires that the rate of token creation is matched by the rate of token consumption. Consumption mechanics include: in-game purchases, upgrades, breeding, crafting, and competitive entry fees.'),
  h('h2', 'Dual token models'),
  p('Many successful GameFi projects use dual token models: a governance/value-capture token with fixed or slow emission, and an in-game currency with higher inflation. This separates speculative demand from in-game utility demand.'),
  h('h3', 'Governance token'),
  p('The governance token should have a fixed or slow emission schedule. It captures the long-term value of the protocol. It is what investors hold. Its price should be tied to the success of the game, not to daily in-game activity.'),
  h('h3', 'In-game currency'),
  p('The in-game currency can be highly inflationary, because its demand is driven by gameplay. If the game is engaging, players will spend the currency on in-game goods. If the currency supply grows faster than demand, its value falls — but this doesn\'t directly destroy the governance token.'),
  h('h2', 'NFT integration'),
  p('NFTs in GameFi serve as scarce, tradeable game assets. The tokenomics of the NFT economy must be separate from the token economy. Breeding mechanics, NFT burn mechanics, and NFT staking can all influence the broader token economy.'),
])

const c_defi_protocol_design = root([
  h('h2', 'Token design for DeFi protocols'),
  p('DeFi protocols face a unique tokenomics challenge: they must incentivise liquidity provision, which is capital-intensive and yields no natural demand for the token. The result is that many DeFi tokens are purely inflationary rewards with no fundamental demand.'),
  h('h2', 'The liquidity mining trap'),
  p('Liquidity mining — paying token rewards to liquidity providers — creates artificial TVL that disappears when rewards end. Projects that rely entirely on liquidity mining for their growth metrics are building on sand.'),
  quote('Mercenary capital follows yield, not vision. A protocol that wins users with token rewards will lose them to the next protocol with better token rewards.'),
  h('h3', 'Sticky liquidity'),
  p('Sticky liquidity comes from protocol design, not token incentives. Protocols with unique market positions, first-mover advantages in specific niches, or genuine network effects retain liquidity even when token rewards decline.'),
  h('h2', 'Fee sharing and protocol revenue'),
  p('The most durable DeFi tokenomics are built around protocol fee sharing. When a token captures a percentage of protocol revenue, it has fundamental value that scales with protocol adoption. This creates a virtuous cycle: more usage generates more fees, which drives more demand for the token, which funds further development.'),
  h('h3', 've(3,3) and vote-escrow models'),
  p('Vote-escrow models incentivise token holders to lock their tokens for extended periods in exchange for boosted rewards and governance rights. This reduces circulating supply and aligns long-term holders with protocol health. The ve(3,3) model extends this with game-theoretic elements designed to maximise protocol revenue.'),
  h('h2', 'Governance token design'),
  p('Governance tokens should govern something meaningful. Projects where the governance token controls significant protocol parameters — fee rates, supported assets, liquidity incentives — have a strong case for fundamental value. Projects where governance is purely ceremonial do not.'),
])

const c_web3_market_2025 = root([
  h('h2', 'The state of Web3 tokenomics in 2025'),
  p('The crypto market has matured significantly since the excesses of 2021-2022. Investors are more sophisticated, regulators are more active, and the projects that have survived are generally those with genuine product-market fit.'),
  h('h2', 'Key trends shaping token design'),
  p('Several macro trends are reshaping how tokens are designed in 2025: the rise of real yield as a design principle, increasing regulatory clarity in major jurisdictions, and the growth of institutional participation in both DeFi and TradFi-adjacent projects.'),
  h('h3', 'Real yield'),
  p('Real yield — token rewards paid from protocol revenue rather than token emissions — has become the gold standard for DeFi tokenomics. Protocols that can demonstrate real yield are valued at a significant premium to those that rely on emissions.'),
  h('h3', 'Regulatory clarity'),
  p('The regulatory landscape for tokens has clarified significantly in 2024-2025. Most major jurisdictions have now provided some guidance on token classification. This clarity has enabled a new wave of compliant token launches and has made institutional participation more feasible.'),
  h('h2', 'What investors look for in 2025'),
  p('The bar for institutional investment has risen. Investors now expect: a clear value accrual mechanism for the token, a credible team with relevant experience, audited smart contracts, a transparent treasury management policy, and a realistic path to protocol revenue that justifies the token valuation.'),
  h('h3', 'Valuation frameworks'),
  p('DCF-style valuation frameworks have become more common for token projects that generate protocol revenue. Tokens are increasingly valued based on earnings multiples relative to protocol fees, rather than purely on narrative and total addressable market.'),
  h('h2', 'Emerging token models'),
  p('New token models emerging in 2025 include: hybrid governance/revenue tokens that capture both voting rights and fee streams, layered token systems that separate speculation from utility, and tokenised equity-like instruments that blur the line between traditional finance and DeFi.'),
])

const c_staking_design = root([
  h('h2', 'Designing staking mechanics'),
  p('Staking is one of the most powerful tools in the tokenomics toolkit — and one of the most commonly misused. When designed correctly, staking aligns token holder incentives with protocol health. When designed incorrectly, it is simply a mechanism to delay selling pressure.'),
  h('h2', 'Types of staking'),
  p('There are three broad categories of staking: security staking (used in PoS networks to secure consensus), liquidity staking (providing liquidity in exchange for rewards), and governance staking (locking tokens to participate in governance and receive fee distributions).'),
  h('h3', 'Security staking'),
  p('Security staking has the strongest economic justification: validators stake tokens as collateral against misbehaviour. The staking yield compensates validators for operational costs and the opportunity cost of locked capital. This yield must come from somewhere — either protocol fees or token inflation.'),
  h('h3', 'Governance staking'),
  p('Governance staking that distributes protocol fees creates genuine demand for the token. The more the protocol is used, the more fees are generated, the higher the staking yield, the more demand for the token. This is the flywheel that well-designed DeFi protocols aim for.'),
  h('h2', 'Common staking design mistakes'),
  p('The most common mistake is offering high staking yields paid entirely in new token emissions with no corresponding demand driver. This is mathematically equivalent to inflation, and token holders who stake are simply treading water relative to non-stakers.'),
  quote('Staking yields that exceed protocol revenue are paid by non-stakers through dilution. The question is always: where does the yield come from?'),
  h('h3', 'Unsustainable APYs'),
  p('Four-digit APY staking rewards are a red flag. They typically indicate one of two things: the protocol is early and expects usage to catch up (sometimes true), or the token is being used to simulate value through inflationary mechanics (usually the case when those yields persist for more than a few months).'),
  h('h2', 'Lock-up design'),
  p('Longer lock-up periods should yield higher rewards, but the relationship must be calibrated correctly. If the premium for locking for 4 years vs 1 year is too high, it creates awkward incentives for short-term holders. If it is too low, nobody will lock for the longer period.'),
])

// ── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { title: 'Tokenomics',           slug: 'tokenomics',   description: 'Token economic models: design, analysis, and best practices' },
  { title: 'Strategy',             slug: 'strategy',     description: 'Strategic consulting and TGE preparation for Web3 projects' },
  { title: 'Audit',                slug: 'audit',        description: 'Tokenomics audit: methods, findings, and remediation' },
  { title: 'Web3 Trends',          slug: 'web3-trends',  description: 'Market trends and developments in the Web3 ecosystem' },
]


// ── Helpers ───────────────────────────────────────────────────────────────────

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString()
}

// ── Runner ───────────────────────────────────────────────────────────────────

async function seed() {
  if (!SEED_ALLOWED) {
    console.error('❌ Seed not allowed. Set NODE_ENV=development or SEED_ALLOWED=true.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  console.log('🌱  Starting blog seed...\n')

  // ── 1. Categories ──────────────────────────────────────────────────────────
  console.log('📂  Categories...')
  const cats: Record<string, string> = {}

  for (const cat of CATEGORIES) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
    if (existing.docs.length) {
      cats[cat.slug] = existing.docs[0].id as string
      console.log(`    ✓ ${cat.title}`)
      continue
    }
    const created = await payload.create({ collection: 'categories', data: cat })
    cats[cat.slug] = created.id as string
    console.log(`    + ${cat.title}`)
  }

  // ── 2. Articles ────────────────────────────────────────────────────────────
  console.log('\n📝  Articles...')

  const ARTICLES = [
    {
      title:    'Tokenomics fundamentals: why most token economies fail',
      slug:     'tokenomics-fundamentals',
      excerpt:  'Tokenomics is the economic architecture of a token. Understanding its core components — and the most common failure modes — is the foundation of any successful token launch.',
      content:  c_tokenomics_fundamentals,
      cat:      'tokenomics',

      days:     90,
    },
    {
      title:    'The complete guide to tokenomics audits',
      slug:     'complete-guide-tokenomics-audit',
      excerpt:  'A tokenomics audit is a systematic analysis of a token\'s economic architecture. This guide covers what an audit examines, when to order one, and what the deliverables look like.',
      content:  c_audit_guide,
      cat:      'audit',

      days:     75,
    },
    {
      title:    'Strategic consulting for token launches: what matters',
      slug:     'strategic-consulting-token-launches',
      excerpt:  'Launching a token is a strategic process that requires alignment across economics, product, investor materials, and the partner ecosystem. This is what strategic consulting covers.',
      content:  c_strategic_consulting,
      cat:      'strategy',

      days:     60,
    },
    {
      title:    'Vesting and cliff: how unlock schedules affect token price',
      slug:     'vesting-cliff-unlock-schedules',
      excerpt:  'Incorrectly structured vesting is one of the leading causes of post-TGE selling pressure. This article explains the principles of correct unlock schedule design.',
      content:  c_vesting_cliff,
      cat:      'tokenomics',

      days:     50,
    },
    {
      title:    'RWA tokenisation: opportunities and risks',
      slug:     'rwa-tokenisation-opportunities-risks',
      excerpt:  'Real World Assets is one of the fastest-growing segments of Web3. We break down how it works and how to design tokenomics for RWA projects.',
      content:  c_rwa_tokenisation,
      cat:      'web3-trends',

      days:     40,
    },
    {
      title:    'Treasury management: how to protect your project\'s reserves',
      slug:     'treasury-management-crypto-projects',
      excerpt:  'Treasury is the lifeblood of a crypto project between the token sale and sustainable protocol revenue. Here is how to manage it without destroying your project.',
      content:  c_treasury_management,
      cat:      'tokenomics',

      days:     30,
    },
    {
      title:    'GameFi tokenomics: lessons from play-to-earn',
      slug:     'gamefi-tokenomics-lessons',
      excerpt:  'GameFi has produced some of the most spectacular tokenomics failures and genuine successes in crypto. The difference comes down to one question: is the game worth playing without the financial incentive?',
      content:  c_gamefi_tokenomics,
      cat:      'tokenomics',

      days:     22,
    },
    {
      title:    'Token design for DeFi protocols',
      slug:     'token-design-defi-protocols',
      excerpt:  'DeFi protocols face a unique tokenomics challenge: incentivising liquidity without creating mercenary capital. This is how to design tokens that create durable value.',
      content:  c_defi_protocol_design,
      cat:      'tokenomics',

      days:     15,
    },
    {
      title:    'Web3 tokenomics trends in 2025',
      slug:     'web3-tokenomics-trends-2025',
      excerpt:  'The crypto market has matured. Investors are more sophisticated, regulators are clearer, and the projects that survive have genuine product-market fit. Here is what is shaping token design in 2025.',
      content:  c_web3_market_2025,
      cat:      'web3-trends',

      days:     7,
    },
    {
      title:    'Staking mechanics: design principles and common mistakes',
      slug:     'staking-mechanics-design-principles',
      excerpt:  'Staking is one of the most powerful — and most misused — tools in tokenomics. When designed correctly it aligns incentives. When designed incorrectly it is just delayed selling pressure.',
      content:  c_staking_design,
      cat:      'tokenomics',

      days:     3,
    },
    // Draft — must NOT appear on frontend
    {
      title:    'Tokenomics of AI agents: a draft',
      slug:     'tokenomics-ai-agents-draft',
      excerpt:  'Work in progress. Coming soon.',
      content:  root([p('Article in progress.')]),
      cat:      'web3-trends',

      days:     null, // draft
    },
  ]

  for (const a of ARTICLES) {
    const existing = await payload.find({ collection: 'articles', where: { slug: { equals: a.slug } }, limit: 1 })
    if (existing.docs.length) {
      console.log(`    ✓ ${a.title}`)
      continue
    }

    const isDraft = a.days === null

    await payload.create({
      collection: 'articles',
      data: {
        title:       a.title,
        slug:        a.slug,
        excerpt:     a.excerpt,
        content:     a.content,
        category:    cats[a.cat] ?? undefined,
        status:      isDraft ? 'draft' : 'published',
        publishedAt: isDraft ? undefined : daysAgo(a.days as number),
        seo: isDraft
          ? { noindex: true }
          : {
              seoTitle:       `${a.title} | 8Blocks`,
              seoDescription: a.excerpt.slice(0, 155),
              noindex:        false,
            },
      },
    })
    console.log(`    + ${a.title}${isDraft ? ' [draft]' : ''}`)
  }

  console.log('\n✅  Blog seed complete!')
  console.log(`    Categories: ${CATEGORIES.length}`)
  console.log(`    Articles:   ${ARTICLES.length - 1} published + 1 draft`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
