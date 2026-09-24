'use strict';
// Signature pieces of the brand motion graphics look, after @digitalstrategyai's "aifixly" explainer
// (docs/styles/motion.jpg): one dark field, thin white hand-drawn line art, a single accent, scribbled emphasis.
// Load after kit.js. Set MO.accent (and MO.bg if the brand is light) from the research.
const MO = { bg: '#0c0b1d', ink: '#f2f1f7', dim: '#8f8da8', accent: '#7c5cff', pain: '#ff5d5d', cyan: '#38d6e6', font: 'MSANS', mono: 'MMONO' };
const moLine = (id, o = {}) => ro(id, { stroke: MO.ink, strokeWidth: 3, roughness: .75, bowing: .6, ...o });

function moBG() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = MO.bg; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// line icons in a 100-unit box centred on (0, 0), drawn on with p. Add your own the same way: a list of polylines.
const moArc = (cx, cy, r, a0, a1, n = 20) => Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(lerp(a0, a1, i / n)) * r, cy + Math.sin(lerp(a0, a1, i / n)) * r]);
const moBox = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
const MO_ICONS = {
  clock: () => [moArc(0, 0, 44, -Math.PI / 2, Math.PI * 1.5, 36), [[0, 0], [0, -30]], [[0, 0], [22, 10]]],
  book: () => [[[-48, -30], [-4, -36], [-4, 38], [-48, 44], [-48, -30]], [[4, -36], [48, -30], [48, 44], [4, 38], [4, -36]], [[-38, -14], [-14, -17]], [[-38, 0], [-14, -3]], [[-38, 14], [-14, 11]], [[14, -17], [38, -14]], [[14, -3], [38, 0]]],
  eye: () => [[...moArc(0, 40, 62, -Math.PI * .79, -Math.PI * .21, 16)], [...moArc(0, -40, 62, Math.PI * .21, Math.PI * .79, 16)], moArc(0, 0, 16, 0, TAU, 20)],
  wallet: () => [moBox(-46, -28, 92, 64), [[-46, -28], [-30, -44], [34, -44], [46, -28]], moBox(18, -6, 28, 20)],
  cash: () => [moBox(-40, -24, 80, 48), moArc(0, 0, 12, 0, TAU, 16), [[-30, -14], [-22, -14]], [[22, 14], [30, 14]]],
  camera: () => [moBox(-46, -24, 92, 62), [[-18, -24], [-10, -38], [10, -38], [18, -24]], moArc(0, 7, 18, 0, TAU, 22)],
  mic: () => [[...moArc(0, -18, 14, Math.PI, TAU, 10), [14, 10], ...moArc(0, 10, 14, 0, Math.PI, 10), [-14, -18]], moArc(0, 6, 26, 0, Math.PI, 14), [[0, 32], [0, 46]], [[-16, 46], [16, 46]]],
  check: () => [[[-34, 2], [-10, 26], [36, -26]]],
  faucet: () => [[[-50, -20], [10, -20], [30, -10], [34, 12], [20, 12], [18, 0], [10, -6], [-50, -6], [-50, -20]], [[-20, -20], [-20, -34]], [[-34, -34], [-6, -34]], [[26, 22], [26, 30]]],
  bulb: () => [[...moArc(0, -10, 30, Math.PI * .75, Math.PI * 2.25, 24)], [[-12, 20], [12, 20]], [[-10, 30], [10, 30]], [[-6, 40], [6, 40]]],
  chat: () => [[[-44, -30], [44, -30], [44, 18], [-6, 18], [-24, 36], [-22, 18], [-44, 18], [-44, -30]]],
  search: () => [moArc(-8, -8, 28, 0, TAU, 24), [[12, 12], [40, 40]]],
  lock: () => [moBox(-32, -6, 64, 48), [...moArc(0, -6, 20, Math.PI, TAU, 12)]],
  chart: () => [[[-44, 40], [-44, -40]], [[-44, 40], [46, 40]], [[-30, 24], [-8, 0], [10, 12], [38, -26]]],
  user: () => [moArc(0, -18, 18, 0, TAU, 20), [...moArc(0, 40, 36, Math.PI, TAU, 16)]],
  gear: () => [moArc(0, 0, 30, 0, TAU, 32), moArc(0, 0, 11, 0, TAU, 14), ...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * TAU; return [[Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a) * 42, Math.sin(a) * 42]]; })],
  star: () => [Array.from({ length: 11 }, (_, i) => { const a = -Math.PI / 2 + i / 10 * TAU, r = i % 2 ? 18 : 42; return [Math.cos(a) * r, Math.sin(a) * r]; })],
};
function icon(name, x, y, s, p, id, color = MO.ink, width = 3) {
  const parts = MO_ICONS[name]?.();
  if (!parts) throw new Error('unknown icon: ' + name);
  parts.forEach((pl, i) => sketch(pl.map(([a, b]) => [x + a * s, y + b * s]), prog(p, i / parts.length * .6, i / parts.length * .6 + .5), id + i, { stroke: color, strokeWidth: width, roughness: .7 }));
}
// a loose 1.2-turn oval scribbled around a word
function scribble(x, y, w, h, p, id, color = MO.ink) {
  const pts = Array.from({ length: 61 }, (_, i) => { const a = -2.6 + i / 60 * TAU * 1.2; return [x + Math.cos(a) * w / 2 * (1 + i * .0012), y + Math.sin(a) * h / 2 - i * .25]; });
  sketch(pts, p, id, { stroke: color, strokeWidth: 3, roughness: .9 });
}
// a curved underline swept under a word
function swoosh(x, y, w, p, id, color = MO.accent) { sketch(bez([x, y + 4], [x + w * .5, y + 14], [x + w, y - 2], 20), p, id, { stroke: color, strokeWidth: 4, roughness: .6 }); }
// small caps label + a thin gauge that fills: the "frustration" meter that climbs through the pain beats
function meter(label, v, x = W / 2 - 220, y = H - 150, w = 440, color = MO.pain) {
  text(label, x - 20, y, { font: MO.mono, size: 12, color: MO.dim, align: 'right', jit: false });
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; rr(x, y - 7, w, 14, 7); ctx.stroke();
  ctx.fillStyle = color; rr(x + 3, y - 4, Math.max(0, (w - 6) * clamp(v)), 8, 4); ctx.fill(); ctx.restore();
}
// bar chart in line art: pain bars hatched in `pain`, the product's bar tiny and solid accent. items [{ label, v, hi }]
function lineBars(title, items, { x = 520, y = 820, w = 880, h = 460, p = 1, id = 8100 } = {}) {
  text(title, x, y - h - 40, { font: MO.font, weight: 700, size: 34, color: MO.ink, align: 'left', jit: false });
  sketch([[x - 20, y], [x + w + 20, y]], prog(p, 0, .3), id, { stroke: MO.ink, strokeWidth: 2.5 });
  const bw = w / (items.length * 1.6), m = Math.max(...items.map(i => i.v));
  items.forEach((it, i) => {
    const bx = x + i * bw * 1.6 + bw * .3, q = E.out(prog(p, .2 + i * .15, .6 + i * .15)), bh = h * it.v / m * q;
    if (bh > 1) rc.rectangle(bx, y - bh, bw, bh, ro(id + 1 + i, it.hi ? { stroke: MO.accent, fill: MO.accent, fillStyle: 'solid', strokeWidth: 2, roughness: .6 } : { stroke: MO.pain, fill: MO.pain, fillStyle: 'hachure', hachureGap: 12, fillWeight: 1.4, strokeWidth: 2.5, roughness: .8 }));
    text(it.label, bx + bw / 2, y + 34, { font: MO.font, size: 20, color: it.hi ? MO.accent : MO.dim, jit: false });
  });
}
// phone drawn in white line art with cyan camera corners; draw(sx, sy, sw, sh) adds the screen content
function linePhone(x, y, h, p, id, draw) {
  const w = h * .5, x0 = x - w / 2, y0 = y - h / 2;
  sketch([[x0 + 30, y0], [x0 + w - 30, y0], [x0 + w, y0 + 30], [x0 + w, y0 + h - 30], [x0 + w - 30, y0 + h], [x0 + 30, y0 + h], [x0, y0 + h - 30], [x0, y0 + 30], [x0 + 30, y0]], p, id, { stroke: MO.ink, strokeWidth: 3, roughness: .6 });
  if (p < 1) return;
  text('● LIVE', x0 + 26, y0 + 34, { font: MO.mono, size: 13, color: MO.pain, align: 'left', jit: false });
  const c = 26, m = 30;
  [[x0 + m, y0 + 70, 1, 1], [x0 + w - m, y0 + 70, -1, 1], [x0 + m, y0 + h - 70, 1, -1], [x0 + w - m, y0 + h - 70, -1, -1]].forEach(([cx, cy, sx, sy], i) =>
    rc.linearPath([[cx, cy + sy * c], [cx, cy], [cx + sx * c, cy]], ro(id + 10 + i, { stroke: MO.cyan, strokeWidth: 3, roughness: .4 })));
  draw?.(x0 + m, y0 + 70, w - 2 * m, h - 140);
}
// the viewer's question in an outline bubble with a mic and a live waveform, typed in
function askBubble(s, x, y, w, p, id) {
  sketch(moBox(x, y - 28, w, 56).map(([a, b]) => [a, b]), prog(p, 0, .3), id, { stroke: MO.ink, strokeWidth: 2.5, roughness: .5 });
  if (p < .3) return;
  icon('mic', x + 30, y, .3, 1, id + 5, MO.cyan, 2);
  for (let i = 0; i < 9; i++) { const hh = 4 + Math.abs(Math.sin(T * 9 + i * 1.3)) * 14; ctx.fillStyle = MO.cyan; ctx.fillRect(x + 56 + i * 7, y - hh / 2, 3, hh); }
  text(typed(s, prog(p, .35, 1)), x + 130, y + 1, { font: MO.font, size: 22, color: MO.ink, align: 'left', jit: false, maxW: w - 150 });
}
// the product's answer: a filled accent bubble
function replyBubble(s, x, y, w, p) {
  const k = E.out(prog(p, 0, .25));
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = MO.accent; rr(x, y - 36, w, 72, 12); ctx.fill(); ctx.restore();
  text(typed(s, prog(p, .2, 1)), x + 24, y, { font: MO.font, size: 22, color: '#fff', align: 'left', jit: false, maxW: w - 48 });
}
// outline pill tags wrapped into centred rows; `active` (index) is filled accent
function pills(items, cx, y, maxW, p, active = -1, size = 20) {
  const ws = items.map(s => measure(s, MO.font, size) + 40), rows = [[]];
  let rw = 0;
  ws.forEach((w, i) => { if (rw + w > maxW && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(i); rw += w + 14; });
  rows.forEach((row, r) => {
    const tw = row.reduce((a, i) => a + ws[i] + 14, -14);
    let x = cx - tw / 2;
    row.forEach(i => {
      const k = E.back(prog(p * items.length * .5, i * .5, i * .5 + 1));
      if (k > 0) {
        ctx.save(); ctx.translate(x + ws[i] / 2, y + r * (size * 2.4)); ctx.scale(k, k);
        ctx.lineWidth = 2; ctx.strokeStyle = i === active ? MO.accent : 'rgba(255,255,255,.7)'; rr(-ws[i] / 2, -size * .9, ws[i], size * 1.8, size * .9);
        if (i === active) { ctx.fillStyle = MO.accent; ctx.fill(); } ctx.stroke();
        text(items[i], 0, 1, { font: MO.font, size, color: MO.ink, jit: false });
        ctx.restore();
      }
      x += ws[i] + 14;
    });
  });
}
// call to action: an accent pill with a soft glow; the cursor glides in and clicks at `clickAt` (seconds of t)
function ctaButton(label, x, y, t, clickAt = 1.2, { note = '', url = '' } = {}) {
  const w = measure(label + '  →', MO.font, 30, 600) + 80, glow = .5 + .5 * Math.sin(T * 4), press = clamp(1 - Math.abs(t - clickAt) * 6);
  ctx.save(); ctx.shadowColor = MO.accent; ctx.shadowBlur = 18 + glow * 22 + press * 30; ctx.fillStyle = MO.accent; rr(x - w / 2, y - 36, w, 72, 36); ctx.fill(); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2; rr(x - w / 2, y - 36, w, 72, 36); ctx.stroke(); ctx.restore();
  text(label + '  →', x, y + 1, { font: MO.font, weight: 600, size: 30, color: '#fff', jit: false });
  if (note) text(note, x, y + 78, { font: MO.font, size: 20, color: MO.dim, jit: false });
  if (url) text(url, x, y + 110, { font: MO.font, size: 16, color: MO.dim, alpha: .8, jit: false });
  const [cx, cy] = [lerp(x + 380, x + w * .3, E.inOut(prog(t, clickAt - .8, clickAt - .05))), lerp(y + 240, y + 12, E.inOut(prog(t, clickAt - .8, clickAt - .05)))];
  if (t > clickAt - .9) cursor(cx, cy, press);
}
// product wordmark: bold name, the full stop in accent, a swoosh under it
function wordmark(name, x, y, size, p, id = 8300) {
  const k = prog(p, 0, .5), shown = typed(name, k), w = measure(name, MO.font, size, 700);
  text(shown, x - w / 2, y, { font: MO.font, weight: 700, size, color: MO.ink, align: 'left', jit: false });
  if (k >= 1) text('.', x + w / 2 + size * .02, y, { font: MO.font, weight: 700, size, color: MO.accent, align: 'left', jit: false });
  swoosh(x - w / 2, y + size * .58, w, prog(p, .55, .9), id);
}
