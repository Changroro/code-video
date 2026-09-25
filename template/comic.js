'use strict';
// Hero comic look: newsprint pages, thick ink panels, Ben-Day halftone, yellow caption boxes, speech balloons,
// burst lettering (POW!), and a title slab over rapidly flipping pages. Load after kit.js.
// Fonts: CM.font (Bangers, Latin) and CM.ko (Black Han Sans / Do Hyeon for Hangul) through unicode-range pairs.
const CM = { paper: '#f4ecd6', ink: '#141414', red: '#e23b2e', yellow: '#ffd43b', blue: '#2a6fdb', cyan: '#59c3e8', white: '#ffffff', font: 'COMIC', ink2: '#2b2b2b' };

// newsprint with a faint dot screen
function comicPaper(color = CM.paper) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = .07; halftone(0, 0, W, H, CM.ink, { dot: 3.2, gap: 12 }); ctx.restore();
}
// Ben-Day dots over a rectangle; `fade` (0..1 along `dir`) grows the dots from none to full, for shading
function halftone(x, y, w, h, color, { dot = 5, gap = 14, angle = .26, fade = null, dir = [1, 0] } = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = color;
  const cx = x + w / 2, cy = y + h / 2, R = Math.hypot(w, h) / 2 + gap, ca = Math.cos(angle), sa = Math.sin(angle);
  ctx.beginPath();
  for (let v = -R; v <= R; v += gap) for (let u = -R; u <= R; u += gap) {
    const px = cx + u * ca - v * sa, py = cy + u * sa + v * ca;
    if (px < x - gap || px > x + w + gap || py < y - gap || py > y + h + gap) continue;
    const k = fade === null ? 1 : clamp(((px - x) / w * dir[0] + (py - y) / h * dir[1]) * (1 - fade) + fade);
    const r = dot * k;
    if (r > .3) { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, TAU); }
  }
  ctx.fill(); ctx.restore();
}
// one panel: a (possibly slanted) quad with a thick ink border; draw() paints inside, clipped. q = [[x,y] x4] or a rect [x,y,w,h]
function panel(q, draw, { fill = CM.white, border = 9, p = 1 } = {}) {
  if (q.length === 4 && typeof q[0] === 'number') { const [x, y, w, h] = q; q = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
  if (p <= 0) return;
  const k = E.back(clamp(p)), cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy);
  ctx.beginPath(); q.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath();
  ctx.save(); ctx.clip(); ctx.fillStyle = fill; ctx.fillRect(0, 0, W, H); draw?.(); ctx.restore();
  ctx.beginPath(); q.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineWidth = border; ctx.strokeStyle = CM.ink; ctx.stroke();
  ctx.restore();
}
// a page split into panels by gutters: rows = [[weights...], ...], returns rects [x, y, w, h]
function pageGrid(rows, { x = 70, y = 60, w = W - 140, h = H - 120, gutter = 26, heights = null } = {}) {
  const out = [], hs = heights ?? rows.map(() => 1), hsum = hs.reduce((a, b) => a + b, 0), avail = h - gutter * (rows.length - 1);
  let yy = y;
  rows.forEach((ws, r) => {
    const rh = avail * hs[r] / hsum, wsum = ws.reduce((a, b) => a + b, 0), aw = w - gutter * (ws.length - 1);
    let xx = x;
    ws.forEach(c => { const cw = aw * c / wsum; out.push([xx, yy, cw, rh]); xx += cw + gutter; });
    yy += rh + gutter;
  });
  return out;
}
// focus lines converging on (cx, cy), drawn inside the current clip
function actionLines(cx, cy, p, { color = CM.ink, n = 70, inner = 220, seed = 3 } = {}) {
  if (p <= 0) return;
  const r = rnd(hash(seed, Math.floor(T * 12)));
  ctx.save(); ctx.fillStyle = color; ctx.globalAlpha *= clamp(p);
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + r() * .05, w = .006 + r() * .012, r0 = inner * (.8 + r() * .5), r1 = Math.hypot(W, H);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a - w) * r1, cy + Math.sin(a - w) * r1); ctx.lineTo(cx + Math.cos(a + w) * r1, cy + Math.sin(a + w) * r1); ctx.fill();
  }
  ctx.restore();
}
// jagged starburst
function burstShape(x, y, r, { spikes = 14, jag = .38, fill = CM.yellow, rot = 0, seed = 1 } = {}) {
  const g = rnd(seed);
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) { const a = rot + i / (spikes * 2) * TAU, rr = r * (i % 2 ? 1 - jag + g() * .1 : 1 + g() * .12); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 7; ctx.lineJoin = 'miter'; ctx.strokeStyle = CM.ink; ctx.stroke();
}
// comic lettering: thick ink outline, a hard offset shadow, slight tilt; p pops it in
function comicText(s, x, y, size, { color = CM.yellow, shadow = CM.red, rot = -.06, p = 1, align = 'center', ow = null } = {}) {
  const k = E.back(clamp(p));
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  ctx.font = `${size}px ${CM.font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const d = size * .07;
  ctx.lineWidth = ow ?? size * .16; ctx.strokeStyle = CM.ink; ctx.strokeText(s, d, d); ctx.fillStyle = shadow; ctx.fillText(s, d, d);
  ctx.strokeText(s, 0, 0); ctx.fillStyle = color; ctx.fillText(s, 0, 0);
  ctx.restore();
}
// sound effect: burst + lettering, e.g. sfx('POW!', 1200, 400, prog(t, 1, 1.2))
function sfx(s, x, y, p, { size = 150, color = CM.yellow, burst = CM.red, rot = -.12, seed = 7 } = {}) {
  const k = E.back(clamp(p));
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  if (burst) burstShape(x, y, size * (.6 + [...s].length * .16), { fill: burst, rot, seed });
  comicText(s, x, y, size, { color, shadow: CM.ink, rot });
  ctx.restore();
}
// yellow narration box, uppercase
function caption(s, x, y, { size = 34, maxW = 640, p = 1, color = CM.yellow } = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.font = `${size}px ${CM.font}`;
  const w = Math.min(maxW, ctx.measureText(s).width) + 40, h = size * 1.5;
  ctx.globalAlpha *= clamp(p * 3);
  ctx.fillStyle = color; ctx.fillRect(x, y, w, h); ctx.lineWidth = 5; ctx.strokeStyle = CM.ink; ctx.strokeRect(x, y, w, h);
  ctx.restore();
  text(s.toUpperCase(), x + 20, y + h / 2 + 2, { font: CM.font, size, color: CM.ink, align: 'left', jit: false, maxW, alpha: clamp(p * 3) });
}
// speech balloon with a tail pointing at (tx, ty); the words appear with p
function balloon(s, x, y, tx, ty, p, { size = 40, maxW = 620, thought = false } = {}) {
  const k = E.back(clamp(p));
  if (k <= 0) return;
  ctx.save(); ctx.font = `${size}px ${CM.font}`;
  const w = Math.min(maxW, ctx.measureText(s).width) + 90, h = size * 2;
  ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = CM.white; ctx.strokeStyle = CM.ink; ctx.lineWidth = 6;
  const ax = tx - x, ay = ty - y;
  if (!thought) { ctx.beginPath(); ctx.moveTo(-w * .12, h * .3); ctx.lineTo(ax / k, ay / k); ctx.lineTo(w * .1, h * .36); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU); ctx.fill(); ctx.stroke();
  if (!thought) { ctx.beginPath(); ctx.moveTo(-w * .12 + 6, h * .3 - 4); ctx.lineTo(w * .1 - 6, h * .36 - 4); ctx.lineWidth = 10; ctx.strokeStyle = CM.white; ctx.stroke(); }
  else [[.55, .7, 14], [.75, .95, 9]].forEach(([fx, fy, r]) => { ctx.beginPath(); ctx.arc(ax * fx / k, ay * fy / k, r, 0, TAU); ctx.fillStyle = CM.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = CM.ink; ctx.stroke(); });
  ctx.restore();
  text(s.toUpperCase(), x, y + 3, { font: CM.font, size: size * k, color: CM.ink, jit: false, maxW: maxW * k });
}
// the opening: pages of panels flip past (fns: panel painters) and settle under a red title slab
function titleSlab(title, t, pages, { flipEnd = 1.6, sub = '' } = {}) {
  const n = pages.length, i = Math.floor(clamp(t / flipEnd, 0, .999) * Math.max(8, n * 3)) % n;
  pages[t < flipEnd ? i : n - 1](t);
  if (t < flipEnd) { ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = CM.ink; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const k = E.out(prog(t, flipEnd - .3, flipEnd + .1));
  if (k <= 0) return;
  ctx.save(); ctx.font = `200px ${CM.font}`; const w = ctx.measureText(title).width + 120; ctx.restore();
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(lerp(1.4, 1, k), lerp(1.4, 1, k)); ctx.globalAlpha = k;
  ctx.fillStyle = CM.red; ctx.fillRect(-w / 2, -130, w, 260);
  text(title, 0, 12, { font: CM.font, size: 200, color: CM.white, jit: false });
  ctx.restore();
  if (sub) text(sub.toUpperCase(), W / 2, H / 2 + 200, { font: CM.font, size: 44, color: CM.white, outline: CM.ink, ow: 10, alpha: prog(t, flipEnd + .2, flipEnd + .5), jit: false });
}
// page turn: the next page slides in from the right with a curled shadow edge; p = 0..1
function pageTurn(p, drawNext) {
  if (p <= 0) return;
  const q = E.inOut(clamp(p)), edge = lerp(W + 80, -80, q);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath(); ctx.moveTo(edge, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(edge - 120, H); ctx.closePath(); ctx.clip();
  drawNext(); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(edge - 150, 0, edge + 40, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(edge - 60, 0); ctx.lineTo(edge + 30, 0); ctx.lineTo(edge - 90, H); ctx.lineTo(edge - 180, H); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// flat hero shape shading: fill a path, add a halftone shadow on one side, ink the outline. path: () => { ctx.beginPath(); ... }
function inked(path, fill, { shade = 'rgba(20,20,20,.9)', dir = [1, .3], width = 7 } = {}) {
  path(); ctx.fillStyle = fill; ctx.fill();
  ctx.save(); path(); ctx.clip(); ctx.globalAlpha = .55; halftone(0, 0, W, H, shade, { dot: 4, gap: 11, fade: 0, dir }); ctx.restore();
  path(); ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.strokeStyle = CM.ink; ctx.stroke();
}
