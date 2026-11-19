// Height fields for the binary-digit relief icons, ported verbatim from the designer's
// project/binary-glyph-wide.js (a superset of project/binary-glyph.js).
// Each shape maps x, y in [-1, 1] (wide scenes span about ±2.8) to a height, or NONE.
/* eslint-disable */

const hash = (a, b, c) => { let h = (a * 374761393 + b * 668265263 + c * 2246822519) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sm = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
const NONE = -Infinity;
// height fields in a unit box x,y ∈ [-1,1]; return height (bigger = nearer) or NONE
const SHAPES = {
  ring(x, y) { const r = Math.hypot(x, y * 1.12), d = Math.abs(r - 0.6); if (d >= 0.27) return NONE; const a = Math.atan2(y, x); return Math.sqrt(0.27 * 0.27 - d * d) * 1.8 + 0.025 * Math.cos((r - 0.6) * 60); },
  coins(x, y) {
    let best = NONE;
    for (let i = 0; i < 3; i++) {
      const cy = -0.5 + i * 0.4, ex = x / 0.8, ey = (y - cy) / 0.3, d = ex * ex + ey * ey, top = 1.0 - i * 0.3;
      if (d <= 1) best = Math.max(best, top - 0.12 * ey + 0.05 * (1 - d) + 0.03 * Math.cos(Math.sqrt(d) * 14) * sm(0.15, 0.5, d));
      else if (y > cy) { const ey2 = (y - cy - 0.22) / 0.3; if (ex * ex + ey2 * ey2 <= 1) best = Math.max(best, top - 0.35 - 0.3 * Math.abs(ex)); }
    }
    return best;
  },
  globe(x, y) {
    const r = Math.hypot(x, y); if (r > 0.84) return NONE;
    const z = Math.sqrt(0.84 * 0.84 - r * r), lon = Math.atan2(x, z), lat = Math.asin(y / 0.84);
    const g = Math.pow(Math.max(0, 1 - Math.abs(Math.sin(lon * 2)) / 0.3), 2);
    const g2 = Math.pow(Math.max(0, 1 - Math.abs(Math.sin(lat * 3)) / 0.3), 2); return z * 1.3 - 0.05 * g - 0.05 * g2;
  },
  cube(x, y) {
    const s = 0.78, h = 0.4, L = 0.8; y += 0.1;
    if (Math.abs(x) / s + Math.abs(y + h) / h <= 1) return 1.1 - 0.5 * (y + h) + 0.04 * Math.cos((Math.abs(x) / s + Math.abs(y + h) / h) * 9);
    if (x <= 0 && x >= -s) { const e = h * x / s; if (y >= e && y <= e + L) return 0.6 + 0.7 * (x / s); }
    if (x > 0 && x <= s) { const e = -h * x / s; if (y >= e && y <= e + L) return 0.6 - 0.7 * (x / s); }
    return NONE;
  },
  gear(x, y) {
    const r = Math.hypot(x, y), a = Math.atan2(y, x);
    const R = 0.62 + 0.12 * sm(-0.3, 0.6, Math.cos(a * 8));
    if (r > R || r < 0.26) return NONE;
    const hub = 0.05 * Math.cos((r - 0.26) * 40) * sm(0.3, 0.36, r) * (1 - sm(0.5, 0.56, r));
    return 0.55 + 0.4 * (1 - (r / R) * (r / R)) - (r < 0.34 ? 0.2 * (1 - (r - 0.26) / 0.08) : 0) + hub;
  },
  pyramid(x, y) { const z = (1 - (Math.abs(x) / 0.95 + Math.abs(y + 0.1) / 0.68)) * 1.2; return z > 0 ? z : NONE; },
  orbit(x, y) {
    let z = NONE;
    const r = Math.hypot(x, y); if (r < 0.5) { z = Math.sqrt(0.5 * 0.5 - r * r) * 1.5 + 0.2; }
    const d = Math.hypot(x / 0.95, y / 0.34), band = Math.abs(d - 1);
    if (band < 0.1) { const rz = Math.sqrt(0.1 * 0.1 - band * band) * 1.5 + (y > 0 ? 0.9 : -0.1); if (rz > z) z = rz; }
    return z;
  },
  twin(x, y) {
    let z = NONE;
    for (const [cx, s] of [[-0.36, 1], [0.36, -1]]) {
      const r = Math.hypot(x - cx, y * 1.05), d = Math.abs(r - 0.5);
      if (d < 0.16) { const h = Math.sqrt(0.16 * 0.16 - d * d) * 1.8 + (s * y > 0 ? 0.12 : -0.12); if (h > z) z = h; }
    }
    return z;
  },
};

const seg = (x, y, ang, len, w) => { const c = Math.cos(ang), s = Math.sin(ang), t = x * c + y * s, p = Math.abs(-x * s + y * c); return (t > -0.06 && t < len && p < w) ? 1 - p / w : -1; };
const line = (x, y, x0, y0, x1, y1, w) => { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy, t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L)); return Math.hypot(x - x0 - t * dx, y - y0 - t * dy) < w; };
const HANDS = (x, y) => seg(x, y, -Math.PI / 2, 0.5, 0.04) >= 0 || seg(x, y, Math.PI / 6, 0.34, 0.05) >= 0 || Math.hypot(x, y) < 0.075;
const DOLLAR = (u, v) => {
  const T = 0.075; let best = -1;
  const arc = (cy, ok) => { const dv = v - cy, rr = Math.hypot(u, dv), b = Math.abs(rr - 0.22); if (b < T && ok(Math.atan2(dv, u))) best = Math.max(best, 1 - b / T); };
  arc(-0.2, (a) => a >= Math.PI / 2 || a <= -0.45);
  arc(0.2, (a) => a >= -Math.PI / 2 && a <= Math.PI - 0.45);
  if (Math.abs(u) < 0.045 && Math.abs(v) < 0.62) best = Math.max(best, 1 - Math.abs(u) / 0.045);
  return best;
};
const COIN8 = (x, y) => { const u = x / 0.8, v = y / 0.8; if (Math.hypot(u, v) > 0.8) return false; return DOLLAR(u, v) >= 0; };
const TARGET_HI = (x, y) => { const r = Math.hypot(x + 0.08, y - 0.08); if (r < 0.78 && (Math.abs(r % 0.2 - 0.1) > 0.075 || r < 0.06)) return true; const [d] = segD(x, y, -0.08, 0.08, 0.72, -0.72); if (d < 0.03) return true; for (const o of [0, 0.12]) { const ax = 0.62 + o, ay = -0.62 - o; if (Math.abs((x - ax) + (y - ay)) < 0.05 && x > ax - 0.02 && x < ax + 0.22 && y < ay + 0.02 && y > ay - 0.22) return true; } return false; };
const DEED_HI = (x, y) => { if (Math.abs(y + 0.62) < 0.05 && Math.abs(x) < 0.3) return true; for (let i = 0; i < 6; i++) { const ly = -0.4 + i * 0.15, lw = i === 5 ? -0.05 : (i % 2 ? 0.28 : 0.42); if (Math.abs(y - ly) < 0.03 && x > -0.42 && x < lw) return true; } const sr = Math.hypot(x - 0.3, y - 0.52); if (Math.abs(sr - 0.17) < 0.03 || (sr > 0.22 && sr < 0.27 && Math.cos(Math.atan2(y - 0.52, x - 0.3) * 12) > 0)) return true; return false; };
const segD = (x, y, x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy, t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L)); return [Math.hypot(x - x0 - t * dx, y - y0 - t * dy), t]; };
const tube = (d, w, base, k) => d < w ? base + k * Math.sqrt(1 - (d / w) * (d / w)) : NONE;
const NEEDLE = (x, y) => { const [d] = segD(x, y, 0, 0.12, 0.36, -0.36); return d < 0.05 || Math.hypot(x, y - 0.12) < 0.1; };
const BANG = (x, y) => (Math.abs(x) < 0.06 && y > -0.28 && y < 0.24) || Math.hypot(x, y - 0.42) < 0.075;
const rbox = (x, y, x0, y0, x1, y1, r) => { const cx = Math.max(x0 + r, Math.min(x1 - r, x)), cy = Math.max(y0 + r, Math.min(y1 - r, y)); const d = Math.hypot(x - cx, y - cy); return d <= r ? 1 - d / r : -1; };
Object.assign(SHAPES, {
  buckets(x, y) {
    let z = NONE;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const x0 = -0.92 + c * 0.47, y0 = -0.5 + r * 0.52, x1 = x0 + 0.4, y1 = y0 + 0.44;
      if (x >= x0 && x <= x1 && y >= y0 && y <= y1) { const e = Math.min(x - x0, x1 - x, y - y0, y1 - y); const h = 0.35 + 0.25 * Math.min(1, e / 0.06) + (r * 4 + c) * 0.025; if (h > z) z = h; }
    }
    return z;
  },
  bars(x, y) {
    let z = NONE;
    const hs = [0.25, 0.42, 0.38, 0.62, 0.55, 0.85];
    for (let i = 0; i < 6; i++) {
      const x0 = -0.9 + i * 0.31, x1 = x0 + 0.22, top = 0.72 - hs[i] * 1.3;
      if (x >= x0 && x <= x1 && y >= top && y <= 0.72) { const e = Math.min(x - x0, x1 - x, y - top); const h = 0.4 + 0.2 * Math.min(1, e / 0.06); if (h > z) z = h; }
    }
    if (y > 0.76 && y < 0.82 && x > -0.95 && x < 0.95) z = Math.max(z, 0.45);
    return z;
  },
  gauge(x, y) {
    y -= 0.12; const r = Math.hypot(x, y), a = Math.atan2(y, x);
    let z = NONE;
    if (y <= 0.2 && r > 0.6 && r < 0.86) { const t = (r - 0.73) / 0.13; z = 0.45 + 0.2 * Math.sqrt(Math.max(0, 1 - t * t)); if (Math.abs(Math.sin(a * 5)) < 0.06) z -= 0.12; }
    if (NEEDLE(x, y + 0.12)) z = Math.max(z, 0.7);
    return z;
  },
  warn(x, y) {
    const yy = y + 0.05, h = 0.85;
    const inside = yy <= 0.7 && yy >= -h && Math.abs(x) <= (yy + h) * 0.62;
    if (!inside) return NONE;
    const e = Math.min(0.7 - yy, ((yy + h) * 0.62 - Math.abs(x)) * 0.85);
    let z = 0.38 + 0.22 * Math.min(1, e / 0.08);
    if (BANG(x, y)) z = 0.72;
    return z;
  },
  file(x, y) {
    const x0 = -0.62, x1 = 0.62, y0 = -0.85, y1 = 0.85, f = 0.34;
    if (x < x0 || x > x1 || y < y0 || y > y1) return NONE;
    if (x > x1 - f && y < y0 + f && (x - (x1 - f)) > (y - y0)) return NONE;
    let z = 0.35 + 0.08 * Math.min(1, Math.min(x - x0, x1 - x, y - y0, y1 - y) / 0.05);
    if (x > x1 - f && y < y0 + f) z = 0.55 - 0.2 * ((x - (x1 - f)) / f);
    for (const ly of [-0.2, 0.05, 0.3, 0.55]) if (Math.abs(y - ly) < 0.04 && x > -0.4 && x < (ly > 0.4 ? 0.05 : 0.4)) z += 0.16;
    { const r = Math.hypot(x + 0.15, y - 0.6); if (r < 0.14 && r > 0.07) z += 0.1; }
    return z;
  },
  tag(x, y) {
    const u = x * 0.707 + y * 0.707, v = -x * 0.707 + y * 0.707;
    const inBody = u > -0.55 && u < 0.75 && Math.abs(v) < 0.42;
    const nose = u <= -0.55 && u > -0.95 && Math.abs(v) < 0.42 * (u + 0.95) / 0.4;
    if (!inBody && !nose) return NONE;
    let z = 0.42 - 0.08 * (1 - Math.min(1, (0.42 - Math.abs(v)) / 0.07));
    if (Math.hypot(u + 0.5, v) < 0.1) return NONE;
    if (Math.abs(Math.hypot(u + 0.5, v) - 0.15) < 0.03) z += 0.1;
    return z;
  },
  compass(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    if (Math.abs(x) < 0.045 && y > -0.98 && y < -0.78) M(tube(Math.abs(x), 0.045, 0.55, 0.15));
    for (const ex of [-0.48, 0.48]) { const [d, t] = segD(x, y, 0, -0.72, ex, 0.82); M(tube(d, 0.11 - 0.07 * t, 0.45, 0.22)); }
    for (const ex of [-0.48, 0.48]) { const [d] = segD(x, y, ex * 0.92, 0.72, ex, 0.95); M(tube(d, 0.02, 0.5, 0.1)); }
    { const r = Math.hypot(x, y + 0.72); if (r < 0.13) M(0.7 + 0.15 * Math.sqrt(1 - (r / 0.13) ** 2) - (r < 0.04 ? 0.1 : 0)); }
    { const r = Math.hypot(x, y + 0.72), b = Math.abs(r - 0.95); const a = Math.atan2(y + 0.72, x); if (b < 0.03 && a > 1.1 && a < 2.05) M(tube(b, 0.03, 0.5, 0.1)); }
    return z;
  },
  crane(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const L = (x0, y0, x1, y1, w, b, k) => { const [d] = segD(x, y, x0, y0, x1, y1); M(tube(d, w, b, k)); };
    const mx = -0.3, hw = 0.075;
    L(mx - hw, -0.58, mx - hw, 0.88, 0.028, 0.55, 0.15); L(mx + hw, -0.58, mx + hw, 0.88, 0.028, 0.55, 0.15);
    for (let yy = -0.58; yy < 0.86; yy += 0.18) { L(mx - hw, yy, mx + hw, yy + 0.18, 0.018, 0.45, 0.1); L(mx - hw, yy + 0.18, mx + hw, yy + 0.18, 0.016, 0.45, 0.08); }
    L(-0.82, -0.6, 0.92, -0.6, 0.03, 0.6, 0.16); L(-0.82, -0.5, 0.92, -0.53, 0.02, 0.5, 0.1);
    for (let xx = -0.8; xx < 0.9; xx += 0.14) L(xx, -0.6, xx + 0.07, -0.515, 0.014, 0.42, 0.08);
    L(mx, -0.92, mx, -0.6, 0.025, 0.55, 0.12); L(mx, -0.92, 0.9, -0.6, 0.012, 0.5, 0.06); L(mx, -0.92, -0.8, -0.6, 0.012, 0.5, 0.06);
    if (x > -0.84 && x < -0.58 && y > -0.5 && y < -0.32) M(0.62 + 0.08 * (1 - Math.abs(y + 0.41) / 0.09));
    if (x > mx - 0.12 && x < mx + 0.16 && y > -0.75 && y < -0.62) M(0.66);
    L(0.55, -0.5, 0.55, 0.12, 0.012, 0.5, 0.06);
    if (x > 0.48 && x < 0.62 && y > -0.56 && y < -0.48) M(0.65);
    { const r = Math.hypot(x - 0.55, y - 0.2), b = Math.abs(r - 0.07); if (b < 0.022 && (y > 0.18 || x < 0.55)) M(tube(b, 0.022, 0.6, 0.12)); }
    if (Math.abs(x - mx) < 0.28 && y > 0.86 && y < 0.95) M(0.5 + 0.1 * (1 - Math.abs(x - mx) / 0.28));
    return z;
  },
  hardhat(x, y) {
    let z = NONE;
    const d = Math.hypot(x / 0.72, (y - 0.2) / 0.78);
    if (d <= 1 && y <= 0.2) { z = 0.3 + 0.55 * Math.sqrt(1 - d * d); if (Math.abs(x) < 0.09 && y < 0.1) z += 0.07 * (1 - Math.abs(x) / 0.09); const a = Math.abs(x) / 0.72; if (Math.abs(a - 0.45) < 0.03) z -= 0.05; }
    if (y > 0.18 && y < 0.36 && Math.abs(x) < 0.92) { const t = (y - 0.27) / 0.09; const bz = 0.55 + 0.12 * Math.sqrt(Math.max(0, 1 - t * t)) - 0.25 * Math.pow(Math.abs(x) / 0.92, 4); if (bz > z) z = bz; }
    return z;
  },
  team(x, y) {
    let z = NONE;
    const fig = (cx, cy, s, base) => {
      const hx = (x - cx) / s, hy = (y - cy) / s;
      const rh = Math.hypot(hx, hy + 0.42); if (rh < 0.24) { const v = base + 0.3 * Math.sqrt(1 - (rh / 0.24) ** 2); if (v > z) z = v; }
      const e = Math.hypot(hx / 0.44, (hy - 0.4) / 0.5); if (e < 1 && hy < 0.55 && hy > -0.12) { const v = base - 0.05 + 0.3 * Math.sqrt(1 - e * e); if (v > z) z = v; }
    };
    fig(-0.56, 0.08, 0.78, 0.2); fig(0.56, 0.08, 0.78, 0.2); fig(0, 0.12, 1, 0.42);
    return z;
  },
  clock(x, y) {
    const r = Math.hypot(x, y); if (r > 0.8) return NONE;
    let z;
    if (r > 0.64) { const t = (r - 0.72) / 0.08; z = 0.55 + 0.35 * Math.sqrt(Math.max(0, 1 - t * t)); }
    else z = 0.08 + 0.12 * Math.pow(r / 0.64, 2);
    const a = Math.atan2(y, x), ta = Math.round(a / (Math.PI / 6)) * (Math.PI / 6);
    if (r > 0.5 && r < 0.6 && Math.abs(Math.sin(a - ta)) * r < 0.028) z = Math.max(z, 0.4);
    if (HANDS(x, y)) z = Math.max(z, 0.62);
    return z;
  },
  coin(x, y) {
    const u = x / 0.8, v = y / 0.8, d = Math.hypot(u, v);
    if (d > 1) return NONE;
    let z;
    if (d > 0.8) { const t = (d - 0.9) / 0.1; z = 0.62 + 0.22 * Math.sqrt(Math.max(0, 1 - t * t)); }
    else z = 0.36 + 0.06 * (1 - d * d);
    const ds = DOLLAR(u, v); if (ds >= 0) z = Math.max(z, 0.8 + 0.14 * Math.sqrt(ds));
    return z;
  },
  flag(x, y) {
    const px = x + 0.62;
    if (Math.abs(px) < 0.045 && y > -0.86 && y < 0.88) return 0.6 + Math.sqrt(0.045 * 0.045 - px * px) * 4;
    if (Math.hypot(px, y + 0.88) < 0.075) return 0.7 + Math.sqrt(Math.max(0, 0.075 * 0.075 - px * px - (y + 0.88) * (y + 0.88))) * 3;
    if (y > 0.86 && y < 0.92 && Math.abs(px) < 0.2) return 0.5;
    const u = x + 0.58; if (u < 0 || x > 0.82) return NONE;
    const w = 0.08 * Math.sin(u * 5.2) * Math.min(1, u * 3), top = -0.8 + w, bot = -0.06 + w;
    if (y < top || y > bot) return NONE;
    return 0.45 + 0.14 * Math.cos(u * 5.2) * Math.min(1, u * 3);
  },
  kettlebell(x, y) {
    let z = NONE;
    const by = y - 0.22, d = Math.hypot(x, by);
    if (d < 0.6 && y < 0.78) z = Math.sqrt(0.6 * 0.6 - d * d) * 1.3 + 0.1;
    const e = Math.hypot(x / 0.4, (y + 0.36) / 0.42), band = Math.abs(e - 1);
    if (band < 0.24 && y < -0.02) { const hz = 0.35 + Math.sqrt(0.24 * 0.24 - band * band) * 1.4; if (hz > z) z = hz; }
    return z;
  },
  blueprint(x, y) {
    const xs = x - 0.14 * y;
    if (y < -0.62 || y > 0.62) return NONE;
    if (xs > 0.68 && xs < 0.84) return 0.3 + Math.sqrt(Math.max(0, 0.08 * 0.08 - (xs - 0.76) * (xs - 0.76))) * 3.5;
    if (xs < -0.84 || xs > 0.68) return NONE;
    let z = 0.3 - 0.06 * y;
    const W = 0.022;
    const L = [[-0.64, -0.42, 0.5, -0.42], [0.5, -0.42, 0.5, 0.42], [0.5, 0.42, -0.64, 0.42], [-0.64, 0.42, -0.64, -0.42], [-0.1, -0.42, -0.1, 0.02], [-0.64, 0.1, -0.28, 0.1], [-0.1, 0.1, 0.5, 0.1], [0.18, 0.1, 0.18, 0.42]];
    for (const s of L) if (line(xs, y, s[0], s[1], s[2], s[3], W)) { z += 0.07; break; }
    if (Math.abs(y + 0.53) < 0.012 && xs > -0.64 && xs < 0.5 && Math.cos(xs * 60) > -0.2) z += 0.05;
    return z;
  },
});

