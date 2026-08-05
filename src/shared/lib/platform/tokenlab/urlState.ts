import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { AllocationBucket, StandardBucketKey, VestingConfig } from "./types";
import type { TokenModel } from "./model";
import { STANDARD_BUCKETS } from "./buckets";

/**
 * Compact wire format (versioned):
 * [1, name, symbol, totalSupply, [[key, percent, enabled], ...], [[key, tge, cliff, vesting], ...]]
 */
type Wire = [
  1,
  string,
  string,
  number,
  [StandardBucketKey, number, 0 | 1][],
  [StandardBucketKey, number, number, number][],
];

const VALID_KEYS = new Set(STANDARD_BUCKETS.map((b) => b.key));
const EXPECTED_KEY_COUNT = STANDARD_BUCKETS.length;

function hasFullUniqueSet(rows: unknown[][]): boolean {
  if (rows.length !== EXPECTED_KEY_COUNT) return false;
  const keys = new Set(rows.map((row) => row[0]));
  return keys.size === EXPECTED_KEY_COUNT && [...VALID_KEYS].every((key) => keys.has(key));
}

export function encodeModel(model: TokenModel): string {
  const wire: Wire = [
    1,
    model.name,
    model.symbol,
    model.totalSupply,
    model.allocations.map(
      (a) => [a.key, a.percent, a.enabled ? 1 : 0] as [StandardBucketKey, number, 0 | 1],
    ),
    model.vestings.map(
      (v) =>
        [v.bucketKey, v.tgePercent, v.cliffMonths, v.vestingMonths] as [
          StandardBucketKey,
          number,
          number,
          number,
        ],
    ),
  ];
  return compressToEncodedURIComponent(JSON.stringify(wire));
}

function num(v: unknown, min: number, max: number): number | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return Math.min(max, Math.max(min, v));
}

/** Decode a shared model. Returns null on any malformed input — never throws. */
export function decodeModel(encoded: string): TokenModel | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const wire = JSON.parse(json) as Wire;
    if (!Array.isArray(wire) || wire[0] !== 1) return null;
    const [, name, symbol, totalSupply, allocs, vests] = wire;
    if (typeof name !== "string" || typeof symbol !== "string") return null;
    const supply = num(totalSupply, 1, 1e18);
    if (supply === null) return null;
    if (!Array.isArray(allocs) || !Array.isArray(vests)) return null;
    if (!hasFullUniqueSet(allocs) || !hasFullUniqueSet(vests)) return null;

    const allocations: AllocationBucket[] = [];
    for (const row of allocs) {
      if (!Array.isArray(row) || row.length !== 3 || !VALID_KEYS.has(row[0])) return null;
      if (row[2] !== 0 && row[2] !== 1) return null;
      const percent = num(row[1], 0, 100);
      if (percent === null) return null;
      allocations.push({ key: row[0], percent, enabled: row[2] === 1 });
    }

    const vestings: VestingConfig[] = [];
    for (const row of vests) {
      if (!Array.isArray(row) || row.length !== 4 || !VALID_KEYS.has(row[0])) return null;
      const tgePercent = num(row[1], 0, 100);
      const cliffMonths = num(row[2], 0, 120);
      const vestingMonths = num(row[3], 0, 240);
      if (tgePercent === null || cliffMonths === null || vestingMonths === null) return null;
      vestings.push({ bucketKey: row[0], tgePercent, cliffMonths, vestingMonths });
    }

    return {
      name: name.slice(0, 64),
      symbol: symbol.slice(0, 8),
      totalSupply: supply,
      fdv: null,
      allocations,
      vestings,
    };
  } catch {
    return null;
  }
}
