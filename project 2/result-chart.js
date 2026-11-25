(() => {
  class ResultChart extends HTMLElement {
    static get observedAttributes() { return ['values', 'color', 'color-values']; }
    connectedCallback() {
      if (this._built) { this.draw(); return; }
      this._built = true;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = '<style>:host{display:block}canvas{display:block;width:100%;height:100%}</style><canvas></canvas>';
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.ro = new ResizeObserver(() => this.draw());
      this.ro.observe(this);
      this.canvas.style.transition = 'transform 180ms ease-out';
      this.canvas.style.willChange = 'transform';
      this._move = (e) => {
        const r = this.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        const ang = Math.atan2(ny, nx);
        const N = (this._disp && this._disp.length) || String(this.getAttribute('values') || '').split(',').filter((s) => s.trim() !== '').length || 4;
        let idx = Math.floor(((ang + Math.PI / 2) / (Math.PI * 2)) * N);
        idx = ((idx % N) + N) % N;
        if (idx !== this._hoverIdx) {
          this._hoverIdx = idx;
          this.dispatchEvent(new CustomEvent('sectorhover', { detail: { index: idx, color: (this._cols || [])[idx] || null } }));
        }
        this._px = nx; this._py = ny;
        this._apply(nx, ny, this._pressed ? 1.06 : 1.03, this._pressed ? 1.7 : 1);
      };
      this._apply = (nx, ny, sc, boost) => {
        if (this.hasAttribute('flat')) { this.canvas.style.transform = 'none'; return; }
        const k = 14 * (boost || 1);
        this.canvas.style.transform =
          'perspective(700px) rotateX(' + (-ny * k).toFixed(2) + 'deg) rotateY(' + (nx * k).toFixed(2) + 'deg) scale(' + sc + ')';
      };
      this._down = () => {
        this._pressed = true;
        this.canvas.style.transition = 'transform 240ms cubic-bezier(.2,.7,.2,1)';
        this._apply(this._px || 0, this._py || 0, 1.06, 1.7);
      };
      this._up = () => {
        if (!this._pressed) return;
        this._pressed = false;
        this.canvas.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
        this._apply(this._px || 0, this._py || 0, 1.03, 1);
      };
      this.addEventListener('pointerdown', this._down);
      window.addEventListener('pointerup', this._up);
      this.style.cursor = 'pointer';
      this._leave = () => {
        this._px = 0; this._py = 0;
        this.canvas.style.transform = this.hasAttribute('flat') ? 'none' : 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
        this._hoverIdx = null;
        this.dispatchEvent(new CustomEvent('sectorhover', { detail: { index: null, color: null } }));
      };
      this.addEventListener('pointermove', this._move);
      this.addEventListener('pointerleave', this._leave);
      this.draw();
    }
    scheduleDraw() {
      if (this._drawQ) return;
      this._drawQ = requestAnimationFrame(() => { this._drawQ = 0; this.draw(); });
    }
    disconnectedCallback() { this.ro && this.ro.disconnect(); cancelAnimationFrame(this._drawQ); cancelAnimationFrame(this._vraf); cancelAnimationFrame(this._craf); }
    attributeChangedCallback(name, oldV, newV) {
      if (!this._built) return;
      if (name === 'color-values') {
        const target = String(newV || '').split(',').map(Number).filter((n) => !isNaN(n));
        if (!target.length) return;
        const from = (this._colv && this._colv.length === target.length) ? this._colv.slice() : target.slice();
        this._colvOwn = true;
        cancelAnimationFrame(this._craf);
        const strict = this.hasAttribute('flat');
        const t0 = performance.now(), DUR = strict ? 700 : 1500;
        const step = () => {
          const p = Math.min(1, (performance.now() - t0) / DUR);
          const e = strict ? 1 - Math.pow(1 - p, 3) : (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
          this._colv = from.map((v, i) => v + (target[i] - v) * e);
          this.scheduleDraw();
          if (p < 1) this._craf = requestAnimationFrame(step);
        };
        step();
        return;
      }
      if (name === 'values') {
        const LV = [0.34, 0.56, 0.78, 1];
        const snap = (v) => LV[Math.max(0, Math.min(3, Math.round(Math.min(1, Math.max(0, v)) * 4) - 1))];
        const target = String(newV || '').split(',').map(Number).filter((n) => !isNaN(n)).map(snap);
        if (!this._disp || this._disp.length !== target.length) { this._disp = target.slice(); this.draw(); return; }
        const from = this._disp.slice();
        if (!this._colv) this._colv = from.slice();
        cancelAnimationFrame(this._vraf);
        const strict = this.hasAttribute('flat');
        const t0 = performance.now(), DUR = strict ? 700 : 1500;
        const step = (now) => {
          const p = Math.min(1, (now - t0) / DUR);
          const e = strict ? 1 - Math.pow(1 - p, 3) : (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
          this._disp = from.map((v, i) => v + (target[i] - v) * e);
          if (!this._colvOwn) this._colv = this._disp.slice();
          this.scheduleDraw();
          if (p < 1) this._vraf = requestAnimationFrame(step);
        };
        this._vraf = requestAnimationFrame(step);
        return;
      }
      this.draw();
    }
    draw() {
      const w = this.offsetWidth, h = this.offsetHeight;
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const c = this.canvas;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const vals = this._disp || (this.getAttribute('values') || '0.95,0.62,0.88,0.7')
        .split(',').map(Number).filter((n) => !isNaN(n));
      if (!this._disp) this._disp = vals.slice();
      const flat = this.hasAttribute('flat');
      const color = flat ? '#2FC95B' : (this.getAttribute('color') || '#2FE06B');
      const RED = flat ? '#FF3B3B' : '#E0472F', ORG = flat ? '#FF9A2E' : '#E08A2F';
      const cx = w / 2, cy = h / 2;
      const half = Math.min(w, h) / 2;
      const R = half / 1.3; // leave room for glow so nothing clips at the canvas edge
      // stepped dark ring backdrop (4 levels)
      const LEVELS = (+this.getAttribute('levels') === 3) ? [0.44, 0.72, 1] : [0.34, 0.56, 0.78, 1];
      for (let li = LEVELS.length - 1; li >= 0; li--) {
        if (flat) {
          const rr = R * LEVELS[li];
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,255,255,' + (li === LEVELS.length - 1 ? 0.22 : 0.12) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
          continue;
        }
        const rr = R * LEVELS[li];
        const ring = ctx.createRadialGradient(cx, cy, rr * 0.55, cx, cy, rr);
        ring.addColorStop(0, 'rgba(255,255,255,0.02)');
        ring.addColorStop(0.85, 'rgba(255,255,255,' + (0.05 + li * 0.02) + ')');
        ring.addColorStop(1, 'rgba(255,255,255,0.10)');
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fillStyle = ring;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,' + (li === LEVELS.length - 1 ? 0.18 : 0.10) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // cross axes
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.setLineDash([3, 5]);
      for (const a of [-Math.PI / 4, Math.PI / 4]) {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.lineTo(cx - Math.cos(a) * R, cy - Math.sin(a) * R);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      // ambient glow behind the wheel — colour follows the overall level
      const hex2 = (c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16));
      const mix = (a, b, t) => {
        const A = hex2(a), B = hex2(b);
        return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
      };
      const cattr = (this.getAttribute('color-values') || '').split(',').map(Number).filter((n) => !isNaN(n));
      if (cattr.length === vals.length && !this._colvOwn) this._colv = cattr;
      const cvals = this._colv || vals;
      const mean = cvals.reduce((s, v) => s + Math.min(1, Math.max(0, v)), 0) / cvals.length;
      let gcol;
      if (mean <= 0.56) gcol = mix(RED, ORG, Math.max(0, (mean - 0.34) / 0.22));
      else gcol = mix(ORG, color, Math.min(1, (mean - 0.56) / 0.22));
      if (!flat) {
        const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, half);
        glow.addColorStop(0, gcol + '30');
        glow.addColorStop(0.6, gcol + '14');
        glow.addColorStop(1, gcol + '00');
        ctx.beginPath();
        ctx.arc(cx, cy, half, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
      // sectors: rounded pie slices with per-sector gradient + glow
      const n = vals.length;
      const inset = flat ? 0 : 7;
      const sector = (a0, a1, r) => {
        const corner = flat ? Math.min(10, r * 0.45) : Math.max(4, Math.min(10, 10 * (r / R)));
        // pie slice starting slightly off-center, rounded outer corners
        const mid = (a0 + a1) / 2;
        const sx = cx + Math.cos(mid) * inset, sy = cy + Math.sin(mid) * inset;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(cx + Math.cos(a0) * (r - corner), cy + Math.sin(a0) * (r - corner));
        ctx.arcTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r,
                  cx + Math.cos(a0 + corner / r) * r, cy + Math.sin(a0 + corner / r) * r, corner);
        ctx.arc(cx, cy, r, a0 + corner / r, a1 - corner / r);
        ctx.arcTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r,
                  cx + Math.cos(a1) * (r - corner), cy + Math.sin(a1) * (r - corner), corner);
        ctx.closePath();
      };
      const gapA = 0.055;
      const GAP = 5; // px half-width of the strip between sectors (flat mode)
      const sectorFlat = (b0, b1, r) => {
        // boundary rays at b0/b1 are offset by GAP px (parallel), giving a constant-width gap
        const corner = Math.min(10, r * 0.45);
        const n0 = [-Math.sin(b0), Math.cos(b0)], n1 = [Math.sin(b1), -Math.cos(b1)]; // inward normals
        const d0 = [Math.cos(b0), Math.sin(b0)], d1 = [Math.cos(b1), Math.sin(b1)];
        // start point: intersection of the two offset lines (near centre)
        const half = (b1 - b0) / 2, mid = (b0 + b1) / 2;
        const s = GAP / Math.sin(half);
        const sx = cx + Math.cos(mid) * s, sy = cy + Math.sin(mid) * s;
        const L = Math.sqrt(Math.max(0, r * r - GAP * GAP));
        const p0 = [cx + d0[0] * L + n0[0] * GAP, cy + d0[1] * L + n0[1] * GAP];
        const p1 = [cx + d1[0] * L + n1[0] * GAP, cy + d1[1] * L + n1[1] * GAP];
        const t0 = Math.atan2(p0[1] - cy, p0[0] - cx), t1 = Math.atan2(p1[1] - cy, p1[0] - cx);
        const dc = corner / r;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(p0[0] - d0[0] * corner, p0[1] - d0[1] * corner);
        ctx.arcTo(p0[0], p0[1], cx + Math.cos(t0 + dc) * r, cy + Math.sin(t0 + dc) * r, corner);
        ctx.arc(cx, cy, r, t0 + dc, t1 - dc);
        ctx.arcTo(p1[0], p1[1], p1[0] - d1[0] * corner, p1[1] - d1[1] * corner, corner);
        ctx.closePath();
      };
      for (let i = 0; i < n; i++) {
        const b0 = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const b1 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2;
        const a0 = b0 + gapA;
        const a1 = b1 - gapA;
        const lvl = Math.min(1, Math.max(0.14, vals[i] <= 1 && vals[i] >= 0.3 ? vals[i] : LEVELS[Math.max(0, Math.min(LEVELS.length - 1, Math.round(Math.min(1, vals[i]) * LEVELS.length) - 1))]));
        const r = lvl * R - (lvl < 1 ? 3 : 0);
        const vr = (this._colv && this._colv[i] !== undefined) ? this._colv[i] : lvl;
        const stepCols = (this.getAttribute('step-colors') || '').split(',').map((s) => s.trim()).filter(Boolean);
        let scol;
        if (stepCols.length) {
          const t = Math.max(0, Math.min(1, (lvl - LEVELS[0]) / (LEVELS[LEVELS.length - 1] - LEVELS[0]))) * (stepCols.length - 1);
          const i0 = Math.floor(t), i1 = Math.min(stepCols.length - 1, i0 + 1);
          scol = mix(stepCols[i0], stepCols[i1], t - i0);
        } else if (flat) {
          scol = vr <= 0.45 ? RED : vr <= 0.67 ? ORG : color;
        } else {
          scol = vr <= 0.56
            ? mix(RED, ORG, Math.max(0, Math.min(1, (vr - 0.34) / 0.22)))
            : mix(ORG, color, Math.max(0, Math.min(1, (vr - 0.56) / 0.22)));
        }
        this._cols = this._cols || []; this._cols[i] = scol;
        const scol2 = stepCols.length ? scol : vr <= 0.56
          ? mix('#e66a4d', '#e6a34d', Math.max(0, Math.min(1, (vr - 0.34) / 0.22)))
          : mix('#e6a34d', this.getAttribute('color2') || '#2ec5a0', Math.max(0, Math.min(1, (vr - 0.56) / 0.22)));
        if (flat) {
          sectorFlat(b0, b1, r);
          ctx.fillStyle = scol;
          ctx.fill();
          ctx.save();
          sectorFlat(b0, b1, r);
          ctx.clip();
          for (const lk of LEVELS) {
            const lr = R * lk;
            if (lr >= r - 2) continue;
            ctx.beginPath();
            ctx.arc(cx, cy, lr, b0, b1);
            ctx.strokeStyle = 'rgba(0,0,0,0.28)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.restore();
          continue;
        }
        const mid = (a0 + a1) / 2;
        // linear gradient across the slice: green -> teal tint on one edge
        const g = ctx.createLinearGradient(
          cx + Math.cos(a0) * r, cy + Math.sin(a0) * r,
          cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        g.addColorStop(0, scol);
        g.addColorStop(1, scol2);
        sector(a0, a1, r);
        ctx.save();
        const animating = !!(this._vraf || this._craf);
        ctx.shadowColor = scol + (animating ? '66' : 'aa');
        ctx.shadowBlur = animating ? 10 : 22;
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
        // inner radial lightening toward center
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g2.addColorStop(0, '#ffffff2e');
        g2.addColorStop(0.5, '#ffffff00');
        g2.addColorStop(1, '#00000022');
        sector(a0, a1, r);
        ctx.fillStyle = g2;
        ctx.fill();
        // level steps inside the slice
        ctx.save();
        sector(a0, a1, r);
        ctx.clip();
        for (const lk of LEVELS) {
          const lr = R * lk;
          if (lr >= r - 2) continue;
          ctx.beginPath();
          ctx.arc(cx, cy, lr, a0, a1);
          ctx.strokeStyle = 'rgba(0,0,0,0.18)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  }
  if (!customElements.get('result-chart')) customElements.define('result-chart', ResultChart);
})();
