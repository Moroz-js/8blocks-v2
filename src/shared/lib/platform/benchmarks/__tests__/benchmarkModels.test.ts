import { describe, expect, it } from "vitest";
import raw from "../projects.json";
import { getDefaultVestingConfigs, STANDARD_BUCKETS } from "../../tokenlab/buckets";
import type { StandardBucketKey, VestingConfig } from "../../tokenlab/types";
import { calcInitialCircPercent } from "../../tokenlab/calc";
import { decodeModel, encodeModel } from "../../tokenlab/urlState";

/**
 * Every benchmark project forked into the calculator must reproduce its
 * published TGE float. This is the contract Sergey caught being broken:
 * the card said HYPE floated ~31% while the fork showed a tiny float,
 * because forks used generic default vesting instead of real terms.
 */

interface VestingSpec {
  tgePercent: number;
  cliffMonths: number;
  vestingMonths: number;
}
interface Project {
  name: string;
  symbol: string;
  tgeFloat?: string;
  templateMapping: Record<StandardBucketKey, number>;
  vestingMapping?: Partial<Record<StandardBucketKey, VestingSpec>>;
  audited?: boolean;
  auditUrl?: string;
}
const projects: Project[] = (
  raw as { categories: { projects: Project[] }[] }
).categories.flatMap((c) => c.projects);

function buildFork(p: Project) {
  const vestings: VestingConfig[] = getDefaultVestingConfigs().map((v) => {
    const real = p.vestingMapping?.[v.bucketKey];
    return real ? { bucketKey: v.bucketKey, ...real } : v;
  });
  const allocations = STANDARD_BUCKETS.map((b) => {
    const pct = p.templateMapping[b.key] ?? 0;
    return { key: b.key, percent: pct, enabled: pct > 0 };
  });
  return { allocations, vestings };
}

describe("benchmark fork models", () => {
  it("covers every project with a vestingMapping", () => {
    for (const p of projects) {
      expect(p.vestingMapping, `${p.symbol} lacks vestingMapping`).toBeTruthy();
    }
  });

  it("maps vesting only onto buckets that exist in the allocation", () => {
    for (const p of projects) {
      for (const key of Object.keys(p.vestingMapping ?? {})) {
        expect(
          p.templateMapping[key as StandardBucketKey],
          `${p.symbol}: vestingMapping has ${key} but allocation is 0`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("reproduces the published TGE float within 5 percentage points", () => {
    const checked: string[] = [];
    for (const p of projects) {
      const m = p.tgeFloat?.match(/~?(\d+(?:\.\d+)?)/);
      if (!m || !p.tgeFloat || /^Not\b/i.test(p.tgeFloat)) continue;
      const published = parseFloat(m[1]);
      const { allocations, vestings } = buildFork(p);
      const computed = calcInitialCircPercent(allocations, vestings);
      expect(
        Math.abs(computed - published),
        `${p.symbol}: computed TGE float ${computed.toFixed(1)}% vs published ~${published}%`,
      ).toBeLessThanOrEqual(5);
      checked.push(p.symbol);
    }
    // The regression that triggered this test must stay covered.
    expect(checked).toContain("HYPE");
    expect(checked.length).toBeGreaterThanOrEqual(10);
  });

  it("survives the strict shared URL roundtrip used by calculator forks", () => {
    for (const project of projects) {
      const fork = buildFork(project);
      const encoded = encodeModel({
        name: project.name,
        symbol: project.symbol,
        totalSupply: 1_000_000_000,
        fdv: null,
        ...fork,
      });
      const decoded = decodeModel(encoded);
      expect(decoded, `${project.symbol}: invalid fork URL model`).not.toBeNull();
      expect(decoded?.allocations).toHaveLength(STANDARD_BUCKETS.length);
      expect(decoded?.vestings).toHaveLength(STANDARD_BUCKETS.length);
    }
  });

  it("audited projects carry their public audit link", () => {
    const audited = projects.filter((p) => p.audited);
    expect(audited.map((p) => p.symbol).sort()).toEqual(["HYPE", "STON", "VIRTUAL"]);
    for (const p of audited) {
      expect(p.auditUrl).toMatch(/^https:\/\/8blocks\.io\/audits\//);
    }
  });
});
