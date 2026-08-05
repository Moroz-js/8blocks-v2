import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "launch_modules"
    SET
      "name_en" = CASE "order"
        WHEN 4 THEN 'Pitch and preparation'
        ELSE "name_en"
      END,
      "duration_label_en" = CASE "order"
        WHEN 1 THEN '1–3 hours'
        WHEN 2 THEN '10 working days'
        WHEN 3 THEN '3–7 weeks'
        WHEN 4 THEN '10 working days'
        WHEN 5 THEN '1–3 months'
        WHEN 6 THEN 'by agreement'
      END,
      "description_en" = CASE "order"
        WHEN 1 THEN 'A strategy session for early-stage projects and Web2 teams moving into Web3. We work out what the token is for, who creates demand for it, and how it fits into the product. You leave with two or three developed concepts, a recording of the session, and a written summary of the key conclusions. If you go on to build the tokenomics with us, the $2,500 comes off the project price.'
        WHEN 2 THEN 'For projects that already have a model. We go deep on emission, vesting, distribution, utility, and the defences against manipulation. You get a full report with the analysis and practical fixes, so the tokenomics works for the project''s growth instead of needing to be propped up from outside.'
        WHEN 3 THEN 'Building the model from scratch, or rebuilding one that did not work. We design the emission, distribution, vesting, utility, treasury, liquidity, safeguards, and price stability. What you end up with is a model the business can launch on, along with the white paper and the materials you put in front of investors.'
        WHEN 4 THEN '8Blocks gets the project ready for the room, Fibonacci opens the door. We shape the project around what funds are looking for, build the materials, and write the meeting to your specifics. You present to investors who work in your space. Everything up to that moment is on us.'
        WHEN 5 THEN 'We launch market making alongside the token model, not after it, and hold liquidity on one or two exchanges, CEX and DEX, for the length of the package. Every package includes pitch sessions.'
        WHEN 6 THEN 'We take the project through the exchange''s due diligence and run the listing from approval to launch. BingX is our main listing partner. If a different exchange suits the project better, we open that door instead.'
      END,
      "updated_at" = now()
    WHERE "order" BETWEEN 1 AND 6;

    UPDATE "launch_modules_packages"
    SET "label_en" = CASE "id"
      WHEN 'pitch-pkg-1' THEN 'One pitch session'
      WHEN 'pitch-pkg-2' THEN 'Two pitch sessions'
      WHEN 'mm-pkg-1' THEN 'One exchange, one month, includes one pitch session'
      WHEN 'mm-pkg-2' THEN 'One exchange, three months, includes two pitch sessions'
      WHEN 'mm-pkg-3' THEN 'Two exchanges, one month, includes one pitch session'
      WHEN 'mm-pkg-4' THEN 'Two exchanges, three months, includes two pitch sessions'
    END
    WHERE "id" IN ('pitch-pkg-1', 'pitch-pkg-2', 'mm-pkg-1', 'mm-pkg-2', 'mm-pkg-3', 'mm-pkg-4');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "launch_modules"
    SET
      "name_en" = CASE "order"
        WHEN 4 THEN 'Pitch & preparation'
        ELSE "name_en"
      END,
      "duration_label_en" = CASE "order"
        WHEN 1 THEN '1–3 hours'
        WHEN 2 THEN '10 business days'
        WHEN 3 THEN '3–7 weeks'
        WHEN 4 THEN '10 business days'
        WHEN 5 THEN '1 or 3 months'
        WHEN 6 THEN 'by agreement'
      END,
      "description_en" = CASE "order"
        WHEN 1 THEN 'A strategy session for early-stage projects and Web2 teams moving into Web3. We define the token’s role, who creates demand and how the token fits into the product. You leave with 2–3 developed concepts, a session recording and a document with the key conclusions. If you continue tokenomics design with us, the Workshop fee ($2,500) is credited toward the project.'
        WHEN 2 THEN 'A tokenomics audit of your existing model for projects with finished tokenomics. A deep review of emission, vesting, distribution, utility and manipulation resistance. You receive a detailed report with model analysis and practical recommendations, so the tokenomics drives project growth instead of requiring outside support.'
        WHEN 3 THEN 'Full tokenomics design for projects building from scratch or rebuilding: emission, distribution, vesting, utility, treasury, liquidity, protective mechanics and price stability. You get a launch-ready tokenomics model that supports the business, plus a white paper and investor presentation materials.'
        WHEN 4 THEN 'Preparing the project for fund meetings together with 8Blocks and organizing pitch sessions through Fibonacci’s infrastructure. We adapt the project to fund requirements and prepare the materials and an individual meeting scenario. You present the project to relevant investors while we handle preparation and process management.'
        WHEN 5 THEN 'Crypto market making services launched in sync with the token model. We manage liquidity after listing on one or two exchanges (CEX and DEX). Every package already includes investor pitch sessions.'
        WHEN 6 THEN 'Token listing services: negotiating the listing with the exchange, passing due diligence and coordinating the process. BingX is the primary listing partner. If another exchange suits the project better, we bring it in through the partner network.'
      END,
      "updated_at" = now()
    WHERE "order" BETWEEN 1 AND 6;

    UPDATE "launch_modules_packages"
    SET "label_en" = CASE "id"
      WHEN 'pitch-pkg-1' THEN '1 pitch session'
      WHEN 'pitch-pkg-2' THEN '2 pitch sessions'
      WHEN 'mm-pkg-1' THEN '1 exchange, 1 month (1 pitch session included)'
      WHEN 'mm-pkg-2' THEN '1 exchange, 3 months (2 pitch sessions included)'
      WHEN 'mm-pkg-3' THEN '2 exchanges, 1 month (1 pitch session included)'
      WHEN 'mm-pkg-4' THEN '2 exchanges, 3 months (2 pitch sessions included)'
    END
    WHERE "id" IN ('pitch-pkg-1', 'pitch-pkg-2', 'mm-pkg-1', 'mm-pkg-2', 'mm-pkg-3', 'mm-pkg-4');
  `)
}
