'use strict';
// Torn-paper collage: pictures built from torn scraps of watercolour-tinted paper that land one by one on a
// cold-press sheet. Each scrap is cached as a small bitmap (torn edge, white fibre rim, wash, grain, shadow), so a
// frame only places bitmaps. Pure function of time. Load after kit.js.
// Fonts: CL.serif (Source Serif 4 / Nanum Myeongjo) for set type, CL.hand (Caveat / Gaegu) for pencil notes.
const CL = { paper: '#f1ece1', ink: '#3a3833', rim: '#fbf8f1', shadow: 'rgba(70,52,30,.30)', strip: '#f7f2e6',
  sky: '#b8c9da', sea: '#6f8dab', sand: '#e2cfa8', sun: '#efc25c', stone: '#8e8b85', slate: '#5f6570', moss: '#8b8d5c', rust: '#c7684e',
  serif: 'SERIF', hand: 'SCRIPT', cache: new Map() };

const clKey = s => [...String(s)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
const clPath = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };

// cold-press watercolour paper, built once
function clSheet() {
  if (!BG.cold) {
    const c = BG.cold = makeBG(CL.paper, 7, '#8a7a5a', 'rgba(90,70,40,.10)'), g = c.getContext('2d'), r = rnd(31);
    for (let i = 0; i < 9000; i++) {   // the paper's tooth: soft light and dark bumps
      g.fillStyle = r() < .5 ? 'rgba(255,255,255,.05)' : 'rgba(90,70,40,.035)';
      g.beginPath(); g.ellipse(r() * W, r() * H, 2 + r() * 6, 1.5 + r() * 4, r() * TAU, 0, TAU); g.fill();
    }
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BG.cold, 0, 0); ctx.restore();
}

// a jagged outline around a polygon: slow wander plus fine fibres along every edge
function tornOutline(pts, seed, rough = 1) {
  const r = rnd(seed), out = [];
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length], len = Math.hypot(x1 - x0, y1 - y0) || 1, n = Math.max(2, Math.round(len / 6));
    const nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
    let drift = 0;
    for (let k = 0; k < n; k++) {
      drift = drift * .75 + (r() - .5) * 1.8 * rough;
      const d = drift * 2.4 + (r() - .5) * 1.4 * rough, u = k / n;
      out.push([lerp(x0, x1, u) + nx * d, lerp(y0, y1, u) + ny * d]);
    }
  });
  return out;
}

const CL_GRAIN = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), img = g.createImageData(256, 256), r = rnd(5);
  for (let i = 0; i < img.data.length; i += 4) { const v = 200 + r() * 55; img.data.set([v, v, v, 255], i); }
  g.putImageData(img, 0, 0); return c;
})();

// build (once) the bitmap of a scrap with corners `pts` in screen pixels and tint `color` (#rrggbb)
function clBitmap(key, pts, color) {
  const id = `${key}|${color}`;
  if (CL.cache.has(id)) return CL.cache.get(id);
  const pad = 16, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, w = Math.ceil(Math.max(...xs) + pad - x0), h = Math.ceil(Math.max(...ys) + pad - y0);
  const seed = clKey(id), r = rnd(seed), cx = xs.reduce((a, b) => a + b) / xs.length, cy = ys.reduce((a, b) => a + b) / ys.length;
  const local = pts.map(([x, y]) => [x - x0, y - y0]), lcx = cx - x0, lcy = cy - y0;
  // the tear exposes the white core unevenly: the tinted face is shrunk and nudged to one side
  const a = r() * TAU, nudge = 1.5 + r() * 2.5;
  const face = local.map(([x, y]) => [lerp(x, lcx, .025) + Math.cos(a) * nudge, lerp(y, lcy, .025) + Math.sin(a) * nudge]);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.save(); g.shadowColor = CL.shadow; g.shadowBlur = 7; g.shadowOffsetX = 2; g.shadowOffsetY = 3;
  clPath(g, tornOutline(local, seed, 1)); g.fillStyle = CL.rim; g.fill(); g.restore();
  g.save(); clPath(g, tornOutline(face, seed + 1, 1.2)); g.clip();
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 7; i++) {   // watercolour wash: soft blotches, lighter and darker
    const bx = r() * w, by = r() * h, br = (.25 + r() * .5) * Math.max(w, h), gr = g.createRadialGradient(bx, by, 0, bx, by, br);
    gr.addColorStop(0, mixHex(color, r() < .55 ? '#ffffff' : '#20242c', .16 + r() * .2) + 'aa'); gr.addColorStop(1, color + '00');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
  g.globalAlpha = .35; g.strokeStyle = mixHex(color, '#ffffff', .3); g.lineWidth = 2;   // dry-brush streaks along the scrap
  for (let i = 0; i < 4; i++) { const yy = r() * h; g.beginPath(); g.moveTo(0, yy); g.bezierCurveTo(w * .3, yy + (r() - .5) * 10, w * .7, yy + (r() - .5) * 10, w, yy + (r() - .5) * 8); g.stroke(); }
  g.globalAlpha = .55; g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(CL_GRAIN, 'repeat'); g.fillRect(0, 0, w, h);
  g.restore();
  const b = { c, x0, y0, cx, cy, seed }; CL.cache.set(id, b); return b;
}

