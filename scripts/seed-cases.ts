import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import configFromFile from '@payload-config'
import { cases as ruCases } from '../src/shared/content/ru/casesPage'
import { cases as enCases } from '../src/shared/content/en/casesPage'

function createSlug(index: number): string {
  return `legacy-case-${String(index + 1).padStart(2, '0')}`
}

async function main() {
  const language = process.env.NEXT_PUBLIC_LANG === 'en' ? 'en' : 'ru'

  const legacyCases = language === 'ru' ? ruCases : enCases
  const config = await Promise.resolve(
    configFromFile as SanitizedConfig | Promise<SanitizedConfig>,
  )
  const payload = await getPayload({ config })
  let created = 0
  let skipped = 0

  for (const [index, legacyCase] of legacyCases.entries()) {
    const slug = createSlug(index)
    const sortOrder = index + 1
    const existing = await payload.find({
      collection: 'cases',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.totalDocs > 0) {
      const existingCase = existing.docs[0]
      const updates: {
        overview?: { industry: typeof legacyCase.tag }
        sortOrder?: number
      } = {}
      if (!existingCase.overview?.industry) {
        updates.overview = { industry: legacyCase.tag }
      }
      if (existingCase.sortOrder !== sortOrder) {
        updates.sortOrder = sortOrder
      }
      if (Object.keys(updates).length > 0) {
        await payload.update({
          collection: 'cases',
          id: existingCase.id,
          data: updates,
        })
      }
      skipped += 1
      continue
    }

    await payload.create({
      collection: 'cases',
      data: {
        title: legacyCase.title,
        slug,
        format: 'mini',
        sortOrder,
        overview: { industry: legacyCase.tag },
        task: legacyCase.task,
        solution: {
          stepOne: legacyCase.actions[0] ?? '',
          stepTwo: legacyCase.actions[1] ?? '',
          stepThree: legacyCase.actions[2] ?? '',
        },
        result: { summary: legacyCase.result },
        status: 'published',
        hidden: false,
      },
    })
    created += 1
  }

  console.log(
    `Cases seed (${language}) complete: ${created} created, ${skipped} already existed.`,
  )
}

main().catch((error: unknown) => {
  console.error('Cases seed failed:', error)
  process.exit(1)
})