Object.assign(SHAPES, {
  cliff(x, y) {
    // flat locked period, vertical cliff, then linear vesting ramp
    let z = NONE;
    const base = 0.62;
    const top = x < -0.2 ? 0.42 : x < 0.85 ? 0.42 - (x + 0.2) / 1.05 * 1.12 : -0.7;
    if (x > -0.92 && x < 0.9 && y > top && y < base) { const e = Math.min(y - top, base - y, x + 0.92, 0.9 - x); z = 0.38 + 0.22 * Math.min(1, e / 0.07); }
    if (x > -0.25 && x < -0.17 && y > -0.05 && y < 0.42) z = Math.max(z, 0.7);
    if (y > 0.66 && y < 0.72 && x > -0.95 && x < 0.95) z = Math.max(z, 0.45);
    { const r = Math.hypot(x + 0.55, y - 0.12); if (r < 0.12) z = Math.max(z, 0.72); }
    return z;
  },
  floor(x, y) {
    let z = NONE;
    const hs = [0.35, 0.5, 0.42, 0.95];
    for (let i = 0; i < 4; i++) {
      const x0 = -0.85 + i * 0.44, x1 = x0 + 0.3, t = 0.75 - hs[i] * 1.25;
      if (x >= x0 && x <= x1 && y >= t && y <= 0.75) { const e = Math.min(x - x0, x1 - x, y - t); z = Math.max(z, (i === 3 ? 0.55 : 0.38) + 0.2 * Math.min(1, e / 0.06)); }
    }
    if (Math.abs(y - 0.05) < 0.025 && x > -0.95 && x < 0.95 && Math.cos(x * 30) > -0.3) z = Math.max(z, 0.75);
    { const [d] = segD(x, y, 0.63, -0.72, 0.63, -0.95); if (d < 0.035) z = Math.max(z, 0.75); }
    if (y < -0.62 && y > -0.86 && Math.abs(x - 0.63) < (y + 0.86) * 0.7) z = Math.max(z, 0.75);
    return z;
  },
  spike(x, y) {
    let z = NONE;
    for (let i = 0; i < 9; i++) {
      const x0 = -0.92 + i * 0.205, x1 = x0 + 0.14, h = i === 4 ? 1.45 : 0.42 + 0.06 * Math.sin(i * 1.7);
      const t = 0.72 - h;
      if (x >= x0 && x <= x1 && y >= t && y <= 0.72) { const e = Math.min(x - x0, x1 - x, y - t); z = Math.max(z, (i === 4 ? 0.5 : 0.36) + 0.2 * Math.min(1, e / 0.05)); }
    }
    if (Math.abs(y - 0.18) < 0.022 && x > -0.95 && x < 0.95) z = Math.max(z, 0.78);
    return z;
  },
  buoy(x, y) {
    let z = NONE;
    const r = Math.hypot(x, (y + 0.12) * 1.05), d = Math.abs(r - 0.48);
    if (d < 0.2) { const a = Math.atan2(y + 0.12, x); z = 0.45 + Math.sqrt(0.04 - d * d) * 2 + (Math.cos(a * 2) > 0.7 ? 0.08 : 0); }
    const wy = 0.55 + 0.06 * Math.sin(x * 9);
    if (Math.abs(y - wy) < 0.03 && Math.abs(x) < 0.98) z = Math.max(z, 0.6);
    const wy2 = 0.74 + 0.05 * Math.sin(x * 9 + 1.5);
    if (Math.abs(y - wy2) < 0.025 && Math.abs(x) < 0.85) z = Math.max(z, 0.48);
    return z;
  },
  tail(x, y) {
    let z = NONE;
    const u = (x + 0.95) / 1.9; if (u < 0 || u > 1) return NONE;
    const curve = 0.7 - 1.35 * (1 - Math.pow(1 - u, 2.2));
    if (y >= curve && y <= 0.7) { const e = Math.min(y - curve, 0.7 - y); z = 0.36 + 0.14 * Math.min(1, e / 0.08); if (Math.abs(y - curve) < 0.035) z = 0.7; }
    for (let k = 1; k < 4; k++) { const xx = -0.95 + k * 0.475; if (Math.abs(x - xx) < 0.012 && y > 0.72 && y < 0.82) z = Math.max(z, 0.6); }
    if (y > 0.7 && y < 0.74 && Math.abs(x) < 0.97) z = Math.max(z, 0.55);
    return z;
  },
  tranches(x, y) {
    let z = NONE;
    const r = Math.hypot(x + 0.18, y), a = Math.atan2(y, x + 0.18);
    const inSlice = a > -0.9 && a < 0.35;
    if (r < 0.72 && !inSlice) { const gap = Math.min(Math.abs(a + 0.9), Math.abs(a - 0.35)) * r; if (gap > 0.04) z = 0.4 + 0.25 * (1 - r / 0.72); }
    const ox = x + 0.18 - 0.22 * Math.cos(-0.27), oy = y - 0.22 * Math.sin(-0.27);
    const r2 = Math.hypot(ox, oy), a2 = Math.atan2(oy, ox);
    if (r2 < 0.72 && a2 > -0.86 && a2 < 0.31) {
      const band = Math.floor(r2 / 0.24), inner = r2 % 0.24;
      if (inner > 0.035 && Math.min(Math.abs(a2 + 0.86), Math.abs(a2 - 0.31)) * r2 > 0.03) z = 0.55 + 0.08 * band;
    }
    return z;
  },
});

