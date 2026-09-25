'use strict';
// Split-flap board look: a railway departures board whose tiles clatter through the alphabet onto each message,
// amber status lamps, and a station clock. Load after kit.js. Fonts: SF.font (Roboto Mono / Pretendard for Hangul).
const SF = { bg: '#0f0f10', frame: '#1b1b1d', tile: '#232326', tile2: '#1a1a1c', ink: '#f1ede2', dim: '#7c7a74', amber: '#ffb000', green: '#39d353', red: '#ff5a4f',
  font: 'FLAP', chars: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:-/·!?&@#%+×', flip: .045, stagger: .035 };

function sfBoard(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = SF.bg; ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,255,255,.04)'); g.addColorStop(1, 'rgba(0,0,0,.3)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
// which character a tile shows at time t: it flips through the charset onto `to`, starting at t0. A real board runs the
// whole drum; here each tile runs at most `cap` flips (varied per tile) so a message lands in under a second
function sfChar(to, from, t, t0, cap = 12) {
  const cs = SF.chars, n = cs.length, a0 = Math.max(0, cs.indexOf(from)), b0 = cs.indexOf(to), b = b0 < 0 ? (a0 + 7) % n : b0;
  const full = ((b - a0) % n + n) % n, steps = Math.min(full, cap), a = (b - steps + n) % n, k = Math.floor(Math.max(0, t - t0) / SF.flip);
  if (k >= steps) return [to, 1];
  return [cs[(a + k) % n], (Math.max(0, t - t0) % SF.flip) / SF.flip];
}
// one tile flipping from `cur` to `next` (ph 0..1): the next top shows behind the falling flap, whose front is the
// current top and whose back is the next bottom; the current bottom stays until the flap lands
function sfTile(x, y, w, h, cur, next, ph, { color = SF.ink, bg = SF.tile, size = null } = {}) {
  const fs = size ?? h * .78, r = w * .12, hy = y + h / 2;
  const half = (c, top) => {
    ctx.save(); ctx.beginPath(); ctx.rect(x, top ? y : hy, w, h / 2); ctx.clip();
    ctx.fillStyle = top ? bg : SF.tile2; rr(x, y, w, h, r); ctx.fill();
    text(c, x + w / 2, hy + fs * .04, { font: SF.font, weight: 700, size: fs, color, jit: false });
    ctx.restore();
  };
  const moving = ph > 0 && ph < 1 && next !== cur;
  half(moving ? next : cur, true); half(cur, false);
  if (moving) {
    const k = Math.cos(ph * Math.PI);
    ctx.save(); ctx.translate(0, hy); ctx.scale(1, Math.max(.02, Math.abs(k))); ctx.translate(0, -hy);
    half(k > 0 ? cur : next, k > 0);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = .35 * (1 - Math.abs(k)); ctx.fillStyle = '#000'; ctx.fillRect(x, k > 0 ? hy : y, w, h / 2); ctx.restore();
  }
  ctx.fillStyle = '#000'; ctx.fillRect(x, hy - 1.5, w, 3);
}
// a row of tiles showing `s`, flipping in from `from` (a string or ''), starting at t0, one column after another
function sfRow(s, x, y, t, t0, { cols = null, w = 56, h = 84, gap = 6, from = '', color = SF.ink, upper = true } = {}) {
  const str = [...(upper ? s.toUpperCase() : s)], n = cols ?? str.length, src = [...(upper ? from.toUpperCase() : from)];
  for (let i = 0; i < n; i++) {
    const to = str[i] ?? ' ', fr = src[i] ?? ' ', [ch, ph] = sfChar(to, fr, t, t0 + i * SF.stagger, 10 + (i * 7) % 9);
    const idx = SF.chars.indexOf(ch), next = ph < 1 ? SF.chars[(idx + 1) % SF.chars.length] : ch;
    sfTile(x + i * (w + gap), y, w, h, ch, next, ph, { color });
  }
  return n * (w + gap) - gap;
}
// the whole departures board: rows [{ time, dest, gate, status, statusColor }], a header, a clock
function sfDepartures(t, rows, { title = 'DEPARTURES', start = 0, rowGap = 1.1, x = 120, y = 250, w = 44, h = 66 } = {}) {
  text(title, x, 150, { font: SF.font, weight: 700, size: 54, color: SF.amber, align: 'left', jit: false });
  const clock = new Date(Date.UTC(2026, 8, 25, 9, 41 + Math.floor(t / 60)));
  text(`${String(clock.getUTCHours()).padStart(2, '0')}:${String(clock.getUTCMinutes()).padStart(2, '0')}`, W - x, 150, { font: SF.font, weight: 700, size: 54, color: SF.ink, align: 'right', jit: false });
  ctx.fillStyle = '#2a2a2d'; ctx.fillRect(x, 195, W - 2 * x, 3);
  rows.forEach((r, i) => {
    const ry = y + i * (h + 26), t0 = start + i * rowGap;
    let cx = x;
    cx += sfRow(r.time ?? '', cx, ry, t, t0, { cols: 5, w, h }) + 30;
    cx += sfRow(r.dest ?? '', cx, ry, t, t0 + .1, { cols: 18, w, h }) + 30;
    sfRow(r.gate ?? '', cx, ry, t, t0 + .2, { cols: 3, w, h });
    const on = t > t0 + 1, blink = r.blink && Math.floor(T * 2) % 2;
    ctx.fillStyle = on && !blink ? (r.statusColor ?? SF.amber) : '#3a3a3c'; ctx.beginPath(); ctx.arc(W - x - 260, ry + h / 2, 12, 0, TAU); ctx.fill();
    if (on) text(r.status ?? '', W - x - 230, ry + h / 2 + 2, { font: SF.font, weight: 700, size: 34, color: r.statusColor ?? SF.amber, align: 'left', jit: false, alpha: blink ? .35 : 1 });
  });
}
// flap sound cues for audio.json: one 'click' per flip, thinned out so the mix stays clean
function sfCues(t0, s, { gain = .25, every = 2 } = {}) {
  const out = [];
  [...s.toUpperCase()].forEach((c, i) => { const b = SF.chars.indexOf(c), steps = Math.min(b < 0 ? 7 : b, 10 + (i * 7) % 9); for (let k = 0; k < steps; k += every) out.push([+(t0 + i * SF.stagger + k * SF.flip).toFixed(3), 'click', gain]); });
  return out;
}