// place a scrap: it lands at `at` (lifted, turned, sliding in from a seeded side) and, with `out`, peels off again.
// paint(p) draws on the scrap in its own frame (origin at its centre), so type and marks travel with it.
function scrap(key, pts, color, t, at, { dur = .5, rot = 0, out = null, from = null, alpha = 1, paint = null } = {}) {
  const b = clBitmap(key, pts, color), p = prog(t, at, at + dur);
  if (p <= 0) return;
  const q = out == null ? 0 : E.in(prog(t, out, out + .45));
  if (q >= 1) return;
  const r = rnd(b.seed + 7), dir = r() * TAU, [fx, fy] = from ?? [Math.cos(dir) * (60 + r() * 90), Math.sin(dir) * (40 + r() * 60) - 50];
  const k = E.out(p), turn = (r() - .5) * .5, lift = (1 - k) * .14 + q * .1;
  ctx.save();
  ctx.globalAlpha = alpha * Math.min(1, p * 4) * (1 - q);
  ctx.translate(b.cx + fx * (1 - k) - fx * q * 2, b.cy + fy * (1 - k) - 160 * q);
  ctx.rotate(rot + turn * (1 - k) - turn * q);
  ctx.scale(1 + lift, 1 + lift);
  ctx.drawImage(b.c, b.x0 - b.cx, b.y0 - b.cy);
  if (paint) paint(p);
  ctx.restore();
}
// a rough rectangle / a torn disc
function scrapRect(key, x, y, w, h, color, t, at, o = {}) {
  const r = rnd(clKey(key)), j = () => (r() - .5) * Math.min(w, h) * .12;
  scrap(key, [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + h + j()], [x + j(), y + h + j()]], color, t, at, o);
}
function scrapCircle(key, cx, cy, rad, color, t, at, o = {}) { scrap(key, circlePts(cx, cy, rad, rad, 24), color, t, at, o); }

// horizontal torn bands filling a box (sky, sea, fields): colours cycle, strips overlap and vary in length
function clStrips(key, x, y, w, h, colors, t, at, { n = 6, stagger = .08, order = 'down', out = null } = {}) {
  const r = rnd(clKey(key)), bh = h / n;
  for (let i = 0; i < n; i++) {
    const inset = r() * w * .18, len = w - inset - r() * w * .12, k = order === 'up' ? n - 1 - i : i;
    scrapRect(`${key}:${i}`, x + inset, y + i * bh - bh * .15, len, bh * 1.3, colors[i % colors.length], t, at + k * stagger, { out: out == null ? null : out + k * stagger * .5 });
  }
}

// fill a polygon with small overlapping scraps (rocks, crowds, foliage); they land in a sweep along `order`
function clMosaic(key, poly, colors, t, at, { size = 70, spread = 1.2, order = 'x', out = null } = {}) {
  const pieces = clMosaicPieces(key, poly, colors, size);
  for (const pc of pieces) {
    const s = order === 'y' ? pc.v : order === 'random' ? pc.rand : pc.u;
    scrap(pc.key, pc.pts, pc.color, t, at + s * spread, { out: out == null ? null : out + s * .4 });
  }
}
function clMosaicPieces(key, poly, colors, size) {
  const id = `m:${key}:${size}`;
  if (CL.cache.has(id)) return CL.cache.get(id);
  const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), mx = Math.min(...xs), Mx = Math.max(...xs), my = Math.min(...ys), My = Math.max(...ys);
  const r = rnd(clKey(key)), out = [];
  for (let y = my; y < My; y += size * .55) for (let x = mx; x < Mx; x += size * .8) {
    const px = x + (r() - .5) * size * .6, py = y + (r() - .5) * size * .4;
    if (!inside(px, py)) continue;
    const w = size * (.8 + r() * .7), h = size * (.45 + r() * .35), a = (r() - .5) * .7, ca = Math.cos(a), sa = Math.sin(a), m = 4 + Math.floor(r() * 3);
    const pts = Array.from({ length: m }, (_, i) => { const th = (i + r() * .6) / m * TAU, k = .75 + r() * .35; return [Math.cos(th) * w / 2 * k, Math.sin(th) * h / 2 * k]; })
      .map(([u, v]) => [px + u * ca - v * sa, py + u * sa + v * ca]);
    out.push({ key: `${key}:${out.length}`, pts, color: colors[Math.floor(r() * colors.length)], u: (px - mx) / (Mx - mx || 1) + r() * .15, v: (py - my) / (My - my || 1) + r() * .15, rand: r() });
  }
  out.sort((a, b) => a.pts[0][1] - b.pts[0][1]);   // lower scraps overlap the ones above
  CL.cache.set(id, out); return out;
}

