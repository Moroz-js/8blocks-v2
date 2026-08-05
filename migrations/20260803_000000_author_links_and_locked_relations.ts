import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "x" varchar;

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "authors_id" integer;

    DO $locked_docs_authors_fk$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'payload_locked_documents_rels_authors_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_authors_fk"
          FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $locked_docs_authors_fk$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx"
      ON "payload_locked_documents_rels" USING btree ("authors_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_authors_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authors_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "authors_id";
    ALTER TABLE "authors" DROP COLUMN IF EXISTS "x";
  `)
}
