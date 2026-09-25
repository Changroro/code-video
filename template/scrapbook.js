'use strict';
// Scrapbook look: kraft paper desk, lined notebook pages, polaroids held by washi tape, torn paper labels,
// die-cut stickers, rubber stamps, and marker doodles. Load after kit.js.
// Fonts: SB.hand (Caveat / Gaegu), SB.marker (Permanent Marker / Black Han Sans), SB.type (IBM Plex Mono / NanumGothicCoding).
const SB = { desk: '#cdb38d', note: '#fbf8f0', ink: '#2b2622', line: '#a9c4e0', margin: '#e38a8a', tape: 'rgba(236,214,160,.82)', tape2: 'rgba(170,215,205,.8)',
  red: '#d94f3d', blue: '#3b6fb6', yellow: '#ffd66b', hand: 'SCRIPT', marker: 'MARKER', type: 'TYPE' };

// kraft paper with fibres (built once, then reused)
function sbDesk() {
  if (!BG.kraft) BG.kraft = makeBG(SB.desk, 10, '#6b4a22', 'rgba(60,40,15,.28)');
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BG.kraft, 0, 0); ctx.restore();
}
const tilt = (x, y, rot, fn) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fn(); ctx.restore(); };
function dropShadow(d = 10) { ctx.shadowColor = 'rgba(40,25,10,.35)'; ctx.shadowBlur = d * 1.6; ctx.shadowOffsetX = d * .4; ctx.shadowOffsetY = d * .8; }
// a lined notebook page centred on (x, y)
function notePage(x, y, w, h, rot = 0, { holes = true } = {}) {
  tilt(x, y, rot, () => {
    ctx.save(); dropShadow(12); ctx.fillStyle = SB.note; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
    ctx.strokeStyle = SB.line; ctx.lineWidth = 2;
    for (let yy = -h / 2 + 90; yy < h / 2 - 20; yy += 46) { ctx.beginPath(); ctx.moveTo(-w / 2, yy); ctx.lineTo(w / 2, yy); ctx.stroke(); }
    ctx.strokeStyle = SB.margin; ctx.beginPath(); ctx.moveTo(-w / 2 + 90, -h / 2); ctx.lineTo(-w / 2 + 90, h / 2); ctx.stroke();
    if (holes) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-w / 2 + 40, -h / 3 + i * h / 3, 13, 0, TAU); ctx.fillStyle = SB.desk; ctx.fill(); }
  });
}
// a strip of washi tape with ragged ends
function tape(x, y, w, rot = 0, color = SB.tape) {
  tilt(x, y, rot, () => {
    const h = 44, r = rnd(hash(x | 0, y | 0));
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2);
    for (let i = 0; i <= 6; i++) ctx.lineTo(w / 2 + (i % 2 ? 6 : -4) * r(), -h / 2 + i * h / 6);
    for (let i = 6; i >= 0; i--) ctx.lineTo(-w / 2 + (i % 2 ? -6 : 4) * r(), -h / 2 + i * h / 6);
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    ctx.globalAlpha = .18; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; for (let k = -w / 2 + 12; k < w / 2; k += 22) { ctx.beginPath(); ctx.moveTo(k, -h / 2); ctx.lineTo(k + 10, h / 2); ctx.stroke(); }
  });
}
// a polaroid: `photo` is an image or a painter (x, y, w, h) => {}; caption in handwriting; drops in with p
function polaroid(photo, x, y, w, rot, p, caption = '', { tapeColor = SB.tape } = {}) {
  const k = E.back(clamp(p));
  if (k <= 0) return;
  const pw = w, ph = w * .8, pad = w * .06, bottom = w * .26;
  ctx.save(); ctx.translate(x, y - (1 - k) * 60); ctx.rotate(rot + (1 - k) * .2); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k));
  ctx.save(); dropShadow(14); ctx.fillStyle = '#fffdf9'; ctx.fillRect(-pw / 2 - pad, -ph / 2 - pad, pw + pad * 2, ph + pad + bottom); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(-pw / 2, -ph / 2, pw, ph); ctx.clip();
  if (photo instanceof HTMLImageElement) { const s = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight); ctx.drawImage(photo, -photo.naturalWidth * s / 2, -photo.naturalHeight * s / 2, photo.naturalWidth * s, photo.naturalHeight * s); }
  else photo?.(-pw / 2, -ph / 2, pw, ph);
  ctx.restore();
  if (caption) text(caption, 0, ph / 2 + bottom * .55, { font: SB.hand, weight: 700, size: w * .1, color: SB.ink, maxW: pw });
  ctx.restore();
  if (k > .9) tape(x + Math.sin(rot) * (ph / 2 + pad), y - Math.cos(rot) * (ph / 2 + pad) - 4, w * .42, rot - .12, tapeColor);
}
// a torn paper label with jagged edges
function tornLabel(s, x, y, rot, { size = 54, bg = '#fffdf6', color = SB.ink, font = SB.marker, p = 1 } = {}) {
  const k = E.out(clamp(p));
  if (k <= 0) return;
  ctx.save(); ctx.font = `${size}px ${font}`; const w = ctx.measureText(s).width + size * 1.1, h = size * 1.6; ctx.restore();
  tilt(x, y, rot, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2 - 20, w * k, h + 40); ctx.clip();
    const r = rnd(hash(size, s.length)); ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2);
    for (let xx = -w / 2; xx <= w / 2; xx += 14) ctx.lineTo(xx, -h / 2 + (r() - .5) * 8);
    for (let yy = -h / 2; yy <= h / 2; yy += 12) ctx.lineTo(w / 2 + (r() - .5) * 10, yy);
    for (let xx = w / 2; xx >= -w / 2; xx -= 14) ctx.lineTo(xx, h / 2 + (r() - .5) * 8);
    ctx.closePath(); ctx.save(); dropShadow(6); ctx.fillStyle = bg; ctx.fill(); ctx.restore();
    text(s, 0, 4, { font, size, color, jit: false });
    ctx.restore();
  });
}
// a die-cut sticker: `draw` paints the art at (0, 0); a white border and a soft shadow; peels in with p
function sticker(draw, x, y, r, p, { rot = 0, border = 14 } = {}) {
  const k = E.back(clamp(p));
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot + (1 - k) * .5); ctx.scale(k, k);
  ctx.save(); dropShadow(8); ctx.beginPath(); ctx.arc(0, 0, r + border, 0, TAU); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); draw(r); ctx.restore();
  ctx.restore();
}
// a round text sticker, e.g. stickerText('NEW!', x, y, 90, p, SB.yellow)
function stickerText(s, x, y, r, p, fill = SB.yellow, { rot = -.15, size = null } = {}) {
  sticker(rr0 => { ctx.fillStyle = fill; ctx.fillRect(-rr0, -rr0, rr0 * 2, rr0 * 2); text(s, 0, 4, { font: SB.marker, size: size ?? rr0 * .55, color: SB.ink, jit: false, maxW: rr0 * 1.7 }); }, x, y, r, p, { rot });
}
// a rubber stamp: distressed ink in a double border
function rubberStamp(s, x, y, p, { rot = -.18, color = SB.red, size = 56 } = {}) {
  const k = E.out(prog(p, 0, .35));
  if (k <= 0) return;
  ctx.save(); ctx.font = `${size}px ${SB.marker}`; const w = ctx.measureText(s).width + 60, h = size * 1.6; ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(lerp(1.8, 1, k), lerp(1.8, 1, k)); ctx.globalAlpha *= Math.min(1, k * 2) * .88;
  ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 2.5; ctx.strokeRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18);
  text(s, 0, 4, { font: SB.marker, size, color, jit: false });
  ctx.globalCompositeOperation = 'destination-out'; const r = rnd(77);
  for (let i = 0; i < 140; i++) { ctx.globalAlpha = .5; ctx.fillRect((r() - .5) * w, (r() - .5) * h, 2 + r() * 4, 2 + r() * 3); }
  ctx.restore();
}
// marker doodles: an arrow along pts, a star, a loose circle around a box, an underline
function doodleArrow(pts, p, id, color = SB.red) { arrow(pts, p, id, { stroke: color, strokeWidth: 5, roughness: 1.4 }); }
function doodleStar(x, y, r, p, id, color = SB.red) { sketch(Array.from({ length: 11 }, (_, i) => { const a = -Math.PI / 2 + i * 4 * Math.PI / 5; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; }), p, id, { stroke: color, strokeWidth: 5, roughness: 1.2 }); }
function doodleCircle(x, y, rx, ry, p, id, color = SB.red) { sketch(circlePts(x, y, rx, ry), p, id, { stroke: color, strokeWidth: 5, roughness: 1.4 }); }
function doodleUnderline(x, y, w, p, id, color = SB.red) { sketch([[x, y], [x + w * .5, y + 6], [x + w, y - 2]], p, id, { stroke: color, strokeWidth: 6, roughness: 1.3 }); }
// transition: the next page slides over from `dir` with a shadow; p = 0..1
function paperSlide(p, drawNext, dir = 1) {
  if (p <= 0) return;
  const q = E.inOut(clamp(p)), dx = (1 - q) * W * dir;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(dx, 0);
  ctx.save(); dropShadow(24); ctx.fillStyle = SB.desk; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); drawNext();
  ctx.restore();
}