Object.assign(SHAPES, {
  target(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const r = Math.hypot(x + 0.08, y - 0.08);
    if (r < 0.78) { const band = Math.floor(r / 0.2) % 2; M(0.35 + (band ? 0.05 : 0.22) + 0.15 * (1 - r / 0.78)); }
    { const [d] = segD(x, y, -0.08, 0.08, 0.72, -0.72); M(tube(d, 0.035, 0.85, 0.12)); }
    for (const o of [0, 0.12]) { const ax = 0.62 + o, ay = -0.62 - o; if (Math.abs((x - ax) + (y - ay)) < 0.05 && x > ax - 0.02 && x < ax + 0.22 && y < ay + 0.02 && y > ay - 0.22) M(0.8); }
    return z;
  },
  coinstack(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const stacks = [[-0.42, 5], [0.38, 3]];
    for (const [cx, n] of stacks) {
      const u = (x - cx) / 0.36; if (Math.abs(u) > 1) continue;
      const w = Math.sqrt(1 - u * u);
      for (let i = 0; i < n; i++) {
        const cy = 0.72 - i * 0.2, top = cy - 0.1;
        if (y >= top - 0.1 * w && y <= cy + 0.1 * w - 0.02) {
          const ey = (y - top) / 0.1;
          if (i === n - 1 && u * u + ey * ey <= 1) { const d = Math.sqrt(u * u + ey * ey); M(0.9 + 0.08 * (1 - d) - (Math.abs(d - 0.75) < 0.07 ? 0.12 : 0)); }
          else if (y > top) { const ridge = Math.abs(Math.sin(u * 14)) < 0.35 ? 0.05 : 0; M(0.4 + 0.35 * w + ridge + 0.05 * i); }
        }
      }
    }
    return z;
  },
  deed(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const e = rbox(x, y, -0.6, -0.85, 0.6, 0.8, 0.06);
    if (e >= 0) {
      M(0.3 + 0.08 * Math.min(1, e * 8));
      if (Math.abs(y + 0.62) < 0.05 && Math.abs(x) < 0.3) z = 0.6;
      for (let i = 0; i < 6; i++) { const ly = -0.4 + i * 0.15, lw = i === 5 ? -0.05 : (i % 2 ? 0.28 : 0.42); if (Math.abs(y - ly) < 0.028 && x > -0.42 && x < lw) z = 0.55; }
    }
    if (x > 0.38 && y < -0.62 && (x - 0.38) + (-0.62 - y) < 0.24 && e >= -0.01) M(0.5);
    const sr = Math.hypot(x - 0.3, y - 0.52);
    if (sr < 0.27) { const a = Math.atan2(y - 0.52, x - 0.3); const tooth = sr > 0.22 && Math.cos(a * 12) < 0 ? -0.15 : 0; M(0.85 + 0.12 * Math.sqrt(1 - (sr / 0.27) ** 2) - (Math.abs(sr - 0.17) < 0.022 ? 0.2 : 0) + tooth - (sr < 0.07 ? 0.15 : 0)); }
    for (const s of [-1, 1]) { const [d] = segD(x, y, 0.3 + s * 0.06, 0.7, 0.3 + s * 0.2, 1.02); M(tube(d, 0.05, 0.7, 0.1)); }
    return z;
  },
  padlock(x, y) {
    let z = NONE;
    const e = rbox(x, y, -0.6, -0.1, 0.6, 0.85, 0.14);
    if (e >= 0) { z = 0.45 + 0.25 * Math.min(1, e * 4); const kr = Math.hypot(x, y - 0.3); if (kr < 0.11 || (Math.abs(x) < 0.045 && y > 0.3 && y < 0.58)) z = 0.3; }
    const r = Math.hypot(x, y + 0.1), d = Math.abs(r - 0.38);
    if (d < 0.08 && y < -0.1) z = Math.max(z, 0.5 + Math.sqrt(0.0064 - d * d) * 3);
    if (d < 0.08 && y >= -0.1 && y < 0 && Math.abs(x) > 0.3) z = Math.max(z, 0.55);
    return z;
  },
  scales(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    { const [d] = segD(x, y, 0, -0.75, 0, 0.75); M(tube(d, 0.05, 0.55, 0.15)); }
    { const [d] = segD(x, y, -0.7, -0.55, 0.7, -0.55); M(tube(d, 0.04, 0.6, 0.12)); }
    if (Math.abs(y - 0.82) < 0.06 && Math.abs(x) < 0.38) M(0.55);
    if (Math.hypot(x, y + 0.78) < 0.08) M(0.7);
    for (const cx of [-0.62, 0.62]) {
      for (const s of [-1, 1]) { const [d] = segD(x, y, cx, -0.55, cx + s * 0.25, 0.05); M(tube(d, 0.015, 0.45, 0.06)); }
      const u = (x - cx) / 0.32, v = (y - 0.05) / 0.16;
      if (Math.abs(u) <= 1 && v >= 0 && v <= Math.sqrt(1 - u * u)) M(0.45 + 0.2 * (1 - v));
    }
    return z;
  },
  hourglass(x, y) {
    let z = NONE;
    const ay = Math.abs(y);
    if (ay > 0.78 && ay < 0.92 && Math.abs(x) < 0.6) { const t = (ay - 0.85) / 0.07; return 0.65 + 0.18 * Math.sqrt(Math.max(0, 1 - t * t)); }
    if (ay <= 0.78 && Math.abs(Math.abs(x) - 0.5) < 0.04) return 0.62;
    if (ay > 0.78) return NONE;
    const w = 0.06 + 0.32 * Math.sin(Math.min(1, ay / 0.72) * Math.PI / 2);
    if (Math.abs(x) > w) return NONE;
    const g = Math.abs(x) / w;
    z = 0.28 + 0.16 * Math.sqrt(1 - g * g);
    if (y > 0.4 + 0.25 * Math.pow(Math.abs(x) / 0.38, 2)) z = 0.5 + 0.12 * Math.sqrt(1 - g * g);
    if (y < -0.3 && y > -0.62 + 0.2 * (1 - g)) z = Math.max(z, 0.46);
    if (Math.abs(x) < 0.02 && y > -0.02 && y < 0.42) z = Math.max(z, 0.52);
    return z;
  },
  stairs(x, y) {
    let z = NONE;
    for (let i = 0; i < 4; i++) {
      const x0 = -0.92 + i * 0.42, x1 = 0.92, t = 0.75 - (i + 1) * 0.3;
      if (x >= x0 && x <= x1 && y >= t && y <= t + 0.3) { const e = Math.min(y - t, x - x0); z = Math.max(z, 0.4 + 0.08 * i + 0.15 * Math.min(1, e / 0.06)); }
    }
    { const [d] = segD(x, y, 0.62, -0.45, 0.62, -0.95); if (d < 0.025) z = Math.max(z, 0.75); }
    { const u = x - 0.64, v = y + 0.95; if (u > 0 && u < 0.3 && v > 0 && v < 0.2 - u * 0.25) z = Math.max(z, 0.72); }
    return z;
  },
});

