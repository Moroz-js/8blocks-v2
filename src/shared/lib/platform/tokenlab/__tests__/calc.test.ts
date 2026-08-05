import { describe, it, expect } from "vitest";
import { calcPricePerToken, calcInitialCircPercent, calcInitialMC } from "../calc";
import { calcTotalPercent, isFullyAllocated } from "../validate";
import { createDefaultModel } from "../model";
import type { AllocationBucket, VestingConfig } from "../types";

describe("valuation math", () => {
  it("price = fdv / supply, guarded", () => {
    expect(calcPricePerToken(10_000_000, 1_000_000_000)).toBeCloseTo(0.01);
    expect(calcPricePerToken(10_000_000, 0)).toBe(0);
  });
  it("initial circulating percent is the weighted TGE unlock", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 60, enabled: true },
      { key: "community", percent: 40, enabled: true },
    ];
    const v: VestingConfig[] = [
      { bucketKey: "team", tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
      { bucketKey: "community", tgePercent: 25, cliffMonths: 0, vestingMonths: 24 },
    ];
    expect(calcInitialCircPercent(a, v)).toBeCloseTo(10, 5); // 40 * 25%
  });
  it("initial MC = fdv * circ% / 100", () => {
    expect(calcInitialMC(10_000_000, 10)).toBeCloseTo(1_000_000);
  });
});

describe("allocation validation", () => {
  it("default model is fully allocated", () => {
    const m = createDefaultModel();
    expect(calcTotalPercent(m.allocations)).toBeCloseTo(100, 5);
    expect(isFullyAllocated(m.allocations)).toBe(true);
  });
  it("detects under-allocation", () => {
    const a: AllocationBucket[] = [{ key: "team", percent: 99.5, enabled: true }];
    expect(isFullyAllocated(a)).toBe(false);
  });
  it("ignores disabled buckets", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 100, enabled: true },
      { key: "investors", percent: 50, enabled: false },
    ];
    expect(calcTotalPercent(a)).toBe(100);
  });
});
