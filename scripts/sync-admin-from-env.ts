/**
 * Удаляет всех пользователей Payload и создаёт одного админа из ADMIN_EMAIL / ADMIN_PASSWORD.
 * Остальные данные БД не трогаются. Запуск: NODE_ENV=production npm run sync-admin
 */
import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import configFromFile from '@payload-config'

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL и ADMIN_PASSWORD должны быть заданы в окружении (.env).')
    process.exit(1)
  }

  const config = await Promise.resolve(
    configFromFile as SanitizedConfig | Promise<SanitizedConfig>,
  )
  const payload = await getPayload({ config })

  let removed = 0
  for (;;) {
    const batch = await payload.find({
      collection: 'users',
      limit: 100,
      page: 1,
      depth: 0,
    })
    if (batch.docs.length === 0) break
    for (const doc of batch.docs) {
      await payload.delete({
        collection: 'users',
        id: doc.id,
      })
      removed += 1
    }
  }

  if (removed > 0) {
    console.log(`🗑️  Удалено пользователей: ${removed}`)
  }

  await payload.create({
    collection: 'users',
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  })
  console.log(`✅ Создан новый админ: ${adminEmail}`)
  process.exit(0)
}

main().catch((e: Error) => {
  console.error('❌ sync-admin:', e.message)
  process.exit(1)
})
