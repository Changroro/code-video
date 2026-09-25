'use strict';
// UI morph: one shape that never cuts, morphing through UI states (button, loader, player, slider, toggle, tabs, chart,
// command palette, toast) on a beat grid while a cursor drives every change. Every animated value is a sum of
// closed-form spring step responses, so a frame is a pure function of time. Load after kit.js.
// After @twoclipping's UI motion study (docs/styles/uimorph.jpg). Fonts: UM.font (Geist / Pretendard), UM.mono (Geist Mono).
const UM = { bg: '#ecebe7', ink: '#0b0b0b', card: '#ffffff', dim: '#8d8c88', line: '#e6e5e1', font: 'UI', mono: 'UIMONO',
  bpm: 120, t0: 0, k: 170, c: 22 };
const beat = n => UM.t0 + n * 60 / UM.bpm;

// the step response of a unit spring (mass 1, stiffness k, damping c) released at tau = 0; the default barely overshoots
function springStep(tau, k = UM.k, c = UM.c) {
  if (tau <= 0) return 0;
  const w = Math.sqrt(k), z = c / (2 * w);
  if (z < 1) { const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + z * w / wd * Math.sin(wd * tau)); }
  if (z === 1) return 1 - Math.exp(-w * tau) * (1 + w * tau);
  const s = Math.sqrt(z * z - 1), r1 = -w * (z - s), r2 = -w * (z + s);
  return 1 + (r2 * Math.exp(r1 * tau) - r1 * Math.exp(r2 * tau)) / (r1 - r2);
}
// a value that changes target at each key: [[t, v], ...] with v a number, an array, or '#rrggbb'.
// It is the first value plus one spring per change, so retargeting mid-flight stays smooth and pure.
function spring(t, keys, { k = UM.k, c = UM.c } = {}) {
  const hex = typeof keys[0][1] === 'string', val = v => (hex ? [1, 3, 5].map(i => parseInt(v.substr(i, 2), 16)) : v);
  let out = val(keys[0][1]);
  const arr = Array.isArray(out);
  out = arr ? [...out] : out;
  for (let i = 1; i < keys.length; i++) {
    const s = springStep(t - keys[i][0], k, c);
    if (!s) continue;
    const a = val(keys[i - 1][1]), b = val(keys[i][1]);
    if (arr) for (let j = 0; j < out.length; j++) out[j] += (b[j] - a[j]) * s; else out += (b - a) * s;
  }
  return hex ? `rgb(${out.map(v => Math.round(clamp(v, 0, 255))).join(',')})` : out;
}
// a segment whose edges ride different springs: the edge in the direction of travel leads, the other trails (tabs, toggle knob)
function stretch(t, keys, { lead = [260, 30], trail = [110, 20] } = {}) {
  let x0 = keys[0][1], x1 = keys[0][2];
  for (let i = 1; i < keys.length; i++) {
    const [ti, a1, b1] = keys[i], [, a0, b0] = keys[i - 1], right = (a1 + b1) > (a0 + b0), [L, T] = right ? [trail, lead] : [lead, trail];
    x0 += (a1 - a0) * springStep(t - ti, ...L); x1 += (b1 - b0) * springStep(t - ti, ...T);
  }
  return [x0, x1];
}

// the morphing container. keys: [[t, { x, y, w, h, r, fill }], ...] with (x, y) the centre. Draws it and returns the live box;
// pass the box to umClip so content stays inside while the shape morphs.
function umShape(t, keys, { shadow = true } = {}) {
  const pick = f => keys.map(([kt, s]) => [kt, s[f]]);
  const b = { x: spring(t, pick('x')), y: spring(t, pick('y')), w: Math.max(1, spring(t, pick('w'))), h: Math.max(1, spring(t, pick('h'))), r: Math.max(0, spring(t, pick('r'))), fill: spring(t, pick('fill')) };
  b.r = Math.min(b.r, b.w / 2, b.h / 2); b.x0 = b.x - b.w / 2; b.y0 = b.y - b.h / 2;
  ctx.save();
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.10)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14; }
  rr(b.x0, b.y0, b.w, b.h, b.r); ctx.fillStyle = b.fill; ctx.fill();
  ctx.restore();
  return b;
}
// the camera zoom that makes a w × h state fill `fill` of the frame, capped so small states stay small: CAM = SHAPE.map(([t, s]) => [t, umFit(s.w, s.h)])
const umFit = (w, h, fill = .6, max = 2.2) => Math.min(max, W * fill / w, H * fill / h);
function umClip(b, draw) { ctx.save(); rr(b.x0, b.y0, b.w, b.h, b.r); ctx.clip(); draw(); ctx.restore(); }

