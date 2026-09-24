'use strict';
// Signature pieces of the default hand-drawn look, after @nahiddotai's "Introducing Opus 5.5" video
// (docs/styles/handdrawn.jpg). Load after kit.js. Fonts: HD.serif / HD.script / HD.pix / HD.mono, declared in index.html.
const HD = { ink: '#2b2a28', paper: '#f4f2ee', dark: '#1c1b1a', light: '#f3f1ec', accent: '#D97757', muted: '#8d8a84', tag: '#eadfc8',
  serif: 'SERIF', script: 'SCRIPT', pix: 'PIX', mono: 'MONO', sans: 'SANS' };
const hdLine = (id, o = {}) => ro(id, { stroke: HD.ink, strokeWidth: 2.2, roughness: .9, bowing: .7, ...o });

// plain paper, no grid: the look lives on empty warm paper and a single ink horizon
function hdPaper() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = HD.paper; ctx.fillRect(0, 0, W, H); ctx.restore(); if (BG.paper) { ctx.save(); ctx.globalAlpha = .55; paperBG(); ctx.restore(); } }
function hdDark() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = HD.dark; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function tuft(x, y, id, s = 1) {
  [[-6, -16], [0, -22], [7, -15]].forEach(([dx, dy], i) => rc.line(x + dx * .3 * s, y, x + dx * s, y + dy * s, hdLine(id + i, { strokeWidth: 1.8 })));
}
// the ground line characters stand on, with grass tufts
function horizon(y = H * .74, id = 7100, o = {}) {
  const x0 = o.x0 ?? 30, x1 = o.x1 ?? W - 30, p = o.p ?? 1;
  sketch([[x0, y], [lerp(x0, x1, .5), y + 3], [x1, y + 1]], p, id, { stroke: o.color ?? HD.ink, strokeWidth: 2.4, roughness: .8 });
  if (p >= 1) (o.tufts ?? [x0 + 70, W * .31, W * .66, x1 - 80]).forEach((gx, i) => tuft(gx, y, id + 10 + i * 5));
}
// outline cloud of three bumps; drifts when x moves with T
function cloud(x, y, s = 1, id = 7200) {
  const pts = [];
  [[-60, 0, 26], [-18, -18, 36], [34, -6, 30]].forEach(([cx, cy, r], k) => {
    for (let a = Math.PI; a <= TAU + .01; a += .25) pts.push([x + (cx + Math.cos(a) * r) * s, y + (cy + Math.sin(a) * r) * s]);
  });
  pts.push([x + 64 * s, y + 18 * s], [x - 86 * s, y + 18 * s], pts[0]);
  rc.linearPath(pts, hdLine(id, { strokeWidth: 2 }));
}
// small mono level tag in the top-left corner, e.g. 'WORLD 1-3'
function worldTag(s, color = HD.muted) { text(s, 38, 34, { font: HD.mono, size: 15, color, align: 'left', jit: false }); }
// full-screen level card: 'WORLD 2' over a pixel title in a thick frame
function worldCard(world, title, p, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = o.bg ?? HD.tag; ctx.fillRect(0, 0, W, H); ctx.restore();
  const k = E.back(prog(p, 0, .35));
  if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(k, k);
  rc.rectangle(-560, -150, 1120, 300, hdLine(7300, { strokeWidth: 5, roughness: .6 }));
  text(world, 0, -52, { font: HD.pix, size: 30, color: HD.ink, jit: false });
  text(title, 0, 40, { font: HD.pix, size: 62, color: o.accent ?? HD.accent, jit: false, maxW: 1000 });
  ctx.restore();
}
// dark title card: small serif 'Introducing', the name typing in, the accent part with a hand underline, a script subline
function introCard(t, { pre = 'Introducing', name, accent = '', sub = '' }, o = {}) {
  hdDark();
  const size = o.size ?? 150, full = name + (accent ? ' ' + accent : ''), wn = measure(name + ' ', HD.serif, size, 500), wa = measure(accent, HD.serif, size, 500);
  const x0 = W / 2 - (wn + wa) / 2, y = o.y ?? H * .47;
  text(pre, W / 2, y - size * .78, { font: HD.serif, size: size * .3, color: '#cfcac1', alpha: prog(t, 0, .3), jit: false });
  const shown = typed(full, prog(t, .2, .2 + full.length * .06));
  text(shown.slice(0, name.length + 1), x0, y, { font: HD.serif, weight: 500, size, color: HD.light, align: 'left', jit: false });
  if (shown.length > name.length + 1) text(shown.slice(name.length + 1), x0 + wn, y, { font: HD.serif, weight: 500, size, color: HD.accent, align: 'left', jit: false });
  const u = prog(t, .3 + full.length * .06, .6 + full.length * .06);
  if (accent) sketch([[x0 + wn, y + size * .42], [x0 + wn + wa * .5, y + size * .46], [x0 + wn + wa, y + size * .4]], u, 7310, { stroke: HD.accent, strokeWidth: 5, roughness: .9 });
  text(sub, W / 2, y + size * .95, { font: HD.script, size: size * .27, color: '#e8b49e', alpha: prog(t, .5 + full.length * .06, .9 + full.length * .06), jit: false });
}
// count-up text: countUp(66.4, p, { decimals: 1, suffix: '%' })
function countUp(to, p, { from = 0, decimals = 0, prefix = '', suffix = '', sep = ',' } = {}) {
  const v = lerp(from, to, E.out(clamp(p)));
  const s = v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return prefix + s + suffix;
}
// big serif stat: accent number counting up, a bold label under it, an optional script note
function serifStat(value, label, note, x, y, p, o = {}) {
  const size = o.size ?? 150;
  text(typeof value === 'number' ? countUp(value, p, o) : value, x, y, { font: HD.serif, weight: 500, size, color: o.color ?? HD.accent, jit: false });
  text(label, x, y + size * .62, { font: HD.sans, weight: 700, size: size * .17, color: o.ink ?? HD.ink, alpha: prog(p, .2, .5), jit: false });
  if (note) text(note, x, y + size * .9, { font: HD.script, size: size * .15, color: HD.accent, alpha: prog(p, .5, .8), jit: false });
}
// comparison bars on the horizon: the old value hatched in ink, the highlighted one solid accent. items: [{ label, v, text, hi }]
function hatchBars(items, { x, y, w, h, p = 1, max = null, id = 7400, gap = .45 } = {}) {
  const m = max ?? Math.max(...items.map(i => i.v)), bw = w / (items.length + (items.length - 1) * gap), tops = [];
  items.forEach((it, i) => {
    const bx = x + i * bw * (1 + gap), q = E.out(prog(p, i * .15, i * .15 + .6)), bh = h * it.v / m * q;
    if (bh > 1) rc.rectangle(bx, y - bh, bw, bh, hdLine(id + i, it.hi ? { fill: HD.accent, fillStyle: 'solid', stroke: HD.ink, strokeWidth: 2.2 } : { fill: HD.ink, fillStyle: 'hachure', hachureGap: 9, hachureAngle: -45, fillWeight: 1.2, strokeWidth: 2 }));
    if (q > .9 && it.text) text(it.text, it.hi ? bx + bw + 20 : bx - 16, y - bh + 16, { font: it.hi ? HD.serif : HD.mono, size: it.hi ? 56 : 24, color: it.hi ? HD.accent : HD.ink, align: it.hi ? 'left' : 'right', jit: false });
    text(it.label, bx + bw / 2, y + 30, { font: HD.sans, weight: it.hi ? 800 : 600, size: 22, color: HD.ink, jit: false });
    tops.push([bx + bw / 2, y - bh]);
  });
  return tops;
}
// arcade leaderboard on a dark screen: rows [[rank, name, score]], hi = row index that gets the mini and the accent
function hiScore(title, sub, rows, p, { hi = 0, mini = null, record = 'NEW RECORD!' } = {}) {
  hdDark();
  rc.rectangle(90, 70, W - 180, H - 140, ro(7500, { stroke: '#d8d3ca', strokeWidth: 2.4, roughness: .7 }));
  text(title, W / 2, 210, { font: HD.pix, size: 64, color: HD.accent, jit: false });
  text(sub, W / 2, 280, { font: HD.sans, size: 22, color: '#bdb8ae', jit: false });
  rows.forEach(([rank, name, score], i) => {
    const a = prog(p, .15 + i * .15, .3 + i * .15);
    if (a <= 0) return;
    const y = 420 + i * 110, c = i === hi ? HD.accent : HD.light;
    text(rank, 560, y, { font: HD.pix, size: 44, color: c, align: 'left', alpha: a, jit: false });
    text(name, 760, y, { font: HD.pix, size: 44, color: c, align: 'left', alpha: a, jit: false });
    text(String(score), 1420, y, { font: HD.pix, size: 44, color: c, align: 'left', alpha: a, jit: false });
    if (i === hi && mini) drawMini(mini, 470, y + 26, 4.5, { alpha: a });
  });
  if (record && p > .8 && Math.floor(T * 4) % 2) text(record, W / 2, 420 + rows.length * 110 + 30, { font: HD.pix, size: 36, color: HD.light, jit: false });
}
// price tag with the old price struck through and the new one written in
function priceTag(x, y, oldV, newV, p, id = 7600) {
  const k = E.back(prog(p, 0, .3));
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.12); ctx.scale(k, k);
  rc.polygon([[-170, -80], [120, -80], [190, 0], [120, 80], [-170, 80]], hdLine(id, { fill: '#e9d9b8', fillStyle: 'solid', strokeWidth: 2.6 }));
  rc.circle(135, 0, 22, hdLine(id + 1, { strokeWidth: 2 }));
  text(oldV, -30, newV ? -22 : 0, { font: HD.serif, size: 72, color: HD.ink, jit: false });
  if (newV) {
    sketch([[-120, -18], [60, -30]], prog(p, .4, .6), id + 2, { stroke: HD.accent, strokeWidth: 5 });
    text(newV, -30, 44, { font: HD.serif, size: 72, color: HD.accent, alpha: prog(p, .55, .75), jit: false });
  }
  ctx.restore();
}
// grid of small document cards; the first `done` get an accent check stamp. Returns nothing; pair with a serif 'done/n'
function docGrid(n, cols, done, p, { x = 360, y = 330, cw = 92, ch = 110, gap = 22, id = 7700, miss = [] } = {}) {
  for (let i = 0; i < n; i++) {
    const cx = x + (i % cols) * (cw + gap), cy = y + Math.floor(i / cols) * (ch + gap);
    rc.rectangle(cx, cy, cw, ch, hdLine(id + i, { fill: '#fbfaf7', fillStyle: 'solid', strokeWidth: 1.8 }));
    for (let l = 0; l < 4; l++) rc.line(cx + 14, cy + 24 + l * 18, cx + cw - 14 - (l % 2) * 18, cy + 24 + l * 18, hdLine(id + 40 + i * 4 + l, { strokeWidth: 1.2, stroke: HD.muted }));
    const on = done * clamp(p) > i + .5;
    if (on) {
      const bad = miss.includes(i);
      rc.circle(cx + cw / 2, cy + ch / 2, 58, hdLine(id + 200 + i, { stroke: bad ? HD.muted : HD.accent, strokeWidth: 3 }));
      if (bad) sketch([[cx + cw / 2 - 18, cy + ch / 2 - 18], [cx + cw / 2 + 18, cy + ch / 2 + 18]], 1, id + 300 + i, { stroke: HD.muted, strokeWidth: 3 });
      else sketch([[cx + cw / 2 - 16, cy + ch / 2], [cx + cw / 2 - 4, cy + ch / 2 + 14], [cx + cw / 2 + 18, cy + ch / 2 - 14]], 1, id + 300 + i, { stroke: HD.accent, strokeWidth: 3.5 });
    }
  }
}
// handwritten lines struck through one after another (clichés crossed out)
function strikeList(lines, x, y, p, { size = 40, gap = 58, id = 7800, color = HD.ink } = {}) {
  lines.forEach((s, i) => {
    text(s, x, y + i * gap, { font: HD.script, size, color, align: 'left', jit: false });
    const w = measure(s, HD.script, size);
    sketch([[x - 6, y + i * gap + 2], [x + w + 6, y + i * gap - 4]], prog(p, i / lines.length, (i + .8) / lines.length), id + i, { stroke: '#b3372c', strokeWidth: 3 });
  });
}
// transition: a torn sheet of `color` sweeps across; p = 0..1 covers the screen
function paperTear(p, color = HD.accent, dir = 1) {
  if (p <= 0) return;
  const q = E.inOut(clamp(p)), edge = lerp(-160, W + 160, q), r = rnd(4242), pts = [];
  for (let y = -20; y <= H + 20; y += 26) pts.push([edge + (r() - .5) * 60 + Math.sin(y * .02) * 30, y]);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (dir < 0) { ctx.translate(W, 0); ctx.scale(-1, 1); }
  ctx.fillStyle = '#fbf6ee'; ctx.beginPath(); ctx.moveTo(-10, -20); pts.forEach(([x, y]) => ctx.lineTo(x + 14, y)); ctx.lineTo(-10, H + 20); ctx.fill();
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-10, -20); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(-10, H + 20); ctx.fill();
  ctx.restore();
}
// a sleeping mini's z's and a power-up burst
function zzz(x, y, t) { [0, 1].forEach(i => { const ph = (t * .8 + i * .5) % 1; text('z', x + ph * 30 + i * 8, y - ph * 50, { font: HD.script, size: 26 - i * 6, color: HD.ink, alpha: Math.sin(ph * Math.PI), jit: false }); }); }
function burst(x, y, r, p, color = HD.accent, id = 7900, n = 12) {
  if (p <= 0) return;
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + .2, r0 = r * .25, r1 = r * (.6 + (i % 2) * .4) * E.out(clamp(p));
    rc.line(x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r1, y + Math.sin(a) * r1, ro(id + i, { stroke: color, strokeWidth: 7, roughness: 1.4 }));
  }
}
