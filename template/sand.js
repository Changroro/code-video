'use strict';
// Sand art on a backlit light table, after @Michaelzsguo's sand animation (docs/styles/sand.jpg).
// Load after kit.js and call sandSetup() from boot({ setup }).
// Per frame: draw the scene's silhouettes and captions into the layer returned by sandClear()
// (any colour; alpha = how much sand), then sandFrame(reveal, sweep, dir, o) pours, sweeps, or scatters it onto the table.
const SAND = { lit: '#f3dcae', edge: '#9b7648', ink: '#2e2014', serif: 'SERIF', serifItalic: 'SERIF_I',
  grainSize: 2, tableGrain: .16, edgeGrain: .6, table: null, g: null, noise: null, grain: null };

function sandSetup() {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  SAND.g = c.getContext('2d', { willReadFrequently: true });
  // low-frequency noise (a tiny random image scaled up smoothly) shapes the pour and sweep edges
  const sw = Math.ceil(W / 24), sh = Math.ceil(H / 24), small = document.createElement('canvas');
  small.width = sw; small.height = sh;
  const sg = small.getContext('2d'), im = sg.createImageData(sw, sh), r = rnd(11);
  for (let i = 0; i < im.data.length; i += 4) { im.data[i] = im.data[i + 1] = im.data[i + 2] = r() * 255; im.data[i + 3] = 255; }
  sg.putImageData(im, 0, 0);
  const big = document.createElement('canvas'); big.width = W; big.height = H;
  const bg = big.getContext('2d', { willReadFrequently: true });
  bg.imageSmoothingQuality = 'high'; bg.drawImage(small, 0, 0, W, H);
  const lf = bg.getImageData(0, 0, W, H).data;
  // grain in grainSize-pixel clumps, so it reads as sand at 1080p rather than as sensor noise
  const gs = SAND.grainSize, gw = Math.ceil(W / gs), clumps = new Float32Array(gw * Math.ceil(H / gs)).map(() => r() - .5);
  SAND.noise = new Float32Array(W * H); SAND.grain = new Float32Array(W * H);
  for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) { SAND.noise[i] = lf[i * 4] / 255; SAND.grain[i] = clumps[((y / gs) | 0) * gw + ((x / gs) | 0)] * .7 + (r() - .5) * .3; }
  // the glowing table: warm centre, darker rim
  const t = document.createElement('canvas'); t.width = W; t.height = H;
  const tg = t.getContext('2d'), gr = tg.createRadialGradient(W / 2, H * .45, H * .1, W / 2, H / 2, Math.hypot(W, H) * .6);
  gr.addColorStop(0, SAND.lit); gr.addColorStop(1, SAND.edge);
  tg.fillStyle = gr; tg.fillRect(0, 0, W, H);
  SAND.table = t;
}

function sandClear() {
  SAND.g.setTransform(1, 0, 0, 1, 0, 0); SAND.g.globalAlpha = 1; SAND.g.globalCompositeOperation = 'source-over';
  SAND.g.clearRect(0, 0, W, H);
  return SAND.g;
}

