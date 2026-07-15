import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- ── Launch modules collection (калькулятор /product/token-launch) ──
  CREATE TABLE IF NOT EXISTS "launch_modules" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" numeric DEFAULT 0 NOT NULL,
    "name_ru" varchar NOT NULL,
    "name_en" varchar NOT NULL,
    "duration_label_ru" varchar NOT NULL,
    "duration_label_en" varchar NOT NULL,
    "duration_weeks" numeric NOT NULL,
    "price" numeric NOT NULL,
    "price_from" boolean DEFAULT false,
    "parallel" boolean DEFAULT false,
    "include_in_total" boolean DEFAULT true,
    "description_ru" varchar NOT NULL,
    "description_en" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "launch_modules_packages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label_ru" varchar NOT NULL,
    "label_en" varchar NOT NULL,
    "price" numeric NOT NULL,
    "duration_weeks" numeric
  );

  DO $launch_modules_packages_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'launch_modules_packages_parent_id_fk') THEN
      ALTER TABLE "launch_modules_packages" ADD CONSTRAINT "launch_modules_packages_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."launch_modules"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $launch_modules_packages_fk$;

  CREATE INDEX IF NOT EXISTS "launch_modules_order_idx" ON "launch_modules" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "launch_modules_updated_at_idx" ON "launch_modules" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "launch_modules_created_at_idx" ON "launch_modules" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "launch_modules_packages_order_idx" ON "launch_modules_packages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "launch_modules_packages_parent_id_idx" ON "launch_modules_packages" USING btree ("_parent_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "launch_modules_id" integer;

  DO $locked_docs_launch_modules_fk$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_launch_modules_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_launch_modules_fk"
        FOREIGN KEY ("launch_modules_id") REFERENCES "public"."launch_modules"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $locked_docs_launch_modules_fk$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_launch_modules_id_idx"
    ON "payload_locked_documents_rels" USING btree ("launch_modules_id");

  -- ── Seed: 6 модулей трека запуска ───────────────────────────────
  INSERT INTO "launch_modules"
    ("order", "name_ru", "name_en", "duration_label_ru", "duration_label_en", "duration_weeks", "price", "price_from", "parallel", "include_in_total", "description_ru", "description_en")
  VALUES
    (1, 'Workshop', 'Workshop', '1–3 часа', '1–3 hours', 0.5, 2500, false, true, true,
     'Стратегическая сессия для проектов на ранней стадии и Web2-команд, переходящих в Web3. Определяем роль токена, кто создаёт спрос и как токен встраивается в продукт. На выходе — 2–3 проработанные концепции, запись сессии и документ с ключевыми выводами. Если продолжаете разработку токеномики с нами — стоимость Workshop ($2,500) засчитывается в счёт проекта.',
     'A strategy session for early-stage projects and Web2 teams moving into Web3. We define the token’s role, who creates demand and how the token fits into the product. You leave with 2–3 developed concepts, a session recording and a document with the key conclusions. If you continue tokenomics design with us, the Workshop fee ($2,500) is credited toward the project.'),
    (2, 'Аудит токеномики', 'Tokenomics audit', '10 рабочих дней', '10 business days', 2, 5000, true, true, true,
     'Аудит существующей модели для проектов с готовой токеномикой. Глубокий разбор эмиссии, vesting, распределения, utility и защиты от манипуляций. Вы получаете подробный отчёт с анализом модели и практическими рекомендациями, чтобы токеномика работала на рост проекта, а не требовала поддержки извне.',
     'A tokenomics audit of your existing model for projects with finished tokenomics. A deep review of emission, vesting, distribution, utility and manipulation resistance. You receive a detailed report with model analysis and practical recommendations, so the tokenomics drives project growth instead of requiring outside support.'),
    (3, 'Дизайн токеномики', 'Tokenomics design', '3–7 недель', '3–7 weeks', 5, 18000, true, false, true,
     'Полная разработка модели для проектов с нуля или пересборки. Дизайн токеномики: эмиссия, распределение, vesting, utility, treasury, ликвидность, защитные механики и ценовая стабильность. В результате вы получаете готовую модель токеномики, которая поддерживает бизнес и готова к запуску, а также white paper и материалы для презентации инвесторам.',
     'Full tokenomics design for projects building from scratch or rebuilding: emission, distribution, vesting, utility, treasury, liquidity, protective mechanics and price stability. You get a launch-ready tokenomics model that supports the business, plus a white paper and investor presentation materials.'),
    (4, 'Pitch и подготовка', 'Pitch & preparation', '10 рабочих дней', '10 business days', 2, 2000, false, false, true,
     'Подготовка проекта к встречам с фондами совместно с А8А9 и организация pitch-сессий через инфраструктуру Fibonacci. Адаптируем проект под требования фондов, готовим материалы и индивидуальный сценарий встречи. Вы представляете проект профильным инвесторам, а мы берём на себя подготовку и организацию процесса.',
     'Preparing the project for fund meetings together with 8Blocks and organizing pitch sessions through Fibonacci’s infrastructure. We adapt the project to fund requirements and prepare the materials and an individual meeting scenario. You present the project to relevant investors while we handle preparation and process management.'),
    (5, 'Маркет-мейкинг', 'Market making', '1 или 3 месяца', '1 or 3 months', 4, 3500, false, false, true,
     'Управление ликвидностью и запуск маркет-мейкинга синхронно с моделью токена. Поддерживаем ликвидность после листинга на одной или двух биржах (CEX и DEX). Все пакеты уже включают pitch-сессии с инвесторами.',
     'Crypto market making services launched in sync with the token model. We manage liquidity after listing on one or two exchanges (CEX and DEX). Every package already includes investor pitch sessions.'),
    (6, 'Листинг', 'Listing', 'по договорённости', 'by agreement', 0, 50000, true, false, false,
     'Согласование листинга с биржей, прохождение due diligence и координация процесса. BingX — основной партнёр по листингу. Если для проекта лучше подходит другая биржа — подключаем её через партнёрскую сеть.',
     'Token listing services: negotiating the listing with the exchange, passing due diligence and coordinating the process. BingX is the primary listing partner. If another exchange suits the project better, we bring it in through the partner network.');

  INSERT INTO "launch_modules_packages" ("_order", "_parent_id", "id", "label_ru", "label_en", "price", "duration_weeks")
  VALUES
    (1, (SELECT "id" FROM "launch_modules" WHERE "name_ru" = 'Pitch и подготовка'), 'pitch-pkg-1', '1 pitch-сессия', '1 pitch session', 2000, NULL),
    (2, (SELECT "id" FROM "launch_modules" WHERE "name_ru" = 'Pitch и подготовка'), 'pitch-pkg-2', '2 pitch-сессии', '2 pitch sessions', 3500, NULL),
    (1, (SELECT "id" FROM "launch_modules" WHERE "name_ru" = 'Маркет-мейкинг'), 'mm-pkg-1', '1 биржа, 1 месяц (включена 1 pitch-сессия)', '1 exchange, 1 month (1 pitch session included)', 3500, 4),
    (2, (SELECT "id" FROM "launch_modules" WHERE "name_ru" = 'Маркет-мейкинг'), 'mm-pkg-2', '1 биржа, 3 месяца (включены 2 pitch-сессии)', '1 exchange, 3 months (2 pitch sessions included)', 10000, 12),
    (3, (SELECT "id" FROM "launch_modules" WHERE "name_ru" = 'Маркет-мейкинг'), 'mm-pkg-3', '2 биржи, 1 месяц (включена 1 pitch-сессия)', '2 exchanges, 1 month (1 pitch session included)', 6000, 4),
    (4, (SELECT "id" FROM "launch_modules" WHERE "name_ru" = 'Маркет-мейкинг'), 'mm-pkg-4', '2 биржи, 3 месяца (включены 2 pitch-сессии)', '2 exchanges, 3 months (2 pitch sessions included)', 16200, 12);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "payload_locked_documents_rels_launch_modules_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_launch_modules_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "launch_modules_id";
  DROP TABLE IF EXISTS "launch_modules_packages" CASCADE;
  DROP TABLE IF EXISTS "launch_modules" CASCADE;
  `)
}
