'use strict';
// Hand-drawn canvas animation kit (rough.js line boil + 8-bit sprites).
// Scenes are pure functions of time: renderFrame(f) must draw the same pixels for the same f.
const VIDEO = Object.assign({ w: 1920, h: 1080, fps: 30, dur: 30 }, window.VIDEO || {});
const W = VIDEO.w, H = VIDEO.h, FPS = VIDEO.fps, DUR = VIDEO.dur;
const cv = document.getElementById('c');
cv.width = W; cv.height = H;
let ctx = cv.getContext('2d');
const rc = rough.canvas(cv);
// draw with the kit's 2D helpers (text, drawPixels, ...) into another context, e.g. an offscreen layer
function withCtx(g, fn) { const prev = ctx; ctx = g; try { fn(); } finally { ctx = prev; } }
const THEME = { ink: '#2f2f2f', paper: '#f7f6f3', dark: '#191919', light: '#f3f3ef', grid: 'rgba(47,47,47,.10)', gridDark: 'rgba(243,243,239,.07)' };
let T = 0;
const IMG = {}, BG = {};

// ---------------------------------------------------------------- math
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out: t => 1 - (1 - t) ** 3,
  in: t => t ** 3,
  inOut: t => (t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
  back: t => { const c = 2.2; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; },
};
function hash(a, b = 0) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}
function rnd(s) {
  let a = s >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mixHex = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - t) + parseInt(b.substr(i, 2), 16) * t).toString(16).padStart(2, '0')).join('');
const typed = (s, p) => { const a = [...s]; return a.slice(0, Math.round(a.length * clamp(p))).join(''); };
const bezAt = (a, c, b, t) => { const u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; };
const bez = (a, c, b, n = 28) => Array.from({ length: n + 1 }, (_, i) => bezAt(a, c, b, i / n));
// keys: [[time, ...values], ...] -> eased values at t
function camKeys(t, keys) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [t0, ...a] = keys[i - 1], [t1, ...b] = keys[i];
      const f = E.inOut((t - t0) / (t1 - t0));
      return a.map((v, j) => lerp(v, b[j], f));
    }
  }
  return keys[keys.length - 1].slice(1);
}

// ---------------------------------------------------------------- hand-drawn primitives
// line boil: every rough shape re-rolls its wobble `rate` times per second
function ro(id, o = {}, rate = 10) {
  return { stroke: THEME.ink, strokeWidth: 3, roughness: 1.2, bowing: 1, ...o, seed: (hash(id, Math.floor(T * rate)) % 2147483000) + 1 };
}
function polyPart(pts, p) {
  if (p >= 1) return pts;
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const target = L[L.length - 1] * p, out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (L[i] <= target) { out.push(pts[i]); continue; }
    const f = (target - L[i - 1]) / (L[i] - L[i - 1]);
    out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]);
    break;
  }
  return out;
}
function sketch(pts, p, id, o = {}, rate) {
  if (p <= 0) return;
  const q = polyPart(pts, p);
  if (q.length > 1) rc.linearPath(q, ro(id, o, rate));
}
function arrow(pts, p, id, o = {}) {
  sketch(pts, p, id, o);
  if (p < 1) return;
  const [x, y] = pts[pts.length - 1], [px, py] = pts[Math.max(0, pts.length - 4)];
  const a = Math.atan2(y - py, x - px), L = 34;
  rc.linearPath([[x + Math.cos(a + 2.6) * L, y + Math.sin(a + 2.6) * L], [x, y], [x + Math.cos(a - 2.6) * L, y + Math.sin(a - 2.6) * L]], ro(id + 1, o));
}
const circlePts = (cx, cy, rx, ry = rx, n = 48, a0 = -Math.PI / 2) =>
  Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(a0 + i / n * TAU * 1.06) * rx, cy + Math.sin(a0 + i / n * TAU * 1.06) * ry]);
