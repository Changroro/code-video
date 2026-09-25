'use strict';
// Particle look: thousands of glowing particles drift on a flow field and gather into words, logos, and numbers,
// then scatter and re-form. Positions are a pure function of time (no simulation state). Load after kit.js.
const PT = { bg: '#05060b', colors: ['#7fd7ff', '#b98cff', '#ffffff', '#ff8fd1'], n: 6000, size: 3, font: 'PSANS', seeds: null, cache: new Map() };

function ptSetup(n = PT.n) {
  const r = rnd(2024);
  PT.n = n; PT.seeds = new Float32Array(n * 6);
  for (let i = 0; i < n; i++) PT.seeds.set([r() * W, r() * H, r() * TAU, .5 + r(), r(), r()], i * 6);
}
// sample target points from anything drawn on an offscreen canvas: ptShape(key, g => { ... draw in white ... })
function ptShape(key, draw) {
  if (PT.cache.has(key)) return PT.cache.get(key);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true }); g.fillStyle = '#fff'; g.strokeStyle = '#fff';
  withCtx(g, () => draw(g));
  const d = g.getImageData(0, 0, W, H).data, pts = [], r = rnd(hash(key.length, 99));
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (d[(y * W + x) * 4 + 3] > 128) pts.push(x + r() * 3, y + r() * 3);
  // shuffle deterministically so any prefix of the list covers the whole shape
  for (let i = pts.length / 2 - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pts[2 * i], pts[2 * j]] = [pts[2 * j], pts[2 * i]]; [pts[2 * i + 1], pts[2 * j + 1]] = [pts[2 * j + 1], pts[2 * i + 1]]; }
  const out = new Float32Array(pts); PT.cache.set(key, out); return out;
}
// convenience: a line of text as a shape
const ptText = (s, x = W / 2, y = H / 2, size = 220, weight = 800) => ptShape(`t:${s}:${x}:${y}:${size}`, () => text(s, x, y, { font: PT.font, weight, size, color: '#fff', jit: false }));
// where particle i drifts at time t: a smooth pseudo-curl flow around its seed, wrapped to the screen
function ptFlow(i, t, speed = 1) {
  const s = PT.seeds, k = i * 6, x0 = s[k], y0 = s[k + 1], ph = s[k + 2], v = s[k + 3] * speed;
  let x = x0 + t * 38 * v + 70 * Math.sin(y0 * .004 + t * .6 * v + ph) + 40 * Math.sin(x0 * .007 - t * .9 + ph * 2);
  let y = y0 + 60 * Math.sin(x0 * .005 + t * .7 * v + ph) + 30 * Math.cos(y0 * .006 + t * 1.1);
  x = ((x % (W + 80)) + W + 80) % (W + 80) - 40; y = ((y % (H + 80)) + H + 80) % (H + 80) - 40;
  return [x, y];
}
// draw the field. form 0..1 pulls particles from the flow into `shape` (from ptShape/ptText); `from` morphs shape→shape
function ptField(t, { shape = null, form = 0, from = null, morph = 0, burst = null, color = null, trail = .08, glow = true, alpha = 1 } = {}) {
  if (!PT.seeds) ptSetup();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const cols = PT.colors, n = PT.n, s = PT.seeds;
  for (let c = 0; c < cols.length; c++) {
    ctx.strokeStyle = color ?? cols[c]; ctx.globalAlpha = alpha * (c === 2 ? .95 : .8); ctx.lineWidth = PT.size * (c === 2 ? .8 : 1); ctx.beginPath();
    for (let i = c; i < n; i += cols.length) {
      const pos = tt => {
        let [x, y] = ptFlow(i, tt);
        const f = E.inOut(clamp(form * (1.25 - s[i * 6 + 4] * .25)));
        if (shape && f > 0) {
          const m = shape.length / 2, j = (i % m) * 2;
          let tx = shape[j], ty = shape[j + 1];
          if (from && morph < 1) { const mf = from.length / 2, jf = (i % mf) * 2, q = E.inOut(clamp(morph * (1.3 - s[i * 6 + 5] * .3))); tx = lerp(from[jf], tx, q); ty = lerp(from[jf + 1], ty, q); }
          const wob = 2.2 * (1 - f * .6);
          x = lerp(x, tx + Math.sin(tt * 3 + i) * wob, f); y = lerp(y, ty + Math.cos(tt * 2.6 + i) * wob, f);
        }
        if (burst) { const [bx, by, bp] = burst, a = s[i * 6 + 2], d = E.out(clamp(bp)) * (300 + s[i * 6 + 4] * 900); x += Math.cos(a) * d; y += Math.sin(a) * d; }
        return [x, y];
      };
      const [x1, y1] = pos(t), [x0, y0] = pos(t - trail), wrapped = Math.abs(x1 - x0) + Math.abs(y1 - y0) > 120;
      ctx.moveTo(wrapped ? x1 - .01 : x0, wrapped ? y1 : y0); ctx.lineTo(x1 + .01, y1);   // a wrap across the screen draws as a dot, not a streak
    }
    ctx.stroke();
  }
  ctx.restore();
  if (glow) ptGlow();
}
// bloom: a blurred copy of the frame added on top
const PT_BUF = document.createElement('canvas');
function ptGlow(strength = 1.1, blur = 14) {
  PT_BUF.width = W / 4; PT_BUF.height = H / 4;
  const g = PT_BUF.getContext('2d'); g.filter = `blur(${blur / 4}px)`; g.drawImage(cv, 0, 0, W / 4, H / 4);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = strength; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(PT_BUF, 0, 0, W, H); ctx.restore();
}
function ptBG() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PT.bg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// crisp caption under a formed shape, fading in once the particles settle
function ptCaption(s, y, p, { size = 40, color = '#cfd8ff' } = {}) { text(s, W / 2, y, { font: PT.font, size, color, alpha: clamp(p), jit: false }); }
