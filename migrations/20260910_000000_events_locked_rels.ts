import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "event_cities_id" integer,
      ADD COLUMN IF NOT EXISTS "event_organizers_id" integer,
      ADD COLUMN IF NOT EXISTS "events_id" integer;

    DO $events_rels_fk$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_event_cities_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_event_cities_fk"
          FOREIGN KEY ("event_cities_id") REFERENCES "public"."event_cities"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_event_organizers_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_event_organizers_fk"
          FOREIGN KEY ("event_organizers_id") REFERENCES "public"."event_organizers"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_events_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_events_fk"
          FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade;
      END IF;
    END $events_rels_fk$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_cities_id_idx"
      ON "payload_locked_documents_rels" USING btree ("event_cities_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_organizers_id_idx"
      ON "payload_locked_documents_rels" USING btree ("event_organizers_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx"
      ON "payload_locked_documents_rels" USING btree ("events_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_events_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_event_organizers_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_event_cities_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_events_fk",
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_event_organizers_fk",
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_event_cities_fk",
      DROP COLUMN IF EXISTS "events_id",
      DROP COLUMN IF EXISTS "event_organizers_id",
      DROP COLUMN IF EXISTS "event_cities_id";
  `)
}
