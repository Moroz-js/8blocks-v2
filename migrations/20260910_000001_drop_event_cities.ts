import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Add new text city column
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "city" varchar;

    -- 2. Migrate existing data: copy city name from event_cities join
    UPDATE "events" e
    SET "city" = ec.slug
    FROM "event_cities" ec
    WHERE e.city_id = ec.id;

    -- 3. Drop FK constraint and old column
    ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_city_id_event_cities_id_fk";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "city_id";
    DROP INDEX IF EXISTS "events_city_idx";

    -- 4. Drop payload_locked_documents_rels FK + column for event_cities
    DROP INDEX IF EXISTS "payload_locked_documents_rels_event_cities_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_event_cities_fk",
      DROP COLUMN IF EXISTS "event_cities_id";

    -- 5. Drop event_cities table
    DROP TABLE IF EXISTS "event_cities" CASCADE;

    -- 6. Recreate city index on events
    CREATE INDEX IF NOT EXISTS "events_city_idx" ON "events" USING btree ("city");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore event_cities table
    CREATE TABLE IF NOT EXISTS "event_cities" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "country" varchar,
      "country_code" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "event_cities_slug_idx" ON "event_cities" USING btree ("slug");

    -- Restore city_id column
    ALTER TABLE "events"
      ADD COLUMN IF NOT EXISTS "city_id" integer,
      ADD CONSTRAINT "events_city_id_event_cities_id_fk"
        FOREIGN KEY ("city_id") REFERENCES "public"."event_cities"("id") ON DELETE restrict;
    CREATE INDEX IF NOT EXISTS "events_city_idx" ON "events" USING btree ("city_id");

    -- Restore locked_documents_rels column
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "event_cities_id" integer,
      ADD CONSTRAINT "payload_locked_documents_rels_event_cities_fk"
        FOREIGN KEY ("event_cities_id") REFERENCES "public"."event_cities"("id") ON DELETE cascade;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_cities_id_idx"
      ON "payload_locked_documents_rels" USING btree ("event_cities_id");

    -- Remove new city column
    DROP INDEX IF EXISTS "events_city_idx";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "city";
  `)
}
