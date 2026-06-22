import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- ── Hero scalar columns ────────────────────────────────────────
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_company" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_token_name" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_token_standard" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_project_description" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_site" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_verdict" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_strength" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_weakness" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_letter_rating" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "hero_score" numeric;

  -- ── Expert columns ─────────────────────────────────────────────
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_name" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_role" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_photo_id" integer;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_rating" varchar;

  DO $public_audits_expert_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_expert_photo_id_media_id_fk') THEN
      ALTER TABLE "public_audits" ADD CONSTRAINT "public_audits_expert_photo_id_media_id_fk"
        FOREIGN KEY ("expert_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $public_audits_expert_fk$;
  CREATE INDEX IF NOT EXISTS "public_audits_expert_photo_idx" ON "public_audits" USING btree ("expert_photo_id");

  -- ── Hero metrics array table ──────────────────────────────────
  CREATE TABLE IF NOT EXISTS "public_audits_hero_metrics" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "value" varchar NOT NULL
  );

  DO $public_audits_hero_metrics_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_hero_metrics_parent_id_fk') THEN
      ALTER TABLE "public_audits_hero_metrics" ADD CONSTRAINT "public_audits_hero_metrics_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."public_audits"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $public_audits_hero_metrics_fk$;
  CREATE INDEX IF NOT EXISTS "public_audits_hero_metrics_order_idx" ON "public_audits_hero_metrics" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "public_audits_hero_metrics_parent_id_idx" ON "public_audits_hero_metrics" USING btree ("_parent_id");

  -- ── Rating blocks array table ─────────────────────────────────
  CREATE TABLE IF NOT EXISTS "public_audits_rating_blocks" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "block" varchar NOT NULL,
    "weight" numeric NOT NULL,
    "score_five" numeric NOT NULL
  );

  DO $public_audits_rating_blocks_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_rating_blocks_parent_id_fk') THEN
      ALTER TABLE "public_audits_rating_blocks" ADD CONSTRAINT "public_audits_rating_blocks_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."public_audits"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $public_audits_rating_blocks_fk$;
  CREATE INDEX IF NOT EXISTS "public_audits_rating_blocks_order_idx" ON "public_audits_rating_blocks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "public_audits_rating_blocks_parent_id_idx" ON "public_audits_rating_blocks" USING btree ("_parent_id");

  -- ── Drop legacy fixed metrics columns ─────────────────────────
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

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "public_audits_rating_blocks" CASCADE;
  DROP TABLE IF EXISTS "public_audits_hero_metrics" CASCADE;

  DROP INDEX IF EXISTS "public_audits_expert_photo_idx";
  ALTER TABLE "public_audits" DROP CONSTRAINT IF EXISTS "public_audits_expert_photo_id_media_id_fk";

  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_rating";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_photo_id";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_role";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_name";

  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_score";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_letter_rating";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_weakness";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_strength";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_verdict";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_site";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_project_description";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_token_standard";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_token_name";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "hero_company";

  -- restore legacy metrics columns
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
