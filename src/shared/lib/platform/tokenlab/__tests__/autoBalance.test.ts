import { describe, it, expect } from "vitest";
import { autoBalance } from "../autoBalance";
import type { AllocationBucket } from "../types";
import { calcTotalPercent } from "../validate";

function total(a: AllocationBucket[]): number {
  return calcTotalPercent(a);
}

describe("autoBalance", () => {
  it("scales an under-allocated model to exactly 100", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 30, enabled: true },
      { key: "community", percent: 40, enabled: true },
      { key: "treasury", percent: 27, enabled: true },
    ];
    expect(total(autoBalance(a))).toBe(100);
  });

  it("scales an over-allocated model down to exactly 100", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 50, enabled: true },
      { key: "investors", percent: 40, enabled: true },
      { key: "community", percent: 33, enabled: true },
    ];
    expect(total(autoBalance(a))).toBe(100);
  });

  it("keeps disabled buckets untouched and handles the zero case", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 97, enabled: true },
      { key: "investors", percent: 55, enabled: false },
    ];
    const out = autoBalance(a);
    expect(out.find((x) => x.key === "investors")!.percent).toBe(55);
    expect(total(out)).toBe(100);
    expect(autoBalance([{ key: "team", percent: 0, enabled: true }])).toEqual([
      { key: "team", percent: 0, enabled: true },
    ]);
  });
});