// content that lives from t0 to t1 and swaps with a short blur: draw(alpha) paints it at full size
function umSwap(t, t0, t1, draw, { enter = .2, exit = .14, blur = 14, rise = 10 } = {}) {
  if (t < t0 || t > t1 + exit) return;
  const pin = E.out(prog(t, t0, t0 + enter)), pout = prog(t, t1, t1 + exit), a = pin * (1 - pout);
  if (a <= 0) return;
  ctx.save();
  const bl = blur * Math.max(1 - pin, pout);
  if (bl > .3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  ctx.translate(0, rise * (1 - pin) - rise * .6 * pout);
  draw(a);
  ctx.restore();
}

// the cursor: path [[t, x, y], ...] (it eases between points, arriving at each time), clicks [t, ...], holds [[t0, t1], ...]
function umCursor(t, path, { clicks = [], holds = [], s = 1.2, draw = true } = {}) {
  let i = path.findIndex(([pt]) => pt > t);
  if (i < 0) i = path.length;
  let x, y;
  if (i === 0) [, x, y] = path[0]; else if (i === path.length) [, x, y] = path[path.length - 1];
  else { const [ta, xa, ya] = path[i - 1], [tb, xb, yb] = path[i], q = E.inOut(prog(t, ta, tb)), arc = Math.sin(q * Math.PI) * Math.hypot(xb - xa, yb - ya) * .06; x = lerp(xa, xb, q) + arc; y = lerp(ya, yb, q) - arc; }
  const down = holds.some(([a, b]) => t >= a && t <= b) ? 1 : Math.max(0, ...clicks.map(c => (t < c - .06 || t > c + .16 ? 0 : t < c ? prog(t, c - .06, c) : 1 - prog(t, c, c + .16))));
  if (draw) cursor(x, y, down, UM.ink, s);
  return { x, y, down };
}
// a dragged value: before t0 it rests at `from`; while held it follows valueAt(t) (from the cursor); on release it springs to `to`
function umDrag(t, t0, t1, valueAt, from, to = null) {
  if (t < t0) return from;
  if (t <= t1) return valueAt(t);
  const v = valueAt(t1);
  return to == null ? v : v + (to - v) * springStep(t - t1);
}

// icons with one stroke weight
function umStroke(color, w = 3) { ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; }
// play (p = 0) morphing into pause (p = 1)
function umPlayPause(x, y, s, p, color = '#fff') {
  const q = clamp(p), L = [[-.35, -.5], [.05, -.25], [.05, .25], [-.35, .5]], R = [[.05, -.25], [.5, 0], [.5, 0], [.05, .25]];
  const L2 = [[-.4, -.5], [-.12, -.5], [-.12, .5], [-.4, .5]], R2 = [[.12, -.5], [.4, -.5], [.4, .5], [.12, .5]];
  ctx.fillStyle = color;
  for (const [a, b] of [[L, L2], [R, R2]]) { ctx.beginPath(); a.forEach(([u, v], i) => { const px = x + lerp(u, b[i][0], q) * s, py = y + lerp(v, b[i][1], q) * s; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.fill(); }
}
function umCheck(x, y, s, p, color = '#fff') { umStroke(color, s * .14); const pts = [[x - s * .35, y], [x - s * .1, y + s * .25], [x + s * .38, y - s * .28]]; ctx.beginPath(); polyPart(pts, E.out(clamp(p))).forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke(); }
function umSpinner(x, y, r, t, color = '#fff') { umStroke(color, r * .22); const a = t * 7; ctx.beginPath(); ctx.arc(x, y, r, a, a + 4.2); ctx.stroke(); }
function umIcon(name, x, y, s, color = UM.ink) {
  umStroke(color, Math.max(2, s * .11)); ctx.beginPath();
  if (name === 'search') { ctx.arc(x - s * .08, y - s * .08, s * .3, 0, TAU); ctx.moveTo(x + s * .15, y + s * .15); ctx.lineTo(x + s * .42, y + s * .42); }
  else if (name === 'next' || name === 'prev') { const d = name === 'next' ? 1 : -1; ctx.moveTo(x - d * s * .4, y - s * .35); ctx.lineTo(x + d * s * .1, y); ctx.lineTo(x - d * s * .4, y + s * .35); ctx.closePath(); ctx.fill(); ctx.moveTo(x + d * s * .28, y - s * .35); ctx.lineTo(x + d * s * .28, y + s * .35); }
  else if (name === 'volume') { ctx.moveTo(x - s * .45, y - s * .15); ctx.lineTo(x - s * .25, y - s * .15); ctx.lineTo(x, y - s * .4); ctx.lineTo(x, y + s * .4); ctx.lineTo(x - s * .25, y + s * .15); ctx.lineTo(x - s * .45, y + s * .15); ctx.closePath(); ctx.fill(); ctx.moveTo(x + s * .2, y - s * .2); ctx.quadraticCurveTo(x + s * .35, y, x + s * .2, y + s * .2); }
  else if (name === 'chevron') { ctx.moveTo(x - s * .15, y - s * .3); ctx.lineTo(x + s * .15, y); ctx.lineTo(x - s * .15, y + s * .3); }
  else throw new Error(`umIcon: unknown icon ${name}`);
  ctx.stroke();
}
// a line chart that draws itself (p 0..1) over a soft area fill; hover (0..1 along x) adds a guide, a dot, and a tooltip
function umChart(values, x, y, w, h, p, { hover = null, label = null, color = UM.ink } = {}) {
  const lo = Math.min(...values), hi = Math.max(...values), pts = values.map((v, i) => [x + w * i / (values.length - 1), y + h - (v - lo) / (hi - lo || 1) * h]);
  const shown = polyPart(pts, E.inOut(clamp(p)));
  if (shown.length < 2) return;
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(0,0,0,.10)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); shown.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.lineTo(shown[shown.length - 1][0], y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  umStroke(color, 3); ctx.beginPath(); shown.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke();
  if (hover == null) return;
  const f = clamp(hover) * (pts.length - 1), i = Math.floor(f), q = f - i, [ax, ay] = pts[i], [bx, by] = pts[Math.min(i + 1, pts.length - 1)], hx = lerp(ax, bx, q), hy = lerp(ay, by, q);
  ctx.save(); ctx.setLineDash([4, 5]); umStroke('rgba(0,0,0,.25)', 1.5); ctx.beginPath(); ctx.moveTo(hx, y); ctx.lineTo(hx, y + h); ctx.stroke(); ctx.restore();
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(hx, hy, 6, 0, TAU); ctx.fill();
  if (label) { const s = label(hover), tw = measure(s, UM.font, 22, 600) + 24; rr(hx - tw / 2, hy - 58, tw, 38, 10); ctx.fillStyle = UM.ink; ctx.fill(); text(s, hx, hy - 39, { font: UM.font, weight: 600, size: 22, color: '#fff', jit: false }); }
}
// the light warm-grey canvas with a soft centre glow
function umBG() {
  if (!BG.um) { const c = BG.um = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.fillStyle = UM.bg; g.fillRect(0, 0, W, H); const r = g.createRadialGradient(W / 2, H * .45, 0, W / 2, H / 2, Math.max(W, H) * .7); r.addColorStop(0, 'rgba(255,255,255,.16)'); r.addColorStop(1, 'rgba(0,0,0,.05)'); g.fillStyle = r; g.fillRect(0, 0, W, H); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BG.um, 0, 0); ctx.restore();
}
