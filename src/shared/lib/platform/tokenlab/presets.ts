import type { StandardBucketKey, VestingConfig } from "./types";
import type { TokenModel } from "./model";
import { createDefaultModel } from "./model";

/* ── Named vesting shapes (Sablier-style gallery, linear parameter space) ── */

export interface VestingShape {
  id: string;
  name: string;
  cfg: Omit<VestingConfig, "bucketKey">;
}

export const VESTING_SHAPES: VestingShape[] = [
  { id: "no-lock", name: "No lock (100% TGE)", cfg: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 } },
  { id: "tge10-18m", name: "TGE 10% + 18m linear", cfg: { tgePercent: 10, cliffMonths: 0, vestingMonths: 18 } },
  { id: "cliff6-2y", name: "6m cliff + 2y linear", cfg: { tgePercent: 0, cliffMonths: 6, vestingMonths: 24 } },
  { id: "cliff12-3y", name: "1y cliff + 3y linear", cfg: { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 } },
  { id: "tge5-cliff6-2y", name: "TGE 5% + 6m cliff + 2y", cfg: { tgePercent: 5, cliffMonths: 6, vestingMonths: 24 } },
  { id: "longhaul-4y", name: "Long-haul 4y", cfg: { tgePercent: 0, cliffMonths: 12, vestingMonths: 48 } },
];

/** Cumulative unlocked fraction (0..1) per month for a shape — for sparkline thumbnails.
 *  Mirrors calcBucketMonthlyUnlock semantics, incl. full remainder at max(cliff,1) when vesting = 0. */
export function shapeCurve(cfg: Omit<VestingConfig, "bucketKey">, months = 48): number[] {
  const tge = cfg.tgePercent / 100;
  const out: number[] = [];
  for (let m = 0; m <= months; m++) {
    let vested = 0;
    if (cfg.vestingMonths > 0) {
      if (m > cfg.cliffMonths) {
        vested = Math.min((m - cfg.cliffMonths) / cfg.vestingMonths, 1) * (1 - tge);
      }
    } else if (m >= Math.max(cfg.cliffMonths, 1)) {
      vested = 1 - tge;
    }
    out.push(Math.min(tge + vested, 1));
  }
  return out;
}

/* ── Whole-model starting templates ── */

export interface ModelTemplate {
  id: string;
  name: string;
  tagline: string;
  allocations: Partial<Record<StandardBucketKey, number>>;
  vestings: Partial<Record<StandardBucketKey, Omit<VestingConfig, "bucketKey">>>;
}

export const MODEL_TEMPLATES: ModelTemplate[] = [
  {
    id: "vc-backed",
    name: "VC-backed",
    tagline: "Classic venture path: investors in, long team locks",
    allocations: { team: 20, investors: 18, community: 25, ecosystem: 12, treasury: 15, liquidity: 10, foundation: 0, publicSale: 0 },
    vestings: {
      team: { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
      investors: { tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
      community: { tgePercent: 10, cliffMonths: 0, vestingMonths: 36 },
      ecosystem: { tgePercent: 5, cliffMonths: 3, vestingMonths: 48 },
      treasury: { tgePercent: 0, cliffMonths: 6, vestingMonths: 48 },
      liquidity: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
    },
  },
  {
    id: "community-led",
    name: "Community-led",
    tagline: "DAO-style: majority to community, small insider share",
    allocations: { team: 12, investors: 8, community: 45, ecosystem: 15, treasury: 10, liquidity: 10, foundation: 0, publicSale: 0 },
    vestings: {
      team: { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
      investors: { tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
      community: { tgePercent: 15, cliffMonths: 0, vestingMonths: 48 },
      ecosystem: { tgePercent: 5, cliffMonths: 3, vestingMonths: 48 },
      treasury: { tgePercent: 0, cliffMonths: 6, vestingMonths: 48 },
      liquidity: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
    },
  },
  {
    id: "fair-launch",
    name: "Fair launch",
    tagline: "No investor round, wide distribution from day one",
    allocations: { team: 10, investors: 0, community: 55, ecosystem: 10, treasury: 10, liquidity: 15, foundation: 0, publicSale: 0 },
    vestings: {
      team: { tgePercent: 0, cliffMonths: 12, vestingMonths: 24 },
      community: { tgePercent: 20, cliffMonths: 0, vestingMonths: 36 },
      ecosystem: { tgePercent: 5, cliffMonths: 0, vestingMonths: 48 },
      treasury: { tgePercent: 0, cliffMonths: 6, vestingMonths: 48 },
      liquidity: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
    },
  },
  {
    id: "utility-enterprise",
    name: "Utility / Enterprise",
    tagline: "Product-first token: heavy ecosystem and treasury",
    allocations: { team: 18, investors: 12, community: 20, ecosystem: 20, treasury: 20, liquidity: 10, foundation: 0, publicSale: 0 },
    vestings: {
      team: { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
      investors: { tgePercent: 5, cliffMonths: 6, vestingMonths: 24 },
      community: { tgePercent: 10, cliffMonths: 0, vestingMonths: 36 },
      ecosystem: { tgePercent: 5, cliffMonths: 3, vestingMonths: 48 },
      treasury: { tgePercent: 0, cliffMonths: 6, vestingMonths: 48 },
      liquidity: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
    },
  },
];

/** Apply a whole-model template on top of the current model (name/symbol/supply preserved). */
export function applyTemplate(model: TokenModel, template: ModelTemplate): TokenModel {
  const base = createDefaultModel();
  return {
    ...model,
    allocations: base.allocations.map((a) => {
      const pct = template.allocations[a.key];
      return pct === undefined
        ? { ...a, enabled: false, percent: 0 }
        : { ...a, percent: pct, enabled: pct > 0 };
    }),
    vestings: base.vestings.map((v) => {
      const cfg = template.vestings[v.bucketKey];
      return cfg ? { ...v, ...cfg } : v;
    }),
  };
}
