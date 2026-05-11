import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/** Таблицы для раздела «Мы в медиа» */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "media_categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "media_categories_slug_idx" ON "media_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "media_categories_updated_at_idx" ON "media_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_categories_created_at_idx" ON "media_categories" USING btree ("created_at");

  CREATE TABLE IF NOT EXISTS "media_mentions" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "source" varchar,
    "url" varchar NOT NULL,
    "excerpt" varchar,
    "cover_id" integer,
    "category_id" integer,
    "published_at" timestamp(3) with time zone NOT NULL,
    "featured" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  DO $media_mentions_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_mentions_cover_id_media_id_fk') THEN
      ALTER TABLE "media_mentions" ADD CONSTRAINT "media_mentions_cover_id_media_id_fk"
        FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_mentions_category_id_media_categories_id_fk') THEN
      ALTER TABLE "media_mentions" ADD CONSTRAINT "media_mentions_category_id_media_categories_id_fk"
        FOREIGN KEY ("category_id") REFERENCES "public"."media_categories"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $media_mentions_fk$;

  CREATE INDEX IF NOT EXISTS "media_mentions_cover_idx" ON "media_mentions" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "media_mentions_category_idx" ON "media_mentions" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "media_mentions_published_at_idx" ON "media_mentions" USING btree ("published_at");
  CREATE INDEX IF NOT EXISTS "media_mentions_updated_at_idx" ON "media_mentions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_mentions_created_at_idx" ON "media_mentions" USING btree ("created_at");

  -- Update payload_locked_documents_rels to support new collections
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_mentions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_categories_id" integer;

  DO $locked_docs_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_media_mentions_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_mentions_fk"
        FOREIGN KEY ("media_mentions_id") REFERENCES "public"."media_mentions"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_media_categories_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_categories_fk"
        FOREIGN KEY ("media_categories_id") REFERENCES "public"."media_categories"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $locked_docs_fk$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_mentions_id_idx"
    ON "payload_locked_documents_rels" USING btree ("media_mentions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_categories_id_idx"
    ON "payload_locked_documents_rels" USING btree ("media_categories_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "payload_locked_documents_rels_media_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_media_mentions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_categories_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_mentions_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_mentions_id";
  DROP TABLE IF EXISTS "media_mentions" CASCADE;
  DROP TABLE IF EXISTS "media_categories" CASCADE;
  `)
}
