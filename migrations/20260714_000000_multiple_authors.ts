import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// author: hasMany:false → hasMany:true в articles и research.
// Одиночная колонка author_id переезжает в *_rels с path = 'author'.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- ── Articles ────────────────────────────────────────────────────
  ALTER TABLE "articles_rels" ADD COLUMN IF NOT EXISTS "authors_id" integer;
  DO $articles_rels_authors_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_rels_authors_fk') THEN
      ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_authors_fk"
        FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $articles_rels_authors_fk$;
  CREATE INDEX IF NOT EXISTS "articles_rels_authors_id_idx" ON "articles_rels" USING btree ("authors_id");

  INSERT INTO "articles_rels" ("order", "parent_id", "path", "authors_id")
  SELECT 1, "id", 'author', "author_id"
  FROM "articles"
  WHERE "author_id" IS NOT NULL;

  DROP INDEX IF EXISTS "articles_author_idx";
  ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_author_id_authors_id_fk";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "author_id";

  -- ── Research ────────────────────────────────────────────────────
  ALTER TABLE "research_rels" ADD COLUMN IF NOT EXISTS "authors_id" integer;
  DO $research_rels_authors_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_rels_authors_fk') THEN
      ALTER TABLE "research_rels" ADD CONSTRAINT "research_rels_authors_fk"
        FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $research_rels_authors_fk$;
  CREATE INDEX IF NOT EXISTS "research_rels_authors_id_idx" ON "research_rels" USING btree ("authors_id");

  INSERT INTO "research_rels" ("order", "parent_id", "path", "authors_id")
  SELECT 1, "id", 'author', "author_id"
  FROM "research"
  WHERE "author_id" IS NOT NULL;

  DROP INDEX IF EXISTS "research_author_idx";
  ALTER TABLE "research" DROP CONSTRAINT IF EXISTS "research_author_id_authors_id_fk";
  ALTER TABLE "research" DROP COLUMN IF EXISTS "author_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  -- ── Articles: назад к одиночной колонке (берём первого автора) ──
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "author_id" integer;
  DO $articles_author_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_author_id_authors_id_fk') THEN
      ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk"
        FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $articles_author_fk$;
  CREATE INDEX IF NOT EXISTS "articles_author_idx" ON "articles" USING btree ("author_id");

  UPDATE "articles" a
  SET "author_id" = r."authors_id"
  FROM (
    SELECT DISTINCT ON ("parent_id") "parent_id", "authors_id"
    FROM "articles_rels"
    WHERE "path" = 'author' AND "authors_id" IS NOT NULL
    ORDER BY "parent_id", "order"
  ) r
  WHERE a."id" = r."parent_id";

  DELETE FROM "articles_rels" WHERE "path" = 'author';
  DROP INDEX IF EXISTS "articles_rels_authors_id_idx";
  ALTER TABLE "articles_rels" DROP CONSTRAINT IF EXISTS "articles_rels_authors_fk";
  ALTER TABLE "articles_rels" DROP COLUMN IF EXISTS "authors_id";

  -- ── Research: назад к одиночной колонке ─────────────────────────
  ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "author_id" integer;
  DO $research_author_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'research_author_id_authors_id_fk') THEN
      ALTER TABLE "research" ADD CONSTRAINT "research_author_id_authors_id_fk"
        FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $research_author_fk$;
  CREATE INDEX IF NOT EXISTS "research_author_idx" ON "research" USING btree ("author_id");

  UPDATE "research" a
  SET "author_id" = r."authors_id"
  FROM (
    SELECT DISTINCT ON ("parent_id") "parent_id", "authors_id"
    FROM "research_rels"
    WHERE "path" = 'author' AND "authors_id" IS NOT NULL
    ORDER BY "parent_id", "order"
  ) r
  WHERE a."id" = r."parent_id";

  DELETE FROM "research_rels" WHERE "path" = 'author';
  DROP INDEX IF EXISTS "research_rels_authors_id_idx";
  ALTER TABLE "research_rels" DROP CONSTRAINT IF EXISTS "research_rels_authors_fk";
  ALTER TABLE "research_rels" DROP COLUMN IF EXISTS "authors_id";
  `)
}
