(() => {
  // Donut/pie chart in the 8Blocks site style: magenta family + neutral, soft glow,
  // hover lifts a slice and reports it via a `slicehover` event.
  const DEFAULT = [
    { label: 'Community', value: 40, color: '#FF5CBE' },
    { label: 'Team share', value: 20, color: '#CA005A' },
    { label: 'Investors', value: 20, color: '#980051' },
    { label: 'Treasury', value: 20, color: 'rgba(255,255,255,0.24)' },
  ];

  class PieChart extends HTMLElement {
    static get observedAttributes() { return ['data', 'inner']; }
    connectedCallback() {
      if (this._built) { this.draw(); return; }
      this._built = true;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML =
        '<style>:host{display:block;position:relative}canvas{display:block;width:100%;height:100%}</style><canvas></canvas>';
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.ro = new ResizeObserver(() => this.draw());
      this.ro.observe(this);
      this.style.cursor = 'pointer';
      this.addEventListener('pointermove', (e) => {
        const r = this.getBoundingClientRect();
        const cx = r.width / 2, cy = r.height / 2;
        const dx = e.clientX - r.left - cx, dy = e.clientY - r.top - cy;
        const dist = Math.hypot(dx, dy);
        const R = Math.min(r.width, r.height) / 2 / 1.16;
        let idx = null;
        if (dist <= R * 1.06 && dist >= R * 0.42) {
          const data = this.series();
          const total = data.reduce((s, d) => s + d.value, 0) || 1;
          let a = Math.atan2(dy, dx) + Math.PI / 2;
          if (a < 0) a += Math.PI * 2;
          let acc = 0;
          for (let i = 0; i < data.length; i++) {
            const span = (data[i].value / total) * Math.PI * 2;
            if (a >= acc && a < acc + span) { idx = i; break; }
            acc += span;
          }
        }
        this.setHover(idx);
      });
      this.addEventListener('pointerleave', () => this.setHover(null));
      this.draw();
    }
    disconnectedCallback() { this.ro && this.ro.disconnect(); }
    attributeChangedCallback() { if (this._built) this.draw(); }
    setHover(idx) {
      if (idx === this._hover) return;
      this._hover = idx;
      const d = idx == null ? null : this.series()[idx];
      this.dispatchEvent(new CustomEvent('slicehover', { detail: { index: idx, item: d || null } }));
      this.draw();
    }
    series() {
      const raw = this.getAttribute('data');
      if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p) && p.length) return p; } catch (e) {} }
      return DEFAULT;
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

      const data = this.series();
      const total = data.reduce((s, d) => s + d.value, 0) || 1;
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) / 2 / 1.16;
      const innerRatio = parseFloat(this.getAttribute('inner'));
      const inner = R * (isNaN(innerRatio) ? 0.56 : innerRatio);

      const gap = 0.02;
      let a0 = -Math.PI / 2;
      data.forEach((d, i) => {
        const span = (d.value / total) * Math.PI * 2;
        const on = i === this._hover;
        const r = on ? R * 1.05 : R;
        const ri = on ? inner * 0.98 : inner;
        ctx.beginPath();
        ctx.arc(cx, cy, r, a0 + gap, a0 + span - gap);
        ctx.arc(cx, cy, ri, a0 + span - gap, a0 + gap, true);
        ctx.closePath();
        ctx.save();
        ctx.fillStyle = d.color;
        ctx.fill();
        ctx.restore();
        a0 += span;
      });

      // center readout
      if (this.hasAttribute('bare')) return;
      const sel = this._hover == null ? null : data[this._hover];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (sel) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 30px Manrope, sans-serif';
        ctx.fillText(Math.round((sel.value / total) * 100) + '%', cx, cy - 12);
        ctx.fillStyle = 'rgba(255,255,255,0.56)';
        ctx.font = '500 14px Manrope, sans-serif';
        ctx.fillText(sel.label, cx, cy + 16);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 30px Manrope, sans-serif';
        ctx.fillText('100%', cx, cy - 12);
        ctx.fillStyle = 'rgba(255,255,255,0.56)';
        ctx.font = '500 14px Manrope, sans-serif';
        ctx.fillText('supply', cx, cy + 16);
      }
    }
  }
  if (!customElements.get('pie-chart')) customElements.define('pie-chart', PieChart);
})();
