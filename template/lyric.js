'use strict';
// Signature pieces of the lyric music video format, after @goodside's "Jev · System One" video (docs/styles/lyric.jpg):
// a dark technical explainer. Section label top left, title top right, a progress hairline, one diagram per lyric line,
// the sung line at the bottom. Load after kit.js. Fonts: LY.sans and LY.mono, declared in index.html.
const LY = { bg: '#0b0f1e', grid: 'rgba(120,150,230,.055)', ink: '#e9edf6', dim: '#5e6886', faint: '#262d4a', card: '#121832',
  accents: ['#35d0e6', '#ff5cc8', '#ffc53a', '#4ade80'], sans: 'LSANS', mono: 'LMONO' };

// the frame every scene sits in. o: { section: 'VERSE 1', detail: 'how Jev differs', title: 'JEV · System One', progress: 0..1, accent }
function lyFrame(o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = LY.bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = LY.grid; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 64) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 64) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
  const v = ctx.createRadialGradient(W / 2, H * .45, H * .2, W / 2, H / 2, W * .7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const a = o.accent ?? LY.accents[0];
  if (o.section) text(o.section.toUpperCase() + (o.detail ? '  ·  ' + o.detail : ''), 40, 34, { font: LY.mono, size: 15, color: LY.dim, align: 'left', jit: false });
  if (o.title) text(o.title, W - 40, 34, { font: LY.mono, size: 15, color: LY.dim, align: 'right', jit: false });
  ctx.fillStyle = a; ctx.fillRect(0, 0, W * clamp(o.progress ?? 0), 3);
  ctx.fillStyle = LY.faint; ctx.fillRect(0, H - 150, W, 1.5);
  ctx.fillStyle = a; ctx.fillRect(0, H - 150, W * .12, 1.5);
}
// the sung line: syl [[text, start]] on the scene clock; sung words bright, the rest dim
function lyLine(syl, t, { size = 44, y = H - 76 } = {}) { karaoke(syl, W / 2, y, t, { font: LY.sans, weight: '600', size, off: LY.dim, on: LY.ink, outline: null }); }
// helper to lay a line on a beat grid: lyWords('Give it a state, get decisions back', start, step)
const lyWords = (s, start, step) => s.split(' ').map((w, i, a) => [w + (i < a.length - 1 ? ' ' : ''), start + i * step]);
// a rounded node box with a coloured border: label in the sans, a small mono sub-label
function lyNode(x, y, w, h, label, sub, p, { color = LY.accents[0], size = 40, fill = LY.card, glow = 0 } = {}) {
  const k = E.out(prog(p, 0, .4));
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(x, y); ctx.scale(.9 + .1 * k, .9 + .1 * k);
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 24 * glow; }
  ctx.fillStyle = fill; rr(-w / 2, -h / 2, w, h, 10); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = color; ctx.lineWidth = 2; rr(-w / 2, -h / 2, w, h, 10); ctx.stroke();
  ctx.restore();
  text(label, x, y - (sub ? size * .22 : 0), { font: LY.sans, weight: '700', size, color: k > .5 ? color : LY.ink, alpha: k, jit: false });
  if (sub) text(sub, x, y + size * .55, { font: LY.mono, size: size * .32, color: LY.dim, alpha: k, jit: false });
}
// a connector that draws itself, with a pulse that keeps travelling once drawn. pts: [[x, y], ...]
function lyLink(pts, p, color = LY.accents[0], width = 5) {
  const q = polyPart(pts, clamp(p));
  if (q.length < 2) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); q.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.stroke();
  if (p >= 1) { const [px, py] = polyPart(pts, (T * .8) % 1).slice(-1)[0]; ctx.fillStyle = '#fff'; ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(px, py, width * 1.2, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// probability bars: rows [[name, value 0..1]]; mono names on the left, values on the right
function probBars(x, y, w, rows, p, { color = LY.accents[0], gap = 64, title = '', sub = '' } = {}) {
  if (title) text(title, x + w / 2, y - 80, { font: LY.sans, weight: '600', size: 34, color: LY.ink, jit: false });
  if (sub) text(sub, x + w / 2, y - 44, { font: LY.mono, size: 16, color: LY.dim, jit: false });
  rows.forEach(([name, v], i) => {
    const ry = y + i * gap, q = E.out(prog(p, i * .12, i * .12 + .5));
    text(name, x - 24, ry, { font: LY.mono, weight: '600', size: 20, color: LY.ink, align: 'right', jit: false });
    ctx.fillStyle = LY.faint; rr(x, ry - 13, w, 26, 4); ctx.fill();
    ctx.fillStyle = i === 0 ? color : LY.dim; rr(x, ry - 13, Math.max(4, w * v * q), 26, 4); ctx.fill();
    text((v * q).toFixed(2), x + w + 24, ry, { font: LY.mono, size: 20, color: i === 0 ? color : LY.dim, align: 'left', jit: false });
  });
}
// a code/JSON card: lines typed in; `key:` parts dim, quoted strings and numbers in the accent
function codeBox(x, y, w, lines, p, { color = LY.accents[0], size = 20, label = '' } = {}) {
  const h = lines.length * size * 1.55 + 40;
  ctx.fillStyle = LY.card; rr(x, y, w, h, 10); ctx.fill(); ctx.strokeStyle = LY.faint; ctx.lineWidth = 1.5; rr(x, y, w, h, 10); ctx.stroke();
  if (label) text(label, x, y - 22, { font: LY.mono, size: 14, color: LY.dim, align: 'left', jit: false });
  const all = lines.join('\n'), shown = typed(all, p).split('\n');
  shown.forEach((ln, i) => {
    const ly = y + 30 + i * size * 1.55, m = ln.match(/^(\s*[\w"]+\s*:)(.*)$/);
    if (m) { text(m[1], x + 24, ly, { font: LY.mono, size, color: LY.dim, align: 'left', jit: false }); text(m[2], x + 24 + measure(m[1], LY.mono, size), ly, { font: LY.mono, size, color, align: 'left', jit: false }); }
    else text(ln, x + 24, ly, { font: LY.mono, size, color: LY.ink, align: 'left', jit: false });
  });
}
// a big value with a soft glow, e.g. a price or '≈ 100 ms'
function bigValue(s, x, y, p, { color = LY.accents[2], size = 120, label = '', boxed = false } = {}) {
  const k = E.out(prog(p, 0, .35));
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.shadowColor = color; ctx.shadowBlur = 30;
  if (boxed) { const w = measure(s, LY.sans, size, '700') + 70; ctx.strokeStyle = color; ctx.lineWidth = 4; rr(x - w / 2, y - size * .62, w, size * 1.24, 12); ctx.stroke(); }
  text(s, x, y, { font: LY.sans, weight: '700', size, color, jit: false });
  ctx.restore();
  if (label) text(label, x, y - size * .9, { font: LY.sans, weight: '600', size: 30, color: LY.ink, alpha: k, jit: false });
}
// intro / outro: the name in a glowing ring, subtitle in the accent, a small about line and the song title
function lyTitle(name, sub, about, song, p, { color = LY.accents[0], kind = 'an educational music video' } = {}) {
  const k = E.out(prog(p, 0, .5));
  ctx.save(); ctx.globalAlpha *= k;
  for (let i = 0; i < 5; i++) { ctx.strokeStyle = color; ctx.globalAlpha = k * (.5 - i * .09); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W / 2, H * .36, 150 + i * 10 + Math.sin(T * 2 + i) * 2, 0, TAU); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.shadowColor = color; ctx.shadowBlur = 24 * k; ctx.globalAlpha *= k; ctx.beginPath(); ctx.arc(W / 2, H * .36, 142, 0, TAU); ctx.stroke(); ctx.restore();
  text(name, W / 2, H * .36, { font: LY.sans, weight: '700', size: 110, color: LY.ink, alpha: k, jit: false });
  text(sub, W / 2, H * .6, { font: LY.sans, weight: '600', size: 54, color, alpha: prog(p, .3, .6), jit: false });
  text(kind, W / 2, H * .655, { font: LY.sans, size: 20, color: LY.dim, alpha: prog(p, .4, .7), jit: false });
  if (about) text(about, W / 2, H * .72, { font: LY.sans, size: 18, color: LY.dim, alpha: prog(p, .5, .8), jit: false });
  if (song) text('♪  ' + song + '  ♪', W / 2, H - 76, { font: LY.sans, size: 26, color: LY.dim, alpha: prog(p, .6, .9), jit: false });
}
// the chorus changes colour each time it returns
const chorusColor = n => LY.accents[n % LY.accents.length];
