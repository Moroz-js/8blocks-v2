import * as migration_20260601_000000_initial_schema from './20260601_000000_initial_schema'
import * as migration_20260601_000001_site_seo_workshop_trust_slots from './20260601_000001_site_seo_workshop_trust_slots'
import * as migration_20260601_000002_media_mentions from './20260601_000002_media_mentions'

export const migrations = [
  {
    up: migration_20260601_000000_initial_schema.up,
    down: migration_20260601_000000_initial_schema.down,
    name: '20260601_000000_initial_schema',
  },
  {
    up: migration_20260601_000001_site_seo_workshop_trust_slots.up,
    down: migration_20260601_000001_site_seo_workshop_trust_slots.down,
    name: '20260601_000001_site_seo_workshop_trust_slots',
  },
  {
    up: migration_20260601_000002_media_mentions.up,
    down: migration_20260601_000002_media_mentions.down,
    name: '20260601_000002_media_mentions',
  },
]
