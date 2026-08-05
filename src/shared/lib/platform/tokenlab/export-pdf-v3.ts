import jsPDF from "jspdf";
import type { AllocationBucket, VestingConfig } from "./types";
import type { StructureScore } from "./scoringV3";
import { getBucketDef } from "./buckets";
import { calcTotalMonthlyUnlocks, calcCumulativeCirculating } from "./unlocks";
import { detectSpikes } from "./spikes";
import { calcUnlockPressure12m, getPressureTag } from "./pressure";
import { calcInitialCircPercent } from "./calc";
import { compareWithMarket } from "./benchmarkNorms";

/** Structure Score PDF report (v3): score + tier + dimensions + fixes + chart. */

const C = {
  bg: "#06020C",
  surface: "#140D20",
  line: "#2A1838",
  magenta: "#E84690",
  text: "#F8F4F6",
  muted: "#9A8A92",
  good: "#4ADE80",
  medium: "#F59E0B",
  weak: "#F87171",
};

const PAGE_W = 210;
const PAGE_H = 297;
const M = 18;
const CW = PAGE_W - M * 2;

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
const setText = (d: jsPDF, h: string) => d.setTextColor(...rgb(h));
const setFill = (d: jsPDF, h: string) => d.setFillColor(...rgb(h));
const setDraw = (d: jsPDF, h: string) => d.setDrawColor(...rgb(h));