// wide horizontal scenes (x spans about ±2.8, y about ±1) for the audit page
const zigD = (x, y, pts) => { let d = 1e9; for (let i = 0; i < pts.length - 1; i++) d = Math.min(d, segD(x, y, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])[0]); return d; };
const bevel = (x, y, x0, y0, x1, y1, b, base, k) => { if (x < x0 || x > x1 || y < y0 || y > y1) return NONE; const e = Math.min(x - x0, x1 - x, y - y0, y1 - y); return base + k * Math.sqrt(Math.min(1, e / b)); };
Object.assign(SHAPES, {
  slabcrack(x, y) {
    const crack = [[0.25, -0.62], [0.05, -0.28], [0.32, -0.02], [0.1, 0.26], [0.36, 0.62]];
    const right = x > 0.2 + 0.25 * Math.sin(y * 3);
    const yy = right ? y - 0.07 : y, xx = right ? x + 0.04 : x;
    let z = bevel(xx, yy, -2.3, -0.5, 2.3, 0.5, 0.14, 0.42, 0.3);
    if (z === NONE) return NONE;
    for (const g of [-0.17, 0.17]) { const dg = Math.abs(yy - g); if (dg < 0.035) z -= 0.12 * (1 - dg / 0.035); }
    for (let i = -4; i <= 4; i++) { const dv = Math.abs(xx - i * 0.52 - (Math.abs(Math.round((yy + 0.5) / 0.34)) % 2 ? 0.26 : 0)); if (dv < 0.03 && Math.abs(yy) < 0.48) z -= 0.08 * (1 - dv / 0.03); }
    const dc = zigD(x, y, crack), db = Math.min(zigD(x, y, [[0.05, -0.28], [-0.35, -0.2], [-0.62, -0.32]]), zigD(x, y, [[0.32, -0.02], [0.75, 0.08], [1.0, -0.02]]));
    if (dc < 0.055 || db < 0.022) return NONE;
    if (dc < 0.12) z -= 0.18 * (1 - (dc - 0.055) / 0.065);
    return z;
  },
  barsweak(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const n = 9, x0 = -2.35, step = 0.53, w = 0.17, base = 0.85;
    const tops = [];
    for (let i = 0; i < n; i++) {
      const cx = x0 + i * step, h = 0.35 + 1.25 * Math.pow(i / (n - 1), 1.2), top = base - h;
      tops.push([cx, top - 0.18]);
      if (i === 6) {
        const cut = top + h * 0.5 + 0.05 * Math.sin((x - cx) * 30);
        if (y < cut - 0.05) { const xs = x - 0.04, ys = y + 0.05; M(bevel(xs, ys, cx - w, top, cx + w, cut - 0.05, 0.07, 0.45, 0.25)); }
        else if (y > cut + 0.03) M(bevel(x, y, cx - w, cut + 0.03, cx + w, base, 0.07, 0.45, 0.25));
        continue;
      }
      M(bevel(x, y, cx - w, top, cx + w, base, 0.07, 0.45, 0.25));
    }
    M(tube(zigD(x, y, tops.slice(0, 9)), 0.035, 0.6, 0.15));
    const tip = tops[8], [da] = segD(x, y, tip[0], tip[1], tip[0] - 0.22, tip[1] + 0.06), [db] = segD(x, y, tip[0], tip[1], tip[0] - 0.08, tip[1] + 0.22);
    M(tube(Math.min(da, db), 0.035, 0.6, 0.15));
    if (Math.abs(y - (base + 0.06)) < 0.025 && Math.abs(x) < 2.6) M(0.35);
    return z;
  },
  chainbreak(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const n = 5, pitch = 1.02, L = 0.36, R = 0.3, T = 0.085;
    for (let k = 0; k < n; k++) {
      const cx = (k - (n - 1) / 2) * pitch;
      let lx = x - cx, ly = y;
      if (k === 2 && lx > 0.02) { lx -= 0.06; ly -= 0.1; }
      if (k % 2 === 0) {
        const q = Math.max(Math.abs(lx) - L, 0), d = Math.abs(Math.hypot(q, ly) - R);
        if (k === 2 && Math.abs(lx - 0.02) < 0.07) continue;
        M(tube(d, T, 0.4, 0.4));
      } else {
        const [d] = segD(lx, ly, -L - R + 0.05, 0, L + R - 0.05, 0);
        M(tube(d, T, 0.55, 0.4));
      }
    }
    return z;
  },
  timelate(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const x0 = -2.5, x1 = 2.5, ax = 0.7;
    if (x > x0 && x < x1) M(tube(Math.abs(y - ax), 0.03, 0.35, 0.12));
    for (let i = 0; i <= 10; i++) { const tx = x0 + i * (x1 - x0) / 10; if (Math.abs(x - tx) < 0.025 && y > ax - 0.1 && y < ax + 0.1) M(tube(Math.abs(x - tx), 0.025, 0.4, 0.1)); }
    const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120, px = x0 + u * (x1 - x0), spike = Math.exp(-Math.pow((u - 0.8) / 0.035, 2)); const amp = 0.06 + 0.1 * Math.max(0, (u - 0.45) / 0.35) * (u < 0.8 ? 1 : 0.5) + 0.25 * spike; pts.push([px, 0.3 - amp * Math.abs(Math.sin(u * 40)) - 0.62 * spike]); }
    M(tube(zigD(x, y, pts), 0.045, 0.55, 0.25));
    const xa = x0 + 0.3 * (x1 - x0), xm = x0 + 0.8 * (x1 - x0);
    for (const [mx, top] of [[xa, -0.25], [xm, -0.95]]) if (Math.abs(x - mx) < 0.02 && y > top && y < ax && ((y * 6) % 1 + 1) % 1 < 0.6) M(0.38);
    const r = Math.hypot(x - xa, y - 0.17); if (r < 0.1) M(0.6 + 0.3 * Math.sqrt(1 - (r / 0.1) ** 2));
    return z;
  },
});