// an image (logo, photo, screenshot) rebuilt as torn scraps sampled on a cols × rows grid
function clImage(key, img, x, y, w, h, t, at, { cols = 22, spread = 1.2, wash = .12, out = null } = {}) {
  const id = `i:${key}:${cols}`;
  let cells = CL.cache.get(id);
  if (!cells) {
    const rows = Math.max(1, Math.round(cols * h / w)), c = document.createElement('canvas'); c.width = cols; c.height = rows;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, cols, rows);
    const d = g.getImageData(0, 0, cols, rows).data, cw = w / cols, ch = h / rows, r = rnd(clKey(key));
    cells = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4; if (d[k + 3] < 128) continue;
      const hex = '#' + [d[k], d[k + 1], d[k + 2]].map(v => v.toString(16).padStart(2, '0')).join('');
      const cx = x + (i + .5) * cw, cy = y + (j + .5) * ch, sw = cw * (1.15 + r() * .35), sh = ch * (1.1 + r() * .3), jx = (r() - .5) * cw * .2, jy = (r() - .5) * ch * .2;
      cells.push({ key: `${key}:${i}:${j}`, color: mixHex(hex, CL.paper, wash), pts: [[cx - sw / 2 + jx, cy - sh / 2], [cx + sw / 2, cy - sh / 2 + jy], [cx + sw / 2 - jx, cy + sh / 2], [cx - sw / 2, cy + sh / 2 - jy]], s: (j / rows) * .6 + (i / cols) * .4 + r() * .2 });
    }
    CL.cache.set(id, cells);
  }
  for (const c of cells) scrap(c.key, c.pts, c.color, t, at + c.s * spread, { dur: .35, out: out == null ? null : out + c.s * .4 });
}

// words set in serif ink, each on its own torn strip, landing one after another
function clWords(s, x, y, t, at, { size = 72, color = CL.ink, strip = CL.strip, stagger = .16, align = 'center', out = null, font = CL.serif, weight = 600 } = {}) {
  const words = s.split(' '), pad = size * .28, gap = size * .22, ws = words.map(wd => measure(wd, font, size, weight) + pad * 2);
  const total = ws.reduce((a, b) => a + b) + gap * (words.length - 1);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  words.forEach((wd, i) => {
    const w = ws[i], h = size * 1.35, key = `w:${s}:${i}:${x | 0}:${y | 0}`, rot = (rnd(clKey(key))() - .5) * .06;
    scrapRect(key, cx, y - h / 2, w, h, strip, t, at + i * stagger, { rot, out: out == null ? null : out + i * .05,
      paint: p => text(wd, 0, size * .04, { font, weight, size, color, alpha: E.out(prog(p, .3, 1)), jit: false, base: 'middle' }) });
    cx += w + gap;
  });
}

// scene change: a fresh sheet with a torn left edge slides over from the right; drawNext paints the next scene
function clPeel(p, drawNext) {
  if (p <= 0) return;
  if (p >= 1) { drawNext(); return; }
  const x = lerp(W + 40, -140, E.inOut(p)), edge = tornOutline([[x, -30], [W + 200, -30], [W + 200, H + 30], [x, H + 30]], 77, 3.2);
  ctx.save(); ctx.shadowColor = CL.shadow; ctx.shadowBlur = 22; ctx.shadowOffsetX = -6;
  clPath(ctx, edge.map(([px, py]) => [px - 7, py])); ctx.fillStyle = CL.rim; ctx.fill(); ctx.restore();
  ctx.save(); clPath(ctx, edge); ctx.clip(); drawNext(); ctx.restore();
}