function wave(x0, x1, y, t, ink, id, amp = 12, len = 90) {
  const pts = [];
  for (let x = x0; x <= x1; x += 15) pts.push([x, y + Math.sin((x / len) * TAU + t * 5) * amp]);
  rc.curve(pts, ro(id, { stroke: ink, strokeWidth: 3.5 }));
}
function radioWaves(x, y, t, ink, id, n = 3, reach = 160) {
  for (let k = 0; k < n; k++) {
    const ph = (t * 1.6 + k / n) % 1, r = 40 + ph * reach;
    ctx.save(); ctx.globalAlpha *= 1 - ph;
    rc.arc(x, y, r * 2, r * 2, -Math.PI * .85, -Math.PI * .58, false, ro(id + k, { stroke: ink, strokeWidth: 4 }));
    rc.arc(x, y, r * 2, r * 2, -Math.PI * .42, -Math.PI * .15, false, ro(id + 10 + k, { stroke: ink, strokeWidth: 4 }));
    ctx.restore();
  }
}
function highlight(x, y, w, h, p, id, color = 'rgba(255,214,64,.65)') {
  if (p <= 0) return;
  rc.rectangle(x, y, w * clamp(p), h, ro(id, { fill: color, fillStyle: 'zigzag', hachureGap: 7, fillWeight: 10, hachureAngle: -20, stroke: 'none', roughness: 2.2 }));
}
function shadow(x, y, w, dark = false) {
  if (w <= 0) return;
  ctx.save(); ctx.fillStyle = dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.14)';
  ctx.beginPath(); ctx.ellipse(x, y, w, w * .16, 0, 0, TAU); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- text