Object.assign(SHAPES, {
  plugout(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    if (x < -1.55) M(tube(Math.abs(y), 0.11, 0.35, 0.25));
    M(bevel(x, y, -1.6, -0.42, -0.7, 0.42, 0.12, 0.45, 0.3));
    for (const py of [-0.17, 0.17]) { const [d] = segD(x, y, -0.7, py, -0.22, py); M(tube(d, 0.065, 0.5, 0.2)); }
    let s = bevel(x, y, 0.35, -0.48, 1.45, 0.48, 0.12, 0.45, 0.3);
    if (s !== NONE) { for (const py of [-0.17, 0.17]) if (x < 0.75 && Math.abs(y - py) < 0.075) s = 0.32; M(s); }
    if (x > 1.4) M(tube(Math.abs(y), 0.11, 0.35, 0.25));
    return z;
  },
  gearsgap(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const s = 0.95;
    for (const cx of [-1.42, 1.42]) { const g = SHAPES.gear((x - cx) / s, y / s); if (g !== NONE) M(g); }
    const r = Math.hypot(x, y), a = Math.atan2(y, x);
    if (Math.abs(r - 0.6) < 0.05 && Math.cos(a * 9) > 0.2) M(tube(Math.abs(r - 0.6), 0.05, 0.35, 0.12));
    if (r < 0.09) M(0.5 + 0.2 * Math.sqrt(1 - (r / 0.09) ** 2));
    return z;
  },
  drain(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const base = 0.82, n = 7, x0 = -2.3, step = 0.76, cw = 0.25, ch = 0.12;
    const tops = [];
    for (let i = 0; i < n; i++) {
      const cx = x0 + i * step, cnt = Math.max(1, Math.round(10 * Math.pow(1 - i / (n - 1), 1.6)));
      tops.push([cx, base - cnt * ch - 0.16]);
      if (Math.abs(x - cx) > cw + 0.02) continue;
      const k = Math.floor((base - y) / ch);
      if (k < 0 || k >= cnt) continue;
      const yc = base - (k + 0.5) * ch, e = Math.min(cw - Math.abs(x - cx), ch / 2 - Math.abs(y - yc));
      if (e < 0) continue;
      M(0.42 + 0.06 * k / 10 + 0.18 * Math.sqrt(Math.min(1, e / 0.04)));
    }
    M(tube(zigD(x, y, tops), 0.035, 0.6, 0.15));
    const tip = tops[n - 1], [da] = segD(x, y, tip[0], tip[1], tip[0] - 0.2, tip[1] - 0.12), [db] = segD(x, y, tip[0], tip[1], tip[0] - 0.04, tip[1] - 0.24);
    M(tube(Math.min(da, db), 0.035, 0.6, 0.15));
    if (Math.abs(y - (base + 0.05)) < 0.022 && Math.abs(x) < 2.65) M(0.33);
    return z;
  },
  coinquestion(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const s = 0.82, c = SHAPES.coin((x + 0.85) / s, y / s); if (c !== NONE) M(c);
    const qx = 1.05, qy = -0.32, R = 0.36, r = Math.hypot(x - qx, y - qy), a = Math.atan2(y - qy, x - qx);
    if (Math.abs(r - R) < 0.1 && !(a > 1.75 && a < 3.0)) M(tube(Math.abs(r - R), 0.1, 0.45, 0.3));
    { const [d] = segD(x, y, qx + R * Math.cos(1.7), qy + R * Math.sin(1.7), qx, 0.3); M(tube(d, 0.1, 0.45, 0.3)); }
    const rd = Math.hypot(x - qx, y - 0.62); if (rd < 0.12) M(0.5 + 0.3 * Math.sqrt(1 - (rd / 0.12) ** 2));
    return z;
  },
});

