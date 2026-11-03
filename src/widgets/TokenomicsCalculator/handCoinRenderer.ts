// Ported from the supplied Binary Hand Coin.dc.html. Geometry, lighting,
// bitmap digits, shimmer, crossfade and palette retain the reference settings.
type Coin = {
    R: number;
    half: number;
    cx: number;
    cy: number;
    cz: number;
    M: (x: number, y: number, z: number) => number[];
    d: number[];
    bound: number;
};
export function createHandCoinRenderer(canvas: HTMLCanvasElement, image?: HTMLImageElement) {
    const context = canvas.getContext('2d');
    if (!context)
        return null;
    const ctx = context;
    const W = 1280, H = 800;
    let scaleX = 1, scaleY = 1;
    let firstColumn = 0, lastColumn = 0;
    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        scaleX = width / W;
        scaleY = height / H;
        ctx.imageSmoothingEnabled = false;
        // The hero clips the wide canvas on mobile; skip invisible columns.
        firstColumn = Math.max(0, Math.floor(-rect.left / rect.width * cols));
        lastColumn = Math.min(cols, Math.ceil((document.documentElement.clientWidth - rect.left) / rect.width * cols));
    };
    const hash = (a: number, b: number, c: number) => { let h = (a * 374761393 + b * 668265263 + c * 2246822519) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const speed = 0.7, waveSpeed = 2.2, flickerSpeed = 0.25;
    const cellW = 5, cellH = cellW * 1.25;
    const color = '#CA005A';
    const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
    const cols = Math.ceil(W / cellW), rows = Math.ceil(H / cellH);
    const depth = new Float32Array(cols * rows);
    depth.fill(Infinity);
    const objId = new Uint8Array(cols * rows); // 1 = coin, 2 = hand
    const coinRR = new Float32Array(cols * rows); // coin hit: local radius / R
    const coinSide = new Uint8Array(cols * rows); // coin hit: 1 = reeded side, 0 = face
    const scale = 1.0;
    const S = H / 600, OX = W - 600 * S + 20, OY = 0; // scene → screen: x' = OX + x·S, y' = OY + y·S
    const rotM = (thY: number, tilt: number, phi: number) => {
        const cy1 = Math.cos(-thY), sy1 = Math.sin(-thY), cx1 = Math.cos(-tilt), sx1 = Math.sin(-tilt), cz1 = Math.cos(-phi), sz1 = Math.sin(-phi);
        return (x: number, y: number, z: number) => {
            const X = cy1 * x + sy1 * z, Y = y, Z = -sy1 * x + cy1 * z;
            const Y2 = cx1 * Y - sx1 * Z, Z2 = sx1 * Y + cx1 * Z;
            return [cz1 * X - sz1 * Y2, sz1 * X + cz1 * Y2, Z2];
        };
    };
    // coin sits exactly where the reference's coin is (image 1254² → 600²)
    const coin: Coin = { d: [0, 0, 1], bound: 0, R: 82 * S, half: 9 * S, cx: OX + 292 * S, cy: OY + 240 * S, cz: 0, M: rotM(0.3, 0.04, 0.0) };
    coin.d = coin.M(0, 0, 1);
    coin.bound = coin.R * 1.04 + coin.half;
    // coin solid: flat face, thin raised lip at the rim, soft bevel to a finely reeded edge
    const inside = (c: Coin, px: number, py: number, pz: number) => {
        const R = c.R, rr = Math.hypot(px, py);
        const ang = Math.atan2(py, px);
        const reed = 1 + 0.012 * Math.cos(ang * 90);
        if (rr > R * reed)
            return false;
        let relief = 0.9;
        const lip = R * 0.07, bev = R * 0.035;
        if (rr > R - bev)
            relief = 1 - 0.22 * Math.pow((rr - (R - bev)) / bev, 2);
        else if (rr > R - lip)
            relief = 1;
        else if (rr > R - lip - bev)
            relief = 0.9 + 0.1 * (rr - (R - lip - bev)) / bev;
        if (rr > R * 0.78 && rr < R * 0.84)
            relief = Math.max(relief, 0.96); // inner laurel ring
        return Math.abs(pz) <= c.half * relief;
    };
    // hand: relief lifted from the reference photo — every contour and crease follows the image.
    // Skin pixels become a height field (lit flesh nearer, shadow farther); the coin stays a true 3D solid.
    const pLum = new Float32Array(cols * rows);
    const buildHand = (img: HTMLImageElement) => {
        const oc = document.createElement('canvas');
        oc.width = W;
        oc.height = H;
        const o = oc.getContext('2d');
        if (!o)
            return;
        o.drawImage(img, OX, OY, 600 * S, 600 * S);
        const px = o.getImageData(0, 0, W, H).data;
        // skin = warm pixel (r > g, r > b), not the blue-black ground, not under the coin
        const skinAt = (x: number, y: number) => {
            const i = (y * W + x) * 4, r0 = px[i], g0 = px[i + 1], b0 = px[i + 2];
            if (r0 < 18 || b0 > r0 * 0.95)
                return false;
            if (x < OX)
                return false;
            if (Math.hypot(x - coin.cx, y - coin.cy) < coin.R * 0.98)
                return false;
            return r0 > g0 && r0 > b0;
        };
        const lumPx = (x: number, y: number) => { const i = (y * W + x) * 4; return Math.pow((0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255, 0.75); };
        // per-cell: average luminance over the cell; cells that are mostly skin count as hand
        const raw = new Float32Array(cols * rows), cov = new Float32Array(cols * rows);
        for (let gy = 0; gy < rows; gy++)
            for (let gx = 0; gx < cols; gx++) {
                let sum = 0, hit = 0, n = 0;
                const x0 = Math.floor(gx * cellW), y0 = Math.floor(gy * cellH);
                for (let y = y0; y < Math.min(H, y0 + cellH); y++)
                    for (let x = x0; x < Math.min(W, x0 + cellW); x++) {
                        n++;
                        if (skinAt(x, y)) {
                            hit++;
                            sum += lumPx(x, y);
                        }
                    }
                cov[gy * cols + gx] = n ? hit / n : 0;
                raw[gy * cols + gx] = hit ? sum / hit : 0;
            }
        // close small holes (nails, deep creases): a cell surrounded by hand is hand, at the neighbours' luminance
        for (let gy = 0; gy < rows; gy++)
            for (let gx = 0; gx < cols; gx++) {
                const k = gy * cols + gx;
                if (cov[k] >= 0.45) {
                    pLum[k] = Math.max(0.04, raw[k]);
                    continue;
                }
                let around = 0, lsum = 0, ln = 0;
                for (let dy = -3; dy <= 3; dy++)
                    for (let dx = -3; dx <= 3; dx++) {
                        const xx = gx + dx, yy = gy + dy;
                        if (xx < 0 || yy < 0 || xx >= cols || yy >= rows)
                            continue;
                        const kk = yy * cols + xx;
                        if (cov[kk] >= 0.45) {
                            around++;
                            lsum += raw[kk];
                            ln++;
                        }
                    }
                pLum[k] = around >= 30 ? Math.max(0.04, (lsum / ln) * 0.9) : 0;
            }
    };
    const buildDepth = () => {
        for (let gy = 0; gy < rows; gy++)
            for (let gx = 0; gx < cols; gx++) {
                const sx = gx * cellW, sy = gy * cellH;
                let z = Infinity, id = 0;
                const c = coin, x = sx - c.cx, y = sy - c.cy;
                if (Math.abs(x) <= c.bound && Math.abs(y) <= c.bound) {
                    const p0 = c.M(x, y, 0), d = c.d;
                    const half = c.half;
                    let z1 = (-half - p0[2]) / d[2], z2 = (half - p0[2]) / d[2];
                    if (z1 > z2) {
                        const q = z1;
                        z1 = z2;
                        z2 = q;
                    }
                    const at = (zz: number) => inside(c, p0[0] + zz * d[0], p0[1] + zz * d[1], p0[2] + zz * d[2]);
                    const n = 24;
                    let prev = z1;
                    for (let i = 0; i <= n; i++) {
                        const zz = z1 + (z2 - z1) * i / n;
                        if (at(zz)) {
                            let lo = prev, hi = zz;
                            for (let k = 0; k < 6; k++) {
                                const mid = (lo + hi) / 2;
                                if (at(mid))
                                    hi = mid;
                                else
                                    lo = mid;
                            }
                            z = hi + c.cz;
                            id = 1;
                            const hx = p0[0] + hi * d[0], hy = p0[1] + hi * d[1], hz = p0[2] + hi * d[2];
                            coinRR[gy * cols + gx] = Math.hypot(hx, hy) / c.R;
                            coinSide[gy * cols + gx] = Math.abs(hz) < c.half * 0.82 ? 1 : 0; // hit well inside the slab thickness → on the side wall
                            break;
                        }
                        prev = zz;
                    }
                }
                const l = pLum[gy * cols + gx];
                if (l > 0) {
                    const zh = (34 - 78 * l) * S;
                    if (zh < z) {
                        z = zh;
                        id = 2;
                    }
                }
                depth[gy * cols + gx] = z;
                objId[gy * cols + gx] = id;
            }
    };
    // ---- one-time per-cell lighting (static scene) ----
    const kind = new Uint8Array(cols * rows); // 0 none, 1 coin, 2 hand, 3 background glyph (halo/glow)
    const base = new Float32Array(cols * rows); // lit shade before shimmer
    const ringF = new Uint8Array(cols * rows); // 1 = coin outline (shimmer-free)
    const bgA = new Float32Array(cols * rows); // background glyph alpha
    const bgPhase = new Float32Array(cols * rows);
    const colKArr = new Float32Array(cols), nzArr = new Float32Array(cols * rows);
    for (let gx = 0; gx < cols; gx++)
        colKArr[gx] = 0.7 + 0.6 * hash(gx, 7, 3);
    const buildStatic = () => {
        const D = (gx: number, gy: number) => (gx < 0 || gy < 0 || gx >= cols || gy >= rows) ? Infinity : depth[gy * cols + gx];
        for (let gx = 0; gx < cols; gx++) {
            const colK = colKArr[gx];
            for (let gy = 0; gy < rows; gy++) {
                const k = gy * cols + gx;
                const z = depth[k];
                const nz = hash(gx, gy, 99);
                nzArr[k] = nz;
                bgPhase[k] = hash(gx, gy, 5) * 6.2832;
                if (z === Infinity) {
                    const gd = Math.hypot(gx * cellW - coin.cx, gy * cellH - coin.cy) / coin.R;
                    const glow = gd < 10.6 ? Math.pow(Math.max(0, 1 - (gd - 1) / 9.6), 2.2) : 0;
                    let near = 0;
                    for (let q = 1; q <= 3 && !near; q++)
                        if (D(gx - q, gy) !== Infinity || D(gx + q, gy) !== Infinity || D(gx, gy - q) !== Infinity || D(gx, gy + q) !== Infinity)
                            near = q;
                    let al = 0;
                    if (glow > 0 && nz > 0.25)
                        al = Math.min(0.21, 0.196 * glow * (0.5 + nz));
                    if (near && nz >= 0.55)
                        al = Math.max(al, 0.22 / near);
                    kind[k] = 3;
                    bgA[k] = al;
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
                    const zq = D(gx + dx, gy + dy);
                    aoN++;
                    if (zq === Infinity)
                        continue;
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
                    }
                    else {
                        // spun-metal face: anisotropic flare — two bright lobes (upper-left ↔ lower-right) fanning out from the centre,
                        // a darker band across them (upper-right ↔ lower-left), all fading toward the rim
                        const ax = gx * cellW - coin.cx, ay = gy * cellH - coin.cy, ang = Math.atan2(ay, ax);
                        const lobe = Math.pow(Math.abs(Math.cos(ang - 2.35)), 3.0); // peaks at ~135° and ~-45°
                        const dark = Math.pow(Math.abs(Math.cos(ang - 0.78)), 6.0); // the cross band at ~45° / -135°
                        const centre = Math.pow(Math.max(0, 1 - rr * 0.9), 0.6); // hot core at the pivot
                        shade = 0.42 + 0.75 * lobe - 0.28 * dark + 0.3 * centre;
                        shade = Math.min(1.1, Math.max(0.2, shade));
                        // smooth, round outline: brightness ramps up with the true local radius (no cell-border jaggies)
                        const ring = Math.max(0, Math.min(1, (rr - 0.86) / 0.07));
                        if (ring > 0) {
                            shade = shade + (1.35 - shade) * (ring * ring * (3 - 2 * ring));
                            isRing = ring > 0.5;
                        }
                    }
                }
                else {
                    // the photo's own light: fingertips and thumb pad glow, palm falls into shadow
                    const pl = pLum[gy * cols + gx];
                    shade = (shade * 0.35 + 1.3 * Math.pow(pl, 1.3)) * 0.75;
                    const Oid = (x: number, y: number) => (x < 0 || y < 0 || x >= cols || y >= rows) ? 0 : objId[y * cols + x];
                    if (Oid(gx - 1, gy) === 1 || Oid(gx + 1, gy) === 1 || Oid(gx, gy - 1) === 1 || Oid(gx, gy + 1) === 1)
                        shade *= 0.3;
                }
                base[k] = shade * (0.94 + 0.12 * (colK - 1)) * (0.92 + 0.16 * nz);
                kind[k] = isCoin ? 1 : 2;
                ringF[k] = isRing ? 1 : 0;
            }
        }
    };
    // ---- per-frame: shimmer × base → quantised colour buckets → batched fills ----
    const LEVELS = 28;
    const palette: string[] = [];
    for (let i = 0; i <= LEVELS; i++) {
        const v = i / LEVELS;
        let cr, cg, cb;
        if (v < 0.6) {
            const q = Math.pow(v / 0.6, 1.4);
            cr = 22 + (r - 22) * q;
            cg = g * q;
            cb = 10 + (b - 10) * q;
        }
        else {
            const q = Math.pow((v - 0.6) / 0.4, 1.2);
            cr = r + (255 - r) * q;
            cg = g + (190 - g) * q;
            cb = b + (225 - b) * q;
        }
        palette.push(`rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${(0.5 + 0.5 * v).toFixed(3)})`);
    }
    const BG_LEVELS = 12;
    const bgPal: string[] = [];
    for (let i = 0; i <= BG_LEVELS; i++)
        bgPal.push(`rgba(${r},${g},${b},${(0.3 * i / BG_LEVELS).toFixed(3)})`);
    // buckets: [level][glyph 0/1] → flat x,y list
    const buckets: number[][][] = [];
    for (let i = 0; i <= LEVELS; i++)
        buckets.push([[], []]);
    const bgBuckets: number[][][] = [];
    for (let i = 0; i <= BG_LEVELS; i++)
        bgBuckets.push([[], []]);
    const gw = Math.max(2, cellW * 0.62), gh = Math.max(3, cellH * 0.72), sw = Math.max(1, cellW * 0.22);
    // Batch bitmap bars into paths by colour. Separate horizontal/vertical
    // passes retain the reference's alpha overlap at zero-ring corners.
    const rectPath = (x: number, y: number, width: number, height: number) => {
        const left = Math.round(x * scaleX), top = Math.round(y * scaleY);
        ctx.rect(left, top, Math.max(1, Math.round((x + width) * scaleX) - left), Math.max(1, Math.round((y + height) * scaleY) - top));
    };
    const flush = (list: number[][][], pal: string[]) => {
        for (let i = 0; i < list.length; i++) {
            const [zeros, ones] = list[i];
            if (!zeros.length && !ones.length) continue;
            ctx.fillStyle = pal[i];
            ctx.beginPath();
            for (let j = 0; j < ones.length; j += 2) {
                rectPath(ones[j] + (cellW - sw) / 2, ones[j + 1] + (cellH - gh) / 2, sw, gh);
            }
            ctx.fill();
            ctx.beginPath();
            for (let j = 0; j < zeros.length; j += 2) {
                const x = zeros[j] + (cellW - gw) / 2, y = zeros[j + 1] + (cellH - gh) / 2;
                rectPath(x, y, gw, sw);
                rectPath(x, y + gh - sw, gw, sw);
            }
            ctx.fill();
            ctx.beginPath();
            for (let j = 0; j < zeros.length; j += 2) {
                const x = zeros[j] + (cellW - gw) / 2, y = zeros[j + 1] + (cellH - gh) / 2;
                rectPath(x, y, sw, gh);
                rectPath(x + gw - sw, y, sw, gh);
            }
            ctx.fill();
            zeros.length = 0;
            ones.length = 0;
        }
    };
    const draw = (now: number) => {
        const t = (now / 1000) * speed;
        const tf = t * 1.5 * flickerSpeed, tw = t * waveSpeed, tb = t * 0.35;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let gy = 0; gy < rows; gy++) {
            const v0 = gy * cellH;
            const rowWave = 0.6 * Math.sin(v0 * 0.02 + tw * 0.7);
            for (let gx = firstColumn; gx < lastColumn; gx++) {
                const k = gy * cols + gx, kd = kind[k];
                if (!kd)
                    continue;
                const u0 = gx * cellW;
                // digit state with crossfade
                const ph = tf + hash(gx, gy, 0);
                const kk = Math.floor(ph), f = ph - kk;
                const d0 = hash(gx, gy, kk * 7) < 0.5 ? 0 : 1, d1 = hash(gx, gy, kk * 7 + 7) < 0.5 ? 0 : 1;
                let mix = f < 0.65 ? 0 : (f - 0.65) / 0.35;
                mix = mix * mix * (3 - 2 * mix);
                if (kd === 3) {
                    // background: slow drifting field of dim digits — two large waves crossing, plus the coin glow / halo
                    const field = 0.5 + 0.5 * Math.sin(u0 * 0.006 + tb + 0.8 * Math.sin(v0 * 0.004 - tb * 0.6))
                        * (0.5 + 0.5 * Math.cos(v0 * 0.005 - tb * 0.8 + u0 * 0.002));
                    const dens = 0.12 + 0.45 * field * field;
                    let al = bgA[k];
                    if (nzArr[k] < dens)
                        al = Math.max(al, 0.02 + 0.06 * field * (0.5 + 0.5 * Math.sin(bgPhase[k] + tb * 2)));
                    if (al < 0.02)
                        continue;
                    const lv = Math.min(BG_LEVELS, Math.round(al / 0.3 * BG_LEVELS));
                    if (d0 === d1 || mix === 0)
                        bgBuckets[lv][d0].push(u0, v0);
                    else {
                        const l1 = Math.round(lv * (1 - mix)), l2 = Math.round(lv * mix);
                        if (l1)
                            bgBuckets[l1][d0].push(u0, v0);
                        if (l2)
                            bgBuckets[l2][d1].push(u0, v0);
                    }
                    continue;
                }
                let lum = base[k];
                if (!ringF[k]) {
                    const shm = 0.5 + 0.5 * Math.sin(u0 * 0.045 - tw * 2.2 + rowWave) * (0.6 + 0.4 * Math.sin(u0 * 0.012 + tw * 0.9 + v0 * 0.006));
                    lum *= 0.7 + 0.8 * Math.pow(shm, 1.6);
                }
                else
                    lum *= 1.5;
                if (lum < 0.05)
                    continue;
                const v = Math.min(1, lum / 1.15);
                const lv = Math.round(v * LEVELS);
                if (d0 === d1 || mix === 0)
                    buckets[lv][d0].push(u0, v0);
                else {
                    const l1 = Math.round(lv * (1 - mix)), l2 = Math.round(lv * mix);
                    if (l1)
                        buckets[l1][d0].push(u0, v0);
                    if (l2)
                        buckets[l2][d1].push(u0, v0);
                }
            }
        }
        flush(bgBuckets, bgPal);
        flush(buckets, palette);
    };
    if (image)
        buildHand(image);
    buildDepth();
    buildStatic();
    resize();
    return { draw, resize };
}
