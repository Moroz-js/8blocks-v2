import * as migration_20260601_000000_initial_schema from './20260601_000000_initial_schema'
import * as migration_20260601_000001_site_seo_workshop_trust_slots from './20260601_000001_site_seo_workshop_trust_slots'
import * as migration_20260601_000002_media_mentions from './20260601_000002_media_mentions'
import * as migration_20260514_000000_public_audits from './20260514_000000_public_audits'
import * as migration_20260515_000000_public_audits_metrics from './20260515_000000_public_audits_metrics'
import * as migration_20260520_000000_public_audits_hidden from './20260520_000000_public_audits_hidden'
import * as migration_20260521_000000_articles_hidden from './20260521_000000_articles_hidden'

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
  {
    up: migration_20260514_000000_public_audits.up,
    down: migration_20260514_000000_public_audits.down,
    name: '20260514_000000_public_audits',
  },
  {
    up: migration_20260515_000000_public_audits_metrics.up,
    down: migration_20260515_000000_public_audits_metrics.down,
    name: '20260515_000000_public_audits_metrics',
  },
  {
    up: migration_20260520_000000_public_audits_hidden.up,
    down: migration_20260520_000000_public_audits_hidden.down,
    name: '20260520_000000_public_audits_hidden',
  },
  {
    up: migration_20260521_000000_articles_hidden.up,
    down: migration_20260521_000000_articles_hidden.down,
    name: '20260521_000000_articles_hidden',
  },
]
