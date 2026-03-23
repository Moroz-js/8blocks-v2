const path = require('path')

async function main() {
  const { getPayload } = require('payload')
  const configPath = path.resolve(__dirname, '../payload.config.ts')
  const mod = require(configPath)
  const config = await (mod.default || mod)

  const payload = await getPayload({ config })

  console.log('Running pending migrations...')
  await payload.db.migrate({ payload })
  console.log('✅ Migrations complete')

  process.exit(0)
}

main().catch((e) => {
  console.error('❌ Migration error:', e.message)
  process.exit(1)
})
