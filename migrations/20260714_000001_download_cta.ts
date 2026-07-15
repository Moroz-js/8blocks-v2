import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Группа cta (текст, кнопка, файл, email-гейт) в articles и research.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- ── Articles ────────────────────────────────────────────────────
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "cta_text" varchar;
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "cta_button_label" varchar;
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "cta_file_id" integer;
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "cta_require_email" boolean DEFAULT false;
  DO $articles_cta_file_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_cta_file_id_media_id_fk') THEN
      ALTER TABLE "articles" ADD CONSTRAINT "articles_cta_file_id_media_id_fk"
        FOREIGN KEY ("cta_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $articles_cta_file_fk$;
  CREATE INDEX IF NOT EXISTS "articles_cta_cta_file_idx" ON "articles" USING btree ("cta_file_id");

  -- ── Research ────────────────────────────────────────────────────
  ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "cta_text" varchar;
  ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "cta_button_label" varchar;
  ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "cta_file_id" integer;
  ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "cta_require_email" boolean DEFAULT false;
  DO $research_cta_file_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_cta_file_id_media_id_fk') THEN
      ALTER TABLE "research" ADD CONSTRAINT "research_cta_file_id_media_id_fk"
        FOREIGN KEY ("cta_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $research_cta_file_fk$;
  CREATE INDEX IF NOT EXISTS "research_cta_cta_file_idx" ON "research" USING btree ("cta_file_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "articles_cta_cta_file_idx";
  ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_cta_file_id_media_id_fk";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "cta_text";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "cta_button_label";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "cta_file_id";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "cta_require_email";

  DROP INDEX IF EXISTS "research_cta_cta_file_idx";
  ALTER TABLE "research" DROP CONSTRAINT IF EXISTS "research_cta_file_id_media_id_fk";
  ALTER TABLE "research" DROP COLUMN IF EXISTS "cta_text";
  ALTER TABLE "research" DROP COLUMN IF EXISTS "cta_button_label";
  ALTER TABLE "research" DROP COLUMN IF EXISTS "cta_file_id";
  ALTER TABLE "research" DROP COLUMN IF EXISTS "cta_require_email";
  `)
}