Object.assign(SHAPES, {
  buysell(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const coin = (cx, cy, k) => { const c = SHAPES.coin((x - cx) / k, (y - cy) / k); if (c !== NONE) M(c * 0.9 + 0.05); };
    const Y = 0.08;
    coin(-2.0, Y, 0.5); coin(2.0, Y, 0.5);
    const arrow = (x0, x1) => { M(tube(segD(x, y, x0, Y, x1, Y)[0], 0.045, 0.5, 0.15)); for (const s of [-1, 1]) M(tube(segD(x, y, x1, Y, x1 - 0.17, Y + s * 0.14)[0], 0.045, 0.5, 0.15)); };
    arrow(-1.4, -0.8); arrow(0.8, 1.4);
    let b = bevel(x, y, -0.55, -0.22, 0.55, 0.62, 0.1, 0.42, 0.28);
    if (b !== NONE) { if (Math.abs(y + 0.1) < 0.03 && Math.abs(x) < 0.5) b -= 0.06; M(b); }
    { const r = Math.hypot(x, y + 0.22), d = Math.abs(r - 0.26); if (y < -0.2 && d < 0.05) M(tube(d, 0.05, 0.5, 0.18)); }
    for (const sx of [-0.26, 0.26]) { const r = Math.hypot(x - sx, y + 0.06); if (r < 0.045) M(0.6); }
    return z;
  },
});

Object.assign(SHAPES, {
  airdropcart(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const L = (x0, y0, x1, y1, w, b, k) => M(tube(segD(x, y, x0, y0, x1, y1)[0], w, b, k));
    for (const [cx, cy] of [[-2.05, 0.35], [-1.25, -0.05], [-0.45, 0.45]]) {
      const dy = cy - 0.62, r = Math.hypot(x - cx, y - dy), R = 0.34;
      if (r < R && y < dy + 0.02) M(0.42 + 0.3 * Math.sqrt(1 - (r / R) ** 2) - (Math.abs(Math.sin(Math.atan2(y - dy, x - cx) * 3)) < 0.12 ? 0.08 : 0));
      L(cx - R + 0.03, dy, cx - 0.06, cy - 0.17, 0.018, 0.38, 0.08);
      L(cx + R - 0.03, dy, cx + 0.06, cy - 0.17, 0.018, 0.38, 0.08);
      const c = SHAPES.coin((x - cx) / 0.22, (y - cy) / 0.22); if (c !== NONE) M(c * 0.9 + 0.05);
    }
    const W = 0.05;
    L(0.85, -0.38, 2.35, -0.38, W, 0.5, 0.18); L(1.05, 0.28, 2.15, 0.28, W, 0.5, 0.18);
    L(0.85, -0.38, 1.05, 0.28, W, 0.5, 0.18); L(2.35, -0.38, 2.15, 0.28, W, 0.5, 0.18);
    for (const t of [0.33, 0.66]) L(0.85 + 1.5 * t, -0.38, 1.05 + 1.1 * t, 0.28, 0.025, 0.42, 0.1);
    L(0.95, -0.05, 2.25, -0.05, 0.025, 0.42, 0.1);
    L(0.85, -0.38, 0.62, -0.68, W, 0.5, 0.18); L(0.62, -0.68, 0.38, -0.68, W, 0.5, 0.18);
    L(1.05, 0.28, 1.0, 0.4, W, 0.5, 0.18); L(1.0, 0.4, 2.2, 0.4, W, 0.5, 0.18);
    for (const wx of [1.25, 2.0]) { const r = Math.hypot(x - wx, y - 0.56); if (r < 0.12) M(0.5 + 0.25 * Math.sqrt(1 - (r / 0.12) ** 2) - (r < 0.04 ? 0.1 : 0)); }
    return z;
  },
});

Object.assign(SHAPES, {
  crackedcoin(x, y) {
    const P = [[0.1, -1.2], [-0.08, -0.6], [0.14, -0.2], [-0.1, 0.22], [0.1, 0.62], [-0.04, 1.2]];
    const cxAt = (yy) => { for (let i = 0; i < P.length - 1; i++) { const [x0, y0] = P[i], [x1, y1] = P[i + 1]; if (yy >= y0 && yy <= y1) return x0 + (x1 - x0) * (yy - y0) / (y1 - y0); } return 0; };
    const k = 0.92, dx = 0.16, dy = 0.07;
    const right = x > cxAt(y) + dx * 0.5;
    const lx = right ? x - dx : x, ly = right ? y - dy : y;
    if (Math.abs(lx - cxAt(ly)) < 0.035) return NONE;
    if (!right && x > cxAt(y)) return NONE;
    if (right && lx < cxAt(ly)) return NONE;
    const c = SHAPES.coin(lx / k, ly / k);
    if (c === NONE) return NONE;
    const e = Math.abs(lx - cxAt(ly));
    return c - (e < 0.1 ? 0.12 * (1 - e / 0.1) : 0);
  },
});

