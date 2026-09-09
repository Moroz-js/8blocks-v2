import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $events_enums$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_events_format') THEN
        CREATE TYPE "enum_events_format" AS ENUM ('offline', 'online');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_events_status') THEN
        CREATE TYPE "enum_events_status" AS ENUM ('draft', 'published');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_events_platform') THEN
        CREATE TYPE "enum_events_platform" AS ENUM ('youtube', 'x', 'zoom', 'other');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_events_representatives_host_role') THEN
        CREATE TYPE "enum_events_representatives_host_role" AS ENUM ('none', 'host', 'cohost');
      END IF;
    END $events_enums$;

    ALTER TABLE "authors"
      ADD COLUMN IF NOT EXISTS "slug" varchar,
      ADD COLUMN IF NOT EXISTS "show_profile" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "bio" varchar,
      ADD COLUMN IF NOT EXISTS "instagram" varchar,
      ADD COLUMN IF NOT EXISTS "telegram" varchar,
      ADD COLUMN IF NOT EXISTS "website" varchar,
      ADD COLUMN IF NOT EXISTS "email" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");

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

    CREATE TABLE IF NOT EXISTS "event_organizers" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "logo_id" integer,
      "instagram" varchar,
      "x" varchar,
      "website" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "event_organizers_slug_idx" ON "event_organizers" USING btree ("slug");
    CREATE TABLE IF NOT EXISTS "event_organizers_extra_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "events" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "subtitle" varchar,
      "content_title" varchar,
      "format" "enum_events_format" DEFAULT 'offline' NOT NULL,
      "featured" boolean DEFAULT false,
      "cover_id" integer,
      "poster_id" integer,
      "starts_at" timestamp(3) with time zone NOT NULL,
      "ends_at" timestamp(3) with time zone,
      "timezone" varchar DEFAULT 'Europe/Moscow' NOT NULL,
      "city_id" integer,
      "venue_name" varchar,
      "address" varchar,
      "maps_url" varchar,
      "maps_embed_url" varchar,
      "platform" "enum_events_platform",
      "platform_label" varchar,
      "platform_url" varchar,
      "host_name" varchar,
      "main_organizer_id" integer,
      "content" jsonb,
      "summary" jsonb,
      "recap_media_id" integer,
      "event_url" varchar,
      "recording_url" varchar,
      "recording_file_id" integer,
      "presentation_id" integer,
      "presentation_url" varchar,
      "seo_seo_title" varchar,
      "seo_seo_description" varchar,
      "seo_og_title" varchar,
      "seo_og_description" varchar,
      "seo_og_image_id" integer,
      "seo_noindex" boolean DEFAULT false,
      "status" "enum_events_status" DEFAULT 'draft' NOT NULL,
      "hidden" boolean DEFAULT false,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "events_visibility_starts_at_idx" ON "events" USING btree ("status", "hidden", "starts_at");
    CREATE INDEX IF NOT EXISTS "events_format_idx" ON "events" USING btree ("format");
    CREATE INDEX IF NOT EXISTS "events_city_idx" ON "events" USING btree ("city_id");

    CREATE TABLE IF NOT EXISTS "events_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "event_organizers_id" integer,
      "media_id" integer
    );
    CREATE TABLE IF NOT EXISTS "events_representatives" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "person_id" integer NOT NULL,
      "is_speaker" boolean DEFAULT false,
      "host_role" "enum_events_representatives_host_role" DEFAULT 'none',
      "bio_override" varchar
    );

    DO $events_foreign_keys$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'event_organizers_logo_id_media_id_fk') THEN
        ALTER TABLE "event_organizers" ADD CONSTRAINT "event_organizers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'event_organizers_extra_links_parent_id_fk') THEN
        ALTER TABLE "event_organizers_extra_links" ADD CONSTRAINT "event_organizers_extra_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_organizers"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_city_id_event_cities_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_city_id_event_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."event_cities"("id") ON DELETE restrict;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_main_organizer_id_event_organizers_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_main_organizer_id_event_organizers_id_fk" FOREIGN KEY ("main_organizer_id") REFERENCES "public"."event_organizers"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_cover_id_media_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_poster_id_media_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_recap_media_id_media_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_recap_media_id_media_id_fk" FOREIGN KEY ("recap_media_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_recording_file_id_media_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_recording_file_id_media_id_fk" FOREIGN KEY ("recording_file_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_presentation_id_media_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_presentation_id_media_id_fk" FOREIGN KEY ("presentation_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_seo_og_image_id_media_id_fk') THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_rels_parent_fk') THEN
        ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_rels_event_organizers_fk') THEN
        ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_event_organizers_fk" FOREIGN KEY ("event_organizers_id") REFERENCES "public"."event_organizers"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_rels_media_fk') THEN
        ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_representatives_parent_id_fk') THEN
        ALTER TABLE "events_representatives" ADD CONSTRAINT "events_representatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_representatives_person_id_authors_id_fk') THEN
        ALTER TABLE "events_representatives" ADD CONSTRAINT "events_representatives_person_id_authors_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."authors"("id") ON DELETE restrict;
      END IF;
    END $events_foreign_keys$;

    CREATE INDEX IF NOT EXISTS "event_organizers_logo_idx" ON "event_organizers" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "event_organizers_extra_links_order_idx" ON "event_organizers_extra_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "event_organizers_extra_links_parent_id_idx" ON "event_organizers_extra_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "events_rels_order_idx" ON "events_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "events_rels_path_idx" ON "events_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "events_rels_event_organizers_id_idx" ON "events_rels" USING btree ("event_organizers_id");
    CREATE INDEX IF NOT EXISTS "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "events_representatives_order_idx" ON "events_representatives" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "events_representatives_parent_id_idx" ON "events_representatives" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "events_representatives_person_id_idx" ON "events_representatives" USING btree ("person_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "events_representatives" CASCADE;
    DROP TABLE IF EXISTS "events_rels" CASCADE;
    DROP TABLE IF EXISTS "events" CASCADE;
    DROP TABLE IF EXISTS "event_organizers_extra_links" CASCADE;
    DROP TABLE IF EXISTS "event_organizers" CASCADE;
    DROP TABLE IF EXISTS "event_cities" CASCADE;
    DROP INDEX IF EXISTS "authors_slug_idx";
    ALTER TABLE "authors"
      DROP COLUMN IF EXISTS "slug",
      DROP COLUMN IF EXISTS "show_profile",
      DROP COLUMN IF EXISTS "bio",
      DROP COLUMN IF EXISTS "instagram",
      DROP COLUMN IF EXISTS "telegram",
      DROP COLUMN IF EXISTS "website",
      DROP COLUMN IF EXISTS "email";
    DROP TYPE IF EXISTS "enum_events_representatives_host_role";
    DROP TYPE IF EXISTS "enum_events_platform";
    DROP TYPE IF EXISTS "enum_events_status";
    DROP TYPE IF EXISTS "enum_events_format";
  `)
}
