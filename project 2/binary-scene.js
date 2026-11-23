// <binary-scene scene="cracks|growth|chain|late"> — wide, soft-edged binary-digit illustrations with pink accents
(() => {
  if (customElements.get('binary-scene')) return;
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const hash = (a, b, c) => { let h = (a * 374761393 + b * 668265263 + c * 2246822519) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const box = (x, y, hx, hy, r) => { const qx = Math.abs(x) - hx + r, qy = Math.abs(y) - hy + r; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
  const seg = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - ax - dx * t, py - ay - dy * t); };
  const poly = (px, py, pts) => { let d = 1e9; for (let i = 0; i < pts.length - 1; i++) d = Math.min(d, seg(px, py, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])); return d; };
  const fill = (d, w) => 1 - sm(-w, w, d);

  // each scene: (x, y, A) with y in [-0.5, 0.5] (down = +), x in [-A/2, A/2]; returns [intensity 0..1, pink 0..1]
  const SCENES = {
    // a layered slab split by a glowing crack
    cracks(x, y, A) {
      const hx = Math.min(A * 0.36, 1.15);
      const d = box(x, y + 0.02, hx, 0.19, 0.05);
      let I = fill(d, 0.012);
      if (I < 0.002) return [0, 0];
      const yy = (y + 0.21) / 0.38;
      I *= 0.5 + 0.5 * (1 - Math.max(0, Math.min(1, yy)));
      const strata = Math.abs(((yy * 4) % 1) - 0.5);
      I *= 0.82 + 0.18 * sm(0.04, 0.16, strata);
      const c1 = [[0.14, -0.32], [0.05, -0.13], [0.17, -0.03], [0.07, 0.08], [0.2, 0.3]];
      const c2 = [[0.05, -0.13], [-0.2, -0.07], [-0.36, -0.15], [-0.5, -0.1]];
      const c3 = [[0.17, -0.03], [0.42, 0.05], [0.6, -0.02]];
      const dm = poly(x, y, c1), db = Math.min(poly(x, y, c2), poly(x, y, c3)) + 0.008;
      const dc = Math.min(dm, db);
      const gap = sm(0.008, 0.016, dc);
      const edge = Math.exp(-Math.max(0, dc - 0.012) / 0.01);
      return [I * gap + edge * 0.25 * I, Math.min(1, edge * 1.2)];
    },
    // rising bars with one weak bar fracturing under the trend
    growth(x, y, A) {
      const n = 9, span = Math.min(A * 0.8, 2.5), x0 = -span / 2, bw = span / n, base = 0.3;
      let I = 0, P = 0;
      const tops = [];
      for (let i = 0; i < n; i++) {
        const cx = x0 + (i + 0.5) * bw, hh = 0.1 + 0.46 * Math.pow(i / (n - 1), 1.25);
        tops.push([cx, base - hh - 0.05]);
        const d = box(x - cx, y - (base - hh / 2), bw * 0.3, hh / 2, 0.012);
        let b = fill(d, 0.008);
        if (b < 0.002) continue;
        b *= 0.45 + 0.55 * (1 - (y - (base - hh)) / hh * 0.6);
        if (i === 6) {
          const cut = base - hh * 0.45 + 0.025 * Math.sin((x - cx) * 60);
          const dcut = Math.abs(y - cut);
          b *= sm(0.01, 0.018, dcut);
          P = Math.max(P, Math.exp(-Math.max(0, dcut - 0.014) / 0.012));
        }
        I = Math.max(I, b);
      }
      const dl = poly(x, y, tops);
      const line = fill(dl - 0.006, 0.004) * 0.95 * sm(x0 - 0.1, x0 + 0.2, x);
      if (line > I) { I = line; P = Math.max(P, Math.abs(x - (x0 + 6.5 * bw)) < bw * 0.5 ? 1 : 0); }
      if (Math.abs(y - base - 0.02) < 0.006 && Math.abs(x) < span / 2 + 0.05) I = Math.max(I, 0.3);
      return [I, P];
    },
    // a horizontal chain whose middle link has snapped
    chain(x, y, A) {
      const n = 5, pitch = Math.min(A * 0.8, 2.4) / n, L = pitch * 0.42, R = 0.12, t = 0.034;
      let I = 0, P = 0;
      for (let k = 0; k < n; k++) {
        const cx = (k - (n - 1) / 2) * pitch;
        let lx = x - cx, ly = y;
        if (k === 2 && lx > 0) { ly -= 0.035; lx -= 0.03; }
        if (k % 2 === 0) {
          const q = Math.max(Math.abs(lx) - L, 0), d = Math.hypot(q, ly) - R, ring = Math.abs(d) - t;
          let b = fill(ring, 0.007) * (0.55 + 0.45 * (1 - Math.min(1, Math.abs(d) / t))) * (0.75 + 0.25 * (ly < 0 ? 1 : 0.6));
          if (k === 2) {
            const dg = Math.abs(lx - 0.015);
            b *= sm(0.03, 0.04, dg);
            P = Math.max(P, dg < 0.09 ? 1 : 0);
          }
          I = Math.max(I, b);
        } else {
          const d = seg(lx, ly, -L - R * 0.7, 0, L + R * 0.7, 0) - 0.04;
          I = Math.max(I, fill(d, 0.007) * (0.5 + 0.4 * (1 - Math.min(1, Math.abs(ly) / 0.04))));
        }
      }
      return [I, P];
    },
    // a timeline whose signal stays calm, then spikes after the decision point
    late(x, y, A) {
      const span = Math.min(A * 0.86, 2.6), x0 = -span / 2, u = (x - x0) / span;
      if (u < -0.05 || u > 1.05) return [0, 0];
      const s = (uu) => { const amp = 0.018 + 0.05 * sm(0.45, 0.75, uu) + 0.24 * Math.exp(-Math.pow((uu - 0.8) / 0.05, 2)); return 0.05 - amp * Math.abs(Math.sin(uu * 46)) * (uu > 0.74 && uu < 0.86 ? 1.4 : 1); };
      const e = 0.002, sv = s(u), ds = (s(u + e) - s(u - e)) / (2 * e * span);
      const d = Math.abs(y - sv) / Math.sqrt(1 + ds * ds);
      let I = fill(d - 0.007, 0.004) * sm(-0.05, 0.08, u) * sm(1.05, 0.95, u);
      let P = I * (u > 0.7 ? 1 : 0);
      const axis = 0.2;
      if (Math.abs(y - axis) < 0.005 && u > 0 && u < 1) I = Math.max(I, 0.28);
      const tk = Math.abs(u * 10 - Math.round(u * 10)) * span / 10;
      if (tk < 0.006 && y > axis - 0.025 && y < axis + 0.025 && u > 0 && u < 1) I = Math.max(I, 0.4);
      const xm = x0 + 0.8 * span;
      if (Math.abs(x - xm) < 0.006 && y > -0.36 && y < axis && ((y * 40) % 1 + 1) % 1 < 0.55) { I = Math.max(I, 0.45); P = Math.max(P, 0.9); }
      const xa = x0 + 0.3 * span;
      if (Math.abs(x - xa) < 0.005 && y > -0.2 && y < axis && ((y * 40) % 1 + 1) % 1 < 0.55) I = Math.max(I, 0.3);
      const dot = Math.hypot(x - xa, y - 0.05);
      if (dot < 0.03) I = Math.max(I, 0.9 * fill(dot - 0.022, 0.008));
      return [I, P];
    }
  };

  const PINK = [236, 57, 135];
  class BinaryScene extends HTMLElement {
    connectedCallback() {
      this.style.display = this.style.display || 'block';
      this.cv = document.createElement('canvas'); this.cv.style.cssText = 'width:100%;height:100%;display:block;';
      this.appendChild(this.cv);
      this.ro = new ResizeObserver(() => this.build()); this.ro.observe(this);
      this.io = new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; if (this.visible && !this.raf) this.loop(); }); this.io.observe(this);
      this.build();
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro && this.ro.disconnect(); this.io && this.io.disconnect(); }
    static get observedAttributes() { return ['scene']; }
    attributeChangedCallback() { if (this.cv) this.build(); }
    build() {
      const W = this.clientWidth, H = this.clientHeight; if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.cv.width = W * dpr; this.cv.height = H * dpr;
      const ctx = this.cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cw = parseFloat(this.getAttribute('cell')) || 6.2, ch = cw * 1.45;
      const cols = Math.ceil(W / cw), rows = Math.ceil(H / ch), A = W / H;
      const fn = SCENES[this.getAttribute('scene')] || SCENES.cracks;
      const N = cols * rows, inten = new Float32Array(N), pink = new Float32Array(N), seed = new Float32Array(N);
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const k = gy * cols + gx, px = gx * cw + cw / 2, py = gy * ch + ch / 2, u = px / W, v = py / H;
        const vig = sm(0, 0.07, u) * sm(1, 0.93, u) * sm(0, 0.06, v) * sm(1, 0.86, v);
        let [I, P] = fn((px - W / 2) / H, (py - H / 2) / H, A);
        seed[k] = hash(gx, gy, 3);
        if (I < 0.03) { I = seed[k] < 0.05 ? 0.04 + 0.05 * hash(gx, gy, 11) : 0; P = 0; }
        inten[k] = Math.min(1, I) * vig; pink[k] = Math.min(1, P);
      }
      const font = `500 ${Math.round(ch * 0.82)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      const AL = 20, PL = 4, styles = [];
      for (let p = 0; p <= PL; p++) for (let a = 0; a <= AL; a++) {
        const m = p / PL, r = Math.round(255 + (PINK[0] - 255) * m), g = Math.round(255 + (PINK[1] - 255) * m), b = Math.round(255 + (PINK[2] - 255) * m);
        styles.push(`rgba(${r},${g},${b},${(a / AL).toFixed(3)})`);
      }
      const buckets = styles.map(() => []);
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t0 = performance.now(); let last = 0;
      this.frame = (now) => {
        if (now - last < 40) return; last = now;
        const t = reduce ? 0 : (now - t0) / 1000;
        ctx.clearRect(0, 0, W, H); ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let k = 0; k < N; k++) {
          const I = inten[k]; if (I < 0.02) continue;
          const gx = k % cols, gy = (k / cols) | 0, px = gx * cw;
          const wave = 0.9 + 0.1 * Math.sin(px * 0.022 - t * 1.4 + gy * 0.15);
          const tw = 0.95 + 0.05 * Math.sin(seed[k] * 40 + t * 3);
          const a = Math.min(1, Math.pow(I, 0.75) * wave * tw);
          const ai = Math.round(a * AL); if (!ai) continue;
          const pl = Math.round(pink[k] * PL);
          const bit = hash(gx, gy, Math.floor(t * 0.8 + seed[k] * 9)) < 0.5 ? 0 : 1;
          buckets[pl * (AL + 1) + ai].push(gx * cw + cw / 2, gy * ch + ch / 2, bit);
        }
        for (let s = 0; s < buckets.length; s++) {
          const list = buckets[s]; if (!list.length) continue;
          ctx.fillStyle = styles[s];
          for (let j = 0; j < list.length; j += 3) ctx.fillText(list[j + 2] ? '1' : '0', list[j], list[j + 1]);
          list.length = 0;
        }
      };
      this.last = 0; this.frame(performance.now() + 1000);
      if (this.visible && !this.raf) this.loop();
    }
    loop() {
      const step = (now) => { if (!this.visible) { this.raf = 0; return; } this.frame && this.frame(now); this.raf = requestAnimationFrame(step); };
      this.raf = requestAnimationFrame(step);
    }
  }
  customElements.define('binary-scene', BinaryScene);
})();
