import * as migration_20260601_000000_initial_schema from './20260601_000000_initial_schema'
import * as migration_20260601_000001_site_seo_workshop_trust_slots from './20260601_000001_site_seo_workshop_trust_slots'
import * as migration_20260601_000002_media_mentions from './20260601_000002_media_mentions'
import * as migration_20260514_000000_public_audits from './20260514_000000_public_audits'
import * as migration_20260515_000000_public_audits_metrics from './20260515_000000_public_audits_metrics'
import * as migration_20260520_000000_public_audits_hidden from './20260520_000000_public_audits_hidden'
import * as migration_20260521_000000_articles_hidden from './20260521_000000_articles_hidden'
import * as migration_20260610_000000_research from './20260610_000000_research'
import * as migration_20260611_000000_research_card_text from './20260611_000000_research_card_text'
import * as migration_20260615_000000_site_seo_robots_txt from './20260615_000000_site_seo_robots_txt'
import * as migration_20260621_000000_public_audits_redesign from './20260621_000000_public_audits_redesign'
import * as migration_20260713_000000_authors from './20260713_000000_authors'
import * as migration_20260713_000001_launch_modules from './20260713_000001_launch_modules'
import * as migration_20260714_000000_multiple_authors from './20260714_000000_multiple_authors'
import * as migration_20260714_000001_download_cta from './20260714_000001_download_cta'

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
  {
    up: migration_20260610_000000_research.up,
    down: migration_20260610_000000_research.down,
    name: '20260610_000000_research',
  },
  {
    up: migration_20260611_000000_research_card_text.up,
    down: migration_20260611_000000_research_card_text.down,
    name: '20260611_000000_research_card_text',
  },
  {
    up: migration_20260615_000000_site_seo_robots_txt.up,
    down: migration_20260615_000000_site_seo_robots_txt.down,
    name: '20260615_000000_site_seo_robots_txt',
  },
  {
    up: migration_20260621_000000_public_audits_redesign.up,
    down: migration_20260621_000000_public_audits_redesign.down,
    name: '20260621_000000_public_audits_redesign',
  },
  {
    up: migration_20260713_000000_authors.up,
    down: migration_20260713_000000_authors.down,
    name: '20260713_000000_authors',
  },
  {
    up: migration_20260713_000001_launch_modules.up,
    down: migration_20260713_000001_launch_modules.down,
    name: '20260713_000001_launch_modules',
  },
  {
    up: migration_20260714_000000_multiple_authors.up,
    down: migration_20260714_000000_multiple_authors.down,
    name: '20260714_000000_multiple_authors',
  },
  {
    up: migration_20260714_000001_download_cta.up,
    down: migration_20260714_000001_download_cta.down,
    name: '20260714_000001_download_cta',
  },
]
