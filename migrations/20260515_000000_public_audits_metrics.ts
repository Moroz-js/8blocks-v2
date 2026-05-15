import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_company_name" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_token_name" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_token_standard" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_fdv" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_mc" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_tvl" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_fees" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_users" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_unlock" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_retail" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_rating" varchar;
    ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "metrics_rating_score" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_company_name";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_token_name";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_token_standard";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_fdv";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_mc";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_tvl";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_fees";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_users";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_unlock";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_retail";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_rating";
    ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "metrics_rating_score";
  `)
}
