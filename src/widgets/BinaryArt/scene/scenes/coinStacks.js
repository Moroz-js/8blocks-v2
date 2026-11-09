// Ported from the designer's project/Binary Coin Stacks.dc.html. Scene geometry and lighting are
// built once from the reference image; the returned frame draws one 1280 × 800 frame.
/* eslint-disable */
export function buildScene(img, makeCanvas) {
  let ctx;

    const W = 1280, H = 800;

    const hash = (a, b, c) => { let h = (a * 374761393 + b * 668265263 + c * 2246822519) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const speed = 0.7, waveSpeed = 2.2, flickerSpeed = 0.25;
    const cellW = 5, cellH = cellW * 1.25;
    const color = '#CA005A';
    const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
    const cols = Math.ceil(W / cellW), rows = Math.ceil(H / cellH);
    const depth = new Float32Array(cols * rows); depth.fill(Infinity);
    const objId = new Uint8Array(cols * rows);                        // 1 = coin, 2 = hand
    const coinRR = new Float32Array(cols * rows);                     // coin hit: local radius / R
    const coinSide = new Uint8Array(cols * rows);                     // coin hit: 1 = reeded side, 0 = face
    const scale = 1.0;
    const SRC = [0, 0.34 * 1162, 830, 0.66 * 1162];                    // crop: drop the empty upper dark, keep the three stacks
    const IW = Math.round(SRC[2] * H / SRC[3]), IH = H, OX = W - IW + 20, OY = 0;   // right half, full height      // photo box (right half), x' = OX + x, y' = OY + y
    const S = H / 600;
    const rotM = (thY, tilt, phi) => {
      const cy1 = Math.cos(-thY), sy1 = Math.sin(-thY), cx1 = Math.cos(-tilt), sx1 = Math.sin(-tilt), cz1 = Math.cos(-phi), sz1 = Math.sin(-phi);
      return (x, y, z) => {
        let X = cy1 * x + sy1 * z, Y = y, Z = -sy1 * x + cy1 * z;
        let Y2 = cx1 * Y - sx1 * Z, Z2 = sx1 * Y + cx1 * Z;
        return [cz1 * X - sz1 * Y2, sz1 * X + cz1 * Y2, Z2];
      };
    };
    // coin sits exactly where the reference's coin is (image 1254² → 600²)
    const coin = { R: 1, half: 1, cx: -99999, cy: -99999, cz: 0, M: rotM(0, 0, 0) };
    coin.d = coin.M(0, 0, 1); coin.bound = coin.R * 1.04 + coin.half;
    // coin solid: flat face, thin raised lip at the rim, soft bevel to a finely reeded edge
    const inside = (c, px, py, pz) => {
      const R = c.R, rr = Math.hypot(px, py);
      const ang = Math.atan2(py, px);
      const reed = 1 + 0.012 * Math.cos(ang * 90);
      if (rr > R * reed) return false;
      let relief = 0.9;
      const lip = R * 0.07, bev = R * 0.035;
      if (rr > R - bev) relief = 1 - 0.22 * Math.pow((rr - (R - bev)) / bev, 2);
      else if (rr > R - lip) relief = 1;
      else if (rr > R - lip - bev) relief = 0.9 + 0.1 * (rr - (R - lip - bev)) / bev;
      if (rr > R * 0.78 && rr < R * 0.84) relief = Math.max(relief, 0.96);          // inner laurel ring
      return Math.abs(pz) <= c.half * relief;
    };
    // hand: relief lifted from the reference photo — every contour and crease follows the image.
    // Skin pixels become a height field (lit flesh nearer, shadow farther); the coin stays a true 3D solid.
    const pLum = new Float32Array(cols * rows);
    const skyLum = new Float32Array(cols * rows);
    const buildHand = (img) => {
      const oc = makeCanvas(); oc.width = W; oc.height = H;
      const o = oc.getContext('2d'); o.drawImage(img, SRC[0], SRC[1], SRC[2], SRC[3], OX, OY, IW, IH);
      // erase the $ engraving: repaint the top coin's inner face as smooth polished metal
      { const kx = IW / SRC[2], ky = IH / SRC[3];
        const fx = OX + (415 - SRC[0]) * kx, fy = OY + (548 - SRC[1]) * ky, fr = 74 * kx;
        const gr = o.createLinearGradient(fx - fr * 0.6, fy - fr, fx + fr * 0.6, fy + fr);
        gr.addColorStop(0, 'rgb(255,246,234)'); gr.addColorStop(0.55, 'rgb(250,234,206)'); gr.addColorStop(1, 'rgb(242,216,170)');
        o.save(); o.beginPath(); o.ellipse(fx, fy, fr, fr * (ky / kx), 0, 0, Math.PI * 2); o.fillStyle = gr; o.fill();
        const ar = ky / kx, ring = (rad, w, col) => { o.beginPath(); o.ellipse(fx, fy, rad, rad * ar, 0, 0, Math.PI * 2); o.lineWidth = w; o.strokeStyle = col; o.stroke(); };
        // sizes are chosen to survive the 5 px glyph grid (≈15 cells across the face radius)
        // fine concentric texture
        for (let q = 0.1; q < 0.95; q += 0.07) ring(fr * q, 1.2, `rgba(150,105,50,${0.08 + 0.08 * ((q * 37) % 1)})`);
        // stepped border: deep groove → raised bead row → groove
        ring(fr * 0.985, 5, 'rgba(95,60,20,0.85)');
        ring(fr * 0.93, 4, 'rgba(255,253,246,1)');
        ring(fr * 0.86, 3.5, 'rgba(110,72,28,0.8)');
        for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2, bx = fx + Math.cos(a) * fr * 0.895, by = fy + Math.sin(a) * fr * 0.895 * ar;
          o.beginPath(); o.arc(bx + 1.2, by + 1.2, 2.4, 0, Math.PI * 2); o.fillStyle = 'rgba(110,70,25,0.55)'; o.fill();
          o.beginPath(); o.arc(bx, by, 2.2, 0, Math.PI * 2); o.fillStyle = 'rgba(255,251,238,0.95)'; o.fill(); }
        // inner medallion: double ring with a recessed band between
        ring(fr * 0.64, 4, 'rgba(115,76,30,0.75)');
        ring(fr * 0.6, 3, 'rgba(255,250,238,0.95)');
        ring(fr * 0.52, 2.5, 'rgba(130,88,36,0.55)');
        // six radial ridges between the medallion and the border
        for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.26;
          o.beginPath(); o.moveTo(fx + Math.cos(a) * fr * 0.66, fy + Math.sin(a) * fr * 0.66 * ar); o.lineTo(fx + Math.cos(a) * fr * 0.84, fy + Math.sin(a) * fr * 0.84 * ar);
          o.lineWidth = 3; o.strokeStyle = 'rgba(255,250,236,0.85)'; o.stroke();
          o.beginPath(); o.moveTo(fx + Math.cos(a) * fr * 0.66 + 1.5, fy + Math.sin(a) * fr * 0.66 * ar + 1.5); o.lineTo(fx + Math.cos(a) * fr * 0.84 + 1.5, fy + Math.sin(a) * fr * 0.84 * ar + 1.5);
          o.lineWidth = 2; o.strokeStyle = 'rgba(110,70,25,0.6)'; o.stroke(); }
        // domed centre: hot highlight upper-left, falling into shade lower-right
        const dg = o.createRadialGradient(fx - fr * 0.18, fy - fr * 0.2 * ar, 0, fx, fy, fr * 0.5);
        dg.addColorStop(0, 'rgba(255,255,252,0.95)'); dg.addColorStop(0.55, 'rgba(255,238,210,0.2)'); dg.addColorStop(1, 'rgba(120,78,30,0.5)');
        o.beginPath(); o.ellipse(fx, fy, fr * 0.5, fr * 0.5 * ar, 0, 0, Math.PI * 2); o.fillStyle = dg; o.fill();
        // whole-face directional shading: light from upper-left, a dark crescent hugging the lower-right rim
        const sg = o.createRadialGradient(fx - fr * 0.35, fy - fr * 0.4 * ar, fr * 0.2, fx, fy, fr * 1.05);
        sg.addColorStop(0, 'rgba(255,255,250,0.25)'); sg.addColorStop(0.6, 'rgba(0,0,0,0)'); sg.addColorStop(0.85, 'rgba(90,55,18,0.35)'); sg.addColorStop(1, 'rgba(60,35,10,0.6)');
        o.beginPath(); o.ellipse(fx, fy, fr * 1.02, fr * 1.02 * ar, 0, 0, Math.PI * 2); o.fillStyle = sg; o.fill();
        // reeded outer rim: alternating light/dark ticks, darker on the shaded side
        for (let k = 0; k < 90; k++) { const a = k / 90 * Math.PI * 2, r1 = fr * 1.03, r2 = fr * 1.22, side = 0.5 + 0.5 * Math.cos(a - 0.8);
          o.beginPath(); o.moveTo(fx + Math.cos(a) * r1, fy + Math.sin(a) * r1 * ar); o.lineTo(fx + Math.cos(a) * r2, fy + Math.sin(a) * r2 * ar);
          o.lineWidth = 1.4; o.strokeStyle = k % 2 ? `rgba(255,246,225,${0.6 - 0.35 * side})` : `rgba(90,55,20,${0.4 + 0.35 * side})`; o.stroke(); }
        // contact shadow where the coin meets the stack top
        const cg = o.createRadialGradient(fx, fy + fr * 1.15 * ar, 0, fx, fy + fr * 1.15 * ar, fr * 0.9);
        cg.addColorStop(0, 'rgba(40,20,5,0.55)'); cg.addColorStop(1, 'rgba(40,20,5,0)');
        o.beginPath(); o.ellipse(fx, fy + fr * 1.15 * ar, fr * 0.9, fr * 0.22, 0, 0, Math.PI * 2); o.fillStyle = cg; o.fill();
        o.restore(); }
      skyLum.fill(0);
      const px = o.getImageData(0, 0, W, H).data;
      // building = dark pixel (towers, city) or warm-bright pixel (the sunlit central spire); the bluish dusk sky is not
      const skinAt = (x, y) => {
        if (x < OX) return false;
        const i = (y * W + x) * 4, r0 = px[i], g0 = px[i + 1], b0 = px[i + 2];
        const l = (0.299 * r0 + 0.587 * g0 + 0.114 * b0) / 255;
        if (y < OY || y >= OY + IH || x >= OX + IW) return false;
        // coins = warm metal; the near-black teal backdrop and the gaps between stacks are not
        return l > 0.1 && r0 > b0 + 12;
      };
      // sky luminance per cell (clouds) → drives the animated background density
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const xr = Math.floor(gx * cellW + cellW / 2), y = Math.min(H - 1, Math.floor(gy * cellH + cellH / 2));
        // left of the photo: sample the edge column so the sky continues, fading out over ~260 px; inside: feather in over 160 px
        const x = Math.min(W - 1, Math.max(Math.floor(OX), xr));
        const fx = xr >= OX ? Math.min(1, (xr - OX) / 160) : Math.max(0, 1 - (OX - xr) / 260);
        const i = (y * W + x) * 4; skyLum[gy * cols + gx] = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255 * (0.35 + 0.65 * fx * fx);
      }
      // height/light from luminance; saturated (orange) surfaces are lifted so the hero tower stands proud of the white blocks
      // S-curve contrast around the mid-tone so marble blazes and shadow sinks
      const lumPx = (x, y) => { const i = (y * W + x) * 4; const l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255; const c = 0.5 + Math.tanh((l - 0.5) * 6.5) / 2; return Math.max(0, Math.min(1, c)); };
      // per-cell: average luminance over the cell; cells that are mostly skin count as hand
      const raw = new Float32Array(cols * rows), cov = new Float32Array(cols * rows);
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        let sum = 0, hit = 0, n = 0;
        const x0 = Math.floor(gx * cellW), y0 = Math.floor(gy * cellH);
        for (let y = y0; y < Math.min(H, y0 + cellH); y++) for (let x = x0; x < Math.min(W, x0 + cellW); x++) { n++; if (skinAt(x, y)) { hit++; sum += lumPx(x, y); } }
        cov[gy * cols + gx] = n ? hit / n : 0; raw[gy * cols + gx] = hit ? sum / hit : 0;
      }
      // close small holes (nails, deep creases): a cell surrounded by hand is hand, at the neighbours' luminance
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const k = gy * cols + gx;
        const cxp = gx * cellW + cellW / 2, cyp = gy * cellH + cellH / 2;
        const fE = Math.min(1, (cxp - OX) / 110);
        if (fE < 1 && hash(gx, gy, 77) > fE * fE) { pLum[k] = 0; continue; }
        if (cov[k] >= 0.45) { pLum[k] = Math.max(0.04, raw[k]); continue; }
        let around = 0, lsum = 0, ln = 0;
        for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
          const xx = gx + dx, yy = gy + dy; if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue;
          const kk = yy * cols + xx; if (cov[kk] >= 0.45) { around++; lsum += raw[kk]; ln++; }
        }
        pLum[k] = around >= 30 ? Math.max(0.04, (lsum / ln) * 0.9) : 0;
      }
    };
    const buildDepth = () => {
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const sx = gx * cellW, sy = gy * cellH;
        let z = Infinity, id = 0;
        const c = coin, x = sx - c.cx, y = sy - c.cy;
        if (Math.abs(x) <= c.bound && Math.abs(y) <= c.bound) {
          const p0 = c.M(x, y, 0), d = c.d;
          const half = c.half; let z1 = (-half - p0[2]) / d[2], z2 = (half - p0[2]) / d[2]; if (z1 > z2) { const q = z1; z1 = z2; z2 = q; }
          const at = (zz) => inside(c, p0[0] + zz * d[0], p0[1] + zz * d[1], p0[2] + zz * d[2]);
          const n = 24; let prev = z1;
          for (let i = 0; i <= n; i++) {
            const zz = z1 + (z2 - z1) * i / n;
            if (at(zz)) { let lo = prev, hi = zz; for (let k = 0; k < 6; k++) { const mid = (lo + hi) / 2; if (at(mid)) hi = mid; else lo = mid; } z = hi + c.cz; id = 1;
              const hx = p0[0] + hi * d[0], hy = p0[1] + hi * d[1], hz = p0[2] + hi * d[2];
              coinRR[gy * cols + gx] = Math.hypot(hx, hy) / c.R;
              coinSide[gy * cols + gx] = Math.abs(hz) < c.half * 0.82 ? 1 : 0;   // hit well inside the slab thickness → on the side wall
              break; }
            prev = zz;
          }
        }
        const l = pLum[gy * cols + gx];
        if (l > 0) { const zh = (40 - 120 * l) * S; if (zh < z) { z = zh; id = 2; } }
        depth[gy * cols + gx] = z; objId[gy * cols + gx] = id;
      }
    };
    // ---- one-time per-cell lighting (static scene) ----
    const kind = new Uint8Array(cols * rows);      // 0 none, 1 coin, 2 hand, 3 background glyph (halo/glow)
    const base = new Float32Array(cols * rows);    // lit shade before shimmer
    const ringF = new Uint8Array(cols * rows);     // 1 = coin outline (shimmer-free)
    const bgA = new Float32Array(cols * rows);     // background glyph alpha
    const bgPhase = new Float32Array(cols * rows);
    const colKArr = new Float32Array(cols), nzArr = new Float32Array(cols * rows);
    for (let gx = 0; gx < cols; gx++) colKArr[gx] = 0.7 + 0.6 * hash(gx, 7, 3);
    const buildStatic = () => {
      const D = (gx, gy) => (gx < 0 || gy < 0 || gx >= cols || gy >= rows) ? Infinity : depth[gy * cols + gx];
      for (let gx = 0; gx < cols; gx++) {
        const colK = colKArr[gx];
        for (let gy = 0; gy < rows; gy++) {
          const k = gy * cols + gx;
          const z = depth[k];
          const nz = hash(gx, gy, 99); nzArr[k] = nz;
          bgPhase[k] = hash(gx, gy, 5) * 6.2832;
          if (z === Infinity) {
            const gd = Math.hypot(gx * cellW - coin.cx, gy * cellH - coin.cy) / coin.R;
            const glow = gd < 10.6 ? Math.pow(Math.max(0, 1 - (gd - 1) / 9.6), 2.2) : 0;
            let near = 0;
            for (let q = 1; q <= 3 && !near; q++) if (D(gx - q, gy) !== Infinity || D(gx + q, gy) !== Infinity || D(gx, gy - q) !== Infinity || D(gx, gy + q) !== Infinity) near = q;
            let al = 0;
            if (glow > 0 && nz > 0.25) al = Math.min(0.21, 0.196 * glow * (0.5 + nz));
            if (near && nz >= 0.55) al = Math.max(al, 0.22 / near);
            kind[k] = 3; bgA[k] = al;
            continue;
          }
          const zl = D(gx - 1, gy), zr = D(gx + 1, gy), zu = D(gx, gy - 1), zd = D(gx, gy + 1);
          const dzx = (zl === Infinity || zr === Infinity) ? 40 : (zr - zl) / (2 * cellW / scale);
          const dzy = (zu === Infinity || zd === Infinity) ? 40 : (zd - zu) / (2 * cellH / scale);
          const len = Math.sqrt(1 + dzx * dzx + dzy * dzy);
          const nzv = 1 / len;
          const lamRaw = (0.6 * dzx + 0.6 * dzy + 0.55) / len;
          const lam = Math.max(0.3, lamRaw);
          const spec = Math.pow(Math.max(0, lamRaw), 18);
          const fill = 0.25 * Math.max(0, (-0.5 * dzx - 0.3 * dzy + 0.4) / len);
          let ao = 0, aoN = 0;
          for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1], [-1, 1], [1, -1], [-4, 0], [4, 0], [0, -3], [0, 3]]) {
            const zq = D(gx + dx, gy + dy); aoN++;
            if (zq === Infinity) continue;
            const expected = z + dzx * dx * cellW / scale + dzy * dy * cellH / scale;
            ao += Math.min(1, Math.max(0, (expected - zq) / (5 * S)));
          }
          ao /= aoN;
          const edge = (zl === Infinity || zr === Infinity || zu === Infinity || zd === Infinity) ? 1 : 0;
          const rim = (objId[gy * cols + gx] === 1 ? 0.15 : 0.45) * Math.pow(1 - nzv, 2.2) + (objId[gy * cols + gx] === 1 ? 0 : 0.55) * edge;
          const zn = Math.max(0, Math.min(1, (z + 60 * S) / (220 * S)));
          let shade = 0.36 + 1.1 * lam + fill * 1.3 + 0.8 * spec - 1.3 * ao - 0.9 * rim - 0.2 * zn;
          shade = Math.max(0.1, Math.min(1.35, shade));
          const isCoin = objId[gy * cols + gx] === 1;
          let isRing = false;
          if (isCoin) {
            const k = gy * cols + gx, rr = coinRR[k];
            if (coinSide[k]) {
              // reeded side wall: explicit and dark, fine vertical grooves
              const ax = gx * cellW - coin.cx, ay = gy * cellH - coin.cy;
              const groove = 0.5 + 0.5 * Math.cos(Math.atan2(ay, ax) * 90);
              shade = 0.16 + 0.14 * groove;
            } else {
              // spun-metal face: anisotropic flare — two bright lobes (upper-left ↔ lower-right) fanning out from the centre,
              // a darker band across them (upper-right ↔ lower-left), all fading toward the rim
              const ax = gx * cellW - coin.cx, ay = gy * cellH - coin.cy, ang = Math.atan2(ay, ax);
              const lobe = Math.pow(Math.abs(Math.cos(ang - 2.35)), 3.0);      // peaks at ~135° and ~-45°
              const dark = Math.pow(Math.abs(Math.cos(ang - 0.78)), 6.0);      // the cross band at ~45° / -135°
              const centre = Math.pow(Math.max(0, 1 - rr * 0.9), 0.6);          // hot core at the pivot
              shade = 0.42 + 0.75 * lobe - 0.28 * dark + 0.3 * centre;
              shade = Math.min(1.1, Math.max(0.2, shade));
              // smooth, round outline: brightness ramps up with the true local radius (no cell-border jaggies)
              const ring = Math.max(0, Math.min(1, (rr - 0.86) / 0.07));
              if (ring > 0) { shade = shade + (1.35 - shade) * (ring * ring * (3 - 2 * ring)); isRing = ring > 0.5; }
            }
          } else {
            // the photo's own light: fingertips and thumb pad glow, palm falls into shadow
            const pl = pLum[gy * cols + gx];
            shade = shade * 0.5 + 1.6 * Math.pow(pl, 1.6) - 0.14;
          }
          base[k] = shade * (0.94 + 0.12 * (colK - 1)) * (0.92 + 0.16 * nz);
          kind[k] = isCoin ? 1 : 2; ringF[k] = isRing ? 1 : 0;
        }
      }
    };
    // ---- per-frame: shimmer × base → quantised colour buckets → batched fills ----
    const LEVELS = 28;
    const palette = [];
    for (let i = 0; i <= LEVELS; i++) {
      const v = i / LEVELS; let cr, cg, cb;
      if (v < 0.6) { const q = Math.pow(v / 0.6, 1.4); cr = 22 + (r - 22) * q; cg = g * q; cb = 10 + (b - 10) * q; }
      else { const q = Math.pow((v - 0.6) / 0.4, 1.2); cr = r + (255 - r) * q; cg = g + (190 - g) * q; cb = b + (225 - b) * q; }
      palette.push(`rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${(0.5 + 0.5 * v).toFixed(3)})`);
    }
    const BG_LEVELS = 12;
    const bgPal = []; for (let i = 0; i <= BG_LEVELS; i++) bgPal.push(`rgba(${r},${g},${b},${(0.3 * i / BG_LEVELS).toFixed(3)})`);
    // buckets: [level][glyph 0/1] → flat x,y list
    const buckets = []; for (let i = 0; i <= LEVELS; i++) buckets.push([[], []]);
    const bgBuckets = []; for (let i = 0; i <= BG_LEVELS; i++) bgBuckets.push([[], []]);
    const gw = Math.max(2, cellW * 0.62), gh = Math.max(3, cellH * 0.72), sw = Math.max(1, cellW * 0.22);
    const ox0 = (cellW - gw) / 2, oy0 = (cellH - gh) / 2, ox1 = ox0 + (gw - sw) / 2;
    const flush = (list, pal) => {
      for (let i = 0; i < list.length; i++) {
        const [zeros, ones] = list[i];
        if (!zeros.length && !ones.length) continue;
        ctx.fillStyle = pal[i];
        ctx.beginPath();
        for (let j = 0; j < ones.length; j += 2) ctx.rect(ones[j] + ox1, ones[j + 1] + oy0, sw, gh);
        for (let j = 0; j < zeros.length; j += 2) {
          // ring '0' = outer rect minus inner rect (even-odd)
          const x0 = zeros[j] + ox0, y0 = zeros[j + 1] + oy0;
          ctx.rect(x0, y0, gw, gh); ctx.rect(x0 + sw, y0 + sw, gw - 2 * sw, gh - 2 * sw);
        }
        ctx.fill('evenodd');
        zeros.length = 0; ones.length = 0;
      }
    };
    const N = cols * rows;
    const digPh = new Float32Array(N), digK = new Int32Array(N).fill(-1), digA = new Uint8Array(N), digB = new Uint8Array(N);
    const phS = new Float32Array(N), phC = new Float32Array(N);
    for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) digPh[gy * cols + gx] = hash(gx, gy, 0);
    const colTrig = (f) => { const sA = new Float32Array(cols), cA = new Float32Array(cols); for (let gx = 0; gx < cols; gx++) { sA[gx] = Math.sin(gx * cellW * f); cA[gx] = Math.cos(gx * cellW * f); } return [sA, cA]; };
    const [sA, cA] = colTrig(0.045), [sB, cB] = colTrig(0.012), [sC, cC] = colTrig(0.006), [sD, cD] = colTrig(0.002);
    // only cells that can ever draw
    // filled after buildStatic(): kind[] and bgPhase[] only exist once the reference image has loaded
    let liveK = new Int32Array(0);
    const buildLive = () => {
      const live = []; for (let k = 0; k < N; k++) { if (kind[k]) live.push(k); phS[k] = Math.sin(bgPhase[k]); phC[k] = Math.cos(bgPhase[k]); }
      liveK = Int32Array.from(live);
    };

    const t0 = 0;
    const frame = (drawCtx, now) => {
      ctx = drawCtx;
      const t = ((now - t0) / 1000) * speed;
      const tf = t * 1.5 * flickerSpeed, tw = t * waveSpeed, tb = t * 0.35;
      ctx.clearRect(0, 0, W, H);
      const s2 = Math.sin(tb * 2), c2 = Math.cos(tb * 2);
      const rowP = [], rowQ = [], rowR = [], rowT = [];
      for (let gy = 0; gy < rows; gy++) {
        const v0 = gy * cellH;
        const P = 0.6 * Math.sin(v0 * 0.02 + tw * 0.7) - tw * 2.2, Q = tw * 0.9 + v0 * 0.006;
        const R2 = tb + 0.8 * Math.sin(v0 * 0.004 - tb * 0.6), T2 = v0 * 0.005 - tb * 0.8;
        rowP.push(Math.sin(P), Math.cos(P)); rowQ.push(Math.sin(Q), Math.cos(Q)); rowR.push(Math.sin(R2), Math.cos(R2)); rowT.push(Math.sin(T2), Math.cos(T2));
      }
      for (let li = 0; li < liveK.length; li++) {
        const k = liveK[li], kd = kind[k];
        const gy = (k / cols) | 0, gx = k - gy * cols, u0 = gx * cellW, v0 = gy * cellH;
        // digit state with crossfade — hashes only when the cell's cycle ticks over
        const ph = tf + digPh[k];
        const kk = Math.floor(ph), f = ph - kk;
        if (kk !== digK[k]) { digK[k] = kk; digA[k] = hash(gx, gy, kk * 7) < 0.5 ? 0 : 1; digB[k] = hash(gx, gy, kk * 7 + 7) < 0.5 ? 0 : 1; }
        const d0 = digA[k], d1 = digB[k];
        let mix = f < 0.65 ? 0 : (f - 0.65) / 0.35; mix = mix * mix * (3 - 2 * mix);
        const g2 = gy * 2;
        if (kd === 3) {
          const sinR = sC[gx] * rowR[g2 + 1] + cC[gx] * rowR[g2];            // sin(u·0.006 + R)
          const cosT = cD[gx] * rowT[g2 + 1] - sD[gx] * rowT[g2];            // cos(u·0.002 + T)
          const field = 0.5 + 0.5 * sinR * (0.5 + 0.5 * cosT);
          const sky = skyLum[k];
          // sparse field: a small scattering of dim digits, slightly denser where the slow waves pass
          const dens = 0.1 + 0.18 * field * field + 0.1 * sky * sky;
          let al = bgA[k];
          if (nzArr[k] < dens) al = Math.max(al, 0.09 + 0.1 * field * (0.5 + 0.5 * (phS[k] * c2 + phC[k] * s2)) + 0.06 * sky * sky);
          if (al < 0.02) continue;
          const lv = Math.min(BG_LEVELS, Math.round(al / 0.3 * BG_LEVELS));
          if (d0 === d1 || mix === 0) bgBuckets[lv][d0].push(u0, v0);
          else { const l1 = Math.round(lv * (1 - mix)), l2 = Math.round(lv * mix); if (l1) bgBuckets[l1][d0].push(u0, v0); if (l2) bgBuckets[l2][d1].push(u0, v0); }
          continue;
        }
        let lum = base[k];
        if (!ringF[k]) {
          const sP = sA[gx] * rowP[g2 + 1] + cA[gx] * rowP[g2];              // sin(u·0.045 + P)
          const sQ = sB[gx] * rowQ[g2 + 1] + cB[gx] * rowQ[g2];              // sin(u·0.012 + Q)
          const shm = 0.5 + 0.5 * sP * (0.6 + 0.4 * sQ);
          lum *= 0.7 + 0.8 * Math.pow(shm, 1.6);
        } else lum *= 1.5;
        if (lum < 0.05) continue;
        const v = Math.min(1, lum / 1.15);
        const lv = Math.round(v * LEVELS);
        if (d0 === d1 || mix === 0) buckets[lv][d0].push(u0, v0);
        else { const l1 = Math.round(lv * (1 - mix)), l2 = Math.round(lv * mix); if (l1) buckets[l1][d0].push(u0, v0); if (l2) buckets[l2][d1].push(u0, v0); }
      }
      flush(bgBuckets, bgPal);
      flush(buckets, palette);
    };
    if (img) buildHand(img); buildDepth(); buildStatic(); buildLive();
    return frame;
}