function measure(s, font, size, weight = '') { ctx.save(); ctx.font = `${weight} ${size}px ${font}`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
function text(s, x, y, o = {}) {
  if (!s) return;
  const { font = 'sans-serif', weight = '', size = 64, color = THEME.ink, align = 'center', base = 'middle', rot = 0, alpha = 1, reveal = 1, outline = null, ow = 12, jit = true, maxW = 0 } = o;
  if (alpha <= 0 || reveal <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y);
  const r = rnd(hash(Math.floor(T * 10), (x | 0) * 31 + (y | 0)));
  ctx.rotate(rot + (jit ? (r() - .5) * .014 : 0));
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align; ctx.textBaseline = base;
  if (maxW) { const w = ctx.measureText(s).width; if (w > maxW) ctx.scale(maxW / w, maxW / w); }
  if (reveal < 1) {
    const w = ctx.measureText(s).width, x0 = align === 'center' ? -w / 2 : align === 'right' ? -w : 0;
    ctx.beginPath(); ctx.rect(x0 - 10, -size * 1.5, (w + 20) * reveal, size * 3); ctx.clip();
  }
  if (outline) { ctx.lineJoin = 'round'; ctx.lineWidth = ow; ctx.strokeStyle = outline; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = color; ctx.fillText(s, 0, 0);
  ctx.restore();
}
// kinetic type: words pop in one after another over p = 0..1. colors: {wordIndex: colour}
function kwords(s, x, y, p, o = {}) {
  const { font = 'sans-serif', weight = '', size = 64, color = THEME.ink, colors = {}, align = 'center', gap = .28, alpha = 1 } = o;
  const words = s.split(' '), ws = words.map(w => measure(w, font, size, weight)), sp = size * gap;
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  words.forEach((w, i) => {
    const q = E.back(prog(p * (words.length + 2), i, i + 2.2));
    if (q > 0) text(w, cx + ws[i] / 2, y + (1 - q) * size * .5, { font, weight, size: size * (.6 + .4 * clamp(q, 0, 1.2)), color: colors[i] ?? color, alpha: alpha * clamp(q * 2), jit: false });
    cx += ws[i] + sp;
  });
}
// typewriter with a blinking cursor
function typeOn(s, x, y, p, o = {}) {
  const shown = typed(s, p), { font = 'sans-serif', weight = '', size = 64, color = THEME.ink, align = 'left' } = o;
  text(shown, x, y, { ...o, align, jit: false });
  if (p < 1.15 && Math.floor(T * 2.5) % 2 === 0) {
    const w = measure(shown, font, size, weight), x0 = align === 'center' ? x + w / 2 : align === 'right' ? x : x + w;
    ctx.save(); ctx.fillStyle = color; ctx.fillRect(x0 + size * .08, y - size * .45, size * .07, size * .9); ctx.restore();
  }
}
// karaoke line: syl = [[text, startSec], ...] (T is seconds since the scene started); sung part turns `on`
function karaoke(syl, x, y, t, o = {}) {
  const { font = 'sans-serif', weight = '800', size = 60, off = 'rgba(255,255,255,.55)', on = '#ffd84a', outline = 'rgba(0,0,0,.55)', align = 'center' } = o;
  const ws = syl.map(([s]) => measure(s, font, size, weight)), total = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  syl.forEach(([s, t0], i) => {
    const sung = t >= t0, pop = sung ? Math.max(0, 1 - (t - t0) * 6) : 0;
    text(s, cx + ws[i] / 2, y - pop * size * .12, { font, weight, size, color: sung ? on : off, outline, ow: size * .16, jit: false });
    cx += ws[i];
  });
}

// ---------------------------------------------------------------- camera & transitions
function cam(z = 1, cx = W / 2, cy = H / 2, rot = 0, sx = 0, sy = 0) {
  ctx.translate(W / 2 + sx, H / 2 + sy);
  if (rot) ctx.rotate(rot);
  ctx.scale(z, z);
  ctx.translate(-cx, -cy);
}
function shake(amp, id = 1) {
  if (amp <= .01) return [0, 0];
  const r = rnd(hash(Math.floor(T * 30), id));
  return [(r() - .5) * 2 * amp, (r() - .5) * 2 * amp];
}
function flash(a, color = '#fff') {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
function speedLines(amt, color = THEME.ink) {
  if (amt <= .02) return;
  const r = rnd(hash(Math.floor(T * 30), 77));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.globalAlpha = clamp(amt) * .55;
  for (let i = 0; i < 46; i++) {
    const y = r() * H, x = r() * W, l = 150 + r() * 700 * amt;
    ctx.lineWidth = 2 + r() * 7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y); ctx.stroke();
  }
  ctx.restore();
}
function zoomLines(amt, color = THEME.ink, cx = W / 2, cy = H / 2) {
  if (amt <= .02) return;
  const r = rnd(hash(Math.floor(T * 30), 78));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.globalAlpha = clamp(amt) * .6;
  for (let i = 0; i < 60; i++) {
    const a = r() * TAU, r0 = 260 + r() * 500 * (1 - amt * .5), r1 = r0 + 200 + r() * 700;
    ctx.lineWidth = 2 + r() * 6;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
  }
  ctx.restore();
}
// slanted ink band; sweep x0/x1 across the screen for a wipe
function inkBand(x0, x1, color = THEME.ink) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  rc.polygon([[x0, -80], [x1, -80], [x1 - 320, H + 80], [x0 - 320, H + 80]],
    ro(3500, { fill: color, fillStyle: 'solid', stroke: color, strokeWidth: 8, roughness: 2.5 }));
  ctx.restore();
}

// shape wipes for scene changes: p = 0..1 covers the screen with `color`
function circleWipe(p, color = THEME.paper, cx = W / 2, cy = H / 2) {
  if (p <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy, E.inOut(clamp(p)) * Math.hypot(W, H), 0, TAU); ctx.fill(); ctx.restore();
}
function wipe(p, color = THEME.paper, dir = 'right') {
  if (p <= 0) return;
  const q = E.inOut(clamp(p));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = color;
  if (dir === 'right') ctx.fillRect(0, 0, W * q, H);
  else if (dir === 'left') ctx.fillRect(W * (1 - q), 0, W * q, H);
  else if (dir === 'down') ctx.fillRect(0, 0, W, H * q);
  else ctx.fillRect(0, H * (1 - q), W, H * q);
  ctx.restore();
}
// map pin that drops in, then sends out a ripple ring
function pin(x, y, p, color = THEME.ink, s = 1) {
  if (p <= 0) return;
  const d = E.back(prog(p, 0, .35)), rp = prog(p, .3, 1);
  ctx.save(); ctx.translate(x, y - (1 - d) * 40 * s); ctx.globalAlpha *= clamp(d * 2);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -26 * s, 12 * s, Math.PI * .85, Math.PI * .15); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -26 * s, 4.5 * s, 0, TAU); ctx.fill();
  ctx.restore();
  if (rp > 0 && rp < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - rp; ctx.strokeStyle = color; ctx.lineWidth = 3 * s;
    ctx.beginPath(); ctx.ellipse(x, y, 10 * s + rp * 50 * s, (10 * s + rp * 50 * s) * .4, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
}

// ---------------------------------------------------------------- video clips
// footage as JPEG frame sequences in assets/clips/<id>/0001.jpg... (see references/styles/beat.md).
// Frames load on demand: a draw that misses records a pending load and renderFrame redraws once it arrives.
const CLIPS = {}, CLIP_CACHE = new Map();
let PENDING = [];
function clip(id, t, x, y, w, h, o = {}) {
  const c = CLIPS[id];
  if (!c) throw new Error('unknown clip: ' + id);
  const i = clamp(Math.floor(t * c.fps), 0, c.n - 1), src = `assets/clips/${id}/${String(i + 1).padStart(4, '0')}.jpg`;
  let im = CLIP_CACHE.get(src);
  if (!im) {
    im = new Image(); im.src = src; CLIP_CACHE.set(src, im);
    PENDING.push(im.decode());
    if (CLIP_CACHE.size > 400) CLIP_CACHE.delete(CLIP_CACHE.keys().next().value);
    return;
  }
  if (!im.complete) { PENDING.push(im.decode()); return; }
  // cover-fit crop into the box
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight), sw = w / s, sh = h / s;
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
  ctx.restore();
}

