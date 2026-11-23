(() => {
  // Unlock schedule: monthly unlock bars + cumulative circulating supply line.
  // Styled for the 8Blocks site: Manrope labels, magenta accent, neutral bars.
  const DEFAULT = (() => {
    const a = [];
    const push = (n, v, spike) => { for (let i = 0; i < n; i++) a.push({ v, spike }); };
    a.push({ v: 13.1, spike: false });      // TGE
    push(6, 5.5, true);                     // M1-M6
    push(5, 8.5, true);                     // M7-M11
    a.push({ v: 8.5, spike: false });       // M12
    push(6, 10.5, true);                    // M13-M18
    push(11, 5.5, false);                   // M19-M29
    push(12, 2.4, false);                   // M30-M41
    push(11, 1.7, false);                   // M42-M52
    push(8, 1.4, false);                    // M53-M60
    return a;
  })();

  const ACCENT = '#CA005A';
  const BAR = 'rgba(255,255,255,0.26)';
  const BAR_HI = 'rgba(255,255,255,0.44)';

  class UnlockChart extends HTMLElement {
    static get observedAttributes() { return ['data', 'accent']; }
    connectedCallback() {
      if (this._built) { this.draw(); return; }
      this._built = true;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML =
        '<style>:host{display:block;position:relative}canvas{display:block;width:100%;height:100%}' +
        '.tip{position:absolute;pointer-events:none;opacity:0;transition:opacity 140ms ease;' +
        'padding:10px 12px;border-radius:12px;background:rgba(20,20,20,0.94);border:1px solid rgba(255,255,255,0.14);' +
        'font-family:Manrope,sans-serif;font-size:13px;line-height:1.45;color:#fff;white-space:nowrap;transform:translate(-50%,-100%)}' +
        '.tip b{font-weight:600}.tip i{font-style:normal;color:rgba(255,255,255,0.56)}</style>' +
        '<canvas></canvas><div class="tip"></div>';
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.tip = this.shadowRoot.querySelector('.tip');
      if (this.hasAttribute('strict')) { this.tip.style.borderRadius = '0'; this.tip.style.border = '1px solid #707172'; this.tip.style.background = '#1B1B1B'; }
      this.ro = new ResizeObserver(() => this.draw());
      this.ro.observe(this);
      this.addEventListener('pointermove', (e) => {
        const r = this.getBoundingClientRect();
        this._mx = e.clientX - r.left;
        this._my = e.clientY - r.top;
        this.draw();
      });
      this.addEventListener('pointerleave', () => { this._mx = null; this.draw(); });
      this.draw();
    }
    disconnectedCallback() { this.ro && this.ro.disconnect(); }
    attributeChangedCallback() { if (this._built) this.draw(); }
    series() {
      const raw = this.getAttribute('data');
      if (!raw) return DEFAULT;
      try {
        const p = JSON.parse(raw);
        if (Array.isArray(p)) return p.map((d) => (typeof d === 'number' ? { v: d, spike: false } : d));
      } catch (e) { /* fall through */ }
      return DEFAULT;
    }
    draw() {
      const w = this.offsetWidth, h = this.offsetHeight;
      if (!w || !h) return;
      const strict = this.hasAttribute('strict');
      const accent = strict ? '#ffffff' : (this.getAttribute('accent') || ACCENT);
      const BARC = strict ? '#707172' : BAR, BARHI = strict ? '#8a8b8c' : BAR_HI;
      const MUTED = strict ? '#707172' : 'rgba(255,255,255,0.56)';
      const GRID = strict ? '#1B1B1B' : 'rgba(255,255,255,0.10)';
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const c = this.canvas;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const data = this.series();
      const n = data.length;
      const padL = 12, padR = 58, padT = 26, padB = 64;
      const pw = w - padL - padR, ph = h - padT - padB;
      const total = data.reduce((s, d) => s + d.v, 0) || 1;
      const maxV = Math.max.apply(null, data.map((d) => d.v));

      // cumulative %
      const cum = [];
      let acc = 0;
      for (let i = 0; i < n; i++) { acc += data[i].v; cum.push((acc / total) * 100); }

      const x = (i) => padL + (i + 0.5) * (pw / n);
      const yPct = (p) => padT + ph - (p / 100) * ph;

      // horizontal gridlines at 25/50/75/100 %
      const slotW = pw / n;
      if (strict) {
        for (let i = 0; i <= n; i++) {
          const tx = padL + i * slotW;
          const q = i % 3 === 0, yr = i % 12 === 0;
          ctx.beginPath(); ctx.moveTo(tx, padT + ph); ctx.lineTo(tx, padT + ph + (yr ? 10 : q ? 6 : 3));
          ctx.strokeStyle = yr ? '#ffffff' : '#707172'; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.strokeStyle = '#707172'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + 0.5); ctx.lineTo(padL + pw, padT + ph + 0.5); ctx.stroke();
      }
      ctx.font = '500 13px Manrope, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      for (const p of [25, 50, 75, 100]) {
        const y = yPct(p);
        ctx.beginPath();
        if (!strict) ctx.setLineDash([2, 6]);
        ctx.moveTo(padL, y);
        ctx.lineTo(padL + pw, y);
        ctx.strokeStyle = GRID;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = MUTED;
        ctx.fillText(p + '%', padL + pw + 14, y);
      }

      // bars
      const slot = pw / n;
      const bw = Math.max(3, Math.min(11, slot * 0.55));
      const hoverIdx = this._mx == null ? -1 : Math.max(0, Math.min(n - 1, Math.floor((this._mx - padL) / slot)));
      const barH = (v) => Math.max(2, (v / maxV) * ph * 0.92);
      for (let i = 0; i < n; i++) {
        const bh = barH(data[i].v);
        const bx = x(i) - bw / 2, by = padT + ph - bh;
        const on = i === hoverIdx;
        ctx.beginPath();
        const r = strict ? 0 : Math.min(2, bw / 2);
        ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, r) : ctx.rect(bx, by, bw, bh);
        if (strict) {
          ctx.fillStyle = data[i].spike ? (on ? '#ffffff' : '#e6e6e6') : (on ? BARHI : BARC);
          ctx.fill();
        } else if (data[i].spike) {
          ctx.fillStyle = on ? '#ff4fb0' : accent;
          ctx.save();
          ctx.shadowColor = accent + '66';
          ctx.shadowBlur = on ? 18 : 10;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = on ? BARHI : BARC;
          ctx.fill();
        }
      }

      // cumulative line
      ctx.beginPath();
      ctx.moveTo(x(0), yPct(cum[0]));
      for (let i = 1; i < n; i++) ctx.lineTo(x(i), yPct(cum[i]));
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.lineJoin = strict ? 'miter' : 'round';
      ctx.save();
      if (!strict) { ctx.shadowColor = accent + '80'; ctx.shadowBlur = 12; }
      ctx.stroke();
      ctx.restore();

      // x labels every 12 months
      ctx.textAlign = 'center';
      ctx.fillStyle = MUTED;
      ctx.font = '500 13px Manrope, sans-serif';
      for (let i = 0; i < n; i += 12) {
        ctx.textAlign = i === 0 ? 'left' : 'center';
        ctx.fillStyle = strict ? '#ffffff' : MUTED;
        ctx.fillText(strict ? (i === 0 ? 'TGE' : 'Y' + (i / 12)) : 'M' + i, i === 0 ? padL : strict ? padL + i * slotW : x(i), padT + ph + 24);
      }
      if (strict) {
        ctx.fillStyle = MUTED; ctx.textAlign = 'center';
        for (let i = 6; i < n; i += 12) ctx.fillText('M' + i, padL + i * slotW, padT + ph + 24);
      }

      // legend
      const ly = h - 14;
      let lx = padL;
      const chip = (color, label, glow) => {
        ctx.beginPath();
        ctx.roundRect && !strict ? ctx.roundRect(lx, ly - 5, 9, 10, 2) : ctx.rect(lx, ly - 5, 9, 10);
        ctx.fillStyle = color;
        if (glow && !strict) { ctx.save(); ctx.shadowColor = color + '66'; ctx.shadowBlur = 8; ctx.fill(); ctx.restore(); }
        else ctx.fill();
        lx += 16;
        ctx.textAlign = 'left';
        ctx.fillStyle = MUTED;
        ctx.fillText(label, lx, ly);
        lx += ctx.measureText(label).width + 28;
      };
      chip(BARC, 'monthly unlock', false);
      chip(strict ? '#e6e6e6' : accent, 'spike month', true);
      // line swatch
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 18, ly);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      lx += 26;
      ctx.fillStyle = MUTED;
      ctx.fillText('circulating supply, % of total', lx, ly);

      // hover marker + tooltip
      if (hoverIdx >= 0 && this._my != null && this._my < padT + ph + 12) {
        const hx = x(hoverIdx), hy = yPct(cum[hoverIdx]);
        ctx.beginPath();
        ctx.moveTo(hx, padT);
        ctx.lineTo(hx, padT + ph);
        ctx.strokeStyle = strict ? '#707172' : 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        if (strict) ctx.rect(hx - 4, hy - 4, 8, 8); else ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2;
        ctx.stroke();
        const d = data[hoverIdx];
        this.tip.innerHTML =
          '<b>M' + hoverIdx + (d.spike ? ' · spike' : '') + '</b><br>' +
          '<i>unlock</i> ' + ((d.v / total) * 100).toFixed(2) + '%<br>' +
          '<i>circulating</i> ' + cum[hoverIdx].toFixed(1) + '%';
        this.tip.style.left = Math.max(90, Math.min(w - 90, hx)) + 'px';
        this.tip.style.top = Math.max(74, hy - 14) + 'px';
        this.tip.style.opacity = '1';
      } else {
        this.tip.style.opacity = '0';
      }
    }
  }
  if (!customElements.get('unlock-chart')) customElements.define('unlock-chart', UnlockChart);
})();
