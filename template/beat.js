'use strict';
// Signature pieces of the beat-synced footage format, after @twoclipping's "hooklab" promo (docs/styles/beat.jpg):
// high-end minimal, one accent, real clips on a dark stage, a wall -> carousel -> phone + panel run, stats on push cuts.
// Load after kit.js. Clips come from boot({ clips }) and draw with clip(). Motion blur: window.VIDEO = { fps: 60, blur: 3 }.
const BT = { light: '#f7f3ef', glow: '#ffd9c4', dark: '#0b0b0c', floor: '#ff6a1a', ink: '#151515', inkLight: '#f4f4f4', dim: '#8a8a8a', accent: '#ff5a1f', ok: '#22c55e', font: 'BSANS', mono: 'BMONO' };

// warm off-white with two slow peach glows
function stageLight(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = BT.light; ctx.fillRect(0, 0, W, H);
  [[.18 + Math.sin(t * .3) * .04, .12, .55], [.8, .9 + Math.cos(t * .25) * .04, .5]].forEach(([fx, fy, r]) => {
    const g = ctx.createRadialGradient(W * fx, H * fy, 0, W * fx, H * fy, W * r);
    g.addColorStop(0, BT.glow + 'cc'); g.addColorStop(1, BT.glow + '00'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  });
  ctx.restore();
}
// near-black stage with a warm glow rising from the floor
function stageDark(glow = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = BT.dark; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * 1.15, 0, W / 2, H * 1.15, W * .6);
  g.addColorStop(0, `rgba(255,106,26,${.28 * glow})`); g.addColorStop(1, 'rgba(255,106,26,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
// words land one per beat: words [[text, time]] on the scene clock; a word '■' becomes an accent block (the masked word).
// Returns the block's box [x, y, w, h] so the next beat can grow it into the product UI without re-laying out the words.
function beatWords(words, x, y, t, { size = 96, color = BT.ink, weight = 600, align = 'center', lineH = 1.1, maxW = W * .7 } = {}) {
  const lines = [[]]; let lw = 0, block = null;
  const ws = words.map(([s]) => s === '■' ? size * 1.5 : measure(s, BT.font, size, weight)), sp = size * .26;
  ws.forEach((w, i) => { if (lw + w > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += w + sp; });
  lines.forEach((ln, li) => {
    const tw = ln.reduce((a, i) => a + ws[i] + sp, -sp);
    let cx = align === 'center' ? x - tw / 2 : x;
    const cy = y + (li - (lines.length - 1) / 2) * size * lineH;
    ln.forEach(i => {
      const [s, at] = words[i], q = E.out(prog(t, at, at + .18));
      if (q > 0) {
        ctx.save(); ctx.globalAlpha *= q; ctx.translate(0, (1 - q) * size * .35);
        if (s === '■') { block = [cx, cy - size * .36, ws[i], size * .72]; ctx.fillStyle = BT.accent; rr(...block, size * .14); ctx.fill(); }
        else text(s, cx + ws[i] / 2, cy, { font: BT.font, weight, size, color, jit: false });
        ctx.restore();
      }
      cx += ws[i] + sp;
    });
  });
  return block;
}
// white product window with a sidebar; returns the content box [x, y, w, h]
function appWindow(x, y, w, h, { title = '', accentDot = true } = {}) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.12)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; ctx.fillStyle = '#fff'; rr(x, y, w, h, 18); ctx.fill(); ctx.restore();
  ctx.save(); ctx.fillStyle = '#f5f5f4'; rr(x, y, w * .16, h, [18, 0, 0, 18]); ctx.fill(); ctx.restore();
  if (accentDot) { ctx.fillStyle = BT.accent; rr(x + 22, y + 22, 18, 18, 5); ctx.fill(); }
  for (let i = 0; i < 5; i++) { ctx.fillStyle = '#e4e4e2'; rr(x + 22, y + 70 + i * 30, w * .16 - 44 - (i % 2) * 20, 8, 4); ctx.fill(); }
  if (title) text(title, x + w * .16 + 40, y + 60, { font: BT.font, weight: 600, size: 26, color: BT.ink, align: 'left', jit: false });
  return [x + w * .16 + 40, y + 90, w * .84 - 80, h - 120];
}
// input field with typed text and a caret
function field(x, y, w, s, p, { size = 20, focus = true } = {}) {
  ctx.save(); ctx.strokeStyle = focus ? BT.accent : '#ddd'; ctx.lineWidth = 2; rr(x, y, w, size * 2.4, 10); ctx.stroke(); ctx.restore();
  typeOn(s, x + 18, y + size * 1.2, p, { font: BT.mono, size, color: BT.ink });
}
function pillButton(label, x, y, { bg = BT.ink, fg = '#fff', size = 18, press = 0 } = {}) {
  const w = measure(label, BT.font, size, 600) + 44, k = 1 - press * .06;
  ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(k, k); ctx.fillStyle = bg; rr(-w / 2, -size * 1.1, w, size * 2.2, size * 1.1); ctx.fill(); ctx.restore();
  text(label, x + w / 2, y + 1, { font: BT.font, weight: 600, size: size * k, color: fg, jit: false });
  return w;
}
// a wall of vertical clips: `scan` 0..1 sweeps a light bar across; after it passes, all but `winners` dim and winners get a frame and a tag
function clipWall(ids, t, { cols = 6, rows = 3, x = W / 2, y = H / 2, cardH = 250, gap = 22, scan = 0, winners = [], tags = [], caption = '' } = {}) {
  const cw = cardH * .5625, tw = cols * cw + (cols - 1) * gap, th = rows * cardH + (rows - 1) * gap, x0 = x - tw / 2, y0 = y - th / 2, sx = lerp(x0 - 60, x0 + tw + 60, scan);
  for (let i = 0; i < cols * rows; i++) {
    const cx = x0 + (i % cols) * (cw + gap), cy = y0 + Math.floor(i / cols) * (cardH + gap), win = winners.includes(i), passed = scan > 0 && sx > cx + cw;
    ctx.save(); rr(cx, cy, cw, cardH, 12); ctx.clip();
    clip(ids[i % ids.length], t + i * .37, cx, cy, cw, cardH);
    if (passed && !win) { ctx.fillStyle = 'rgba(0,0,0,.62)'; ctx.fillRect(cx, cy, cw, cardH); }
    ctx.restore();
    if (passed && win) {
      ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; rr(cx - 4, cy - 4, cw + 8, cardH + 8, 15); ctx.stroke(); ctx.restore();
      const tag = tags[winners.indexOf(i)] ?? 'winner', w = measure(tag, BT.font, 14, 600) + 20;
      ctx.fillStyle = '#fff'; rr(cx + cw / 2 - w / 2, cy - 18, w, 26, 13); ctx.fill();
      text(tag, cx + cw / 2, cy - 5, { font: BT.font, weight: 600, size: 14, color: BT.ink, jit: false });
    }
  }
  if (scan > 0 && scan < 1) {
    const g = ctx.createLinearGradient(sx - 80, 0, sx + 6, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.35)');
    ctx.fillStyle = g; ctx.fillRect(sx - 80, y0 - 20, 86, th + 40); ctx.fillStyle = '#fff'; ctx.fillRect(sx, y0 - 20, 2, th + 40);
  }
  if (caption) text(caption, x, y0 - 40, { font: BT.font, weight: 500, size: 18, color: BT.inkLight, jit: false });
}
// a 3D carousel of vertical clips on a cylinder with floor reflections. spin in radians; the card facing the camera is at spin = -i * 2π / n
function carousel(ids, t, spin, { x = W / 2, y = H * .5, R = 1000, cardH = 300, n = 32, reflect = true } = {}) {
  const cw = cardH * .5625, cards = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + spin, z = Math.cos(a);
    if (z < -.05) continue;
    cards.push({ i, a, z, px: x + Math.sin(a) * R, s: lerp(.62, 1, (z + 1) / 2) });
  }
  cards.sort((a, b) => a.z - b.z).forEach(({ i, a, z, px, s }) => {
    const w = cw * s * Math.max(.08, z), h = cardH * s, top = y - h / 2;
    const draw = () => { ctx.save(); rr(px - w / 2, top, w, h, 10 * s); ctx.clip(); clip(ids[i % ids.length], t + i * .41, px - w / 2, top, w, h); ctx.fillStyle = `rgba(0,0,0,${(1 - z) * .55})`; ctx.fillRect(px - w / 2, top, w, h); ctx.restore(); };
    draw();
    if (reflect) {
      ctx.save(); ctx.translate(0, 2 * (top + h) + 8); ctx.scale(1, -1); ctx.globalAlpha *= .28; draw(); ctx.restore();
    }
  });
  if (reflect) {
    const g = ctx.createLinearGradient(0, y + cardH * .5, 0, y + cardH * 1.05); g.addColorStop(0, 'rgba(11,11,12,0)'); g.addColorStop(1, 'rgba(11,11,12,.96)');
    ctx.fillStyle = g; ctx.fillRect(0, y + cardH * .5, W, H - y - cardH * .5);
  }
}
// the hero clip in a phone with a feed overlay (tabs, caption, shop button)
function phoneClip(id, t, x, y, h, { caption = '', button = 'Shop now' } = {}) {
  return phone(x, y, h, (sx, sy, sw, sh) => {
    clip(id, t, sx, sy, sw, sh);
    const g = ctx.createLinearGradient(0, sy + sh * .6, 0, sy + sh); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.7)'); ctx.fillStyle = g; ctx.fillRect(sx, sy + sh * .6, sw, sh * .4);
    text('Following   For You', sx + sw / 2, sy + sh * .06, { font: BT.font, weight: 600, size: sh * .022, color: '#fff', jit: false });
    if (caption) text(caption, sx + sw * .06, sy + sh * .82, { font: BT.font, size: sh * .021, color: '#fff', align: 'left', jit: false, maxW: sw * .8 });
    ctx.fillStyle = '#fff'; rr(sx + sw * .06, sy + sh * .87, sw * .88, sh * .05, sh * .012); ctx.fill();
    text(button, sx + sw / 2, sy + sh * .895, { font: BT.font, weight: 600, size: sh * .02, color: BT.ink, jit: false });
  });
}
// dark settings panel: toggles switch on at their times, the button turns green at `clickAt`, then (after flipAt) it flips into a result card
function campaignPanel(x, y, t, { w = 420, title = 'launch campaign', toggles = [['meta ads', .3], ['tiktok ads', .6]], budget = '$50 / day', button = 'launch 24 ads', done = '✓ 24 ads live', clickAt = 1.4, flipAt = 99, result = null } = {}) {
  const flip = prog(t, flipAt, flipAt + .35), sx = Math.abs(Math.cos(flip * Math.PI)), back = flip > .5, h = 300;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(Math.max(.02, sx), 1); ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = '#161618'; rr(0, 0, w, h, 16); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1.5; rr(0, 0, w, h, 16); ctx.stroke();
  if (!back) {
    text(title, 28, 40, { font: BT.font, weight: 600, size: 20, color: BT.inkLight, align: 'left', jit: false });
    toggles.forEach(([s, at], i) => {
      const on = E.out(prog(t, at, at + .15)), ty = 92 + i * 46;
      text(s, 28, ty, { font: BT.font, size: 17, color: BT.dim, align: 'left', jit: false });
      ctx.fillStyle = on > .5 ? BT.ok : '#3a3a3c'; rr(w - 76, ty - 12, 46, 24, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w - 64 + on * 22, ty, 9, 0, TAU); ctx.fill();
    });
    const by = 92 + toggles.length * 46;
    text('daily budget', 28, by, { font: BT.font, size: 17, color: BT.dim, align: 'left', jit: false });
    ctx.fillStyle = '#3a3a3c'; ctx.fillRect(w - 190, by - 2, 120, 3); ctx.fillStyle = '#fff'; ctx.fillRect(w - 190, by - 2, 80, 3);
    text(budget, w - 28, by, { font: BT.font, size: 15, color: BT.inkLight, align: 'right', jit: false });
    const ok = t >= clickAt, press = clamp(1 - Math.abs(t - clickAt) * 8);
    ctx.save(); ctx.translate(w / 2, h - 46); ctx.scale(1 - press * .05, 1 - press * .05); ctx.fillStyle = ok ? BT.ok : '#fff'; rr(-(w - 56) / 2, -22, w - 56, 44, 10); ctx.fill(); ctx.restore();
    text(ok ? done : button, w / 2, h - 45, { font: BT.font, weight: 600, size: 17, color: ok ? '#fff' : BT.ink, jit: false });
  } else if (result) {
    text(result.title, 28, 40, { font: BT.font, weight: 600, size: 18, color: BT.inkLight, align: 'left', jit: false });
    (result.stats ?? []).forEach(([v, l], i) => { text(v, 28 + i * 150, 96, { font: BT.font, weight: 700, size: 34, color: BT.inkLight, align: 'left', jit: false }); text(l, 28 + i * 150, 128, { font: BT.font, size: 13, color: BT.dim, align: 'left', jit: false }); });
    const pts = Array.from({ length: 24 }, (_, i) => [40 + i * (w - 80) / 23, h - 40 - (i / 23) ** 1.6 * 110 - Math.sin(i * 1.7) * 8]);
    ctx.strokeStyle = BT.accent; ctx.lineWidth = 3; ctx.beginPath(); polyPart(pts, prog(t, flipAt + .3, flipAt + 1.2)).forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.stroke();
  }
  ctx.restore();
}
// ranked text rows with a score that counts up: rows [[text, score, time]]
function scoreRows(rows, x, y, t, { w = 1100, size = 30, gap = 70, label = '' } = {}) {
  if (label) text(label, x + w / 2, y - 90, { font: BT.mono, size: 13, color: BT.dim, jit: false });
  rows.forEach(([s, score, at], i) => {
    const q = E.out(prog(t, at, at + .25)), ry = y + i * gap;
    if (q <= 0) return;
    ctx.save(); ctx.globalAlpha *= q;
    ctx.fillStyle = BT.accent; ctx.fillRect(x, ry - 3, 10, 6);
    text(s, x + 36, ry, { font: BT.font, weight: 600, size, color: BT.inkLight, align: 'left', jit: false });
    text(String(Math.round(score * E.out(prog(t, at, at + .8)))), x + w - 90, ry, { font: BT.mono, size: size * .7, color: BT.inkLight, align: 'right', jit: false });
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x + w - 70, ry, 70, 1.5);
    ctx.restore();
  });
}
// a big stat that pushes in (scale down onto the screen); pair with VIDEO.blur for the smear
function pushStat(value, label, t, { at = 0, color = BT.inkLight, size = 190 } = {}) {
  const q = E.out(prog(t, at, at + .22));
  if (q <= 0) return;
  ctx.save(); ctx.translate(W / 2, H / 2 - 20); const s = lerp(1.9, 1, q); ctx.scale(s, s); ctx.globalAlpha *= q;
  text(value, 0, 0, { font: BT.font, weight: 700, size, color, jit: false });
  ctx.restore();
  text(label, W / 2, H / 2 + size * .5, { font: BT.font, size: 20, color: BT.dim, alpha: prog(t, at + .15, at + .35), jit: false });
}
// a word ticker: each word replaces the last on its beat; the last word takes the accent. words [[text, time]]
function ticker(words, t, { size = 150, sub = '' } = {}) {
  let cur = -1;
  words.forEach(([, at], i) => { if (t >= at) cur = i; });
  if (cur < 0) return;
  const [s, at] = words[cur], q = E.out(prog(t, at, at + .16)), last = cur === words.length - 1;
  if (cur > 0) { const out = 1 - q; if (out > 0) text(words[cur - 1][0], W / 2, H / 2 - size * .5 * q, { font: BT.font, weight: 700, size, color: BT.inkLight, alpha: out * .6, jit: false }); }
  text(s, W / 2, H / 2 + size * .45 * (1 - q), { font: BT.font, weight: 700, size, color: last ? BT.accent : BT.inkLight, alpha: q, jit: false });
  if (last && sub) text(sub, W / 2, H / 2 + size * .55, { font: BT.font, size: 24, color: BT.dim, alpha: prog(t, at + .2, at + .5), jit: false });
}