// ---------------------------------------------------------------- backgrounds
function makeBG(base, noise, fiber, vig) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  const r = rnd(7), img = g.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * noise; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  g.strokeStyle = fiber; g.globalAlpha = .08; g.lineWidth = 1;
  for (let i = 0; i < 700; i++) {
    const x = r() * W, y = r() * H, a = r() * TAU, l = 8 + r() * 36;
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a + 1) * l / 2, y + Math.sin(a + 1) * l / 2, x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  g.globalAlpha = 1;
  const v = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, Math.max(W, H) * .6);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, vig);
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  return c;
}
const paperBG = () => ctx.drawImage(BG.paper, 0, 0);
const darkBG = () => ctx.drawImage(BG.dark, 0, 0);
function grid(dark = false, step = 160) {
  const o = id => ro(id, { stroke: dark ? THEME.gridDark : THEME.grid, strokeWidth: 1.3, roughness: .7, bowing: 2 }, 4);
  for (let x = -4 * step; x <= W + 4 * step; x += step) rc.line(x, -3 * step, x + 6, H + 3 * step, o(600 + x));
  for (let y = -3 * step; y <= H + 3 * step; y += step) rc.line(-4 * step, y, W + 4 * step, y + 6, o(900 + y));
}

// ---------------------------------------------------------------- 8-bit sprites
// rows: strings, one char per pixel ('.' empty); pal: char -> colour or (x, y) => colour
function drawPixels(rows, pal, x, y, s, o = {}) {
  const { flip = false, sx = 1, sy = 1, rot = 0, outline = null, alpha = 1, swap = {} } = o;
  const h = rows.length, w = rows[0].length;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s * sx * (flip ? -1 : 1), s * sy); ctx.translate(-w / 2, -h);
  if (outline) {
    ctx.fillStyle = outline;
    rows.forEach((r, py) => [...r].forEach((c, px) => { if (c !== '.') ctx.fillRect(px - .35, py - .35, 1.7, 1.7); }));
  }
  rows.forEach((r, py) => [...r].forEach((c, px) => {
    if (c === '.') return;
    c = swap[c] ?? c;
    const v = pal[c];
    ctx.fillStyle = typeof v === 'function' ? v(px, py) : v;
    ctx.fillRect(px, py, 1.04, 1.04);
  }));
  ctx.restore();
}

// cast of mini characters: MINIS[key] = { name, color, body, pal, rows }
// E pixels hide on blink (drawn as `body`), C pixels blink by themselves (cursor, light)
const MINIS = {};
function drawMini(key, x, y, s, o = {}) {
  const m = MINIS[key];
  if (!m) throw new Error('unknown mini: ' + key);
  const swap = {};
  if (o.blink) swap.E = m.body;
  if (Math.floor(T * 3) % 2) swap.C = m.body;
  drawPixels(m.rows, m.pal, x, y, s, { ...o, swap });
}

// draw an image (e.g. a logo) as chunky pixels: px = screen pixels per block, 1 = normal
const PIXEL_BUF = document.createElement('canvas');
function pixelImage(img, cx, cy, w, h, px = 1) {
  if (px <= 1) { ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h); return; }
  const bw = Math.max(1, Math.round(w / px)), bh = Math.max(1, Math.round(h / px));
  PIXEL_BUF.width = bw; PIXEL_BUF.height = bh;
  PIXEL_BUF.getContext('2d').drawImage(img, 0, 0, bw, bh);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(PIXEL_BUF, cx - w / 2, cy - h / 2, w, h); ctx.restore();
}