// reveal 0..1: sand pours in, patchy at first. sweep 0..1: a hand pushes it off along dir = [dx, dy], leaving a ridge.
// o.scatter 0..1: the picture breaks into grains that blow away along o.wind (default up and right) - the signature scene change.
// o.light scales the table's brightness (dusk, night interiors).
function sandFrame(reveal = 1, sweep = 0, dir = [1, 0], o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(SAND.table, 0, 0); ctx.restore();
  const d = SAND.g.getImageData(0, 0, W, H).data, out = ctx.getImageData(0, 0, W, H), px = out.data;
  const ink = [1, 3, 5].map(k => parseInt(SAND.ink.substr(k, 2), 16)), light = o.light ?? 1, sc = o.scatter ?? 0;
  const n = SAND.noise, gr = SAND.grain, front = sweep * 1.5 - .25, mag = Math.hypot(dir[0], dir[1]) || 1;
  const dx = dir[0] / mag, dy = dir[1] / mag, off = (dx < 0 ? -dx : 0) + (dy < 0 ? -dy : 0), tg = SAND.tableGrain, eg = SAND.edgeGrain;
  for (let y = 0, i = 0; y < H; y++) {
    for (let x = 0; x < W; x++, i++) {
      const j = i * 4;
      let a = d[j + 3] / 255;
      if (a > 0) a *= clamp((reveal * 1.3 - n[i]) * 5);
      if (sc > 0 && a > 0 && n[i] + (x / W) * .25 < sc * 1.45) a = 0;
      if (sweep > 0) {
        const s = (x / W) * dx + (y / H) * dy + off + (n[i] - .5) * .18;
        if (s < front) a = 0;
        else a = Math.max(a, Math.exp(-(((s - front) / .025) ** 2)) * .75 * (sweep < 1 ? 1 : 0));
      }
      if (a > 0) a = clamp(a * (.9 + gr[i] * .6) + gr[i] * eg * 4 * a * (1 - a));
      const lit = light * (1 + gr[i] * tg);
      px[j] = (px[j] * lit) * (1 - a) + ink[0] * a;
      px[j + 1] = (px[j + 1] * lit) * (1 - a) + ink[1] * a;
      px[j + 2] = (px[j + 2] * lit) * (1 - a) + ink[2] * a;
    }
  }
  ctx.putImageData(out, 0, 0);
  if (sc > 0) sandGrains(d, sc, o.wind ?? [.55, -1]);
}
// the grains in flight during a scatter: sampled from the layer on a sparse grid, carried by the wind with a little swirl
function sandGrains(d, sc, wind) {
  const n = SAND.noise, gr = SAND.grain, r = rnd(99);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = SAND.ink;
  for (let y = 4; y < H; y += 9) for (let x = 4; x < W; x += 9) {
    const i = y * W + x, a = d[i * 4 + 3] / 255;
    if (a < .35) continue;
    const go = sc * 1.45 - (n[i] + (x / W) * .25);
    if (go <= 0 || go > .9) continue;
    const k = go / .9, sz = 1.5 + r() * 2.5, sw = Math.sin(y * .05 + k * 6) * 40 * k;
    ctx.globalAlpha = (1 - k) * .85;
    ctx.fillRect(x + wind[0] * k * 900 + sw + gr[i] * 30, y + wind[1] * k * 700 + gr[i] * 30, sz, sz);
  }
  ctx.restore();
}
// light rays: a haze of sand over the sky with bright wedges carved out around a sun at (cx, cy). Draw into the layer.
function sandRays(g, cx, cy, p = 1, { n = 22, haze = .32, sun = 90 } = {}) {
  g.save();
  g.globalAlpha = haze * p; g.fillStyle = '#000'; g.fillRect(0, 0, W, cy + sun * 3);
  g.globalAlpha = 1; g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + T * .05, wdt = .035 + (i % 3) * .015;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a - wdt) * W, cy + Math.sin(a - wdt) * W); g.lineTo(cx + Math.cos(a + wdt) * W, cy + Math.sin(a + wdt) * W); g.closePath();
    g.globalAlpha = .55 * p; g.fill();
  }
  const s = g.createRadialGradient(cx, cy, 0, cx, cy, sun * 2.2); s.addColorStop(0, 'rgba(0,0,0,1)'); s.addColorStop(1, 'rgba(0,0,0,0)');
  g.globalAlpha = p; g.fillStyle = s; g.fillRect(cx - sun * 3, cy - sun * 3, sun * 6, sun * 6);
  g.restore();
}
// carve light out of the sand: night skies are a full layer with the moon and stars cut out
function sandCut(g, fn) { g.save(); g.globalCompositeOperation = 'destination-out'; withCtx(g, fn); g.restore(); }
// the year in an old-style serif and an italic line under it, in a corner of the table. Draw into the layer.
function sandYear(g, year, sub, { corner = 'tl', size = 66, alpha = 1 } = {}) {
  const right = corner.includes('r'), x = right ? W - 90 : 90, y = corner.includes('b') ? H - 150 : 96;
  withCtx(g, () => {
    text(year, x, y, { font: SAND.serif, weight: '500', size, color: '#000', align: right ? 'right' : 'left', alpha, jit: false });
    if (sub) text(sub, x + (right ? -4 : 4), y + size * .66, { font: SAND.serifItalic, size: size * .42, color: '#000', align: right ? 'right' : 'left', alpha: alpha * .9, jit: false });
  });
}
