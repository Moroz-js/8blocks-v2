/**
 * Number formatting utilities — space-separated thousands.
 * Used consistently across all screens.
 */

/** Format number with space-separated thousands: 1 000 000 000 */
export function fmtSpace(n: number): string {
  const parts = Math.round(n).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009"); // thin space
  return parts.join(".");
}

/** Compact short form: 1B, 100M, 1.5K */
export function fmtShort(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1)}K`;
  return fmtSpace(n);
}

/** Token amount from supply and percentage */
export function fmtTokens(supply: number, pct: number): string {
  return fmtShort(supply * pct / 100);
}

/** "Mixed" → "Moderate" for display; maps internal status to user-facing label */
export function statusLabel(status: "Strong" | "Mixed" | "Weak"): string {
  return { Strong: "Strong", Mixed: "Moderate", Weak: "Weak" }[status];
}
