/**
 * Синхронизирует первого пользователя Payload с ADMIN_EMAIL / ADMIN_PASSWORD из .env.
 * Не трогает остальные данные БД. Запуск на сервере: NODE_ENV=production npm run sync-admin
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

  const existingByEmail = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (existingByEmail.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: existingByEmail.docs[0].id,
      data: { password: adminPassword },
    })
    console.log(`✅ Пароль обновлён для пользователя ${adminEmail}`)
    process.exit(0)
  }

  const oldest = await payload.find({
    collection: 'users',
    limit: 1,
    sort: 'createdAt',
  })

  if (oldest.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    })
    console.log(`✅ Создан админ: ${adminEmail} (пользователей не было)`)
    process.exit(0)
  }

  await payload.update({
    collection: 'users',
    id: oldest.docs[0].id,
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  })
  console.log(`✅ Обновлены email и пароль у самого раннего пользователя → ${adminEmail}`)
  process.exit(0)
}

main().catch((e: Error) => {
  console.error('❌ sync-admin:', e.message)
  process.exit(1)
})
