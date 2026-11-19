import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * SEO content fixes from the 2026-10-26 crawl, after the 20261030 hreflang migration.
 * Runs on every instance (EN, AE, RU);
 * each UPDATE matches by slug, so rows that don't exist on an instance are simply skipped.
 *
 * 1. Rich-text links to /blog/<slug> for two pages that live under /cases/<slug> (404 otherwise).
 * 2. hreflang: TiBiTi case has different slugs on the EN and RU sites; events that exist on one
 *    language only get seo.noAlternates so their hreflang stops pointing at 404s.
 */
const CONTENT_TABLES = ['articles', 'research', 'cases', 'public_audits', 'events'] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of CONTENT_TABLES) {
    await db.execute(sql`
      UPDATE ${sql.identifier(table)}
      SET "content" = regexp_replace(
        "content"::text,
        '/blog/(earnpark-weekly-vesting-audit|how-we-built-a-web3-game-that-made-4m-on-day-one)(?=["?#/])',
        '/cases/\\1',
        'g'
      )::jsonb,
      "updated_at" = now()
      WHERE "content"::text ~ '/blog/(earnpark-weekly-vesting-audit|how-we-built-a-web3-game-that-made-4m-on-day-one)(?=["?#/])';
    `)
  }

  await db.execute(sql`
    UPDATE "cases" SET "seo_alternate_slug" = 'tibiti-tokenomika-meta-otelya', "updated_at" = now()
      WHERE "slug" = 'tibiti-meta-hotel-tokenomics'
        AND NULLIF(trim("seo_alternate_slug"), '') IS NULL;
    UPDATE "cases" SET "seo_alternate_slug" = 'tibiti-meta-hotel-tokenomics', "updated_at" = now()
      WHERE "slug" = 'tibiti-tokenomika-meta-otelya'
        AND NULLIF(trim("seo_alternate_slug"), '') IS NULL;
    UPDATE "events" SET "seo_no_alternates" = true, "updated_at" = now()
      WHERE "slug" IN (
        'running-hackathon-v02',
        'token2049-show-hottest-market-narratives-to-invest-in',
        'what-will-bring-300b-in-capital-from-usd-backed-stablecoins-back-into-defi',
        'open-board-web3-leaders-meeting-point',
        'iv-forum-tsifrovye-finansy-2026'
      )
      AND "seo_no_alternates" IS DISTINCT FROM true
      AND NULLIF(trim("seo_alternate_slug"), '') IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Link rewrites are not reverted: the old /blog/ URLs were 404s.
  await db.execute(sql`
    UPDATE "cases" SET "seo_alternate_slug" = NULL
      WHERE "slug" IN ('tibiti-meta-hotel-tokenomics', 'tibiti-tokenomika-meta-otelya');
    UPDATE "events" SET "seo_no_alternates" = false
      WHERE "slug" IN (
        'running-hackathon-v02',
        'token2049-show-hottest-market-narratives-to-invest-in',
        'what-will-bring-300b-in-capital-from-usd-backed-stablecoins-back-into-defi',
        'open-board-web3-leaders-meeting-point',
        'iv-forum-tsifrovye-finansy-2026'
      );
  `)
}
