import { describe, it, expect } from "vitest";
import { detectSpikes } from "../spikes";

const S = 1_000_000;

describe("detectSpikes spec invariants", () => {
  it("flags a month above 3% of total supply", () => {
    const monthly = [0, 31_000, 0]; // 3.1% of S
    const circ = [0, 31_000, 31_000];
    const spikes = detectSpikes(monthly, circ, S);
    expect(spikes.map((s) => s.month)).toEqual([1]);
    expect(spikes[0].supplyPercent).toBeCloseTo(3.1, 5);
  });
  it("does not flag exactly 3% (strict >)", () => {
    expect(detectSpikes([0, 30_000], [0, 30_000], S)).toEqual([]);
  });
  it("flags above 10% of prior circulating even when small vs supply", () => {
    const BIG = 10_000_000;
    const monthly = [100_000, 10_100]; // month 0 = 1% of BIG; month 1 = 0.1% of BIG but 10.1% of circ(0)
    const circ = [100_000, 110_100];
    const spikes = detectSpikes(monthly, circ, BIG);
    expect(spikes.map((s) => s.month)).toEqual([1]);
  });
  it("does not flag exactly 10% of circulating (strict >)", () => {
    const BIG = 10_000_000;
    expect(detectSpikes([100_000, 10_000], [100_000, 110_000], BIG)).toEqual([]);
  });
  it("month 0 (TGE) is never flagged - the float is scored by TGE Readiness", () => {
    const spikes = detectSpikes([40_000, 0], [40_000, 40_000], S); // 4% at TGE
    expect(spikes).toEqual([]);
  });
  it("skips zero-unlock months", () => {
    expect(detectSpikes([0, 0, 0], [0, 0, 0], S)).toEqual([]);
  });
});
