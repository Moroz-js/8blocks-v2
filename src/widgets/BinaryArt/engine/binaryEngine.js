// Binary Engine (binary-style-kit), ported from project 2/binary-engine.js.
// The drawing code is kept verbatim; only the page globals were replaced by exports.
const React = { createRef: () => ({ current: null }) }
class DCLogic {
  constructor() {
    this.props = {}
    this.state = {}
  }
  setState(s) {
    Object.assign(this.state, s)
  }
}

export class BinaryEngine extends DCLogic {
  canvasRef = React.createRef();
  // SITE ADAPTER: canvas size comes from props w/h, shown at 1/density of it (density 3 = 7px cells shown at ~2.3px); defaults = the kit's 1080x1350
  get W() { return Number(this.props.w) || 1080; }
  get H() { return Number(this.props.h) || 1350; }
  src = null; prepared = false; gridKey = ''; atlasKey = ''; sparkles = []; t0 = null;

  p() {
    const p = this.props;
    return { cell: 7, depth: p.depth ?? 0, contrast: p.contrast ?? 1.6, bgTol: Math.max(0.1, p.bgTol ?? 0.22), reveal: p.reveal ?? 4.5, charset: p.charset ?? '01', sparkle: p.sparkle ?? 1, flicker: p.flicker ?? 4 };
  }

  componentDidMount() {
    this.raf = requestAnimationFrame(this.frame);
    this.loadSrc();
    // SITE ADAPTER (scroll reveal): nothing is drawn until the illustration scrolls into view;
    // the reveal starts from zero when its block is 250px below the bottom of the screen (just before it scrolls in).
    // Checked every frame against the viewport, so it also works inside the editor's preview frame. Far off screen the drawing pauses.
    this.seen = false; this.onScreen = false;
  }
  checkView(c) {
    const PRE = 250, r = c.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    this.onScreen = r.top < vh + PRE && r.bottom > -PRE;
    if (this.onScreen && !this.seen) { this.seen = true; this.t0 = null; this.sparkles = []; }
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }
  componentDidUpdate(prev) {
    if (prev.src !== this.props.src) { this.loadSrc(); return; }
    const keys = ['depth', 'contrast', 'bgTol', 'charset', 'reveal', 'flicker', 'sparkle', 'accents', 'bodyDim', 'neutralDim', 'punch', 'detail', 'w', 'h', 'density', 'weight', 'tone'];
    if (keys.some(k => prev[k] !== this.props[k])) { this.prepared = false; this.gridKey = ''; }
  }
  loadSrc() { const u = this.props.src; if (!u) return; this.loadedSrc = u; fetch(u).then(r => r.blob()).then(b => { if (this.loadedSrc === u) this.loadBlob(b); }).catch(() => {}); }

  loadBlob(blob) {
    const img = new Image(); img.src = URL.createObjectURL(blob);
    img.onload = () => { this.src = img; this.prepared = false; this.t0 = null; };
  }

