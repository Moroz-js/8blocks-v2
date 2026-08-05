import type { AllocationBucket, VestingConfig } from "./types";
import { getDefaultAllocations, getDefaultVestingConfigs } from "./buckets";

export interface TokenModel {
  name: string;
  symbol: string;
  totalSupply: number;
  fdv: number | null;
  allocations: AllocationBucket[];
  vestings: VestingConfig[];
}

export function createDefaultModel(): TokenModel {
  return {
    name: "",
    symbol: "",
    totalSupply: 1_000_000_000,
    fdv: null,
    allocations: getDefaultAllocations(),
    vestings: getDefaultVestingConfigs(),
  };
}
