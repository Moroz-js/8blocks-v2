import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/** Поле robots.txt в глобале «Глобальное SEO». */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_seo" ADD COLUMN IF NOT EXISTS "robots_txt" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_seo" DROP COLUMN IF EXISTS "robots_txt";
  `)
}