// ---------------------------------------------------------------- UI props
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// a phone of height h centred at (x, y); draw(sx, sy, sw, sh) paints the screen, clipped to it
function phone(x, y, h, draw, o = {}) {
  const w = h * .49, r = h * .075, b = h * .018, sx = x - w / 2 + b, sy = y - h / 2 + b, sw = w - 2 * b, sh = h - 2 * b;
  ctx.save();
  if (o.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = h * .06; ctx.shadowOffsetY = h * .02; }
  ctx.fillStyle = o.body ?? '#0e0e10'; rr(x - w / 2, y - h / 2, w, h, r); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.strokeStyle = o.rim ?? 'rgba(255,255,255,.2)'; ctx.lineWidth = 2; rr(x - w / 2, y - h / 2, w, h, r); ctx.stroke(); ctx.restore();
  ctx.save(); rr(sx, sy, sw, sh, r - b); ctx.clip(); ctx.fillStyle = o.screen ?? '#000'; ctx.fillRect(sx, sy, sw, sh);
  draw?.(sx, sy, sw, sh);
  ctx.restore();
  ctx.save(); ctx.fillStyle = '#000'; rr(x - w * .13, sy + h * .012, w * .26, h * .028, h * .014); ctx.fill(); ctx.restore();
  return [sx, sy, sw, sh];
}
// pointer arrow with its tip at (x, y); press 0..1 squeezes it for a click
function cursor(x, y, press = 0, color = '#ffffff', s = 1) {
  const k = s * (1 - clamp(press) * .18);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 27); ctx.lineTo(7, 21); ctx.lineTo(12, 32); ctx.lineTo(17, 30); ctx.lineTo(12, 19); ctx.lineTo(21, 19); ctx.closePath();
  ctx.fillStyle = color; ctx.strokeStyle = color === '#ffffff' ? '#111' : '#fff'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.fill(); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- timeline & boot
let SCENES = [];
async function drawAt(t) {
  T = clamp(t, 0, DUR - 1e-6);
  const [a, , fn] = SCENES.find(([, b]) => T < b) ?? SCENES[SCENES.length - 1];
  for (let pass = 0; pass < 3; pass++) {
    PENDING = [];
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.save(); fn(T - a); ctx.restore();
    if (!PENDING.length) return;
    await Promise.all(PENDING);
  }
  throw new Error(`clip frames still missing at t=${T}`);
}
// window.VIDEO.blur = n averages n subframes spread over VIDEO.shutter (default .5) of a frame: real motion blur, n times the render cost
const ACC = document.createElement('canvas');
async function renderFrame(f) {
  const n = VIDEO.blur | 0;
  if (n < 2) return drawAt(f / FPS);
  if (ACC.width !== W) { ACC.width = W; ACC.height = H; }
  const g = ACC.getContext('2d'), sh = VIDEO.shutter ?? .5;
  for (let i = 0; i < n; i++) {
    await drawAt((f + (i / (n - 1) - .5) * sh) / FPS);
    g.globalAlpha = 1 / (i + 1); g.drawImage(cv, 0, 0);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(ACC, 0, 0);
}
// load font files without @font-face in index.html: [[family, 'assets/fonts/file.ttf'], ...]
async function useFonts(defs) {
  await Promise.all(defs.map(async ([family, url]) => { const f = new FontFace(family, `url(${url})`); await f.load(); document.fonts.add(f); }));
}
// fonts: [[family, sampleText]]; images: {key: path}; clips: {id: {n: frameCount, fps}}
async function boot({ scenes, images = {}, fonts = [], clips = {}, noise = 6, setup = null }) {
  SCENES = scenes;
  for (const [k, c] of Object.entries(clips)) CLIPS[k] = { fps: 30, ...c };
  for (const [k, src] of Object.entries(images)) { const im = new Image(); im.src = src; await im.decode(); IMG[k] = im; }
  // load every declared face up front: a bold face loaded on first use would draw that frame in a fallback font
  await Promise.all([...document.fonts].map(f => f.load()));
  await Promise.all(fonts.map(([f, sample]) => document.fonts.load(`40px ${f}`, sample)));
  BG.paper = makeBG(THEME.paper, noise, '#7a6a4a', 'rgba(60,45,20,.18)');
  BG.dark = makeBG(THEME.dark, noise * .8, '#9aa3b5', 'rgba(0,0,0,.45)');
  if (setup) await setup();
  window.READY = true;
  const q = new URLSearchParams(location.search);
  if (q.has('t')) renderFrame(Math.round(+q.get('t') * FPS));
  else if (q.has('play')) {
    const t0 = performance.now();
    const loop = () => { renderFrame(Math.floor((performance.now() - t0) / 1000 * FPS) % (FPS * DUR)); requestAnimationFrame(loop); };
    loop();
  }
}
