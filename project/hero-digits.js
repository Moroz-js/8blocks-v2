/* <hero-digits> — dense white digit field + survey quads that snap to the photo's relief.
   Usage: <hero-digits style="position:absolute;inset:0"></hero-digits>
   Attributes: radius (px) · step (grid px) · zone (hover-area selector) */
(() => {
  class HeroDigits extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>:host{display:block;pointer-events:none}canvas{position:absolute;inset:0;width:100%;height:100%}</style><canvas></canvas>`;
      this.cv = root.querySelector('canvas');
      this.ctx = this.cv.getContext('2d');

      this.R = +(this.getAttribute('radius') || 170);
      this.STEP = +(this.getAttribute('step') || 12);
      this.m = { x: -999, y: -999 };
      this.t = { x: -999, y: -999 };
      this.hv = 0;
      this.p = null;
      this.excl = (this.getAttribute('exclude') || '').split(';').filter(Boolean)
        .map(t => t.split(',').map(Number));
      this.COL = 6;               // edge-map column pitch (px)

      this.onMove = (e) => {
        const r = this.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        this.active = inside;
        if (inside) { this.t.x = e.clientX - r.left; this.t.y = e.clientY - r.top; }
      };
      this.onLeave = () => { this.active = false; };
      window.addEventListener('pointermove', this.onMove, { passive: true });
      window.addEventListener('pointerleave', this.onLeave);

      this.fit = () => {
        const r = this.getBoundingClientRect();
        this.w = r.width; this.h = r.height;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        this.cv.width = Math.round(this.w * dpr); this.cv.height = Math.round(this.h * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cols = Math.ceil(this.w / this.STEP) + 1, rows = Math.ceil(this.h / this.STEP) + 1;
        const glyphs = '822002802208';
        this.cells = [];
        for (let r2 = 0; r2 < rows; r2++) for (let c = 0; c < cols; c++) {
          this.cells.push({
            x: c * this.STEP + (r2 % 2 ? this.STEP * 0.5 : 0),
            y: r2 * this.STEP,
            ch: glyphs[(c * 7 + r2 * 3) % glyphs.length],
            w: 0.5 + 0.5 * Math.sin(c * 1.7 + r2 * 2.3)
          });
        }
        this.buildEdges();
        this.buildMask();
      };
      this.ro = new ResizeObserver(this.fit); this.ro.observe(this);
      this.fit();

      const loop = (now) => {
        this._raf = requestAnimationFrame(loop);
        if (this.__vis === false) return;
        if ((this.hv || 0) < 0.008 && now - (this._lastF || 0) < 150) return;
        this._lastF = now;
        this.hv += ((this.active ? 1 : 0) - this.hv) * 0.07;
        if (this.hv < 0.004) { this.ctx.clearRect(0, 0, this.w, this.h); return; }
        this.m.x += (this.t.x - this.m.x) * 0.16;
        this.m.y += (this.t.y - this.m.y) * 0.16;
        this.draw(now);
      };
      this.__vis = true;
      this.__io = new IntersectionObserver((es) => { this.__vis = es[es.length - 1].isIntersecting; }, { rootMargin: '200px' });
      this.__io.observe(this);
      this._raf = requestAnimationFrame(loop);
    }

    findImg() {
      const p = this.parentElement;
      if (!p) return null;
      const direct = p.querySelector('img');
      if (direct) return direct;
      for (const el of p.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const im = el.shadowRoot.querySelector('img[part="image"], img');
          if (im && im.currentSrc) return im;
        }
      }
      return null;
    }

    /* sample the underlying photo once: per column, the y positions of the strongest
       luminance breaks — the relief the quads latch onto */
    buildEdges() {
      const img = this.findImg();
      this.edges = null;
      if (!img) { this._edgeRetry = (this._edgeRetry || 0) + 1;
        if (this._edgeRetry < 40) setTimeout(() => this.buildEdges(), 250); return; }
      const run = () => {
        try {
          const er = this.getBoundingClientRect(), ir = img.getBoundingClientRect();
          const s = 0.25;
          const off = document.createElement('canvas');
          off.width = Math.max(1, Math.round(this.w * s)); off.height = Math.max(1, Math.round(this.h * s));
          const c = off.getContext('2d', { willReadFrequently: true });
          c.drawImage(img, (ir.left - er.left) * s, (ir.top - er.top) * s, ir.width * s, ir.height * s);
          const { width: W, height: H } = off;
          const d = c.getImageData(0, 0, W, H).data;
          const L = new Float32Array(W * H);
          for (let i = 0, n = W * H; i < n; i++) L[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) / 255;
          const cols = Math.ceil(this.w / this.COL) + 1;
          const edges = [];
          for (let ci = 0; ci < cols; ci++) {
            const px = Math.min(W - 1, Math.round(ci * this.COL * s));
            const list = [];
            for (let y = 3; y < H - 3; y++) {
              const g = Math.abs(L[(y + 2) * W + px] - L[(y - 2) * W + px]);
              const gp = Math.abs(L[(y + 1) * W + px] - L[(y - 3) * W + px]);
              const gn = Math.abs(L[(y + 3) * W + px] - L[(y - 1) * W + px]);
              if (g > 0.055 && g >= gp && g >= gn) list.push(y / s);
            }
            edges.push(list);
          }
          this.edges = edges;
          // per-row x positions of strong vertical breaks = facade sides
          const rows = Math.ceil(this.h / this.COL) + 1;
          const vEdges = [];
          for (let ri = 0; ri < rows; ri++) {
            const py = Math.min(H - 1, Math.round(ri * this.COL * s));
            const list = [];
            for (let x = 3; x < W - 3; x++) {
              const g = Math.abs(L[py * W + x + 2] - L[py * W + x - 2]);
              const gp = Math.abs(L[py * W + x + 1] - L[py * W + x - 3]);
              const gn = Math.abs(L[py * W + x + 3] - L[py * W + x - 1]);
              if (g > 0.055 && g >= gp && g >= gn) list.push(x / s);
            }
            vEdges.push(list);
          }
          this.vEdges = vEdges;
        } catch (e) { this.edges = null; }
      };
      if (img.complete && img.naturalWidth) run(); else img.addEventListener('load', run, { once: true });
    }

    /* per-cell structure mask: buildings + crane keep digits, open sky drops them */
    buildMask() {
      const img = this.findImg();
      if (!img || !this.cells) { this._maskRetry = (this._maskRetry || 0) + 1;
        if (this._maskRetry < 40) setTimeout(() => this.buildMask(), 250); return; }
      const run = () => {
        try {
          const er = this.getBoundingClientRect(), ir = img.getBoundingClientRect();
          const s = 0.3;
          const off = document.createElement('canvas');
          off.width = Math.max(1, Math.round(this.w * s)); off.height = Math.max(1, Math.round(this.h * s));
          const c = off.getContext('2d', { willReadFrequently: true });
          c.drawImage(img, (ir.left - er.left) * s, (ir.top - er.top) * s, ir.width * s, ir.height * s);
          const { width: W, height: H } = off;
          const d = c.getImageData(0, 0, W, H).data;
          const L = new Float32Array(W * H);
          for (let i = 0, n = W * H; i < n; i++) L[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) / 255;
          // local edge energy per pixel (cheap 4-neighbour gradient), then per-cell max
          const E = new Float32Array(W * H);
          for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
            const i = y * W + x;
            E[i] = Math.abs(L[i + 1] - L[i - 1]) + Math.abs(L[i + W] - L[i - W]);
          }
          const rad = Math.max(2, Math.round(this.STEP * s));
          for (const cell of this.cells) {
            const cx = Math.round(cell.x * s), cy = Math.round(cell.y * s);
            let e = 0, lum = 0, n = 0;
            for (let y = cy - rad; y <= cy + rad; y += 1) {
              if (y < 1 || y >= H - 1) continue;
              for (let x = cx - rad; x <= cx + rad; x += 1) {
                if (x < 1 || x >= W - 1) continue;
                const i = y * W + x;
                if (E[i] > e) e = E[i];
                lum += L[i]; n++;
              }
            }
            if (!n) { cell.m = 0; continue; }
            lum /= n;
            const texture = Math.min(1, Math.max(0, (e - 0.045) / 0.10));
            cell.m = texture;
            if (this.excl) for (const [ex, ey, er] of this.excl) {
              if ((cell.x - ex) ** 2 + (cell.y - ey) ** 2 < er * er) { cell.m = 0; break; }
            }
          }
          // soften: a cell with strong neighbours picks up some presence
          const byKey = new Map();
          for (const cell of this.cells) byKey.set(Math.round(cell.x) + ':' + Math.round(cell.y), cell);
          const prev = this.cells.map(c2 => c2.m);
          this.cells.forEach((cell, i2) => {
            let mx = prev[i2];
            for (const [dx, dy] of [[this.STEP, 0], [-this.STEP, 0], [0, this.STEP], [0, -this.STEP]]) {
              const nb = byKey.get(Math.round(cell.x + dx) + ':' + Math.round(cell.y + dy));
              if (nb) mx = Math.max(mx, nb.m * 0.72);
            }
            cell.m = mx;
          });
        } catch (e) { for (const cell of this.cells) cell.m = 1; }
      };
      if (img.complete && img.naturalWidth) run(); else img.addEventListener('load', run, { once: true });
    }

    /* y of the relief break nearest refY at x */
    snapY(x, refY) {
      if (!this.edges) return refY;
      const ci = Math.max(0, Math.min(this.edges.length - 1, Math.round(x / this.COL)));
      const list = this.edges[ci];
      if (!list || !list.length) return refY;
      let best = refY, bd = 1e9;
      for (const y of list) { const dd = Math.abs(y - refY); if (dd < bd) { bd = dd; best = y; } }
      return bd > 70 ? refY : best;
    }

    /* nearest facade side to refX at height y; dir -1 left, +1 right, 0 nearest */
    snapX(y, refX, dir) {
      if (!this.vEdges) return refX;
      const ri = Math.max(0, Math.min(this.vEdges.length - 1, Math.round(y / this.COL)));
      const list = this.vEdges[ri];
      if (!list || !list.length) return refX;
      let best = refX, bd = 1e9;
      for (const x of list) {
        if (dir < 0 && x > refX) continue;
        if (dir > 0 && x < refX) continue;
        const dd = Math.abs(x - refX);
        if (dd < bd) { bd = dd; best = x; }
      }
      return bd > 120 ? refX : best;
    }

    /* least-squares fit of the relief under [x0, x0+w] -> clean straight edge */
    reliefFit(x0, w, refY) {
      const N = 9;
      let sx = 0, sy = 0, sxx = 0, sxy = 0, n = 0;
      for (let i = 0; i <= N; i++) {
        const x = x0 + (w * i) / N;
        const y = this.snapY(x, refY);
        sx += x; sy += y; sxx += x * x; sxy += x * y; n++;
      }
      const den = n * sxx - sx * sx;
      let k = den ? (n * sxy - sx * sy) / den : 0;
      k = Math.max(-0.6, Math.min(0.6, k));
      const b = sy / n - k * (sx / n);
      return { k, b };
    }

    /* quadrilateral: left/right sides on facade edges, each corner y on its own relief break */
    quad(ctx, x0, w, hgt, refY) {
      const tL = this.snapX(refY + hgt * 0.5, x0, -1);
      const tR = this.snapX(refY + hgt * 0.5, x0 + w, 1);
      const L0 = this.bL = this.bL == null ? tL : this.bL + (tL - this.bL) * 0.05;
      const R0raw = this.bR = this.bR == null ? tR : this.bR + (tR - this.bR) * 0.05;
      const R0 = L0 + Math.max(110, Math.min(360, R0raw - L0));
      const tyL = this.snapY(L0, refY), tyR = this.snapY(R0, refY);
      const byL = this.snapY(L0, refY + hgt), byR = this.snapY(R0, refY + hgt);
      const lerp = (k, t, v) => this[k] = this[k] == null ? v : this[k] + (v - this[k]) * t;
      const clamp = (v, ref, d) => Math.max(ref - d, Math.min(ref + d, v));
      const yTL = lerp('_ytl', 0.05, tyL);
      const yTR = lerp('_ytr', 0.05, clamp(tyR, tyL, 30));
      const yBL = lerp('_ybl', 0.05, Math.max(byL, tyL + hgt * 0.7));
      const yBR = lerp('_ybr', 0.05, clamp(Math.max(byR, tyR + hgt * 0.7), Math.max(byL, tyL + hgt * 0.7), 30));
      const pts = [[L0, yTL], [R0, yTR], [R0, yBR], [L0, yBL]];
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      return pts;
    }

    draw(now) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const mx = this.m.x, my = this.m.y;

      if (!this.p) this.p = { x: mx, y: my, x2: mx, y2: my };
      if (now - (this._roll || -9999) > 2600) {
        this._roll = now;
        const rnd = (a2, b2) => a2 + Math.random() * (b2 - a2);
        const amount = Math.round(rnd(120000, 985000));
        this.v = {
          w1: Math.round(rnd(190, 260)), h1: Math.round(rnd(58, 82)),
          l1: '$' + amount.toLocaleString('en-US')
        };
      }
      const v = this.v, p = this.p;
      p.x += (mx - p.x) * 0.07; p.y += (my - p.y) * 0.07;
      p.x2 += (p.x - p.x2) * 0.035; p.y2 += (p.y - p.y2) * 0.035;

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.42 * this.hv).toFixed(3) + ')';
      const q = this.quad(ctx, p.x2 - v.w1 * 0.62, v.w1, v.h1, p.y2);
      ctx.stroke();

      // digits live only inside the quad
      const inQ = (x, y) => {
        let ins = false;
        for (let i = 0, j = 3; i < 4; j = i++) {
          const [xi, yi] = q[i], [xj, yj] = q[j];
          if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
        }
        return ins;
      };
      const minX = Math.min(q[0][0], q[3][0]), maxX = Math.max(q[1][0], q[2][0]);
      const minY = Math.min(q[0][1], q[1][1]), maxY = Math.max(q[2][1], q[3][1]);
      ctx.font = "500 9px ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const cell of this.cells) {
        if (cell.x < minX || cell.x > maxX || cell.y < minY || cell.y > maxY) continue;
        if (!inQ(cell.x, cell.y)) continue;
        const m = cell.m == null ? 1 : cell.m;
        if (m < 0.22) continue;
        const a2 = 0.5 * cell.w * this.hv * m;
        if (a2 < 0.012) continue;
        ctx.fillStyle = 'rgba(255,255,255,' + a2.toFixed(3) + ')';
        ctx.fillText(cell.ch, cell.x, cell.y);
      }

      ctx.fillStyle = 'rgba(255,255,255,' + (0.62 * this.hv).toFixed(3) + ')';
      ctx.font = "500 11px ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace";
      ctx.textAlign = 'left';
      ctx.fillText(v.l1, q[0][0], q[0][1] - 10);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      window.removeEventListener('pointermove', this.onMove);
      window.removeEventListener('pointerleave', this.onLeave);
      this.ro && this.ro.disconnect();
    }
  }
  if (!customElements.get('hero-digits')) customElements.define('hero-digits', HeroDigits);
})();
