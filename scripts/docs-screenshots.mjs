/**
 * Скриншоты для страницы /staging-docs/audits-guide.
 *
 * Снимает пары «поле в админке → результат на сайте» по одному эталонному аудиту.
 * Блоки внутри контента ищутся по опорному тексту, чтобы админка и сайт показывали
 * один и тот же фрагмент.
 *
 * Запуск: node scripts/docs-screenshots.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const BASE = process.env.DOCS_BASE_URL || 'http://localhost:3000'
const AUDIT_ID = process.env.DOCS_AUDIT_ID || '3'
const AUDIT_SLUG = process.env.DOCS_AUDIT_SLUG || 'hype-tokenomics-audit'
const OUT_DIR = path.resolve('public/staging-docs/audits-guide')
const MAX_HEIGHT = 1400

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function readEnv() {
  const raw = fs.readFileSync('.env', 'utf8')
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]),
  )
}

async function login(page) {
  const env = readEnv()
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle2' })
  if (page.url().includes('/login')) {
    await page.waitForSelector('#field-email', { timeout: 20000 })
    await page.type('#field-email', env.ADMIN_EMAIL)
    await page.type('#field-password', env.ADMIN_PASSWORD)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
      page.click('button[type="submit"]'),
    ])
  }
}

/** Помечает первый элемент, чей текст или значения полей содержат needle. */
async function markTarget(page, selector, needle) {
  return page.evaluate(
    (sel, text) => {
      document.querySelectorAll('[data-docs-target]').forEach((el) => el.removeAttribute('data-docs-target'))
      const nodes = Array.from(document.querySelectorAll(sel))
      const hit = nodes.find((node) => {
        if (!text) return true
        const values = Array.from(node.querySelectorAll('input, textarea'))
          .map((input) => input.value ?? '')
          .join(' ')
        return `${node.textContent ?? ''} ${values}`.includes(text)
      })
      if (hit) hit.setAttribute('data-docs-target', '1')
      return Boolean(hit)
    },
    selector,
    needle,
  )
}

/** Скриншот элемента; липкие панели прячутся, слишком длинные блоки обрезаются. */
async function shot(page, selector, name, { needle = '', maxHeight = MAX_HEIGHT } = {}) {
  const found = await markTarget(page, selector, needle)
  if (!found) {
    console.warn(`SKIP ${name}: не найден ${selector} ${needle ? `(${needle})` : ''}`)
    return false
  }
  const el = await page.$('[data-docs-target="1"]')
  await el.evaluate((node, limit) => {
    node.scrollIntoView({ block: 'center' })
    for (const other of document.querySelectorAll('body *')) {
      const pos = getComputedStyle(other).position
      if ((pos === 'sticky' || pos === 'fixed') && !other.contains(node) && !node.contains(other)) {
        other.setAttribute('data-docs-hidden', '1')
        other.style.visibility = 'hidden'
      }
    }
    if (node.getBoundingClientRect().height > limit) {
      node.setAttribute('data-docs-clamped', '1')
      node.style.maxHeight = `${limit}px`
      node.style.overflow = 'hidden'
    }
  }, maxHeight)
  await sleep(600)

  const box = await el.boundingBox()
  if (!box || box.width < 40 || box.height < 20) {
    console.warn(`SKIP ${name}: пустой bounding box`)
    return false
  }
  await el.screenshot({ path: path.join(OUT_DIR, `${name}.png`) })

  const clamped = await el.evaluate((node) => {
    const was = node.hasAttribute('data-docs-clamped')
    node.style.maxHeight = ''
    node.style.overflow = ''
    node.removeAttribute('data-docs-clamped')
    document.querySelectorAll('[data-docs-hidden]').forEach((other) => {
      other.style.visibility = ''
      other.removeAttribute('data-docs-hidden')
    })
    return was
  })
  console.log(`OK ${name}.png (${Math.round(box.width)}x${Math.round(box.height)})${clamped ? ' [обрезан]' : ''}`)
  return true
}