  // Build subject mask at analysis resolution: colour-key against border colour + local texture (blurred backgrounds have none)
  prepare() {
    const s = this.src, { bgTol } = this.p();
    const sc = Math.min(1, 520 / Math.max(s.naturalWidth, s.naturalHeight)), aw = Math.round(s.naturalWidth * sc), ah = Math.round(s.naturalHeight * sc);
    const A = document.createElement('canvas'); A.width = aw; A.height = ah;
    const ax = A.getContext('2d', { willReadFrequently: true }); ax.fillStyle = '#fff'; ax.fillRect(0, 0, aw, ah); ax.drawImage(s, 0, 0, aw, ah);
    const d = ax.getImageData(0, 0, aw, ah).data, n = aw * ah, lum = new Float32Array(n);
    for (let i = 0, j = 0; j < n; i += 4, j++) lum[j] = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
    // background references: 8 border patches (gradient / vignetted backgrounds have several shades)
    const refs = [], patch = (cx, cy) => { let r = 0, g = 0, b = 0, k = 0; const S = Math.round(Math.min(aw, ah) * 0.06); for (let y = Math.max(0, cy - S); y < Math.min(ah, cy + S); y++) for (let x = Math.max(0, cx - S); x < Math.min(aw, cx + S); x++) { const i = (y * aw + x) * 4; r += d[i]; g += d[i + 1]; b += d[i + 2]; k++; } const sum = r + g + b + 1; refs.push({ nr: r / sum, ng: g / sum, nb: b / sum, l: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 / k }); };
    [[0, 0], [aw / 2, 0], [aw, 0], [0, ah / 2], [aw, ah / 2], [0, ah], [aw / 2, ah], [aw, ah]].forEach(([x, y]) => patch(Math.round(x), Math.round(y)));
    // neutral (grey/white/black) background → chroma carries no information, key on luminance instead
    const bgSat = refs.reduce((m, f) => Math.max(m, Math.abs(f.nr - 1 / 3) + Math.abs(f.ng - 1 / 3) + Math.abs(f.nb - 1 / 3)), 0);
    const neutral = bgSat < 0.08, lumW = neutral ? 2.2 : 0.5;
    this.lightBg = refs.reduce((s, f) => s + f.l, 0) / refs.length > 0.6;
    const mask = new Float32Array(n), keyDist = new Float32Array(n), R = 3;
    for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) {
      const j = y * aw + x, i = j * 4, r = d[i], g = d[i + 1], b = d[i + 2], sum = r + g + b + 1, nr = r / sum, ng = g / sum, nb = b / sum;
      let dc = 9, dl = 9;
      for (const f of refs) { const c2 = (Math.abs(nr - f.nr) + Math.abs(ng - f.ng) + Math.abs(nb - f.nb)) * 2.2, l2 = Math.abs(lum[j] - f.l) * lumW; if (Math.max(c2, l2) < Math.max(dc, dl)) { dc = c2; dl = l2; } }
      keyDist[y * aw + x] = Math.max(dc, dl);
      let m = Math.min(1, Math.max(0, (Math.max(dc, dl) - bgTol * 0.8) / 0.12));
      if (m < 1 && bgTol > 0) {
        let mu = 0, k = 0; for (let yy = -R; yy <= R; yy += 1) for (let xx = -R; xx <= R; xx += 1) { const X = x + xx, Y = y + yy; if (X >= 0 && Y >= 0 && X < aw && Y < ah) { mu += lum[Y * aw + X]; k++; } }
        mu /= k; let va = 0; for (let yy = -R; yy <= R; yy += 1) for (let xx = -R; xx <= R; xx += 1) { const X = x + xx, Y = y + yy; if (X >= 0 && Y >= 0 && X < aw && Y < ah) { const e = lum[Y * aw + X] - mu; va += e * e; } }
        const sd = Math.sqrt(va / k), tex = Math.min(1, Math.max(0, (sd - 0.045) / 0.035)) * Math.min(1, dc / (bgTol * 0.6 + 0.01));
        m = Math.max(m, tex);
      }
      // hard-keep: anything far from the background colour is subject even without texture (thin cables, flat dark parts)
      if (Math.max(dc, dl) > bgTol * 1.6) m = 1;
      if (bgTol === 0) m = 1;
      if (x < aw * 0.025 || y < ah * 0.025 || x > aw * 0.975 || y > ah * 0.975) m = 0;
      mask[j] = m;
    }
    // despeckle: box-blur the mask with a summed-area table, then re-threshold
    if (bgTol > 0) {
      const sat = new Float64Array((aw + 1) * (ah + 1));
      for (let y = 1; y <= ah; y++) { let row = 0; for (let x = 1; x <= aw; x++) { row += mask[(y - 1) * aw + x - 1]; sat[y * (aw + 1) + x] = sat[(y - 1) * (aw + 1) + x] + row; } }
      const B = 3;
      for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) {
        const x0 = Math.max(0, x - B), y0 = Math.max(0, y - B), x1 = Math.min(aw, x + B + 1), y1 = Math.min(ah, y + B + 1);
        const s = sat[y1 * (aw + 1) + x1] - sat[y0 * (aw + 1) + x1] - sat[y1 * (aw + 1) + x0] + sat[y0 * (aw + 1) + x0];
        const avg = s / ((x1 - x0) * (y1 - y0));
        // thin lines survive despeckle: keep the pixel if it was a hard-keep itself
        mask[y * aw + x] = Math.max(keyDist[y * aw + x] > bgTol * 1.6 ? 1 : 0, Math.min(1, Math.max(0, (avg - 0.3) / 0.2)));
      }
      // fill holes: any pixel enclosed by subject on all four sides belongs to the subject
      // flood-fill background from the frame border; whatever is unreached and not subject is an enclosed hole
      const out = new Uint8Array(n), q = new Int32Array(n); let qh = 0, qt = 0;
      const push = (j) => { if (!out[j] && mask[j] <= 0.5) { out[j] = 1; q[qt++] = j; } };
      for (let x = 0; x < aw; x++) { push(x); push((ah - 1) * aw + x); } for (let y = 0; y < ah; y++) { push(y * aw); push(y * aw + aw - 1); }
      while (qh < qt) { const j = q[qh++], x = j % aw, y = (j / aw) | 0; if (x > 0) push(j - 1); if (x < aw - 1) push(j + 1); if (y > 0) push(j - aw); if (y < ah - 1) push(j + aw); }
      // only fill small enclosed holes (< 2% of frame); large enclosed voids (e.g. between compass legs) stay empty
      const seen = new Uint8Array(n), maxHole = n * 0.02, comp = new Int32Array(n);
      for (let s0 = 0; s0 < n; s0++) {
        if (out[s0] || seen[s0] || mask[s0] > 0.5) continue;
        let head = 0, len = 1; comp[0] = s0; seen[s0] = 1;
        while (head < len) {
          const j = comp[head++], x = j % aw, y = (j / aw) | 0;
          if (x > 0) { const q = j - 1; if (!seen[q] && !out[q] && mask[q] <= 0.5) { seen[q] = 1; comp[len++] = q; } }
          if (x < aw - 1) { const q = j + 1; if (!seen[q] && !out[q] && mask[q] <= 0.5) { seen[q] = 1; comp[len++] = q; } }
          if (y > 0) { const q = j - aw; if (!seen[q] && !out[q] && mask[q] <= 0.5) { seen[q] = 1; comp[len++] = q; } }
          if (y < ah - 1) { const q = j + aw; if (!seen[q] && !out[q] && mask[q] <= 0.5) { seen[q] = 1; comp[len++] = q; } }
        }
        let kd = 0, hl = 0; for (let k = 0; k < len; k++) { kd += keyDist[comp[k]]; hl += lum[comp[k]]; } kd /= len; hl /= len;
        const bgL = refs.reduce((s, f) => s + f.l, 0) / refs.length, offBg = Math.abs(hl - bgL) > 0.025; // a pale surface (white ring) vs a true see-through gap
        if (len < maxHole * 2 && (len < n * 0.002 || kd > bgTol * 0.35 || offBg)) for (let k = 0; k < len; k++) mask[comp[k]] = 1;
      }
    }
    // bbox of the subject
    let x0 = aw, y0 = ah, x1 = 0, y1 = 0; const colHits = new Uint16Array(aw), rowHits = new Uint16Array(ah);
    for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) if (mask[y * aw + x] > 0.6) { colHits[x]++; rowHits[y]++; }
    for (let x = 0; x < aw; x++) if (colHits[x] > ah * 0.01) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
    for (let y = 0; y < ah; y++) if (rowHits[y] > aw * 0.01) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = aw - 1; y1 = ah - 1; }
    const padX = (x1 - x0) * 0.08, padY = (y1 - y0) * 0.08;
    this.bbox = { x: Math.max(0, x0 - padX) / sc, y: Math.max(0, y0 - padY) / sc, w: Math.min(aw, x1 + padX) / sc - Math.max(0, x0 - padX) / sc, h: Math.min(ah, y1 + padY) / sc - Math.max(0, y0 - padY) / sc };
    const M = document.createElement('canvas'); M.width = aw; M.height = ah;
    const mx = M.getContext('2d'), md = mx.createImageData(aw, ah);
    for (let j = 0; j < n; j++) { const v = Math.round(mask[j] * 255); md.data[j * 4] = md.data[j * 4 + 1] = md.data[j * 4 + 2] = v; md.data[j * 4 + 3] = 255; }
    mx.putImageData(md, 0, 0); this.maskCanvas = M; this.maskScale = sc;
    { // SITE ADAPTER (equal visual weight): share of the padded bbox the silhouette fills, used by ensureGrid to size every object to the same area
      let cnt = 0; for (let j = 0; j < n; j++) if (mask[j] > 0.6) cnt++;
      this.subjFrac = cnt / Math.max(1, (this.bbox.w * sc) * (this.bbox.h * sc)); }
    this.prepared = true; this.gridKey = '';
  }

  ensureGrid() {
    const { cell, contrast, depth } = this.p(), cols = Math.ceil(this.W / cell), rows = Math.ceil(this.H / cell), key = cols + 'x' + rows + contrast + depth + JSON.stringify(this.props.accents || '') + (this.props.bodyDim ?? '') + (this.props.neutralDim ?? '') + (this.props.punch ?? '') + (this.props.detail ?? '') + '|' + (this.props.weight ?? '') + '|' + (this.props.tone ?? '');
    if (key === this.gridKey) return;
    this.gridKey = key; this.cols = cols; this.rows = rows;
    const n = cols * rows, SS = 3;
    this.chars = new Uint8Array(n); this.nextT = new Float32Array(n); this.lum = new Float32Array(n); this.appear = new Float32Array(n);
    for (let i = 0; i < n; i++) { this.chars[i] = Math.random() * 256 | 0; this.nextT[i] = Math.random() * 1500; }
    const b = this.bbox, bw = cols * SS, bh = rows * SS;
    let fit = Math.min(bw / b.w, bh / b.h) * 0.96;
    // SITE ADAPTER (equal visual weight): prop weight = share of the frame the silhouette should cover; objects that would cover more are scaled down to it
    const wantCover = this.props.weight != null ? Number(this.props.weight) : 0.2; // site default: 20% of the frame
    if (wantCover > 0 && this.subjFrac) { const have = this.subjFrac * b.w * b.h * fit * fit, want = wantCover * bw * bh; if (have > want) fit *= Math.sqrt(want / have); }
    const dw = b.w * fit, dh = b.h * fit, ox = (bw - dw) / 2, oy = (bh - dh) / 2;
    const C = document.createElement('canvas'); C.width = bw; C.height = bh; const cx = C.getContext('2d', { willReadFrequently: true });
    cx.fillStyle = this.lightBg ? '#fff' : '#000'; cx.fillRect(0, 0, bw, bh); cx.drawImage(this.src, b.x, b.y, b.w, b.h, ox, oy, dw, dh);
    const img = cx.getImageData(0, 0, bw, bh).data;
    const ms = this.maskScale; cx.fillStyle = '#000'; cx.fillRect(0, 0, bw, bh);
    cx.drawImage(this.maskCanvas, b.x * ms, b.y * ms, b.w * ms, b.h * ms, ox, oy, dw, dh);
    const mk = cx.getImageData(0, 0, bw, bh).data;
    const mask = new Float32Array(n);
    // tone = luminance, but saturated colours are pushed apart by hue so same-brightness colours (red/blue/yellow) stay distinguishable
    const satSum = [], satA = new Float32Array(n), rawL = new Float32Array(n);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      let R = 0, G = 0, B = 0, m = 0, lmin = 1, lmax = 0;
      for (let yy = 0; yy < SS; yy++) for (let xx = 0; xx < SS; xx++) { const i = ((r * SS + yy) * bw + c * SS + xx) * 4; R += img[i]; G += img[i + 1]; B += img[i + 2]; m += mk[i]; const pl = (0.2126 * img[i] + 0.7152 * img[i + 1] + 0.0722 * img[i + 2]) / 255; if (pl < lmin) lmin = pl; if (pl > lmax) lmax = pl; }
      R /= SS * SS * 255; G /= SS * SS * 255; B /= SS * SS * 255;
      const mx = Math.max(R, G, B), mn = Math.min(R, G, B), sat = mx > 0 ? (mx - mn) / mx : 0;
      let l = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      // thin features: on a light background a dark edge in the cell should win (becomes bright code), on dark background a highlight should
      const satT = this.lightBg ? 0.1 : 0.25; // on white backgrounds pale tints (specular on colour) still belong to their hue
      if (sat <= satT) l = this.lightBg ? l * 0.5 + lmin * 0.5 : l * 0.6 + lmax * 0.4;
      if (sat > satT) {
        let h = 0; const d = mx - mn || 1;
        if (mx === R) h = ((G - B) / d + 6) % 6; else if (mx === G) h = (B - R) / d + 2; else h = (R - G) / d + 4;
        h /= 6; // 0 red … 1/6 yellow … 1/3 green … 2/3 blue
        // hue → tone band: yellow ≈ 0.95, red ≈ 0.75, blue ≈ 0.45 — all lifted into the visible range
        const hueTone = 0.4 + 0.55 * (0.5 + 0.5 * Math.cos((h - 0.12) * 6.283));
        const w = Math.min(1, (sat - satT) / 0.25) * 0.85;
        // light bg: saturated colour must come out BRIGHT after the later (1 - v) flip → push it dark here, scaled by saturation so pale tints stay mid
        l = this.lightBg ? l * (1 - w) + (0.05 + 0.25 * (1 - hueTone)) * w : l * (1 - w) + (0.35 + 0.65 * hueTone) * w;
      }
      this.lum[r * cols + c] = l; mask[r * cols + c] = m / (SS * SS * 255);
      satA[r * cols + c] = sat; rawL[r * cols + c] = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      if (mask[r * cols + c] > 0.6) satSum.push(sat);
    }
    const colorful = satSum.length && satSum.reduce((a, b2) => a + b2, 0) / satSum.length > 0.18;
    const vals = []; for (let i = 0; i < n; i++) if (mask[i] > 0.6) vals.push(this.lum[i]);
    vals.sort((a, b2) => a - b2);
    const lo = vals.length ? vals[Math.floor(vals.length * 0.04)] : 0, hi = vals.length ? vals[Math.floor(vals.length * 0.995)] : 1, rng = Math.max(0.1, hi - lo);
    let minR = rows, maxR = 0;
    for (let i = 0; i < n; i++) {
      let v = Math.min(1, Math.max(0, (this.lum[i] - lo) / rng));
      if (this.lightBg && !colorful) v = 1 - v; // grey object on white: shadows become the bright code
      else if (this.lightBg) v = 0.22 + 0.78 * (1 - v); // white parts of a colourful object stay a visible grey, never a black hole; // light bg + colour: hue mapping below already inverted saturated colours, so a plain flip keeps red bright and white mid-grey
      v = v < 0.5 ? 0.5 * Math.pow(2 * v, contrast) : 1 - 0.5 * Math.pow(2 * (1 - v), contrast); // S-curve contrast
      if (depth > 0) v = Math.pow(v, 1 + depth * 1.4); // depth: darken mids, keep highlights — deeper, more contrasty
      // accent hierarchy: body stays in a soft grey band, only the brightest ~25% of tones climb to white
      v = v < 0.68 ? v * 0.52 : 0.354 + Math.pow((v - 0.68) / 0.32, 1.7) * 0.646; // highlights graded, only peaks reach white
      // every cell inside the silhouette is drawn: floor at 0.3 so shadows read as dim digits, never as holes
      this.lum[i] = mask[i] > 0.4 ? 0.3 + 0.7 * v : 0;
      if (this.lum[i] >= 0.3) { const r = (i / cols) | 0; minR = Math.min(minR, r); maxR = Math.max(maxR, r); }
    }
    if (this.lightBg && colorful) {
      // neutral (white/grey) parts: lift to an even mid-grey band so their brightest spots never read as holes
      for (let i = 0; i < n; i++) if (this.lum[i] >= 0.3 && satA[i] < 0.14) this.lum[i] = 0.4 + (this.lum[i] - 0.3) * 0.6;
      const wh = new Uint8Array(n); let subj = 0;
      for (let i = 0; i < n; i++) { if (this.lum[i] >= 0.3) subj++; if (this.lum[i] >= 0.3 && satA[i] < 0.14 && rawL[i] > 0.72) wh[i] = 1; }
      const seen = new Uint8Array(n), comp = new Int32Array(n), lim = subj * 0.015;
      for (let s0 = 0; s0 < n; s0++) {
        if (!wh[s0] || seen[s0]) continue;
        let hd = 0, ln = 1, satNb = 0, nb = 0; comp[0] = s0; seen[s0] = 1;
        while (hd < ln) { const j = comp[hd++], cx = j % cols, cy = (j / cols) | 0;
          for (const q of [cx > 0 ? j - 1 : -1, cx < cols - 1 ? j + 1 : -1, cy > 0 ? j - cols : -1, cy < rows - 1 ? j + cols : -1]) { if (q < 0) continue; if (wh[q]) { if (!seen[q]) { seen[q] = 1; comp[ln++] = q; } } else if (this.lum[q] >= 0.3) { nb++; if (satA[q] > 0.3) satNb++; } } }
        if (ln < lim && nb && satNb / nb > 0.6) for (let k = 0; k < ln; k++) this.lum[comp[k]] = 1;
      }
    }
    { // auto-exposure: the brightest ~4% of the subject should reach white, like the compass accents
      const sv = []; for (let i = 0; i < n; i++) if (this.lum[i] >= 0.3) sv.push(this.lum[i]);
      if (sv.length) { sv.sort((a, b2) => a - b2); const p = sv[Math.floor(sv.length * 0.96)];
        if (p < 0.97 && p > 0.5) { const k = (0.97 - 0.3) / (p - 0.3); for (let i = 0; i < n; i++) if (this.lum[i] >= 0.3) { const v = this.lum[i]; this.lum[i] = Math.min(1, 0.3 + (v - 0.3) * (v > 0.6 ? k : 1 + (k - 1) * (v - 0.3) / 0.3)); } } }
    }
    // rim light: silhouette cells lit from top-left get a highlight, bottom-right edge a slight shade → volume
    // soft rim: distance-to-edge falloff over ~4 cells, lit from top-left, shaded bottom-right
    const inside = (rr, cc) => rr >= 0 && cc >= 0 && rr < rows && cc < cols && this.lum[rr * cols + cc] >= 0.3;
    const RR = 4, rim = new Float32Array(n);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c; if (!inside(r, c)) continue;
      let dTL = RR + 1, dBR = RR + 1;
      for (let k = 1; k <= RR; k++) { if (dTL > RR && (!inside(r - k, c) || !inside(r, c - k) || !inside(r - k, c - k))) dTL = k; if (dBR > RR && (!inside(r + k, c) || !inside(r, c + k))) dBR = k; }
      const fl = (d) => d > RR ? 0 : Math.pow(1 - (d - 1) / RR, 2); // smooth falloff
      rim[i] = fl(dTL) * 0.75 - fl(dBR) * 0.3;
    }
    // blur the rim field once (3x3) to remove per-cell steps
    const rim2 = new Float32Array(n);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (!inside(r, c)) continue; let s = 0, k = 0; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (inside(r + dr, c + dc)) { s += rim[(r + dr) * cols + c + dc]; k++; } rim2[i] = s / k; }
    for (let i = 0; i < n; i++) if (this.lum[i] >= 0.3) this.lum[i] = Math.min(1, Math.max(0.3, this.lum[i] + rim2[i] * 0.4));
    // accent shading: flat bright regions get a graded, lit-from-top-left volume instead of uniform white
    {
      const acc = new Uint8Array(n); for (let i = 0; i < n; i++) acc[i] = this.lum[i] > 0.62 ? 1 : 0;
      const D = new Float32Array(n), BIG = 1e4; for (let i = 0; i < n; i++) D[i] = acc[i] ? BIG : 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (!D[i]) continue; let m = D[i]; if (c > 0) m = Math.min(m, D[i - 1] + 1); if (r > 0) m = Math.min(m, D[i - cols] + 1); if (r > 0 && c > 0) m = Math.min(m, D[i - cols - 1] + 1.414); if (r > 0 && c < cols - 1) m = Math.min(m, D[i - cols + 1] + 1.414); D[i] = m; }
      for (let r = rows - 1; r >= 0; r--) for (let c = cols - 1; c >= 0; c--) { const i = r * cols + c; if (!D[i]) continue; let m = D[i]; if (c < cols - 1) m = Math.min(m, D[i + 1] + 1); if (r < rows - 1) m = Math.min(m, D[i + cols] + 1); if (r < rows - 1 && c < cols - 1) m = Math.min(m, D[i + cols + 1] + 1.414); if (r < rows - 1 && c > 0) m = Math.min(m, D[i + cols - 1] + 1.414); D[i] = m; }
      // directional term: brighter toward top-left of each accent blob (sample neighbour distances)
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c; if (!acc[i]) continue;
        const d = D[i], edge = Math.exp(-(d - 1) / 3.5); // 1 at the rim, fades inward
        const up = r > 2 ? D[i - 3 * cols] : 0, lf = c > 2 ? D[i - 3] : 0, dn = r < rows - 3 ? D[i + 3 * cols] : 0, rt = c < cols - 3 ? D[i + 3] : 0;
        const dir = Math.max(-1, Math.min(1, ((dn + rt) - (up + lf)) / 8)); // >0 when lit side (top-left) is the near edge
        const shade = 0.62 + 0.26 * edge + 0.12 * dir;
        const keep = this.lum[i];
        this.lum[i] = Math.max(0.3, Math.min(1, 0.3 + (keep - 0.3) * Math.max(0.55, Math.min(1, shade))));
      }
    }
    // explicit accents (per illustration): listed shapes stay bright, everything else is pushed into grey
    const acc = this.props.accents;
    if (acc && acc.length) {
      const iw = this.src.naturalWidth, ih = this.src.naturalHeight, dim = this.props.bodyDim ?? 0.55, neutralDim = this.props.neutralDim ?? 0.75;
      this._pc = new Float32Array(n); this._pt = new Float32Array(n);
      const accLvl = new Float32Array(n), halo = new Uint8Array(n), onLine = new Uint8Array(n), photo = new Uint8Array(n), ov = new Float32Array(n).fill(-1), ovW = new Float32Array(n);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const sx = (b.x + ((c + 0.5) * SS - ox) / fit) / iw, sy = (b.y + ((r + 0.5) * SS - oy) / fit) / ih;
        for (const a of acc) {
          let inside = false, edge = false;
          let dn = 0;
          if (a.type === 'circle') { const d = Math.hypot((sx - a.x) * iw, (sy - a.y) * ih) / (a.r * iw); inside = d <= (a.radial ? 1.18 : 1); dn = d; }
          else if (a.type === 'poly') { const px = sx * iw, py = sy * ih, P = a.pts; let ins = false; for (let k = 0, m = P.length - 1; k < P.length; m = k++) { const [xi, yi] = P[k], [xj, yj] = P[m]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) ins = !ins; } inside = ins; }
          else if (a.type === 'line') {
            const ax = a.x1 * iw, ay = a.y1 * ih, bx = a.x2 * iw, by = a.y2 * ih, px = sx * iw, py = sy * ih, vx = bx - ax, vy = by - ay;
            const tt = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy))), dd = Math.hypot(px - ax - vx * tt, py - ay - vy * tt), w = (a.w1 + (a.w2 - a.w1) * tt) * iw / 2;
            inside = dd <= w; edge = !inside && dd <= w + 2.2 * SS / fit;
            if (a.flat != null) { const cv = (w - dd) * fit / SS; inside = cv >= 0.6; if (!inside && cv > -1.4) { const j = r * cols + c, s = (cv + 1.4) / 2, sm = s * s * (3 - 2 * s); if (sm > this._pc[j]) { this._pc[j] = sm; this._pt[j] = a.flat; } } }
          }
          if (inside) accLvl[r * cols + c] = Math.max(accLvl[r * cols + c], a.level ?? 1);
          if (inside && a.halo) onLine[r * cols + c] = 1;
          if (inside && a.photo) photo[r * cols + c] = 1;
          if (inside && a.flat != null) { const j = r * cols + c; ov[j] = a.flat + (((j * 2654435761) >>> 0) % 100) / 100 * 0.06 - 0.03; photo[j] = 0; }
          if (inside && a.radial) { const [ci, co] = a.radial, s = Math.pow(Math.min(1, dn), 1.1), j = r * cols + c; ov[j] = ci + (co - ci) * s; ovW[j] = dn <= 0.9 ? 1 : Math.max(0, 1 - (dn - 0.9) / 0.28); } // feathered rim, no stair-step edge
          else if (inside && a.flat != null) ovW[r * cols + c] = 1;
          if (edge && a.halo) halo[r * cols + c] = 1;
        }
      }
      // photo zones: adaptive local tone (CLAHE-like) from the real photo luminance → metal knurling, flight folds, specular glints read
      { const RW = 3;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (!photo[i] || this.lum[i] < 0.3) continue;
          let mn = 1, mx = 0, s = 0, k = 0;
          for (let dr = -RW; dr <= RW; dr++) for (let dc = -RW; dc <= RW; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue; const j = rr * cols + cc; if (!photo[j] || this.lum[j] < 0.3) continue; const v = rawL[j]; if (v < mn) mn = v; if (v > mx) mx = v; s += v; k++; }
          const rg = Math.max(0.06, mx - mn), loc = (rawL[i] - mn) / rg, glob = rawL[i];
          let tone = 0.7 * loc + 0.3 * Math.min(1, glob * 2.0);
          tone = Math.min(1, Math.max(0, tone)); tone = tone < 0.5 ? 0.5 * Math.pow(2 * tone, 1.8) : 1 - 0.5 * Math.pow(2 * (1 - tone), 1.8); // photographic S-curve
          this.lum[i] = 0.3 + 0.7 * (0.12 + 0.88 * tone); photo[i] = 2; } }
      // soften photo zones: two 3x3 blur passes on their tone, then a gentle wide rim (bright edge fading inward over ~3 cells)
      for (let pass = 0; pass < 2; pass++) { const tmp = this.lum.slice();
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (photo[i] !== 2) continue; let s = 0, k = 0;
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue; const j = rr * cols + cc; if (photo[j] !== 2) continue; const w = dr || dc ? 1 : 2; s += tmp[j] * w; k += w; }
          this.lum[i] = s / k; } }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (photo[i] !== 2) continue; let d = 4;
        for (let k = 1; k <= 3 && d === 4; k++) for (let dr = -k; dr <= k && d === 4; dr++) for (let dc = -k; dc <= k; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols || this.lum[rr * cols + cc] < 0.3) { d = k; break; } }
        if (d < 4) this.lum[i] = Math.min(0.94, this.lum[i] + 0.16 * Math.pow(1 - (d - 1) / 3, 1.5)); }
      // separate photo zones (dart flight) from what's behind: lift their tone, darken a 2-cell gap around them
      for (let i = 0; i < n; i++) if (photo[i] === 2) this.lum[i] = Math.min(1, 0.42 + (this.lum[i] - 0.3) * 1.05);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (photo[i] === 2 || this.lum[i] < 0.3) continue; let near = 0;
        for (let dr = -2; dr <= 2 && !near; dr++) for (let dc = -2; dc <= 2; dc++) { const rr = r + dr, cc = c + dc; if (rr >= 0 && cc >= 0 && rr < rows && cc < cols && photo[rr * cols + cc] === 2) { near = Math.max(Math.abs(dr), Math.abs(dc)); break; } }
        if (near) this.lum[i] = 0.3 + (this.lum[i] - 0.3) * (near === 1 ? 0.15 : 0.45); }
      for (let i = 0; i < n; i++) {
        if (this.lum[i] < 0.3) continue;
        if (ov[i] >= 0) { const tgt = 0.3 + 0.7 * Math.min(1, Math.max(0, ov[i])), w = ovW[i] || 1; if (w >= 1) { this.lum[i] = tgt; continue; } const ring = 0.3 + (this.lum[i] - 0.3) * (this.props.bodyDim ?? 0.55) * (satA[i] < 0.14 ? (this.props.neutralDim ?? 0.75) : 1); this.lum[i] = ring + (tgt - ring) * w * w; continue; }
        if (photo[i] === 2) continue;
        if (accLvl[i] > 0) this.lum[i] = Math.min(1, 0.3 + (this.lum[i] - 0.3) * accLvl[i]); // accents keep the photo's own tones (no flattening), level scales them
        else {
          let k = dim; if (satA[i] < 0.14) k *= neutralDim;
          this.lum[i] = 0.3 + (this.lum[i] - 0.3) * k;
          if (halo[i]) this.lum[i] = 0.3;
        }
      }
      // ring gradient: saturated bands around a centre get lighter toward their outer edge, darker toward the inner edge
      for (const a of acc) {
        if (a.type !== 'rings') continue;
        const ccx = ((a.x * iw - b.x) * fit + ox) / SS - 0.5, ccy = ((a.y * ih - b.y) * fit + oy) / SS - 0.5;
        const isBand = (rr, cc) => { rr = Math.round(rr); cc = Math.round(cc); if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) return false; const j = rr * cols + cc; return satA[j] > 0.3 && this.lum[j] >= 0.3 && accLvl[j] === 0 && ov[j] < 0 && photo[j] !== 2; };
        const upd = new Float32Array(n).fill(-1);
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          if (!isBand(r, c)) continue;
          const dx = c - ccx, dy = r - ccy, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
          let dIn = 0, dOut = 0; while (dIn < 80 && isBand(r - uy * (dIn + 1), c - ux * (dIn + 1))) dIn++; while (dOut < 80 && isBand(r + uy * (dOut + 1), c + ux * (dOut + 1))) dOut++;
          const tt = (dIn + 0.5) / (dIn + dOut + 1);
          upd[r * cols + c] = (a.lo ?? 0.45) + ((a.hi ?? 1.15) - (a.lo ?? 0.45)) * Math.pow(tt, 1.6);
        }
        // the per-cell ray march jitters by a cell → radial spokes; smooth the gain field inside the bands
        for (let pass = 0; pass < 3; pass++) { const tmp = upd.slice();
          for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (tmp[i] < 0) continue; let s = 0, k = 0;
            for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue; const v = tmp[rr * cols + cc]; if (v >= 0) { s += v; k++; } }
            upd[i] = s / k; } }
        for (let i = 0; i < n; i++) if (upd[i] >= 0) this.lum[i] = Math.min(1, 0.3 + (this.lum[i] - 0.3) * upd[i]);
      }
      this._keep = new Uint8Array(n); for (let i = 0; i < n; i++) if (accLvl[i] > 0 || ov[i] >= 0 || photo[i] === 2 || halo[i]) this._keep[i] = 1;
      // outline around haloed lines (dart): dark gap so the tip reads even over a bright accent
      for (let i = 0; i < n; i++) if (halo[i] && !onLine[i] && this.lum[i] >= 0.3) this.lum[i] = accLvl[i] > 0 ? 0.36 : 0.3;
    }
    // board gradient: replace the whole body (except kept accents) with one smooth light-edge → dark-centre gradient
    const bg2 = this.props.boardGradient;
    if (bg2) {
      const keep = this._keep || new Uint8Array(n), D = new Float32Array(n), BIG = 1e4;
      for (let i = 0; i < n; i++) D[i] = this.lum[i] >= 0.3 ? BIG : 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (!D[i]) continue; let m = D[i]; if (c > 0) m = Math.min(m, D[i - 1] + 1); if (r > 0) m = Math.min(m, D[i - cols] + 1); if (r > 0 && c > 0) m = Math.min(m, D[i - cols - 1] + 1.414); if (r > 0 && c < cols - 1) m = Math.min(m, D[i - cols + 1] + 1.414); if (c === 0 || r === 0) m = Math.min(m, 1); D[i] = m; }
      for (let r = rows - 1; r >= 0; r--) for (let c = cols - 1; c >= 0; c--) { const i = r * cols + c; if (!D[i]) continue; let m = D[i]; if (c < cols - 1) m = Math.min(m, D[i + 1] + 1); if (r < rows - 1) m = Math.min(m, D[i + cols] + 1); if (r < rows - 1 && c < cols - 1) m = Math.min(m, D[i + cols + 1] + 1.414); if (r < rows - 1 && c > 0) m = Math.min(m, D[i + cols - 1] + 1.414); D[i] = m; }
      // exact euclidean distance to the silhouette boundary (chamfer gives octagons)
      { const bnd = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (this.lum[i] < 0.3) continue; if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1 || this.lum[i - 1] < 0.3 || this.lum[i + 1] < 0.3 || this.lum[i - cols] < 0.3 || this.lum[i + cols] < 0.3) bnd.push(c, r); }
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (this.lum[i] < 0.3) continue; let m = 1e9; for (let k = 0; k < bnd.length; k += 2) { const dx = bnd[k] - c, dy = bnd[k + 1] - r, d = dx * dx + dy * dy; if (d < m) m = d; } D[i] = Math.sqrt(m) + 1; } }
      // distance field ignores the dart (dart cells count as board), so the gradient flows under it
      let maxD = 0; for (let i = 0; i < n; i++) if (D[i] < BIG && D[i] > maxD) maxD = D[i];
      // bands: [{from, to, outer, inner, pow}] in normalised edge-distance (0 = rim, 1 = centre); legacy [inner, outer] = one band
      const bands = Array.isArray(bg2[0]) || typeof bg2[0] === 'object' ? bg2 : [{ from: 0, to: 1, outer: bg2[1], inner: bg2[0], pow: 0.75 }];
      const toneAt = (tt) => { for (const bd of bands) if (tt >= bd.from && tt <= bd.to) { const u = (tt - bd.from) / Math.max(1e-6, bd.to - bd.from); return bd.inner + (bd.outer - bd.inner) * Math.pow(1 - u, bd.pow ?? 2.5); } return bands[bands.length - 1].inner; };
      // boardCircle: force a perfect circle (front view) — radial distance replaces edge distance, silhouette re-cut to the circle
      const bc = this.props.boardCircle; let rad = null;
      if (bc) { const iw = this.src.naturalWidth, ih = this.src.naturalHeight; rad = new Float32Array(n);
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c;
          const sx = b.x + ((c + 0.5) * SS - ox) / fit, sy = b.y + ((r + 0.5) * SS - oy) / fit, d = Math.hypot(sx - bc.x * iw, sy - bc.y * ih) / (bc.r * iw);
          rad[i] = d; if (keep[i]) continue; const ext = 1 + 1.6 / (bc.r * iw * fit / SS); this.lum[i] = d <= ext ? Math.max(this.lum[i], 0.31) : 0; }
        this._radCells = bc.r * iw * fit / SS; this._rad = rad; this._ccx = ((bc.x * iw - b.x) * fit + ox) / SS - 0.5; this._ccy = ((bc.y * ih - b.y) * fit + oy) / SS - 0.5;
        if (!this._vn) { const P = new Float32Array(4096); for (let k = 0; k < 4096; k++) P[k] = Math.random(); const at = (x, y) => P[(((x * 73856093) ^ (y * 19349663)) >>> 0) % 4096]; this._vn = (x, y) => { const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy); const a0 = at(x0, y0), a1 = at(x0 + 1, y0), b0 = at(x0, y0 + 1), b1 = at(x0 + 1, y0 + 1); return (a0 + (a1 - a0) * sx) * (1 - sy) + (b0 + (b1 - b0) * sx) * sy; }; } }
      for (let i = 0; i < n; i++) { if (this.lum[i] < 0.3 || keep[i]) continue;
        const tt = rad ? Math.min(1, Math.max(0, 1 - rad[i])) : Math.min(1, D[i] / (maxD || 1));
        // anti-alias inner ring boundaries: blend across ±1.6 cells instead of a hard step
        let tone = toneAt(tt); const sw = rad ? 1.6 / (this._radCells || 100) : 0.02;
        for (let q = 0; q < bands.length - 1; q++) { const bd = bands[q].to; if (Math.abs(tt - bd) < sw) { const u = (tt - bd + sw) / (2 * sw), s = u * u * (3 - 2 * u); tone = toneAt(bd - sw) * (1 - s) + toneAt(bd + sw) * s; } }
        // surface: lit volume, raised ring lips + grooves, felt texture, brushed sheen, soft specular — so the board reads as a real object
        let jit = 0;
        if (rad && this._radCells) { const R = this._radCells, cr = i / cols | 0, cc0 = i % cols, dx = (cc0 - this._ccx) / R, dy = (cr - this._ccy) / R, dist = Math.hypot(dx, dy) || 1e-6, ux = dx / dist, uy = dy / dist;
          const Lx = -0.55, Ly = -0.83, facing = ux * Lx + uy * Ly; // +1 where the surface tilts toward the light (top-left)
          const vn = this._vn, tex = (vn(cc0 / 2.2, cr / 2.2) * 0.5 + vn(cc0 / 6, cr / 6) * 0.32 + vn(cc0 / 16, cr / 16) * 0.18) - 0.5;
          const ang = Math.atan2(dy, dx), brush = vn(ang * 22, dist * 14) - 0.5;
          let lip = 0, groove = 0;
          for (const bd of bands) { const e = tt - bd.from; if (bd.from > 0 && e >= 0 && e < 0.05) lip = Math.max(lip, 1 - e / 0.05); const g2 = Math.abs(tt - bd.to); if (bd.to < 1 && g2 < 0.018) groove = Math.max(groove, 1 - g2 / 0.018); }
          const dome = facing * Math.pow(dist, 1.2) * 0.24, lipL = lip * lip * (0.14 + 0.3 * Math.max(0, facing)), spec = Math.exp(-((dx + 0.36) ** 2 + (dy + 0.4) ** 2) / 0.06) * 0.3;
          const mott = (vn(cc0 / 11 + 40, cr / 11 + 17) - 0.5) * 0.5, sheen = Math.pow(Math.max(0, Math.sin((dx * 0.8 - dy * 1.1) * 7 + vn(cc0 / 9, cr / 9) * 3)), 6) * 0.12 * (0.5 + 0.5 * facing);
          // chiaroscuro: strong key light from top-left, smooth terminator, deep core shadow bottom-right, faint bounce at the far rim
          const key = Math.max(0, Math.min(1, 0.5 + facing * 0.75 * Math.pow(dist, 0.8))), shadowK = 0.42 + 0.82 * key * key * (3 - 2 * key), bounce = Math.max(0, -facing) * (Math.pow(Math.max(0, dist - 0.8) / 0.2, 2) * 0.2 + lip * 0.14);
          // cast shadow of dart + flight onto the board (offset down-right, soft)
          let cast = 0; const keepA = this._keep; if (keepA) { const so = this._radCells * 0.07; for (let k = 0; k < 5; k++) { const f = 0.6 + k * 0.2, sr = Math.round(cr - so * f * 0.9), sc = Math.round(cc0 - so * f * 0.6); if (sr >= 0 && sc >= 0 && sr < rows && sc < cols && keepA[sr * cols + sc]) cast = Math.max(cast, 1 - k * 0.15); } }
          tone = Math.max(0, (tone * (1 - groove * 0.7) * (1 + mott) + dome * (0.5 + tone) + lipL + spec * (0.4 + tone) * key + sheen * key) * shadowK * (1 - cast * 0.75) + bounce);
          jit = tex * 0.22 * (0.35 + tone) + brush * 0.035 * (0.25 + tone); }
        else jit = ((((i * 2654435761) >>> 0) % 1000) / 1000 - 0.5) * 0.015;
        this.lum[i] = 0.3 + 0.7 * Math.min(1, Math.max(0, tone + jit)); }
    }
    // anti-aliased shaft: partially covered cells blend toward the shaft tone
    if (this._pc) { for (let i = 0; i < n; i++) { const pc = this._pc[i]; if (pc > 0 && this.lum[i] >= 0.3 && !(this._keep && this._keep[i])) { const tg = 0.3 + 0.7 * this._pt[i]; this.lum[i] += (tg - this.lum[i]) * pc; } } this._pc = null; }
    // detail: photographic micro-contrast — high-pass of the real photo luminance (shadows stay dark, scratches/rims/glints read)
    const detail = this.props.detail ?? 0;
    if (detail > 0) {
      const blur = (src, R) => { const out = new Float32Array(n); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (this.lum[i] < 0.3) continue; let s = 0, k = 0; for (let dr = -R; dr <= R; dr++) for (let dc = -R; dc <= R; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue; const j = rr * cols + cc; if (this.lum[j] < 0.3) continue; s += src[j]; k++; } out[i] = s / k; } return out; };
      // median first: thin straight scratches/seams (1–2 cells wide) are removed before high-pass, texture & shading kept
      const med = new Float32Array(n), win = new Float32Array(25);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (this.lum[i] < 0.3) { med[i] = rawL[i]; continue; } let k = 0;
        for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue; const j = rr * cols + cc; if (this.lum[j] < 0.3) continue; win[k++] = rawL[j]; }
        const w = win.subarray(0, k); w.sort(); med[i] = w[k >> 1]; }
      const b1 = blur(med, 1), b4 = blur(med, 4);
      for (let i = 0; i < n; i++) { if (this.lum[i] < 0.3) continue;
        // soft-clip: keep fine texture & soft shadows, ignore hard colour boundaries between rings
        const clip = (v, m) => m * Math.tanh(v / m);
        const fine = clip(b1[i] - b4[i], 0.035), micro = clip(med[i] - b1[i], 0.03);
        this.lum[i] = Math.min(1, Math.max(0.3, this.lum[i] + detail * (fine * 2.2 + micro * 1.6))); }
    }
    // punch: final per-illustration contrast/depth — S-curve on the visible range, deeper darks, brighter peaks
    const punch = this.props.punch ?? 0;
    if (punch > 0) for (let i = 0; i < n; i++) { const L0 = this.lum[i]; if (L0 < 0.3) continue;
      let u = (L0 - 0.3) / 0.7; const g = 1 + punch * 1.6;
      u = u < 0.5 ? 0.5 * Math.pow(2 * u, g) : 1 - 0.5 * Math.pow(2 * (1 - u), g);
      this.lum[i] = 0.3 + 0.7 * Math.min(1, Math.max(0, u)); }
    // soft silhouette: cells near the outer edge fade in opacity (distance-based feather) instead of a hard stair-step cut
    { const fw = this.props.edgeFeather ?? 2.5, R = Math.ceil(fw) + 1; this.alpha = new Float32Array(n).fill(1);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; if (this.lum[i] < 0.3) continue; let m = 1e9;
        for (let dr = -R; dr <= R; dr++) for (let dc = -R; dc <= R; dc++) { const rr = r + dr, cc = c + dc; if (rr >= 0 && cc >= 0 && rr < rows && cc < cols && this.lum[rr * cols + cc] >= 0.3) continue; const d = dr * dr + dc * dc; if (d < m) m = d; }
        if (m < 1e9 && !(this._keep && this._keep[i])) { const d = Math.sqrt(m) - 0.5, u = Math.min(1, Math.max(0, d / fw)); this.alpha[i] = 0.18 + 0.82 * u * u * (3 - 2 * u); } } }
    // exact anti-aliasing for circular boards: opacity from sub-cell coverage of the true circle
    if (this._rad) { const rc = this._radCells; for (let i = 0; i < n; i++) { if (this.lum[i] < 0.3 || (this._keep && this._keep[i])) continue; const ed = (1 - this._rad[i]) * rc; const cov = Math.min(1, Math.max(0, (ed + 1.6) / 3.2)); this.alpha[i] = Math.min(this.alpha[i] === 1 ? 1 : 1, cov * cov * (3 - 2 * cov)); } this._rad = null; }
    { // SITE ADAPTER (equal visual weight): prop tone = target average brightness of the object (0..1 above the dim floor);
      // the whole object is lifted or lowered together (factor kept within 0.75-1.35), so its own highlights and accents stay in place
      const tone = this.props.tone != null ? Number(this.props.tone) : 0.34; // site default average brightness
      if (tone > 0) { let s = 0, k = 0; for (let i = 0; i < n; i++) if (this.lum[i] >= 0.3) { s += (this.lum[i] - 0.3) / 0.7; k++; }
        if (k) { const f = Math.max(0.75, Math.min(1.35, tone / Math.max(0.01, s / k))); for (let i = 0; i < n; i++) if (this.lum[i] >= 0.3) this.lum[i] = Math.min(1, 0.3 + (this.lum[i] - 0.3) * f); this.toneFactor = f; this.toneBefore = s / k; } }
    }
    this.minR = minR; this.maxR = maxR;
    // per-cell reveal offset: height (bottom first) + per-column wobble + small noise → organic growth, not a flat wipe
    const colPh = new Float32Array(cols); for (let c = 0; c < cols; c++) colPh[c] = Math.sin(c * 0.35) * 0.04 + Math.sin(c * 0.11 + 1.7) * 0.05;
    for (let i = 0; i < n; i++) { const r = (i / cols) | 0, c = i % cols, yb = (maxR - r) / Math.max(1, maxR - minR); this.appear[i] = 0.62 * yb + colPh[c] * 0.6 + 0.08 * Math.random(); }
    // ambient particles: a few drifting digits outside the subject, rising slowly
    this.particles = [];
    const pn = Math.round((this.W * this.H) / 2500);
    for (let k = 0; k < pn; k++) this.particles.push({ x: Math.random() * this.W, y: Math.random() * this.H, vy: 2 + Math.random() * 6, ph: Math.random() * 6.28, sp: 0.3 + Math.random() * 0.7, ch: Math.random() * 256 | 0, a: 0.18 + Math.random() * 0.32 });
    this.sparkles = []; this.t0 = null;
  }

  ensureAtlas() {
    const { cell, charset } = this.p(), key = cell + charset;
    if (key === this.atlasKey) return;
    this.atlasKey = key; this.set = charset;
    const L = 64, a = document.createElement('canvas'); a.width = cell * this.set.length; a.height = cell * L;
    const x = a.getContext('2d'); x.font = `600 ${Math.round(cell * 1.25)}px 'IBM Plex Mono', monospace`; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let l = 0; l < L; l++) { const v = (l + 1) / L, k = Math.pow(v, 1.6), al = (55 + 200 * k) / 255; x.fillStyle = `rgba(255,255,255,${al.toFixed(3)})`; x.globalAlpha = 1; for (let ci = 0; ci < this.set.length; ci++) x.fillText(this.set[ci], ci * cell + cell / 2, l * cell + cell / 2 + cell * 0.06); }
    x.globalAlpha = 1; this.atlas = a;
    // big sparkle glyphs
    const S = Math.round(cell * 2.2), sa = document.createElement('canvas'); sa.width = S * this.set.length; sa.height = S;
    const sx = sa.getContext('2d'); sx.font = `600 ${Math.round(S * 0.95)}px 'IBM Plex Mono', monospace`; sx.textAlign = 'center'; sx.textBaseline = 'middle'; sx.fillStyle = '#fff'; sx.shadowColor = 'rgba(255,255,255,.8)'; sx.shadowBlur = cell * 0.6;
    for (let ci = 0; ci < this.set.length; ci++) sx.fillText(this.set[ci], ci * S + S / 2, S / 2 + S * 0.04);
    this.sparkAtlas = sa; this.sparkSize = S;
  }

  frame = (t) => {
    this.raf = requestAnimationFrame(this.frame);
    const c = this.canvasRef.current; if (!c) return;
    this.checkView(c);
    if (this.seen && !this.onScreen) return; // SITE ADAPTER: already revealed, now off screen: keep the last frame, skip work
    const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); // SITE ADAPTER: transparent, the card is the background
    if (!this.seen) return; // SITE ADAPTER: not scrolled into view yet
    if (!this.src) return;
    if (!this.prepared) this.prepare();
    this.ensureGrid(); this.ensureAtlas();
    if (this.t0 === null) this.t0 = t;
    const { cell, reveal, sparkle, flicker } = this.p(), prog = Math.min(1.25, (t - this.t0) / 1000 / reveal);
    const cols = this.cols, rows = this.rows, setLen = this.set.length, chars = this.chars, nextT = this.nextT, lum = this.lum, appear = this.appear, atlas = this.atlas;
    const period = flicker > 0 ? 2600 / flicker : Infinity;
    // ambient particles: slow-rising digits, breathing in and out; they fade in with the reveal
    const pa = Math.min(1, prog / 0.6), ts = t / 1000;
    for (const p of this.particles) {
      p.y -= p.vy / 60; if (p.y < -cell) { p.y = this.H + cell; p.x = Math.random() * this.W; p.ch = Math.random() * 256 | 0; }
      const br = 0.5 + 0.5 * Math.sin(ts * p.sp + p.ph);
      const pj = ((p.y / cell) | 0) * cols + ((p.x / cell) | 0); if (pj >= 0 && pj < cols * rows && lum[pj] >= 0.3) continue; // not over the subject
      if (Math.random() < 0.004) p.ch = Math.random() * 256 | 0;
      g.globalAlpha = p.a * (0.35 + 0.65 * br) * pa;
      g.drawImage(atlas, (p.ch % setLen) * cell, 30 * cell, cell, cell, p.x, p.y, cell, cell);
    }
    g.globalAlpha = 1;
    // glints: a few small soft highlight spots that swell and fade on lit areas
    if (!this.boost || this.boost.length !== cols * rows) { this.boost = new Float32Array(cols * rows); this.glints = []; this.touched = []; }
    const boost = this.boost; for (const j of this.touched) boost[j] = 0; this.touched.length = 0;
    if (prog > 1 && this.glints.length < 3 && Math.random() < 0.025) {
      for (let tries = 0; tries < 30; tries++) { const j = Math.random() * cols * rows | 0; if (lum[j] > 0.5) { this.glints.push({ r: (j / cols) | 0, c: j % cols, t0: t, dur: 1600 + Math.random() * 1400, rad: 2 + Math.random() * 2.5 }); break; } }
    }
    this.glints = this.glints.filter(gl => t - gl.t0 < gl.dur);
    for (const gl of this.glints) {
      const u = (t - gl.t0) / gl.dur, env = Math.pow(Math.sin(u * Math.PI), 2), R = Math.ceil(gl.rad * 1.6);
      for (let dr = -R; dr <= R; dr++) for (let dc = -R; dc <= R; dc++) {
        const rr = gl.r + dr, cc = gl.c + dc; if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
        const j = rr * cols + cc; if (lum[j] < 0.3) continue;
        const f = Math.exp(-(dr * dr + dc * dc) / (gl.rad * gl.rad)) * env; if (f < 0.02) continue;
        if (!boost[j]) this.touched.push(j); boost[j] = Math.max(boost[j], f);
      }
    }
    // reveal: each cell fades up over a long window from dim to its true tone; digits settle from fast to slow cycling
    for (let i = 0, n = cols * rows; i < n; i++) {
      const l = lum[i]; if (l < 0.3) continue; // < 0.3 means outside the subject mask — never drawn
      const d = prog - appear[i]; if (d <= 0) continue;
      const s = Math.min(1, d / 0.38), e = 1 - Math.pow(1 - s, 2.2); // ease-out
      if (t > nextT[i]) { chars[i] = Math.random() * 256 | 0; nextT[i] = t + period * (0.3 + Math.random() * 1.6) * (0.35 + 0.65 * e); }
      let v = 0.3 + (l - 0.3) * e;
      if (boost[i]) v = v + (1 - v) * boost[i] * 0.85;
      const lvl = Math.min(63, Math.max(0, Math.round((v - 0.3) / 0.7 * 63)));
      g.globalAlpha = Math.min(1, s * 2.5) * (this.alpha ? this.alpha[i] : 1);
      g.drawImage(atlas, (chars[i] % setLen) * cell, lvl * cell, cell, cell, (i % cols) * cell, ((i / cols) | 0) * cell, cell, cell);
    }
    g.globalAlpha = 1;
    // sparkles: bright oversized digits that briefly pop on lit cells
    if (sparkle > 0 && prog > 0.15) {
      const want = sparkle * 0.9 * Math.min(1, prog);
      for (let k = 0; k < 6 && Math.random() < want; k++) {
        const i = Math.random() * cols * rows | 0; const l = lum[i];
        if (l > 0.5 && Math.random() < l && appear[i] < prog - 0.4) this.sparkles.push({ i, t0: t, dur: 700 + Math.random() * 1200, ch: Math.random() * setLen | 0 });
      }
    }
    // sparkle = same-size glyph flashing to pure white
    this.sparkles = this.sparkles.filter(s => t - s.t0 < s.dur);
    for (const s of this.sparkles) {
      const u = (t - s.t0) / s.dur, al = Math.sin(u * Math.PI);
      g.globalAlpha = al;
      g.drawImage(atlas, (chars[s.i] % setLen) * cell, 63 * cell, cell, cell, (s.i % cols) * cell, ((s.i / cols) | 0) * cell, cell, cell);
    }
    g.globalAlpha = 1;
  };

  restart = () => { this.t0 = null; this.sparkles = []; };

  renderVals() {
    return {
      canvasRef: this.canvasRef, cw: this.W, ch: this.H, cssW: (this.W / (Number(this.props.density) || 2)) + 'px', cssH: (this.H / (Number(this.props.density) || 2)) + 'px'
    };
  }
}