function pageBg(d: jsPDF) {
  setFill(d, C.bg);
  d.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function header(d: jsPDF, name: string, symbol: string) {
  setFill(d, "#FFFFFF");
  d.rect(M, M - 2, 1.6, 6, "F");
  d.rect(M + 2.4, M - 4, 1.6, 8, "F");
  d.rect(M + 4.8, M - 6, 1.6, 10, "F");
  setText(d, C.text);
  d.setFont("helvetica", "bold");
  d.setFontSize(11);
  d.text("8Blocks · Token Lab", M + 9, M + 2);
  d.setFont("helvetica", "normal");
  d.setFontSize(9);
  setText(d, C.muted);
  d.text(`${name} ($${symbol})`, PAGE_W - M, M + 2, { align: "right" });
  setDraw(d, C.line);
  d.line(M, M + 6, PAGE_W - M, M + 6);
}

function scoreColor(score: number): string {
  if (score >= 70) return C.good;
  if (score >= 55) return C.medium;
  return C.weak;
}

export function generatePdfReportV3(data: {
  name: string;
  symbol: string;
  totalSupply: number;
  allocations: AllocationBucket[];
  vestings: VestingConfig[];
  result: StructureScore;
}): void {
  const { name, symbol, totalSupply, allocations, vestings, result } = data;
  const d = new jsPDF({ unit: "mm", format: "a4" });

  /* ── page 1: score ── */
  pageBg(d);
  header(d, name || "Token model", symbol || "TOKEN");

  // score block
  let y = 44;
  const col = scoreColor(result.score);
  setText(d, C.muted);
  d.setFontSize(9);
  d.text("STRUCTURE SCORE", M, y - 8);
  setText(d, col);
  d.setFont("helvetica", "bold");
  d.setFontSize(54);
  d.text(String(result.score), M, y + 14);
  d.setFontSize(12);
  d.text(result.tier.name.toUpperCase(), M, y + 24);
  setText(d, C.muted);
  d.setFont("helvetica", "normal");
  d.setFontSize(9);
  d.text(`Scored as: ${result.archetype.label}`, M, y + 31);

  const metaX = M + 78;
  setText(d, C.text);
  d.setFontSize(10);
  const meaning = d.splitTextToSize(result.tier.meaning, CW - 78);
  d.text(meaning, metaX, y);
  setText(d, C.muted);
  d.setFontSize(9);
  const float = calcInitialCircPercent(allocations, vestings);
  const pressure = calcUnlockPressure12m(allocations, vestings, totalSupply);
  d.text(
    [
      `TGE float: ${float.toFixed(1)}%`,
      `12m unlock pressure: ${pressure.toFixed(1)}% (${getPressureTag(pressure)})`,
    ],
    metaX,
    y + 22,
  );

  // caps
  y += 42;
  for (const cap of result.caps) {
    setFill(d, C.surface);
    setDraw(d, C.weak);
    const capLines = d.splitTextToSize(cap.message, CW - 8);
    const h = capLines.length * 4.5 + 6;
    d.rect(M, y, CW, h, "FD");
    setText(d, C.weak);
    d.setFontSize(8.5);
    d.text(capLines, M + 4, y + 5.5);
    y += h + 4;
  }

  // dimensions
  y += 4;
  setText(d, C.muted);
  d.setFontSize(9);
  d.text("FIVE DIMENSIONS", M, y);
  y += 6;
  for (const dim of result.dimensions) {
    setText(d, C.text);
    d.setFontSize(10);
    d.text(dim.name, M, y);
    setText(d, scoreColor(dim.score));
    d.setFont("helvetica", "bold");
    d.text(String(dim.score), PAGE_W - M, y, { align: "right" });
    d.setFont("helvetica", "normal");
    setFill(d, C.surface);
    d.rect(M, y + 2, CW, 1.6, "F");
    setFill(d, scoreColor(dim.score));
    d.rect(M, y + 2, (CW * dim.score) / 100, 1.6, "F");
    setText(d, C.muted);
    d.setFontSize(7.5);
    const one = d.splitTextToSize(dim.oneLiner, CW);
    d.text(one, M, y + 7.5);
    y += 8 + one.length * 3.4 + 3;
  }

  // top fixes
  if (result.topFixes.length > 0) {
    y += 3;
    setText(d, C.magenta);
    d.setFontSize(9);
    d.text("TOP FIXES", M, y);
    y += 5.5;
    for (const f of result.topFixes) {
      setText(d, C.text);
      d.setFontSize(9);
      d.text(`• ${f.label}`, M, y);
      setText(d, C.good);
      d.text(`+${f.gain} pts`, PAGE_W - M, y, { align: "right" });
      y += 5.5;
    }
  }

  // footer
  setText(d, C.muted);
  d.setFontSize(7);
  d.text(
    "Structure-only analysis. This does not measure demand, product, or price. Not investment or legal advice.",
    M,
    PAGE_H - 12,
  );
  d.text("8blocks.io/product/calculator", PAGE_W - M, PAGE_H - 12, { align: "right" });

  /* ── page 2: allocation + unlock schedule + market norms ── */
  d.addPage();
  pageBg(d);
  header(d, name || "Token model", symbol || "TOKEN");

  y = 34;
  setText(d, C.muted);
  d.setFontSize(9);
  d.text("ALLOCATION", M, y);
  y += 6;
  const active = allocations.filter((a) => a.enabled && a.percent > 0);
  // stacked bar
  let x = M;
  for (const a of active) {
    const def = getBucketDef(a.key);
    const w = (CW * a.percent) / 100;
    setFill(d, def.color);
    d.rect(x, y, w, 6, "F");
    x += w;
  }
  y += 10;
  d.setFontSize(8);
  let lx = M;
  for (const a of active) {
    const def = getBucketDef(a.key);
    setFill(d, def.color);
    d.rect(lx, y - 2.5, 2.5, 2.5, "F");
    setText(d, C.text);
    const label = `${def.label} ${a.percent}%`;
    d.text(label, lx + 4, y);
    lx += d.getTextWidth(label) + 12;
    if (lx > PAGE_W - M - 30) {
      lx = M;
      y += 5;
    }
  }

  // unlock chart
  y += 12;
  setText(d, C.muted);
  d.setFontSize(9);
  d.text("UNLOCK SCHEDULE", M, y);
  y += 4;
  const chartH = 52;
  const chartY = y;
  const monthly = calcTotalMonthlyUnlocks(allocations, vestings, totalSupply);
  const circ = calcCumulativeCirculating(monthly);
  const spikes = new Set(detectSpikes(monthly, circ, totalSupply).map((s) => s.month));
  const n = monthly.length;
  const maxPct = Math.max(...monthly.map((m) => (m / totalSupply) * 100), 5);
  setFill(d, C.surface);
  d.rect(M, chartY, CW, chartH, "F");
  const bw = Math.max((CW / n) * 0.55, 0.5);
  for (let m = 0; m < n; m++) {
    if (monthly[m] <= 0) continue;
    const bx = M + (m / Math.max(n - 1, 1)) * CW;
    const bh = (((monthly[m] / totalSupply) * 100) / maxPct) * (chartH - 4);
    setFill(d, spikes.has(m) ? C.weak : "#5A4A62");
    d.rect(bx - bw / 2, chartY + chartH - bh, bw, bh, "F");
  }
  setDraw(d, C.magenta);
  d.setLineWidth(0.5);
  for (let m = 1; m < n; m++) {
    const x1 = M + ((m - 1) / (n - 1)) * CW;
    const x2 = M + (m / (n - 1)) * CW;
    const y1 = chartY + chartH - ((circ[m - 1] / totalSupply) * (chartH - 4));
    const y2 = chartY + chartH - ((circ[m] / totalSupply) * (chartH - 4));
    d.line(x1, y1, x2, y2);
  }
  y = chartY + chartH + 6;
  setText(d, C.muted);
  d.setFontSize(7.5);
  d.text("bars: monthly unlock (red = spike month) · line: circulating supply", M, y);

  // vs market
  y += 12;
  setText(d, C.muted);
  d.setFontSize(9);
  d.text("YOUR MODEL VS MARKET NORMS", M, y);
  y += 7;
  for (const c of compareWithMarket(allocations, vestings)) {
    setText(d, C.text);
    d.setFontSize(9.5);
    d.text(c.label, M, y);
    d.text(c.yours, M + 70, y);
    setText(d, c.status === "within" ? C.good : C.medium);
    d.text(c.status === "within" ? "within norm" : c.status, M + 100, y);
    setText(d, C.muted);
    d.text(`norm ${c.norm}`, PAGE_W - M, y, { align: "right" });
    y += 6.5;
  }

  setText(d, C.muted);
  d.setFontSize(7);
  d.text(
    "Norms compiled from published market research - see 8blocks.io/learn/token-vesting-benchmarks.",
    M,
    PAGE_H - 12,
  );

  d.save(`${(symbol || "token").toLowerCase()}-structure-score.pdf`);
}
