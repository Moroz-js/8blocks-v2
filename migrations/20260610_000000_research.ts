import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $enum_research_status$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_research_status') THEN
      CREATE TYPE "enum_research_status" AS ENUM('draft', 'published');
    END IF;
  END $enum_research_status$;

  CREATE TABLE IF NOT EXISTS "research" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "excerpt" varchar,
    "card_color" varchar DEFAULT '#141414',
    "text_color" varchar DEFAULT '#FFFFFF',
    "category_id" integer,
    "cover_id" integer,
    "status" "enum_research_status" DEFAULT 'draft' NOT NULL,
    "content" jsonb NOT NULL,
    "seo_seo_title" varchar,
    "seo_seo_description" varchar,
    "seo_og_title" varchar,
    "seo_og_description" varchar,
    "seo_og_image_id" integer,
    "seo_twitter_title" varchar,
    "seo_twitter_description" varchar,
    "seo_head_markup" varchar,
    "seo_noindex" boolean DEFAULT false,
    "published_at" timestamp(3) with time zone,
    "views" numeric DEFAULT 0,
    "hidden" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "research_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "research_id" integer
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "research_slug_idx" ON "research" USING btree ("slug");

  DO $research_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_category_id_categories_id_fk') THEN
      ALTER TABLE "research" ADD CONSTRAINT "research_category_id_categories_id_fk"
        FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_cover_id_media_id_fk') THEN
      ALTER TABLE "research" ADD CONSTRAINT "research_cover_id_media_id_fk"
        FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_seo_og_image_id_media_id_fk') THEN
      ALTER TABLE "research" ADD CONSTRAINT "research_seo_og_image_id_media_id_fk"
        FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_rels_parent_fk') THEN
      ALTER TABLE "research_rels" ADD CONSTRAINT "research_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."research"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_rels_research_fk') THEN
      ALTER TABLE "research_rels" ADD CONSTRAINT "research_rels_research_fk"
        FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $research_fk$;

  CREATE INDEX IF NOT EXISTS "research_category_idx" ON "research" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "research_cover_idx" ON "research" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "research_seo_seo_og_image_idx" ON "research" USING btree ("seo_og_image_id");
  CREATE INDEX IF NOT EXISTS "research_published_at_idx" ON "research" USING btree ("published_at");
  CREATE INDEX IF NOT EXISTS "research_updated_at_idx" ON "research" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "research_created_at_idx" ON "research" USING btree ("created_at");

  CREATE INDEX IF NOT EXISTS "research_rels_order_idx" ON "research_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "research_rels_parent_idx" ON "research_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "research_rels_path_idx" ON "research_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "research_rels_research_id_idx" ON "research_rels" USING btree ("research_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "research_id" integer;

  DO $locked_docs_research_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_research_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_research_fk"
        FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $locked_docs_research_fk$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_research_id_idx"
    ON "payload_locked_documents_rels" USING btree ("research_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "payload_locked_documents_rels_research_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_research_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "research_id";
  DROP TABLE IF EXISTS "research_rels" CASCADE;
  DROP TABLE IF EXISTS "research" CASCADE;
  DROP TYPE IF EXISTS "enum_research_status";
  `)
}