/** Раскрывает свёрнутые группы, массивы и блоки редактора. */
async function expandAll(page) {
  for (let pass = 0; pass < 8; pass += 1) {
    const opened = await page.evaluate(() => {
      const toggles = Array.from(
        document.querySelectorAll(
          '.collapsible--collapsed .collapsible__toggle, button.collapsible__toggle[aria-expanded="false"], [class*="collapsible--collapsed"] button[class*="toggle"]',
        ),
      )
      toggles.forEach((btn) => btn.click())
      return toggles.length
    })
    if (opened === 0) break
    await sleep(1000)
  }
}

const BLOCK = (type) => `.LexicalEditorTheme__block-${type}`
const SITE = (name) => `[class*="RichText"][class*="${name}"]`

/** Пары: [имя, селектор в админке, селектор на сайте, опорный текст]. */
const CONTENT_PAIRS = [
  ['chart-row', BLOCK('chartRow'), SITE('chartRow'), 'Распределение Genesis'],
  ['table', BLOCK('auditTable'), SITE('tableWrap'), 'Особенность'],
  ['metric-strip', BLOCK('metricStrip'), SITE('metricStrip'), 'Старт торгов'],
  ['checklist', BLOCK('checklist'), SITE('checklistCard'), 'устойчивость к давлению airdrops'],
  ['stat-columns', BLOCK('statColumns'), SITE('statColumns'), 'Торговые комиссии'],
  ['info-columns', BLOCK('infoColumns'), SITE('infoColumns'), 'годовые награды'],
  ['numbered-notes', BLOCK('numberedNotes'), SITE('numberedNotes'), 'onchain perpetuals'],
]

async function adminShots(page) {
  await login(page)
  await page.goto(`${BASE}/admin/collections/public-audits/${AUDIT_ID}`, { waitUntil: 'networkidle2' })
  await page.waitForSelector('#field-title', { timeout: 30000 })
  await sleep(5000)
  await expandAll(page)

  await page.evaluate(() => {
    const first = document.querySelector('#field-title')?.closest('.field-type')
    const cover = document.querySelector('#field-cover')
    if (!first || !cover || document.querySelector('#docs-basics-wrap')) return
    const wrap = document.createElement('div')
    wrap.id = 'docs-basics-wrap'
    first.parentNode.insertBefore(wrap, first)
    let node = first
    while (node) {
      const next = node.nextElementSibling
      wrap.appendChild(node)
      if (node === cover || node.contains(cover)) break
      node = next
    }
  })

  await shot(page, '#docs-basics-wrap', 'admin-basics')
  await shot(page, '#field-hero', 'admin-hero')
  await shot(page, '#field-heroMetrics', 'admin-hero-metrics')
  await shot(page, '#field-ratingBlocks', 'admin-rating-blocks')
  await shot(page, '#field-expert', 'admin-expert')
  await shot(page, '#field-seo', 'admin-seo')

  for (const [name, adminSelector, , needle] of CONTENT_PAIRS) {
    await shot(page, adminSelector, `admin-${name}`, { needle })
  }
}

async function siteShots(page) {
  await page.goto(`${BASE}/audits/${AUDIT_SLUG}`, { waitUntil: 'networkidle2' })
  await sleep(4000)
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await sleep(2000)

  await shot(page, '[class*="AuditHero"][class*="__hero"]', 'site-hero')
  await shot(page, '[class*="AuditHero"][class*="metricsBand"]', 'site-hero-metrics')
  await shot(page, '[class*="AuditTakeaways"][class*="__root"]', 'site-takeaways')
  await shot(page, '[class*="AuditToc"]', 'site-toc')
  await shot(page, '[class*="AuditRating"][class*="radarWrap"]', 'site-rating-radar')
  await shot(page, '[class*="AuditRating"][class*="tableWrap"]', 'site-rating-table')
  await shot(page, '[class*="AuditRating"][class*="expertRow"]', 'site-expert')

  for (const [name, , siteSelector, needle] of CONTENT_PAIRS) {
    await shot(page, siteSelector, `site-${name}`, { needle })
  }

  await page.goto(`${BASE}/audits`, { waitUntil: 'networkidle2' })
  await sleep(3000)
  await shot(page, 'article, [class*="PublicAuditCard"], [class*="card"]', 'site-card', {
    needle: 'Hyperliquid',
  })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1500, height: 1000, deviceScaleFactor: 2 },
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  try {
    await siteShots(page)
    await adminShots(page)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
