import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_alternate_slug" varchar;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_no_alternates" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "seo_alternate_slug";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "seo_no_alternates";
  `)
}