Object.assign(SHAPES, {
  signpost(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    M(tube(segD(x, y, 0, -0.95, 0, 0.82)[0], 0.07, 0.5, 0.2));
    const board = (y0, dir, len, h) => {
      const ax = dir > 0 ? x : -x, x0 = 0.08, tip = 0.24;
      const dy = Math.abs(y - y0);
      let inside = false, e = 0;
      if (ax >= x0 && ax <= x0 + len && dy <= h) { inside = true; e = Math.min(ax - x0, x0 + len + tip - ax, h - dy); }
      else if (ax > x0 + len && ax <= x0 + len + tip && dy <= h * (1 - (ax - x0 - len) / tip)) { inside = true; e = Math.min(h * (1 - (ax - x0 - len) / tip) - dy, 0.06); }
      if (inside) M(0.55 + 0.2 * Math.sqrt(Math.min(1, e / 0.06)));
    };
    board(-0.62, 1, 1.25, 0.15); board(-0.18, -1, 1.1, 0.15); board(0.26, 1, 0.85, 0.15);
    const main = [[-2.75, 0.98], [-1.9, 0.86], [-1.0, 0.92], [0, 0.86]];
    const brA = [[0, 0.86], [0.9, 0.7], [1.8, 0.62], [2.75, 0.48]], brB = [[0, 0.86], [0.95, 0.98], [1.9, 1.02], [2.75, 1.1]];
    const dp = Math.min(zigD(x, y, main), zigD(x, y, brA), zigD(x, y, brB));
    if (dp < 0.13) { let v = 0.36 + 0.08 * (dp / 0.13); if (dp > 0.1) v = 0.5; M(v); }
    if (dp < 0.025 && Math.floor((x + 3) * 7) % 2 === 0) M(0.55);
    return z;
  },
  trail: (() => {
    const C = [[-2.85, 1.0], [-1.9, 0.78], [-1.15, 0.28], [-0.35, 0.18], [0.35, 0.52], [1.05, 0.5], [1.6, 0.05], [2.15, -0.32]];
    const P = []; for (let i = 0; i < C.length - 1; i++) { const p0 = C[Math.max(0, i - 1)], p1 = C[i], p2 = C[i + 1], p3 = C[Math.min(C.length - 1, i + 2)]; for (let k = 0; k < 12; k++) { const t = k / 12, t2 = t * t, t3 = t2 * t; P.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } }
    P.push(C[C.length - 1]);
    const S = [0]; for (let i = 1; i < P.length; i++) S.push(S[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const L = S[S.length - 1], W = (s) => 0.3 - 0.19 * (s / L);
    const Q = [0]; for (let i = 1; i < P.length; i++) Q.push(Q[i - 1] + (S[i] - S[i - 1]) / W((S[i] + S[i - 1]) / 2));
    return (x, y) => {
      let z = NONE; const M = (v) => { if (v > z) z = v; };
      let bd = 1e9, bs = 0, bq = 0;
      for (let i = 0; i < P.length - 1; i++) { const [d, t] = segD(x, y, P[i][0], P[i][1], P[i + 1][0], P[i + 1][1]); if (d < bd) { bd = d; bs = S[i] + t * (S[i + 1] - S[i]); bq = Q[i] + t * (Q[i + 1] - Q[i]); } }
      const w = W(bs), near = 1 - bs / L;
      if (bd < w) {
        const per = 1.15, f = (bq / per) % 1, gap = 0.16;
        if (f > gap) {
          const eAlong = Math.min(f - gap, 1 - f) * per * w, e = Math.min(w - bd, eAlong);
          M(0.42 + 0.12 * near + 0.22 * Math.sqrt(Math.min(1, e / (0.07 * w / 0.3))));
        }
      }
      M(tube(segD(x, y, 2.3, -0.38, 2.3, -1.0)[0], 0.035, 0.55, 0.2));
      if (y >= -1.0 && y <= -0.66 && x >= 2.33) { const tY = -0.83, hw = 0.17 * (1 - (x - 2.33) / 0.48); if (Math.abs(y - tY) <= hw) M(0.62 + 0.15 * Math.sqrt(Math.min(1, (hw - Math.abs(y - tY)) / 0.05))); }
      { const r = Math.hypot((x - 2.3) / 1.6, y + 0.36); if (r < 0.09) M(0.5 + 0.1 * (1 - r / 0.09)); }
      return z;
    };
  })(),
  chaos: (() => {
    const bits = [[-2.95, -0.7, 0.5, 's'], [-2.2, 0.55, -0.4, 't'], [-2.75, 0.35, 0, 'c'], [-1.65, -0.45, 0.9, 's'], [-1.1, 0.75, 0.3, 'c'], [-0.85, -0.85, -2.2, 'a'], [-0.95, 0.2, 1.3, 'a'],
      [-0.35, -0.2, -0.3, 't'], [0.15, 0.6, 0.6, 's'], [0.55, -0.8, 0.2, 'c'], [0.9, 0.1, 2.5, 'a'], [1.35, -0.4, -0.6, 't'], [1.6, 0.7, 0.35, 's'], [2.2, -0.05, 0.7, 'c'], [2.55, -0.8, -0.9, 'a'], [2.95, 0.55, 0.25, 't'], [-2.2, -0.95, 0.15, 'c']];
    return (x, y) => {
      let z = NONE; const M = (v) => { if (v > z) z = v; };
      for (const [bx, by, rot, k] of bits) {
        const c = Math.cos(rot), sn = Math.sin(rot), lx = (x - bx) * c - (y - by) * sn, ly = (x - bx) * sn + (y - by) * c;
        if (k === 's') { const e = Math.min(0.24 - Math.abs(lx), 0.24 - Math.abs(ly)); if (e >= 0) M(0.45 + 0.25 * Math.sqrt(Math.min(1, e / 0.06))); }
        else if (k === 'c') { const r = Math.hypot(lx, ly); if (r < 0.2) M(0.45 + 0.3 * Math.sqrt(1 - (r / 0.2) ** 2)); }
        else if (k === 't') { const h = 0.29, w = 0.32 * (ly + h) / (2 * h); if (ly >= -h && ly <= h && Math.abs(lx) <= w) M(0.45 + 0.25 * Math.sqrt(Math.min(1, Math.min(w - Math.abs(lx), h - ly) / 0.06))); }
        else { if (Math.abs(ly) < 0.035 && lx > -0.28 && lx < 0.12) M(0.55); if (lx >= 0.12 && lx <= 0.3 && Math.abs(ly) <= 0.12 * (0.3 - lx) / 0.18) M(0.6); }
      }
      return z;
    };
  })(),
  dumpchart(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const L = [[-2.7, 0.62], [-2.15, 0.48], [-1.6, 0.55], [-1.05, 0.12], [-0.6, -0.15], [-0.15, -0.82], [0.25, -0.05], [0.65, 0.38], [1.1, 0.2], [1.6, 0.7], [2.1, 0.6], [2.7, 1.0]];
    const d = zigD(x, y, L); M(tube(d, 0.06, 0.62, 0.2));
    for (const [px, py] of L) { const r = Math.hypot(x - px, y - py); if (r < 0.11) M(0.7 + 0.15 * Math.sqrt(1 - (r / 0.11) ** 2)); }
    if (x > L[0][0] && x < L[L.length - 1][0]) { let yl = 0; for (let i = 0; i < L.length - 1; i++) if (x >= L[i][0] && x <= L[i + 1][0]) { const t = (x - L[i][0]) / (L[i + 1][0] - L[i][0]); yl = L[i][1] + t * (L[i + 1][1] - L[i][1]); } if (y > yl + 0.08 && y < 1.1) M(0.3 + 0.08 * Math.max(0, 1 - (y - yl) / 1.2)); }
    { const ax0 = 0.55, ay0 = -0.85, ax1 = 1.75, ay1 = -0.05; const [dd, t] = segD(x, y, ax0, ay0, ax1, ay1); if (t < 0.78) M(tube(dd, 0.07, 0.62, 0.22)); const ux = (ax1 - ax0), uy = (ay1 - ay0), ul = Math.hypot(ux, uy), nx = ux / ul, ny = uy / ul; const lx = (x - ax1) * nx + (y - ay1) * ny, ly = -(x - ax1) * ny + (y - ay1) * nx; if (lx <= 0 && lx > -0.42 && Math.abs(ly) < -lx * 0.75) M(0.66 + 0.18 * Math.sqrt(Math.min(1, (-lx * 0.75 - Math.abs(ly)) / 0.08))); }
    return z;
  },
  misfit(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const T = 0.56, G = 0.12, x0 = -2.55, y0 = -0.66;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
      const tx = x0 + c * (T + G), ty = y0 + r * (T + G);
      if (r === 0 && c === 2) { const e = Math.min(x - tx, tx + T - x, y - ty, ty + T - y); if (e >= -0.02 && e < 0.03 && Math.floor((x + y) * 9) % 2 === 0) M(0.38); continue; }
      M(bevel(x, y, tx, ty, tx + T, ty + T, 0.08, 0.45, 0.25));
    }
    M(bevel(x, y, x0 - 0.12, y0 + 2 * (T + G) - 0.02, x0 + 3 * T + 2 * G + 0.12, y0 + 2 * (T + G) + 0.16, 0.05, 0.36, 0.15));
    { const cx = 1.75, cy = -0.1, R = 0.68, r = Math.hypot(x - cx, y - cy); if (r < R) { let v = 0.5 + 0.28 * Math.sqrt(1 - (r / R) ** 2); if (Math.abs(r - R * 0.78) < 0.035) v -= 0.12; if (r < R * 0.5 && Math.abs(x - cx) < 0.06) v += 0.06; M(v); } }
    { const [d, t] = segD(x, y, 0.95, -0.25, -0.55, -0.42); if (d < 0.03 && Math.floor(t * 12) % 2 === 0) M(0.5); const lx = x + 0.55, ly = y + 0.42; if (lx >= 0 && lx < 0.22 && Math.abs(ly + lx * 0.11) < 0.12 * (1 - lx / 0.22) + 0.01) M(0.55); }
    return z;
  },
  rocketpad(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    { const [d] = segD(x, y, 0, -0.35, 0, 0.35); if (d < 0.24) M(0.45 + 0.35 * Math.sqrt(1 - (d / 0.24) ** 2)); }
    if (y < -0.35 && y > -0.92) { const w = 0.24 * (y + 0.92) / 0.57; if (Math.abs(x) < w) M(0.45 + 0.35 * Math.sqrt(1 - (x / w) ** 2)); }
    for (const sd of [-1, 1]) { const fx = sd * x; if (y > 0.05 && y < 0.5 && fx > 0.2 && fx < 0.2 + 0.3 * (y - 0.05) / 0.45) M(0.5); }
    { const r = Math.hypot(x, y + 0.2); if (Math.abs(r - 0.09) < 0.035) z = Math.max(0.35, z - 0.15); }
    M(bevel(x, y, -0.95, 0.55, 0.95, 0.75, 0.05, 0.4, 0.2));
    for (const sx of [-0.7, -0.35, 0.35, 0.7]) if (Math.abs(x - sx) < 0.04 && y > 0.75 && y < 0.98) M(0.4);
    { const tx = -0.62; if ((Math.abs(x - tx) < 0.035 || Math.abs(x - tx - 0.22) < 0.035) && y > -0.6 && y < 0.55) M(0.5); for (let k = 0; k < 5; k++) { const yy = -0.55 + k * 0.22; const [d] = segD(x, y, tx, yy, tx + 0.22, yy + 0.22); if (d < 0.025 && y < 0.55) M(0.45); } const [d2] = segD(x, y, tx + 0.22, -0.2, -0.24, -0.2); M(tube(d2, 0.03, 0.42, 0.1)); }
    return z;
  },
  returnloop(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const R = 0.78, r = Math.hypot(x, y), a = Math.atan2(y, x);
    const a0 = -Math.PI * 0.62, span = Math.PI * 1.6; let t = a - a0; while (t < 0) t += Math.PI * 2;
    if (t <= span && Math.abs(r - R) < 0.1) M(0.5 + 0.25 * Math.sqrt(1 - ((r - R) / 0.1) ** 2));
    { const ae = a0 + span, ex = R * Math.cos(ae), ey = R * Math.sin(ae), tx = -Math.sin(ae), ty = Math.cos(ae); const lx = (x - ex) * tx + (y - ey) * ty, ly = (x - ex) * Math.cos(ae) + (y - ey) * Math.sin(ae); const h = 0.34; if (lx >= -0.02 && lx < h && Math.abs(ly) < 0.26 * (1 - lx / h)) M(0.62 + 0.18 * Math.sqrt(Math.min(1, (0.26 * (1 - lx / h) - Math.abs(ly)) / 0.06))); }
    { const rc = Math.hypot(x, y); if (rc < 0.42) { let v = 0.55 + 0.25 * Math.sqrt(1 - (rc / 0.42) ** 2); if (Math.abs(rc - 0.32) < 0.03) v -= 0.12; M(v); } }
    return z;
  },
  playbtn(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const W = 1.0, H = 0.66; if (Math.abs(x) < W && Math.abs(y + 0.08) < H) { const e = Math.min(W - Math.abs(x), H - Math.abs(y + 0.08)); M(e < 0.09 ? 0.5 + 0.2 * Math.sqrt(e / 0.09) : 0.3); }
    { const lx = x + 0.12, ly = y + 0.08, h = 0.62; if (lx > -0.22 && lx < -0.22 + h && Math.abs(ly) < 0.36 * (1 - (lx + 0.22) / h)) M(0.72 + 0.2 * Math.sqrt(Math.min(1, (0.36 * (1 - (lx + 0.22) / h) - Math.abs(ly)) / 0.08))); }
    if (y > 0.74 && y < 0.82 && Math.abs(x) < 1.0) M(x < -0.15 ? 0.6 : 0.4);
    { const r = Math.hypot(x + 0.15, y - 0.78); if (r < 0.09) M(0.75); }
    return z;
  },
  docpage(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const x0 = -0.72, x1 = 0.5, y0 = -0.88, y1 = 0.78, f = 0.3;
    if (x > x0 && x < x1 && y > y0 && y < y1 && !(x > x1 - f && y < y0 + f && (x - (x1 - f)) > (y - y0))) {
      let v = 0.42 + 0.2 * Math.sqrt(Math.min(1, Math.min(x - x0, x1 - x, y - y0, y1 - y) / 0.07));
      for (let k = 0; k < 6; k++) { const ly = -0.45 + k * 0.2, len = k % 3 === 2 ? 0.55 : 0.85; if (Math.abs(y - ly) < 0.035 && x > x0 + 0.18 && x < x0 + 0.18 + len) v = 0.58; }
      M(v);
    }
    if (x > x1 - f && x < x1 && y > y0 && y < y0 + f && (x - (x1 - f)) <= (y - y0)) M(0.6);
    { const cx = 0.55, cy = 0.35, r = Math.hypot(x - cx, y - cy); if (Math.abs(r - 0.3) < 0.07) M(0.62 + 0.18 * Math.sqrt(1 - ((r - 0.3) / 0.07) ** 2)); const [d] = segD(x, y, cx + 0.26, cy + 0.26, cx + 0.62, cy + 0.62); M(tube(d, 0.08, 0.6, 0.2)); }
    return z;
  },
  concepts(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const cards = [[-0.62, 0.08, -0.32, 0.45, 'c'], [0.62, 0.08, 0.32, 0.45, 't'], [0, -0.08, 0, 0.6, 's']];
    for (const [cx, cy, rot, base, k] of cards) {
      const c = Math.cos(rot), s = Math.sin(rot), lx = (x - cx) * c + (y - cy) * s, ly = -(x - cx) * s + (y - cy) * c;
      const e = Math.min(0.42 - Math.abs(lx), 0.6 - Math.abs(ly)); if (e < 0) continue;
      let v = base + 0.18 * Math.sqrt(Math.min(1, e / 0.07));
      const iy = ly + 0.15;
      if (k === 'c' && Math.hypot(lx, iy) < 0.17) v += 0.22;
      if (k === 't' && iy > -0.17 && iy < 0.15 && Math.abs(lx) < 0.19 * (iy + 0.17) / 0.32) v += 0.22;
      if (k === 's' && Math.abs(lx) < 0.16 && Math.abs(iy) < 0.16) v += 0.22;
      for (const yy of [0.25, 0.38]) if (Math.abs(ly - yy) < 0.03 && Math.abs(lx) < 0.26) v -= 0.08;
      z = Math.max(z, v);
    }
    return z;
  },
  bubbles(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const bub = (x0, y0, x1, y1, tailX, tailDir) => {
      let b = bevel(x, y, x0, y0, x1, y1, 0.12, 0.42, 0.28);
      const ty = y - y1; if (b === NONE && ty >= 0 && ty < 0.3) { const w = 0.22 * (1 - ty / 0.3), cx = tailX + tailDir * ty * 0.6; if (Math.abs(x - cx) < w) b = 0.5; }
      return b;
    };
    let a = bub(-2.3, -0.7, -0.3, 0.2, -1.8, -1);
    if (a !== NONE) { for (const [ly, lx1] of [[-0.45, -0.7], [-0.25, -0.5], [-0.05, -0.95]]) if (Math.abs(y - ly) < 0.04 && x > -2.0 && x < lx1) a -= 0.14; M(a); }
    let b = bub(0.3, -0.3, 2.3, 0.6, 1.8, 1);
    if (b !== NONE) { for (const dx of [0.85, 1.3, 1.75]) { const r = Math.hypot(x - dx, y - 0.15); if (r < 0.1) b = Math.max(b, 0.8 + 0.1 * Math.sqrt(1 - (r / 0.1) ** 2)); } M(b); }
    return z;
  },
  puzzlegap(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const piece = (cx, cy, hole, knob) => {
      const lx = x - cx, ly = y - cy, H = 0.44, R = 0.15;
      const kr = Math.hypot(lx - (H + 0.08), ly), hr = Math.hypot(lx - (-H + 0.08), ly);
      let inSq = Math.abs(lx) <= H && Math.abs(ly) <= H;
      if (hole && hr < R) inSq = false;
      const inKnob = knob && kr < R;
      if (!inSq && !inKnob) return;
      const e = inKnob ? R - kr : Math.min(H - Math.abs(lx), H - Math.abs(ly), hole ? hr - R : 9);
      M(0.45 + 0.25 * Math.sqrt(Math.max(0, Math.min(1, e / 0.08))));
    };
    const cy = 0.38, xs = [-1.45, -0.5, 0.45, 1.4];
    piece(xs[0], cy, false, true); piece(xs[1], cy, true, true); piece(xs[3], cy, true, false);
    piece(xs[2] + 0.2, -0.52, true, true);
    { const lx = x - xs[2], ly = y - cy; const d = Math.max(Math.abs(lx), Math.abs(ly)); if (Math.abs(d - 0.44) < 0.025 && (Math.floor((lx + ly + 2) * 8) % 2 === 0)) M(0.35); }
    return z;
  },
  rocketmess(x, y) {
    let z = NONE; const M = (v) => { if (v > z) z = v; };
    const a = 0.22, c = Math.cos(a), s = Math.sin(a), rx = x * c - (y - 0.05) * s, ry = x * s + (y - 0.05) * c;
    { const [d] = segD(rx, ry, 0, -0.35, 0, 0.45); if (d < 0.26) M(0.45 + 0.35 * Math.sqrt(1 - (d / 0.26) ** 2)); }
    if (ry < -0.35 && ry > -0.9) { const w = 0.26 * (ry + 0.9) / 0.55; if (Math.abs(rx) < w) M(0.45 + 0.35 * Math.sqrt(1 - (rx / w) ** 2)); }
    for (const sd of [-1, 1]) { const fx = sd * rx; if (ry > 0.15 && ry < 0.6 && fx > 0.2 && fx < 0.2 + 0.3 * (ry - 0.15) / 0.45) M(0.5); }
    { const r = Math.hypot(rx, ry + 0.08); if (Math.abs(r - 0.1) < 0.035) z = Math.max(0.35, z - 0.15); }
    for (const [bx, by, rot] of [[-1.7, -0.45, 0.4], [-1.05, 0.55, -0.3], [-2.25, 0.25, 0.1], [1.3, -0.55, -0.5], [1.95, 0.3, 0.6], [0.95, 0.62, 0.2]]) {
      const cc = Math.cos(rot), ss = Math.sin(rot), lx = (x - bx) * cc - (y - by) * ss, ly = (x - bx) * ss + (y - by) * cc;
      const e = Math.min(0.17 - Math.abs(lx), 0.17 - Math.abs(ly));
      if (e >= 0) { let v = 0.42 + 0.22 * Math.sqrt(Math.min(1, e / 0.05)); if (Math.abs(Math.abs(lx) - 0.1) < 0.02 && Math.abs(ly) < 0.1 || Math.abs(Math.abs(ly) - 0.1) < 0.02 && Math.abs(lx) < 0.1) v -= 0.1; M(v); }
    }
    return z;
  },
});

export { hash, NONE, SHAPES, HANDS, COIN8, NEEDLE, BANG, TARGET_HI, DEED_HI }
