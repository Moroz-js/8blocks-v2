import { describe, it, expect } from "vitest";
import { MODEL_TEMPLATES, VESTING_SHAPES, applyTemplate, shapeCurve } from "../presets";
import { createDefaultModel } from "../model";
import { calcTotalPercent, isFullyAllocated } from "../validate";
import { computeStructureScore } from "../scoringV3";

describe("model templates", () => {
  for (const t of MODEL_TEMPLATES) {
    it(`${t.id} allocates exactly 100% and scores without errors`, () => {
      const m = applyTemplate(createDefaultModel(), t);
      expect(calcTotalPercent(m.allocations)).toBeCloseTo(100, 5);
      expect(isFullyAllocated(m.allocations)).toBe(true);
      const r = computeStructureScore(m.allocations, m.vestings);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    });
    it(`${t.id} keeps a vesting config for every bucket`, () => {
      const m = applyTemplate(createDefaultModel(), t);
      expect(m.vestings.length).toBe(8);
      for (const a of m.allocations.filter((x) => x.enabled)) {
        expect(m.vestings.find((v) => v.bucketKey === a.key)).toBeDefined();
      }
    });
  }

  it("preserves name, symbol and supply", () => {
    const m = { ...createDefaultModel(), name: "X", symbol: "X", totalSupply: 42 };
    const applied = applyTemplate(m, MODEL_TEMPLATES[0]);
    expect(applied.name).toBe("X");
    expect(applied.totalSupply).toBe(42);
  });
});

describe("vesting shapes", () => {
  for (const s of VESTING_SHAPES) {
    it(`${s.id} has valid ranges and a monotonic curve ending at 100%`, () => {
      expect(s.cfg.tgePercent).toBeGreaterThanOrEqual(0);
      expect(s.cfg.tgePercent).toBeLessThanOrEqual(100);
      const curve = shapeCurve(s.cfg, 60);
      for (let i = 1; i < curve.length; i++) {
        expect(curve[i]).toBeGreaterThanOrEqual(curve[i - 1]);
      }
      expect(curve.at(-1)).toBeCloseTo(1, 5);
    });
  }

  it("cliff holds the curve flat at the TGE level", () => {
    const curve = shapeCurve({ tgePercent: 10, cliffMonths: 6, vestingMonths: 12 });
    expect(curve[0]).toBeCloseTo(0.1, 5);
    expect(curve[6]).toBeCloseTo(0.1, 5);
    expect(curve[7]).toBeGreaterThan(0.1);
  });
});
