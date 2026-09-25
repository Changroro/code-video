'use strict';
// Toon look: flat saturated colour, one cel-shade tone, thick even ink outlines, squash-and-stretch bounces,
// letters that pop one by one, sparkles, and iris transitions. Load after kit.js. Fonts: TN.font (Fredoka / Jua for Hangul).
const TN = { ink: '#1b1b1f', sky: '#7fd0ff', sky2: '#b9e8ff', grass: '#79d65a', grass2: '#57b53c', sun: '#ffd43b', pink: '#ff6fb1', orange: '#ff8a3d',
  purple: '#8b6cff', white: '#ffffff', font: 'TOON', line: 9 };

// backdrops: 'sky' (sky + rolling hills), 'burst' (radiating stripes in two tones), 'dots' (polka dots)
function toonBG(kind = 'sky', t = 0, { a = TN.sky, b = TN.sky2 } = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (kind === 'burst') {
    ctx.fillStyle = a; ctx.fillRect(0, 0, W, H); ctx.fillStyle = b;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU + t * .15, a1 = (i + 1) / 24 * TAU + t * .15; ctx.beginPath(); ctx.moveTo(W / 2, H / 2); ctx.arc(W / 2, H / 2, W, a0, a1); ctx.fill(); }
  } else if (kind === 'dots') {
    ctx.fillStyle = a; ctx.fillRect(0, 0, W, H); ctx.fillStyle = b;
    for (let y = -40, r = 0; y < H + 60; y += 70, r++) for (let x = (r % 2) * 35 - 40 + (t * 20) % 70; x < W + 60; x += 70) { ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); }
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, H * .75); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    [[TN.grass2, H * .74, 180, .0016, 0], [TN.grass, H * .8, 120, .0022, 2]].forEach(([c, y0, amp, f, ph]) => {
      ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y0 - Math.sin(x * f + ph) * amp * .35 - amp * .2); ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = TN.line * .7; ctx.strokeStyle = TN.ink; ctx.stroke();
    });
  }
  ctx.restore();
}
// fill a path flat, add one cel-shade tone offset inside it, ink the outline. path: () => { ctx.beginPath(); ... }
function toonShape(path, fill, { shade = null, off = [-14, -10], width = TN.line } = {}) {
  path(); ctx.fillStyle = fill; ctx.fill();
  if (shade !== false) {
    // shade the whole shape, then lay the base colour back over a copy nudged by `off`: a crescent of shade remains
    ctx.save(); path(); ctx.clip();
    ctx.fillStyle = shade ?? mixHex(fill, '#000000', .22); ctx.fill();
    ctx.translate(off[0], off[1]); path(); ctx.fillStyle = fill; ctx.fill();
    ctx.restore();
  }
  path(); ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = TN.ink; ctx.stroke();
}
// squash and stretch for a bounce that lands at t0: returns [sx, sy, dy] (dy: height above ground)
function bounce(t, t0, { h = 220, period = .7, decay = .55 } = {}) {
  const k = Math.max(0, t - t0), n = Math.floor(k / period), ph = (k % period) / period, amp = h * decay ** n;
  const dy = amp * 4 * ph * (1 - ph), land = Math.max(0, 1 - Math.min(ph, 1 - ph) * 8) * decay ** n;
  return [1 + land * .28 - (1 - land) * .02 * Math.sin(ph * Math.PI), 1 - land * .26 + (1 - land) * .06 * Math.sin(ph * Math.PI), dy];
}
// overshoot pop 0 → 1.15 → 1
const pop = (t, a, d = .35) => E.back(prog(t, a, a + d));
// chunky outlined title: letters pop in one after another with a small wave
function toonText(s, x, y, t, { size = 150, a = 0, gap = .06, fill = TN.white, shadow = TN.ink, align = 'center', wave = 8 } = {}) {
  ctx.save(); ctx.font = `700 ${size}px ${TN.font}`;
  const chars = [...s], ws = chars.map(c => ctx.measureText(c).width), total = ws.reduce((p, q) => p + q, 0);
  let cx = align === 'center' ? x - total / 2 : x;
  chars.forEach((c, i) => {
    const k = pop(t, a + i * gap), yy = y + Math.sin(T * 5 + i * .7) * wave * (k >= 1 ? 1 : 0);
    if (k > 0) {
      ctx.save(); ctx.translate(cx + ws[i] / 2, yy); ctx.scale(k, k); ctx.rotate((i % 2 ? .04 : -.04));
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = size * .2; ctx.strokeStyle = TN.ink; ctx.strokeText(c, size * .05, size * .07); ctx.fillStyle = shadow; ctx.fillText(c, size * .05, size * .07);
      ctx.strokeText(c, 0, 0); ctx.fillStyle = fill; ctx.fillText(c, 0, 0);
      ctx.restore();
    }
    cx += ws[i];
  });
  ctx.restore();
}
// four-point sparkles that twinkle around (x, y)
function sparkles(x, y, r, t, { n = 6, color = TN.white, seed = 5 } = {}) {
  const g = rnd(seed);
  for (let i = 0; i < n; i++) {
    const a = g() * TAU, d = r * (.5 + g() * .6), ph = (t * 1.6 + g()) % 1, s = Math.sin(ph * Math.PI) * (14 + g() * 16);
    if (s <= .5) continue;
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
    ctx.beginPath(); ctx.moveTo(px, py - s); ctx.quadraticCurveTo(px, py, px + s, py); ctx.quadraticCurveTo(px, py, px, py + s); ctx.quadraticCurveTo(px, py, px - s, py); ctx.quadraticCurveTo(px, py, px, py - s);
    ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = TN.ink; ctx.stroke();
  }
}
// smear lines behind something moving fast from (x0, y) to (x1, y)
function smear(x0, x1, y, h, p, color = TN.ink) {
  if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalAlpha *= Math.sin(p * Math.PI); ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { ctx.lineWidth = 6 - i; const yy = y - h / 2 + (i + .5) * h / 5; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, p * .5), yy); ctx.lineTo(lerp(x0, x1, p) - 40, yy); ctx.stroke(); }
  ctx.restore();
}
// iris transition: p 0..1 closes a black circle onto (cx, cy); pass 1 - p to open it
function iris(p, cx = W / 2, cy = H / 2, color = TN.ink) {
  if (p <= 0) return;
  const r = (1 - E.inOut(clamp(p))) * Math.hypot(W, H) * .6;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = color;
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(cx, cy, Math.max(0, r), 0, TAU, true); ctx.fill('evenodd');
  ctx.restore();
}
// a round buddy with big eyes: the default toon character when the brand has no mascot. mood: 'happy' | 'wow'
function buddy(x, y, s, t, { color = TN.orange, mood = 'happy', look = 0, sq = [1, 1] } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sq[0], s * sq[1]);
  toonShape(() => { ctx.beginPath(); ctx.ellipse(0, -60, 70, 62, 0, 0, TAU); }, color, { width: TN.line / s });
  const blink = (T * .5 % 1) > .96;
  [-26, 26].forEach(ex => {
    ctx.beginPath(); ctx.ellipse(ex, -72, 16, blink ? 2 : 20, 0, 0, TAU); ctx.fillStyle = TN.white; ctx.fill(); ctx.lineWidth = 4 / s; ctx.strokeStyle = TN.ink; ctx.stroke();
    if (!blink) { ctx.beginPath(); ctx.arc(ex + look * 6, -68, 8, 0, TAU); ctx.fillStyle = TN.ink; ctx.fill(); }
  });
  ctx.lineWidth = 5 / s; ctx.strokeStyle = TN.ink; ctx.beginPath();
  if (mood === 'wow') { ctx.ellipse(0, -34, 10, 13, 0, 0, TAU); ctx.fillStyle = TN.ink; ctx.fill(); }
  else { ctx.arc(0, -44, 18, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
  [-40, 40].forEach(fx => { ctx.beginPath(); ctx.ellipse(fx, 0, 22, 10, 0, 0, TAU); ctx.fillStyle = mixHex(color, '#000000', .25); ctx.fill(); ctx.lineWidth = 4 / s; ctx.stroke(); });
  ctx.restore();
}
// a rounded sign board the characters can hold up
function toonSign(s, x, y, t, a, { w = null, fill = TN.white, size = 64 } = {}) {
  const k = pop(t, a);
  if (k <= 0) return;
  ctx.save(); ctx.font = `700 ${size}px ${TN.font}`; const bw = w ?? ctx.measureText(s).width + 90, bh = size * 1.7; ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(-.03);
  toonShape(() => { rr(-bw / 2, -bh / 2, bw, bh, 26); }, fill);
  ctx.restore();
  text(s, x, y + 4, { font: TN.font, weight: 700, size: size * k, color: TN.ink, jit: false, rot: -.03 });
}
