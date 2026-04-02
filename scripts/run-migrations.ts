import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import configFromFile from '@payload-config'

async function main() {
  const config = await Promise.resolve(
    configFromFile as SanitizedConfig | Promise<SanitizedConfig>,
  )

  const payload = await getPayload({ config })

  console.log('Running pending migrations...')
  await payload.db.migrate()
  console.log('✅ Migrations complete')

  process.exit(0)
}

main().catch((e: Error) => {
  console.error('❌ Migration error:', e.message)
  process.exit(1)
})
