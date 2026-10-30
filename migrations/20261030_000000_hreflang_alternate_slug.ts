import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cases" ADD COLUMN IF NOT EXISTS "seo_alternate_slug" varchar;
    ALTER TABLE "cases" ADD COLUMN IF NOT EXISTS "seo_no_alternates" boolean DEFAULT false;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "seo_alternate_slug" varchar;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "seo_no_alternates" boolean DEFAULT false;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "seo_alternate_slug" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "seo_no_alternates" boolean DEFAULT false;
    ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "seo_alternate_slug" varchar;
    ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "seo_no_alternates" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cases" DROP COLUMN IF EXISTS "seo_alternate_slug";
    ALTER TABLE "cases" DROP COLUMN IF EXISTS "seo_no_alternates";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "seo_alternate_slug";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "seo_no_alternates";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "seo_alternate_slug";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "seo_no_alternates";
    ALTER TABLE "research" DROP COLUMN IF EXISTS "seo_alternate_slug";
    ALTER TABLE "research" DROP COLUMN IF EXISTS "seo_no_alternates";
  `)
}
