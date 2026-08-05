import { describe, it, expect } from "vitest";
import { computeStructureScore, tierToLetter } from "../scoringV3";
import type { AllocationBucket, VestingConfig } from "../types";

function model(
  rows: [string, number, number, number, number][],
): { a: AllocationBucket[]; v: VestingConfig[] } {
  // rows: [key, percent, tgePercent, cliffMonths, vestingMonths]
  return {
    a: rows.map(([key, percent]) => ({
      key: key as AllocationBucket["key"],
      percent,
      enabled: percent > 0,
    })),
    v: rows.map(([key, , tgePercent, cliffMonths, vestingMonths]) => ({
      bucketKey: key as VestingConfig["bucketKey"],
      tgePercent,
      cliffMonths,
      vestingMonths,
    })),
  };
}

describe("calibration against reference launches (expert-panel spec)", () => {
  it("Hyperliquid-style community launch is Rock Solid", () => {
    // genesis: community 70% with 31% of supply liquid at TGE, rest ~96mo;
    // team 23.8% locked 12mo cliff + 36mo; foundation 6.2% long-locked; zero investors
    const { a, v } = model([
      ["community", 70, 44.29, 0, 96],
      ["team", 23.8, 0, 12, 36],
      ["foundation", 6.2, 0, 12, 36],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.archetype.id).toBe("community_launch");
    expect(r.score).toBeGreaterThanOrEqual(85);
    expect(r.tier.name).toBe("Rock Solid");
    expect(r.caps).toEqual([]);
  });

  it("'Insider Feast' (bad VC model) is Red Flag", () => {
    const { a, v } = model([
      ["team", 25, 10, 0, 12],
      ["investors", 35, 15, 0, 10],
      ["foundation", 15, 0, 12, 36],
      ["treasury", 10, 0, 6, 48],
      ["liquidity", 5, 100, 0, 0],
      ["community", 5, 50, 0, 24],
      ["publicSale", 5, 100, 0, 0],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.score).toBeLessThanOrEqual(39);
    expect(r.tier.name).toBe("Red Flag");
  });

  it("cap B fires when >=10% of supply is liquid to insiders at TGE", () => {
    const { a, v } = model([
      ["team", 25, 30, 0, 24],
      ["investors", 35, 15, 0, 24],
      ["community", 40, 30, 0, 36],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.caps.some((c) => c.id === "capB")).toBe(true);
    expect(r.score).toBeLessThanOrEqual(49);
  });

  it("'Ghost Float' (3-5% float, huge overhang) lands Fragile or below", () => {
    const { a, v } = model([
      ["community", 5, 100, 0, 0],
      ["team", 25, 0, 12, 6],
      ["investors", 25, 0, 12, 6],
      ["treasury", 30, 0, 0, 72],
      ["ecosystem", 15, 0, 0, 48],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.score).toBeLessThanOrEqual(54);
  });

  it("Uniswap-style structure grades Strong", () => {
    // UNI genesis: community 60 (15% immediately claimable ~= 25% of bucket),
    // team 21.3 / investors 18 / advisors folded, all 4y no TGE
    const { a, v } = model([
      ["community", 60, 25, 0, 48],
      ["team", 22, 0, 12, 36],
      ["investors", 18, 0, 12, 36],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.score).toBeGreaterThanOrEqual(70);
    expect(r.score).toBeLessThan(85);
  });

  it("Arbitrum-style L2 lands Watch List band", () => {
    // ARB: airdrop 12.75 liquid, dao treasury 35.3 (slow), team 26.9 + investors 17.5
    // (1y cliff then 3y), ecosystem ~7.5
    const { a, v } = model([
      ["community", 12.75, 100, 0, 0],
      ["treasury", 35.3, 0, 0, 60],
      ["team", 26.9, 0, 12, 36],
      ["investors", 17.5, 0, 12, 36],
      ["ecosystem", 7.55, 25, 0, 24],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.archetype.id).toBe("vc_backed");
    expect(r.score).toBeGreaterThanOrEqual(55);
    expect(r.score).toBeLessThan(80);
  });

  it("100% TGE memecoin is full_float: no overhang but capped skin-in-the-game", () => {
    const { a, v } = model([["community", 100, 100, 0, 0]]);
    const r = computeStructureScore(a, v);
    expect(r.archetype.id).toBe("full_float");
    const disc = r.dimensions.find((d) => d.id === "discipline")!;
    expect(disc.score).toBe(35);
    expect(r.dimensions.find((d) => d.id === "overhang")!.score).toBe(100);
  });
});

describe("engine mechanics", () => {
  it("top fixes are ranked by real recomputed gain", () => {
    const { a, v } = model([
      ["team", 20, 10, 0, 12],
      ["investors", 20, 10, 0, 12],
      ["community", 40, 20, 0, 36],
      ["treasury", 20, 0, 6, 48],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.topFixes.length).toBeGreaterThan(0);
    for (const f of r.topFixes) expect(f.gain).toBeGreaterThanOrEqual(2);
    const sorted = [...r.topFixes].sort((x, y) => y.gain - x.gain);
    expect(r.topFixes).toEqual(sorted);
  });

  it("applying the first fix actually improves the score by the promised gain", () => {
    const { a, v } = model([
      ["team", 20, 0, 0, 12],
      ["community", 60, 20, 0, 36],
      ["treasury", 20, 0, 6, 48],
    ]);
    const r = computeStructureScore(a, v);
    const cliffFix = r.topFixes.find((f) => f.label.includes("12-month cliff"));
    if (cliffFix) {
      const v2 = v.map((x) => (x.bucketKey === "team" ? { ...x, cliffMonths: 12 } : x));
      const r2 = computeStructureScore(a, v2);
      expect(r2.score - r.score).toBe(cliffFix.gain);
    }
  });

  it("ICP-style cap A triggers when almost nothing reaches the public", () => {
    const { a, v } = model([
      ["team", 40, 0, 12, 36],
      ["investors", 30, 0, 12, 36],
      ["foundation", 25, 0, 12, 48],
      ["community", 5, 100, 0, 0],
    ]);
    const r = computeStructureScore(a, v);
    expect(r.caps.some((c) => c.id === "capA")).toBe(true);
    expect(r.score).toBeLessThanOrEqual(44);
  });

  it("tierToLetter keeps the legacy PDF working", () => {
    expect(tierToLetter(90)).toBe("A");
    expect(tierToLetter(72)).toBe("B");
    expect(tierToLetter(60)).toBe("C");
    expect(tierToLetter(20)).toBe("D");
  });
});
