import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- ── Authors collection ─────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS "authors" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "position" varchar,
    "linked_in" varchar,
    "photo_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  DO $authors_photo_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'authors_photo_id_media_id_fk') THEN
      ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk"
        FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $authors_photo_fk$;
  CREATE INDEX IF NOT EXISTS "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "authors_created_at_idx" ON "authors" USING btree ("created_at");

  -- ── Articles: author relationship ──────────────────────────────
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "author_id" integer;
  DO $articles_author_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_author_id_authors_id_fk') THEN
      ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk"
        FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $articles_author_fk$;
  CREATE INDEX IF NOT EXISTS "articles_author_idx" ON "articles" USING btree ("author_id");

  -- ── Research: author relationship ──────────────────────────────
  ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "author_id" integer;
  DO $research_author_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_author_id_authors_id_fk') THEN
      ALTER TABLE "research" ADD CONSTRAINT "research_author_id_authors_id_fk"
        FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $research_author_fk$;
  CREATE INDEX IF NOT EXISTS "research_author_idx" ON "research" USING btree ("author_id");

  -- ── Public audits: expert.author relationship ─────────────────
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_author_id" integer;
  DO $public_audits_expert_author_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_expert_author_id_authors_id_fk') THEN
      ALTER TABLE "public_audits" ADD CONSTRAINT "public_audits_expert_author_id_authors_id_fk"
        FOREIGN KEY ("expert_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $public_audits_expert_author_fk$;
  CREATE INDEX IF NOT EXISTS "public_audits_expert_author_idx" ON "public_audits" USING btree ("expert_author_id");

  -- ── Data migration: legacy embedded expert → authors ──────────
  -- one author per distinct (name, role, photo) combination
  INSERT INTO "authors" ("name", "position", "photo_id")
  SELECT DISTINCT "expert_name", "expert_role", "expert_photo_id"
  FROM "public_audits"
  WHERE "expert_name" IS NOT NULL AND "expert_name" <> '';

  UPDATE "public_audits" pa
  SET "expert_author_id" = a."id"
  FROM "authors" a
  WHERE pa."expert_name" = a."name"
    AND pa."expert_role" IS NOT DISTINCT FROM a."position"
    AND pa."expert_photo_id" IS NOT DISTINCT FROM a."photo_id";

  -- ── Drop legacy embedded expert columns ────────────────────────
  DROP INDEX IF EXISTS "public_audits_expert_photo_idx";
  ALTER TABLE "public_audits" DROP CONSTRAINT IF EXISTS "public_audits_expert_photo_id_media_id_fk";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_name";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_role";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_photo_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  -- restore legacy embedded expert columns
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_name" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_role" varchar;
  ALTER TABLE "public_audits" ADD COLUMN IF NOT EXISTS "expert_photo_id" integer;
  DO $public_audits_expert_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'public_audits_expert_photo_id_media_id_fk') THEN
      ALTER TABLE "public_audits" ADD CONSTRAINT "public_audits_expert_photo_id_media_id_fk"
        FOREIGN KEY ("expert_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $public_audits_expert_fk$;
  CREATE INDEX IF NOT EXISTS "public_audits_expert_photo_idx" ON "public_audits" USING btree ("expert_photo_id");

  UPDATE "public_audits" pa
  SET "expert_name" = a."name",
      "expert_role" = a."position",
      "expert_photo_id" = a."photo_id"
  FROM "authors" a
  WHERE pa."expert_author_id" = a."id";

  DROP INDEX IF EXISTS "public_audits_expert_author_idx";
  ALTER TABLE "public_audits" DROP CONSTRAINT IF EXISTS "public_audits_expert_author_id_authors_id_fk";
  ALTER TABLE "public_audits" DROP COLUMN IF EXISTS "expert_author_id";

  DROP INDEX IF EXISTS "research_author_idx";
  ALTER TABLE "research" DROP CONSTRAINT IF EXISTS "research_author_id_authors_id_fk";
  ALTER TABLE "research" DROP COLUMN IF EXISTS "author_id";

  DROP INDEX IF EXISTS "articles_author_idx";
  ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_author_id_authors_id_fk";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "author_id";

  DROP TABLE IF EXISTS "authors" CASCADE;
  `)
}
