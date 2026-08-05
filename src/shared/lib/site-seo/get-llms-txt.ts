import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/shared/config/site'
import { lang, t } from '@/shared/i18n'
import { getBlogEnabled } from '@/shared/lib/getBlogEnabled'
import { getResearchEnabled } from '@/shared/lib/getResearchEnabled'
import { getPublicAuditsEnabled } from '@/shared/lib/getPublicAuditsEnabled'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'
import { visiblePublishedResearchWhere } from '@/shared/lib/visible-research-where'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'

const BASE = siteConfig.url.replace(/\/$/, '')

function oneLine(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.replace(/\s+/g, ' ').trim()
  return trimmed.length > 220 ? `${trimmed.slice(0, 217)}…` : trimmed
}

function link(title: string, path: string, description: string): string {
  const desc = description ? `: ${description}` : ''
  return `- [${title}](${BASE}${path})${desc}`
}

/**
 * llms.txt — a curated, machine-readable map of the site for LLM crawlers
 * (see llmstxt.org). Generated dynamically so it always reflects live content
 * (new audits/articles) and the correct domain/language per deployment.
 */
export const getLlmsTxt = cache(async (): Promise<string> => {
  const brand =
    lang === 'ru'
      ? '8Blocks (токеномика.рф)'
      : BASE.includes('8blocks.ae')
        ? '8Blocks (UAE)'
        : '8Blocks'

  const tagline = t({
    ru: 'Консалтинг по токеномике для Web3-проектов с 2017 года: дизайн токенов, аудиты и стратегия запуска.',
    en: 'Tokenomics consulting for Web3 projects since 2017: token design, audits and launch strategy for 200+ projects.',
  })

  const labels = t({
    ru: { services: 'Услуги', audits: 'Аудиты токеномики (кейсы)', research: 'Исследования', articles: 'Статьи блога', about: 'О компании и контакты' },
    en: { services: 'Services', audits: 'Tokenomics audits (case studies)', research: 'Research', articles: 'Blog articles', about: 'Company & contact' },
  })

  const serviceLinks = t({
    ru: [
      ['/services', 'Услуги'],
      ['/services/tokenomics', 'Дизайн токеномики'],
      ['/services/audit', 'Аудит токеномики'],
      ['/services/strategic-consulting', 'Стратегический консалтинг'],
      ['/product/calculator', 'Калькулятор токеномики'],
    ],
    en: [
      ['/services', 'Services'],
      ['/services/tokenomics', 'Tokenomics Design'],
      ['/services/audit', 'Tokenomics Audit'],
      ['/services/strategic-consulting', 'Strategic Consulting'],
      ['/product/calculator', 'Tokenomics Calculator'],
    ],
  })

  const aboutLinks = t({
    ru: [
      ['/about', 'О компании'],
      ['/contact', 'Контакты'],
      ['/privacy-policy', 'Политика конфиденциальности'],
      ['/terms', 'Условия использования'],
    ],
    en: [
      ['/about', 'About us'],
      ['/contact', 'Contact'],
      ['/privacy-policy', 'Privacy Policy'],
      ['/terms', 'Terms of Service'],
    ],
  })

  const lines: string[] = [`# ${brand}`, '', `> ${tagline}`, '', `## ${labels.services}`]
  for (const [path, title] of serviceLinks) lines.push(link(title, path, ''))
  if (siteConfig.digitalAssetsEnabled) {
    lines.push(
      link(
        t({ ru: 'Стратегия цифровых активов', en: 'Digital Asset Strategy' }),
        '/product/digital-assets',
        t({
          ru: 'Стратегия токенизации реальных активов и структурирования инвестиционных прав.',
          en: 'Digital-asset strategy for real assets and investable rights.',
        }),
      ),
    )
    lines.push(
      link(
        t({ ru: 'Гид владельца', en: "Owner's Guide" }),
        '/product/digital-assets/owners-guide',
        t({
          ru: 'Семь вопросов перед токенизацией актива.',
          en: 'Seven questions to ask before tokenizing an asset.',
        }),
      ),
    )
  }
  lines.push(
    link(
      t({ ru: 'Оценка готовности к токенизации', en: 'Tokenization Readiness Assessment' }),
      '/product/tokenization-readiness',
      t({
        ru: 'Бесплатная оценка по семи вопросам с персональным вердиктом.',
        en: 'Free seven-question assessment with an instant personalized verdict.',
      }),
    ),
    link(
      t({ ru: 'Кейсы токенизации', en: 'Tokenization Case Library' }),
      '/product/tokenization-cases',
      t({
        ru: 'Реальные программы цифровых активов с цифрами и источниками.',
        en: 'Real digital-asset programs with sourced numbers.',
      }),
    ),
    link(
      'Tokenomics AI',
      '/product/tokenomics-ai',
      t({
        ru: 'Ранний доступ к AI-сервису проектирования токеномики.',
        en: 'Early access to an AI-assisted token-model design sprint.',
      }),
    ),
    link(
      t({ ru: 'Бенчмарки аллокаций и вестинга', en: 'Token Vesting Benchmarks' }),
      '/learn/token-vesting-benchmarks',
      t({
        ru: 'Отраслевые диапазоны аллокаций и вестинга с первоисточниками.',
        en: 'Sourced allocation and vesting ranges across leading launches.',
      }),
    ),
  )

  try {
    const payload = await getPayload({ config })
    const [auditsOn, researchOn, blogOn] = await Promise.all([
      getPublicAuditsEnabled(),
      getResearchEnabled(),
      getBlogEnabled(),
    ])

    if (auditsOn) {
      const audits = await payload.find({
        collection: 'public-audits',
        where: visiblePublicAuditWhere,
        limit: 100,
        depth: 0,
        sort: '-featured,-publishedAt',
      })
      if (audits.docs.length) {
        lines.push('', `## ${labels.audits}`)
        for (const d of audits.docs) lines.push(link(oneLine(d.title), `/audits/${d.slug}`, oneLine(d.excerpt)))
      }
    }

    if (researchOn) {
      const research = await payload.find({
        collection: 'research',
        where: visiblePublishedResearchWhere,
        limit: 100,
        depth: 0,
        sort: '-publishedAt',
      })
      if (research.docs.length) {
        lines.push('', `## ${labels.research}`)
        for (const d of research.docs) lines.push(link(oneLine(d.title), `/research/${d.slug}`, oneLine(d.excerpt)))
      }
    }

    if (siteConfig.blogEnabled && blogOn) {
      const articles = await payload.find({
        collection: 'articles',
        where: visiblePublishedArticleWhere,
        limit: 200,
        depth: 0,
        sort: '-publishedAt',
      })
      if (articles.docs.length) {
        lines.push('', `## ${labels.articles}`)
        for (const d of articles.docs) lines.push(link(oneLine(d.title), `/blog/${d.slug}`, oneLine(d.excerpt)))
      }
    }
  } catch {
    // fall through to the static sections already collected
  }

  lines.push('', `## ${labels.about}`)
  for (const [path, title] of aboutLinks) lines.push(link(title, path, ''))
  lines.push('')

  return lines.join('\n')
})
