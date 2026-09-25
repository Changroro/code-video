'use strict';
// Neon sign look: glass tubes on a dark brick wall that buzz and flicker on, glow onto the wall, and reflect on a wet floor.
// Load after kit.js. Fonts: NE.font (Tilt Neon / Pretendard for Hangul).
const NE = { wall: '#1b1417', mortar: '#120d10', pink: '#ff4fa3', cyan: '#3ff0ff', yellow: '#ffe45c', green: '#6bff8a', orange: '#ff8a3d', violet: '#b56bff', font: 'NEON' };

function neWall(t, { floor = H * .82 } = {}) {
  if (!BG.brick) {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = rnd(31);
    g.fillStyle = NE.mortar; g.fillRect(0, 0, W, H);
    for (let y = 0, row = 0; y < H; y += 44, row++) for (let x = (row % 2) * -60; x < W; x += 120) {
      const v = 18 + r() * 14; g.fillStyle = `rgb(${v + 10},${v},${v + 4})`; g.fillRect(x + 3, y + 3, 114, 38);
    }
    const v = g.createRadialGradient(W / 2, H * .4, H * .2, W / 2, H * .5, W * .75); v.addColorStop(0, 'rgba(0,0,0,.1)'); v.addColorStop(1, 'rgba(0,0,0,.75)');
    g.fillStyle = v; g.fillRect(0, 0, W, H); BG.brick = c;
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BG.brick, 0, 0);
  if (floor < H) { const g = ctx.createLinearGradient(0, floor, 0, H); g.addColorStop(0, '#0b0809'); g.addColorStop(1, '#050304'); ctx.fillStyle = g; ctx.fillRect(0, floor, W, H - floor); }
  ctx.restore();
}
// how lit a tube is at time t: dark, a few stuttering flickers from t0, then steady (with a rare dip). 0..1
function neOn(t, t0, seed = 1) {
  if (t < t0) return 0;
  const k = t - t0, r = rnd(hash(seed, Math.floor(k * 18)));
  if (k < .55) return r() > .45 ? 1 : .08;
  const dip = rnd(hash(seed, Math.floor(t * 6)))() > .985 ? .55 : 1;
  return dip;
}
// glow pass shared by text and tubes: wide soft halo, tighter glow, white-hot core
function neGlow(stroke, color, on, width) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (on < .1) { ctx.strokeStyle = mixHex(color, '#000000', .72); ctx.lineWidth = width; stroke(); ctx.restore(); return; }
  ctx.strokeStyle = color;
  [[width * 4, 60, .35], [width * 1.8, 26, .7], [width, 10, 1]].forEach(([lw, blur, a]) => { ctx.globalAlpha = a * on; ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.lineWidth = lw; stroke(); });
  ctx.shadowBlur = 0; ctx.globalAlpha = on; ctx.strokeStyle = mixHex(color, '#ffffff', .75); ctx.lineWidth = width * .38; stroke();
  ctx.restore();
}
// neon lettering
function neText(s, x, y, size, color, on, { align = 'center', weight = 400, glowWall = true } = {}) {
  ctx.save(); ctx.font = `${weight} ${size}px ${NE.font}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (glowWall && on > .1) { const w = ctx.measureText(s).width, g = ctx.createRadialGradient(x, y, 0, x, y, w * .7 + size); g.addColorStop(0, color + '38'); g.addColorStop(1, color + '00'); ctx.fillStyle = g; ctx.fillRect(x - w - size * 2, y - size * 3, w * 2 + size * 4, size * 6); }
  neGlow(() => ctx.strokeText(s, x, y), color, on, Math.max(2.5, size * .05));
  ctx.restore();
}
// a tube following pts (an icon, an underline, a frame)
function neTube(pts, color, on, width = 8, { close = false } = {}) {
  neGlow(() => { ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); if (close) ctx.closePath(); ctx.stroke(); }, color, on, width);
}
// a rounded frame of tube around a box, often the sign's border
function neFrame(x, y, w, h, color, on, r = 40, width = 8) {
  neGlow(() => { rr(x, y, w, h, r); ctx.stroke(); }, color, on, width);
}
// wet floor: mirror everything above `floor` into it, dim and blurred
const NE_BUF = document.createElement('canvas');
function neReflect(floor = H * .82, strength = .35) {
  NE_BUF.width = W / 2; NE_BUF.height = (H - floor) / 2;
  const g = NE_BUF.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, NE_BUF.width, NE_BUF.height);
  g.filter = 'blur(3px)'; g.translate(0, NE_BUF.height); g.scale(1, -1);
  g.drawImage(cv, 0, floor - (H - floor), W, H - floor, 0, 0, W / 2, NE_BUF.height);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = strength; ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(NE_BUF, 0, floor, W, H - floor); ctx.restore();
}
// buzz cue times for audio.json: a short 'click' at every flicker before the tube settles
function neCues(t0, seed = 1, gain = .3) {
  const out = []; let last = -1;
  for (let k = 0; k < .55; k += 1 / 18) { const on = rnd(hash(seed, Math.floor(k * 18)))() > .45; if (on && last !== 1) out.push([+(t0 + k).toFixed(3), 'click', gain]); last = on ? 1 : 0; }
  return out;
}
