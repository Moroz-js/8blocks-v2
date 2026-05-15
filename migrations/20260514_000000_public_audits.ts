import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "public_audits" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "related_article_id" integer,
    "cta_text" varchar,
    "excerpt" varchar,
    "cover_id" integer,
    "content" jsonb,
    "seo_seo_title" varchar,
    "seo_seo_description" varchar,
    "seo_og_title" varchar,
    "seo_og_description" varchar,
    "seo_og_image_id" integer,
    "seo_twitter_title" varchar,
    "seo_twitter_description" varchar,
    "seo_noindex" boolean DEFAULT false,
    "published_at" timestamp(3) with time zone NOT NULL,
    "featured" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "public_audits_slug_idx" ON "public_audits" USING btree ("slug");

  DO $public_audits_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_cover_id_media_id_fk') THEN
      ALTER TABLE "public_audits" ADD CONSTRAINT "public_audits_cover_id_media_id_fk"
        FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_related_article_id_articles_id_fk') THEN
      ALTER TABLE "public_audits" ADD CONSTRAINT "public_audits_related_article_id_articles_id_fk"
        FOREIGN KEY ("related_article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_seo_og_image_id_media_id_fk') THEN
      ALTER TABLE "public_audits" ADD CONSTRAINT "public_audits_seo_og_image_id_media_id_fk"
        FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $public_audits_fk$;

  CREATE INDEX IF NOT EXISTS "public_audits_cover_idx" ON "public_audits" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "public_audits_related_article_idx" ON "public_audits" USING btree ("related_article_id");
  CREATE INDEX IF NOT EXISTS "public_audits_seo_og_image_idx" ON "public_audits" USING btree ("seo_og_image_id");
  CREATE INDEX IF NOT EXISTS "public_audits_published_at_idx" ON "public_audits" USING btree ("published_at");
  CREATE INDEX IF NOT EXISTS "public_audits_updated_at_idx" ON "public_audits" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "public_audits_created_at_idx" ON "public_audits" USING btree ("created_at");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "public_audits_id" integer;

  DO $locked_docs_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_public_audits_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_public_audits_fk"
        FOREIGN KEY ("public_audits_id") REFERENCES "public"."public_audits"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $locked_docs_fk$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_public_audits_id_idx"
    ON "payload_locked_documents_rels" USING btree ("public_audits_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "payload_locked_documents_rels_public_audits_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_public_audits_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "public_audits_id";
  DROP TABLE IF EXISTS "public_audits" CASCADE;
  `)
}
