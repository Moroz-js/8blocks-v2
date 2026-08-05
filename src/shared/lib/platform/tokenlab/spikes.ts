export interface SpikeDetail {
  month: number;
  tokens: number;
  supplyPercent: number;
  circPercent: number;
}

const SUPPLY_THRESHOLD = 0.03;
const CIRC_THRESHOLD = 0.1;

/**
 * Spec: month m is a spike if unlock(m)/S > 3% OR unlock(m)/circ(m-1) > 10%.
 * Month 0 (TGE) is excluded: the launch float is a deliberate decision scored
 * separately by the TGE Readiness dimension, not a concentration anomaly.
 */
export function detectSpikes(
  monthly: number[],
  circulating: number[],
  totalSupply: number,
): SpikeDetail[] {
  const spikes: SpikeDetail[] = [];
  for (let m = 1; m < monthly.length; m++) {
    const unlock = monthly[m];
    if (unlock <= 0) continue;
    const supplyRatio = totalSupply > 0 ? unlock / totalSupply : 0;
    const prevCirc = m > 0 ? circulating[m - 1] : 0;
    const circRatio = prevCirc > 0 ? unlock / prevCirc : 0;
    if (supplyRatio > SUPPLY_THRESHOLD || circRatio > CIRC_THRESHOLD) {
      spikes.push({
        month: m,
        tokens: unlock,
        supplyPercent: supplyRatio * 100,
        circPercent: circRatio * 100,
      });
    }
  }
  return spikes;
}
