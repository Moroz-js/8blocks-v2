import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $enum_cases_status$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cases_status') THEN
        CREATE TYPE "enum_cases_status" AS ENUM('draft', 'published');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cases_service') THEN
        CREATE TYPE "enum_cases_service" AS ENUM('design', 'audit', 'advisory');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cases_format') THEN
        CREATE TYPE "enum_cases_format" AS ENUM('mini', 'full');
      END IF;
    END $enum_cases_status$;

    CREATE TABLE IF NOT EXISTS "cases" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "format" "enum_cases_format" DEFAULT 'full' NOT NULL,
      "overview_industry" varchar,
      "overview_client_goals" varchar,
      "service" "enum_cases_service",
      "cover_id" integer,
      "task" varchar NOT NULL,
      "challenge" varchar,
      "solution_step_one" varchar,
      "solution_step_two" varchar,
      "solution_step_three" varchar,
      "result_summary" varchar,
      "result_metric_value" varchar,
      "result_metric_label" varchar,
      "content" jsonb,
      "related_article_id" integer,
      "status" "enum_cases_status" DEFAULT 'draft' NOT NULL,
      "seo_seo_title" varchar,
      "seo_seo_description" varchar,
      "seo_og_title" varchar,
      "seo_og_description" varchar,
      "seo_og_image_id" integer,
      "seo_noindex" boolean DEFAULT false,
      "published_at" timestamp(3) with time zone,
      "hidden" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "cases_slug_idx" ON "cases" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "cases_cover_idx" ON "cases" USING btree ("cover_id");
    CREATE INDEX IF NOT EXISTS "cases_related_article_idx" ON "cases" USING btree ("related_article_id");
    CREATE INDEX IF NOT EXISTS "cases_seo_og_image_idx" ON "cases" USING btree ("seo_og_image_id");
    CREATE INDEX IF NOT EXISTS "cases_published_at_idx" ON "cases" USING btree ("published_at");
    CREATE INDEX IF NOT EXISTS "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "cases_created_at_idx" ON "cases" USING btree ("created_at");

    DO $cases_fk$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cases_cover_id_media_id_fk') THEN
        ALTER TABLE "cases" ADD CONSTRAINT "cases_cover_id_media_id_fk"
          FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cases_related_article_id_articles_id_fk') THEN
        ALTER TABLE "cases" ADD CONSTRAINT "cases_related_article_id_articles_id_fk"
          FOREIGN KEY ("related_article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cases_seo_og_image_id_media_id_fk') THEN
        ALTER TABLE "cases" ADD CONSTRAINT "cases_seo_og_image_id_media_id_fk"
          FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $cases_fk$;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "cases_id" integer;
    DO $locked_docs_cases_fk$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_cases_fk') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk"
          FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $locked_docs_cases_fk$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cases_id_idx"
      ON "payload_locked_documents_rels" USING btree ("cases_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_cases_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_cases_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cases_id";
    DROP TABLE IF EXISTS "cases";
    DROP TYPE IF EXISTS "enum_cases_format";
    DROP TYPE IF EXISTS "enum_cases_service";
    DROP TYPE IF EXISTS "enum_cases_status";
  `)
}
