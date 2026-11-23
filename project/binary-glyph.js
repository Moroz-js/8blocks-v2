// <binary-glyph shape="ring|coins|globe|cube|gear|pyramid|orbit|twin"> — white binary-digit relief illustration
(() => {
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
  class BinaryGlyph extends HTMLElement {
    connectedCallback() {
      this.style.display = this.style.display || 'block';
      this.cv = document.createElement('canvas'); this.cv.style.cssText = 'width:100%;height:100%;display:block;';
      this.appendChild(this.cv);
      this.ro = new ResizeObserver(() => this.build()); this.ro.observe(this);
      this.io = new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; if (this.visible && !this.raf) this.loop(); }); this.io.observe(this);
      this.build();
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro && this.ro.disconnect(); this.io && this.io.disconnect(); }
    build() {
      const W = this.clientWidth, H = this.clientHeight; if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.cv.width = W * dpr; this.cv.height = H * dpr;
      const ctx = this.cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cellW = parseFloat(this.getAttribute('grid')) || 3.2, cellH = cellW * 1.25;
      const cols = Math.ceil(W / cellW), rows = Math.ceil(H / cellH);
      const fn = SHAPES[this.getAttribute('shape')] || SHAPES.ring;
      const os = parseFloat(this.getAttribute('os')) || 1, half = Math.min(W, H) / 2 * 0.92 * os;
      const cx = W * (parseFloat(this.getAttribute('ox')) || 0.5), cy = H * (parseFloat(this.getAttribute('oy')) || 0.5), S = half;
      const depth = new Float32Array(cols * rows);
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const z = fn((gx * cellW + cellW / 2 - cx) / half, (gy * cellH + cellH / 2 - cy) / half);
        depth[gy * cols + gx] = z === NONE ? Infinity : -z * S;   // depth: smaller = nearer
      }
      const D = (gx, gy) => (gx < 0 || gy < 0 || gx >= cols || gy >= rows) ? Infinity : depth[gy * cols + gx];
      const fadeR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) / half;
      const bgFade = new Float32Array(cols * rows), edgeA = new Uint8Array(cols * rows), hiA = new Uint8Array(cols * rows);
      const kind = new Uint8Array(cols * rows), base = new Float32Array(cols * rows), bgA = new Float32Array(cols * rows), nz = new Float32Array(cols * rows), ph = new Float32Array(cols * rows);
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const k = gy * cols + gx, z = depth[k]; nz[k] = hash(gx, gy, 99); ph[k] = hash(gx, gy, 5) * 6.2832;
        if (z === Infinity) {
          let near = 0; for (let q = 1; q <= 3 && !near; q++) if (D(gx - q, gy) !== Infinity || D(gx + q, gy) !== Infinity || D(gx, gy - q) !== Infinity || D(gx, gy + q) !== Infinity) near = q;
          const gd = Math.hypot(gx * cellW - cx, gy * cellH - cy) / half, glow = Math.pow(Math.max(0, 1 - gd / 2.2), 1.6);
          const al = nz[k] < 0.06 ? 0.08 + 0.2 * hash(gx, gy, 17) : 0;
          bgFade[k] = 0.45 + 0.55 * Math.pow(Math.max(0, 1 - gd / fadeR), 1.2);
          kind[k] = 2; bgA[k] = al; continue;
        }
        const zl = D(gx - 1, gy), zr = D(gx + 1, gy), zu = D(gx, gy - 1), zd = D(gx, gy + 1);
        const dzx = (zl === Infinity || zr === Infinity) ? 30 : (zr - zl) / (2 * cellW), dzy = (zu === Infinity || zd === Infinity) ? 30 : (zd - zu) / (2 * cellH);
        const len = Math.sqrt(1 + dzx * dzx + dzy * dzy), nzv = 1 / len;
        const lamRaw = (0.6 * dzx + 0.6 * dzy + 0.5) / len, lam = Math.max(0.08, lamRaw), spec = Math.pow(Math.max(0, lamRaw), 6);
        let ao = 0; const nb = [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1], [-1, 1], [1, -1]];
        for (const [dx, dy] of nb) { const zq = D(gx + dx, gy + dy); if (zq === Infinity) continue; ao += Math.min(1, Math.max(0, (z + dzx * dx * cellW + dzy * dy * cellH - zq) / (8))); }
        ao /= nb.length;
        const edge = (zl === Infinity || zr === Infinity || zu === Infinity || zd === Infinity) ? 1 : 0;
        const rim = 0.3 * Math.pow(1 - nzv, 2); edgeA[k] = edge;   // edge cells brighten → crisp outline
        let shade = 0.02 + 1.2 * Math.pow(lam, 1.5) + 0.8 * spec - 1.1 * ao - rim;
        base[k] = Math.max(0.06, Math.min(1.3, shade)) * (0.96 + 0.08 * nz[k]); kind[k] = 1;
      }
      { const b2 = new Float32Array(base); for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) { const k = gy * cols + gx; if (kind[k] !== 1) continue; let s = 0, n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = gx + dx, yy = gy + dy; if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue; const kk = yy * cols + xx; if (kind[kk] !== 1) continue; const w = (dx || dy) ? 1 : 2; s += b2[kk] * w; n += w; } base[k] = s / n; } }
      for (let k = 0; k < base.length; k++) if (kind[k] === 1 && edgeA[k]) base[k] = Math.max(base[k], 1.15);
      const hiList = [], solidHi = false;
      const shp = this.getAttribute('shape'), hiFn = shp === 'clock' ? HANDS : shp === 'coin' ? COIN8 : shp === 'gauge' ? ((x, y) => NEEDLE(x, y)) : shp === 'warn' ? BANG : shp === 'target' ? TARGET_HI : shp === 'deed' ? DEED_HI : null;
      if (hiFn) for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) { const k = gy * cols + gx; if (kind[k] === 1 && hiFn((gx * cellW + cellW / 2 - cx) / half, (gy * cellH + cellH / 2 - cy) / half)) { base[k] = 1.5; hiA[k] = 1; } }
      const LEVELS = 40, pal = []; for (let i = 0; i <= LEVELS; i++) pal.push(`rgba(255,255,255,${(0.03 + 0.97 * Math.pow(i / LEVELS, 2.1)).toFixed(3)})`);
      const BGL = 10, bgPal = []; for (let i = 0; i <= BGL; i++) bgPal.push(`rgba(255,255,255,${(0.28 * i / BGL).toFixed(3)})`);
      const bk = []; for (let i = 0; i <= LEVELS; i++) bk.push([[], []]);
      const bbk = []; for (let i = 0; i <= BGL; i++) bbk.push([[], []]);
      const gw = Math.max(2, cellW * 0.62), gh = Math.max(3, cellH * 0.72), sw = Math.max(1, cellW * 0.22);
      const flush = (list, p) => {
        for (let i = 0; i < list.length; i++) {
          const [zeros, ones] = list[i]; if (!zeros.length && !ones.length) continue;
          ctx.fillStyle = p[i];
          for (let j = 0; j < ones.length; j += 2) { const x0 = ones[j] + (cellW - gw) / 2, y0 = ones[j + 1] + (cellH - gh) / 2; ctx.fillRect(x0 + (gw - sw) / 2, y0, sw, gh); }
          for (let j = 0; j < zeros.length; j += 2) { const x0 = zeros[j] + (cellW - gw) / 2, y0 = zeros[j + 1] + (cellH - gh) / 2; ctx.fillRect(x0, y0, gw, sw); ctx.fillRect(x0, y0 + gh - sw, gw, sw); ctx.fillRect(x0, y0, sw, gh); ctx.fillRect(x0 + gw - sw, y0, sw, gh); }
          zeros.length = 0; ones.length = 0;
        }
      };
      const t0 = performance.now();
      this.frame = (now) => {
        const t = (now - t0) / 1000 * 0.7, tf = t * 0.375, tw = t * 2.2, tb = t * 0.35;
        ctx.clearRect(0, 0, W, H);
        for (let gy = 0; gy < rows; gy++) {
          const v0 = gy * cellH, rowWave = 0.6 * Math.sin(v0 * 0.02 + tw * 0.7);
          for (let gx = 0; gx < cols; gx++) {
            const k = gy * cols + gx, kd = kind[k], u0 = gx * cellW;
            const p = tf + hash(gx, gy, 0), kk = Math.floor(p), f = p - kk;
            const d0 = hash(gx, gy, kk * 7) < 0.5 ? 0 : 1, d1 = hash(gx, gy, kk * 7 + 7) < 0.5 ? 0 : 1;
            let mix = f < 0.65 ? 0 : (f - 0.65) / 0.35; mix = mix * mix * (3 - 2 * mix);
            if (kd === 2) {
              const field = 0.5 + 0.5 * Math.sin(u0 * 0.012 + tb + 0.8 * Math.sin(v0 * 0.008 - tb * 0.6));
              let al = bgA[k]; if (!al) continue;
              al *= (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ph[k] + tb * 3))) * bgFade[k] * 0.3;
              if (al < 0.012) continue;
              const lv = Math.min(BGL, Math.round(al / 0.28 * BGL));
              if (d0 === d1 || mix === 0) bbk[lv][d0].push(u0, v0); else { const l1 = Math.round(lv * (1 - mix)), l2 = Math.round(lv * mix); if (l1) bbk[l1][d0].push(u0, v0); if (l2) bbk[l2][d1].push(u0, v0); }
              continue;
            }
            const shm = 0.5 + 0.5 * Math.sin(u0 * 0.045 - tw * 2.2 + rowWave) * (0.6 + 0.4 * Math.sin(u0 * 0.012 + tw * 0.9 + v0 * 0.006));
            if (hiA[k] && solidHi) { hiList.push(u0, v0); continue; }
            const lum = hiA[k] ? 1.3 : base[k] * (0.55 + 0.9 * Math.pow(shm, 1.8)); if (lum < 0.03) continue;
            const lv = Math.round(Math.min(1, lum / 1.2) * LEVELS);
            if (d0 === d1 || mix === 0) bk[lv][d0].push(u0, v0); else { const l1 = Math.round(lv * (1 - mix)), l2 = Math.round(lv * mix); if (l1) bk[l1][d0].push(u0, v0); if (l2) bk[l2][d1].push(u0, v0); }
          }
        }
        flush(bbk, bgPal); flush(bk, pal);
        if (hiList.length) { ctx.fillStyle = '#fff'; for (let q = 0; q < hiList.length; q += 2) ctx.fillRect(hiList[q], hiList[q + 1], cellW + 0.4, cellH + 0.4); hiList.length = 0; }
      };
      if (!this.raf) this.loop();
    }
    loop() {
      const step = (now) => { if (!this.isConnected || this.visible === false) { this.raf = 0; return; } this.frame && this.frame(now); this.raf = requestAnimationFrame(step); };
      this.raf = requestAnimationFrame(step);
    }
  }
  if (!customElements.get('binary-glyph')) customElements.define('binary-glyph', BinaryGlyph);
})();
