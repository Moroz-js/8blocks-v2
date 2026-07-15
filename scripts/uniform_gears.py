"""One-off: rebuild gear rims from the original art with mathematically even teeth.

Takes one angular sector of the rim and repeats it N times around the circle,
leaving the inner part (spokes, hub) untouched. Output: *-uniform.png
"""
import math

import numpy as np
from PIL import Image


def uniformize(src, dst, n_teeth, r_fix_frac):
    im = Image.open(src).convert('RGBA')
    a = np.asarray(im).astype(np.float64)  # H,W,4
    H, W = a.shape[:2]
    cx, cy = (W - 1) / 2.0, (H - 1) / 2.0

    alpha = a[..., 3]
    yy, xx = np.mgrid[0:H, 0:W]
    dx, dy = xx - cx, yy - cy
    r = np.hypot(dx, dy)
    th = np.arctan2(dy, dx)  # -pi..pi

    # angular radius profile to find a gap center (cleanest sector boundary)
    N = 2880
    bins = ((th + math.pi) / (2 * math.pi) * N).astype(int) % N
    rad = np.zeros(N)
    mask = alpha > 60
    np.maximum.at(rad, bins[mask], r[mask])
    k = 9
    ker = np.ones(2 * k + 1) / (2 * k + 1)
    sm = np.convolve(np.concatenate([rad[-k:], rad, rad[:k]]), ker, 'valid')
    thr = sm.min() + (sm.max() - sm.min()) * 0.5
    below = sm < thr

    # gap centers (angular midpoints of below-threshold runs)
    gap_centers = []
    falls = np.where((~below) & np.roll(below, -1))[0]  # last index before gap
    for f in falls:
        j = (f + 1) % N
        ln = 0
        while below[j % N] and ln < N:
            j += 1
            ln += 1
        gap_centers.append(((f + 1 + ln / 2.0) % N) / N * 2 * math.pi - math.pi)
    gap_centers.sort()

    # pick the sector between adjacent gaps whose width is closest to the ideal
    # pitch; remember its actual width so we can stretch it to exactly one pitch
    delta = 2 * math.pi / n_teeth
    t0, w0 = 0.0, delta
    best = 1e9
    for i in range(len(gap_centers)):
        g0 = gap_centers[i]
        g1 = gap_centers[(i + 1) % len(gap_centers)]
        width = (g1 - g0) % (2 * math.pi)
        if abs(width - delta) < best:
            best = abs(width - delta)
            t0, w0 = g0, width

    r_max = rad.max()
    r_fix = r_max * r_fix_frac  # radius where symmetrized annulus starts
    blend_w = r_max * 0.02

    # fold all sectors onto the reference one, stretching the reference sector
    # (actual width w0) to exactly one ideal pitch so the wrap is seamless
    th_m = t0 + np.mod(th - t0, delta) * (w0 / delta)
    sx = cx + r * np.cos(th_m)
    sy = cy + r * np.sin(th_m)

    x0 = np.clip(np.floor(sx).astype(int), 0, W - 2)
    y0 = np.clip(np.floor(sy).astype(int), 0, H - 2)
    fx = np.clip(sx - x0, 0, 1)[..., None]
    fy = np.clip(sy - y0, 0, 1)[..., None]
    s = (a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x0 + 1] * fx * (1 - fy)
         + a[y0 + 1, x0] * (1 - fx) * fy + a[y0 + 1, x0 + 1] * fx * fy)

    w = np.clip((r - r_fix) / blend_w, 0, 1)[..., None]
    out = a * (1 - w) + s * w
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst)
    print('saved', dst)


if __name__ == '__main__':
    uniformize('public/img/huge.png', 'public/img/huge-uniform.png', 27, 0.84)
    uniformize('public/img/tiny.png', 'public/img/tiny-uniform.png', 12, 0.70)
