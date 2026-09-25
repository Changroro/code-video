'use strict';
// Brand-style launch films driven by design tokens: a preset (BRANDS.apple, ...) or tokens read from any DESIGN.md or site.
// Load after kit.js. Pick tokens with brandUse('apple') or brandUse({ ...tokens }), before boot.
// Tokens: bg / bgAlt / dark (stages), ink / inkDark / muted / mutedDark (text), accent / accentInk (CTA), surface / divider,
// font / fontDisplay (families declared in index.html), weight, tracking (em), upper (bool), radius (px), cta ('pill' | 'rect' | 'ghost'), line (accent rule colour or null),
// ctaLight / ctaDark (button fill on light / dark stages, default accent) with ctaInk / ctaInkDark (its label colour).
// Presets: the design language of well-known sites, from their public DESIGN.md (VoltAgent/awesome-design-md), Refero styles, and live CSS.
// Not affiliated with these companies; no logos or proprietary fonts (the families below are free substitutes declared in index.html).
const BRANDS = {
  apple: { bg: '#f5f5f7', bgAlt: '#ffffff', dark: '#000000', ink: '#1d1d1f', inkDark: '#f5f5f7', muted: '#86868b', mutedDark: '#86868b', accent: '#0071e3', accentInk: '#ffffff',
    surface: '#ffffff', font: 'BRAND', fontDisplay: 'BRAND', weight: 700, tracking: -.035, upper: false, radius: 28, cta: 'pill' },
  samsung: { bg: '#ffffff', bgAlt: '#f7f7f7', dark: '#000000', ink: '#000000', inkDark: '#ffffff', muted: '#555555', mutedDark: '#8f8f8f', accent: '#2189ff', accentInk: '#ffffff',
    ctaLight: '#000000', ctaInk: '#ffffff', ctaDark: '#ffffff', ctaInkDark: '#000000', surface: '#f7f7f7', font: 'BRAND', fontDisplay: 'BRANDD', weight: 800, tracking: -.01, upper: false, radius: 20, cta: 'pill' },
  ferrari: { bg: '#ffffff', bgAlt: '#f2f2f2', dark: '#181818', ink: '#181818', inkDark: '#ffffff', muted: '#8f8f8f', mutedDark: '#969696', accent: '#da291c', accentInk: '#ffffff', line: '#da291c',
    surface: '#ffffff', font: 'BRAND', fontDisplay: 'BRANDD', weight: 600, tracking: .09, upper: true, radius: 0, cta: 'ghost' },
  nike: { bg: '#ffffff', bgAlt: '#f5f5f5', dark: '#111111', ink: '#111111', inkDark: '#ffffff', muted: '#707072', mutedDark: '#9e9ea0', accent: '#ee0005', accentInk: '#ffffff',
    ctaLight: '#111111', ctaInk: '#ffffff', ctaDark: '#ffffff', ctaInkDark: '#111111', surface: '#f5f5f5', font: 'BRAND', fontDisplay: 'BRANDD', weight: 400, tracking: 0, upper: true, radius: 0, cta: 'pill' },
  spotify: { bg: '#121212', bgAlt: '#1f1f1f', dark: '#000000', ink: '#ffffff', inkDark: '#ffffff', muted: '#b3b3b3', mutedDark: '#b3b3b3', accent: '#1ed760', accentInk: '#000000',
    surface: '#1f1f1f', font: 'BRAND', fontDisplay: 'BRAND', weight: 700, tracking: -.02, upper: false, radius: 8, cta: 'pill', gradient: ['#af2896', '#509bf5'] },
};
// the free fonts each preset uses, Latin first and Pretendard for Hangul: boot({ setup: () => useFonts(brandFonts('apple')) })
const HANGUL = 'U+1100-11FF, U+3000-303F, U+3130-318F, U+AC00-D7AF';
function brandFonts(name, dir = 'assets/fonts') {
  const pick = { apple: ['Inter', 'Inter'], samsung: ['Inter', 'Manrope'], ferrari: ['Archivo', 'Archivo'], nike: ['Inter', 'Anton-Regular'], spotify: ['DMSans', 'DMSans'] }[name];
  if (!pick) throw new Error('no font set for brand: ' + name);
  const w = { weight: '100 900' };
  return [['BRAND', `${dir}/${pick[0]}.ttf`, w], ['BRANDD', `${dir}/${pick[1]}.ttf`, w],
    ['BRAND', `${dir}/Pretendard-Bold.otf`, { ...w, unicodeRange: HANGUL }], ['BRANDD', `${dir}/Pretendard-Black.otf`, { ...w, unicodeRange: HANGUL }]];
}
const BR = {};
function brandUse(t) { Object.keys(BR).forEach(k => delete BR[k]); Object.assign(BR, { weight: 700, tracking: -.02, upper: false, radius: 18, cta: 'pill', line: null, gradient: null }, typeof t === 'string' ? BRANDS[t] : t); if (!BR.font) throw new Error('brand tokens need a font'); }

// stages: 'light' (gallery white), 'alt' (the alternate light band), 'dark' (black stage with a soft top light), 'accent' (brand colour)
function brStage(kind = 'light', { glow = 1 } = {}) {
  BR.stage = kind;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = kind === 'dark' ? BR.dark : kind === 'alt' ? BR.bgAlt ?? BR.bg : kind === 'accent' ? BR.accent : BR.bg; ctx.fillRect(0, 0, W, H);
  if (kind === 'dark' && glow > 0) { const g = ctx.createRadialGradient(W / 2, -H * .2, 0, W / 2, -H * .2, H * 1.3); g.addColorStop(0, `rgba(255,255,255,${.1 * glow})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
const brInk = dark => (dark ? BR.inkDark ?? '#f5f5f7' : BR.ink);
const brMuted = dark => (dark ? BR.mutedDark ?? BR.muted : BR.muted);
// display text with the brand's tracking and case; fill may be a colour or [c0, c1] for a vertical gradient
function brText(s, x, y, { size = 96, weight = BR.weight, color = null, dark = false, align = 'center', font = null, alpha = 1, tracking = BR.tracking, upper = BR.upper } = {}) {
  if (!s || alpha <= 0) return;
  const str = upper ? s.toUpperCase() : s, f = font ?? BR.fontDisplay ?? BR.font;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `${weight} ${size}px ${f}`; ctx.letterSpacing = `${tracking * size}px`;
  ctx.textAlign = align; ctx.textBaseline = 'middle';
  const fill = color ?? brInk(dark);
  if (Array.isArray(fill)) { const g = ctx.createLinearGradient(0, y - size * .6, 0, y + size * .6); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); ctx.fillStyle = g; } else ctx.fillStyle = fill;
  ctx.fillText(str, x, y); ctx.restore();
}
function brMeasure(s, size, { weight = BR.weight, font = null, tracking = BR.tracking, upper = BR.upper } = {}) {
  ctx.save(); ctx.font = `${weight} ${size}px ${font ?? BR.fontDisplay ?? BR.font}`; ctx.letterSpacing = `${tracking * size}px`; const w = ctx.measureText(upper ? s.toUpperCase() : s).width; ctx.restore(); return w;
}
// a headline stack that fades up line by line: lines [[text, size, { color }], ...]
function brHeadline(lines, x, y, t, { a = 0, stagger = .18, dur = .6, dark = false, gap = 1.12, align = 'center' } = {}) {
  let yy = y;
  lines.forEach(([s, size, o = {}], i) => {
    const k = E.out(prog(t, a + i * stagger, a + i * stagger + dur));
    brText(s, x, yy + size * .5 + (1 - k) * size * .35, { size, dark, align, alpha: k, ...o });
    yy += size * gap;
  });
}
// small label above a headline ("New", a product line); the accent colour by default
function brEyebrow(s, x, y, t, a = 0, { dark = false, color = null } = {}) { brText(s, x, y, { size: 30, weight: 600, color: color ?? BR.accent, alpha: E.out(prog(t, a, a + .4)), tracking: BR.upper ? .12 : 0, upper: BR.upper }); }
// call to action: pill (filled accent), rect (filled, square corners), ghost (outline); press 0..1
function brCTA(label, x, y, t, a = 0, { dark = false, size = 30, press = 0 } = {}) {
  const k = E.out(prog(t, a, a + .4));
  if (k <= 0) return;
  const w = brMeasure(label, size, { weight: 500, font: BR.font, tracking: BR.upper ? .1 : 0 }) + size * 2.2, h = size * 2.1, r = BR.cta === 'pill' ? h / 2 : BR.cta === 'rect' ? 2 : Math.min(BR.radius, h / 2);
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(x, y + (1 - k) * 20); const s = 1 - press * .05; ctx.scale(s, s);
  rr(-w / 2, -h / 2, w, h, r);
  const fill = dark ? BR.ctaDark ?? BR.accent : BR.ctaLight ?? BR.accent, ink = dark ? BR.ctaInkDark ?? BR.accentInk : BR.ctaInk ?? BR.accentInk;
  if (BR.cta === 'ghost') { ctx.lineWidth = 2; ctx.strokeStyle = brInk(dark); ctx.stroke(); } else { ctx.fillStyle = fill; ctx.fill(); }
  ctx.restore();
  brText(label + (BR.cta === 'ghost' ? '  →' : ''), x, y + (1 - k) * 20 + 1, { size, weight: 500, font: BR.font, color: BR.cta === 'ghost' ? brInk(dark) : ink ?? '#fff', alpha: k, tracking: BR.upper ? .1 : 0 });
}
// the accent rule (e.g. a red line under a caption) that draws itself
function brRule(x, y, w, p, { color = BR.line ?? BR.accent, h = 4 } = {}) { if (p > 0) { ctx.fillStyle = color; ctx.fillRect(x, y, w * E.inOut(clamp(p)), h); } }
// the hero object on a stage: `draw(w, h)` paints it centred at (0, 0); slow push-in, soft floor shadow or reflection, a light sweep
function brProduct(draw, x, y, w, h, t, { a = 0, push = .06, reflect = false, sweep = null, dark = false } = {}) {
  const k = E.out(prog(t, a, a + .9)), s = (1 - push) + push * clamp((t - a) / 6) + (1 - k) * .05;
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(x, y + (1 - k) * 40); ctx.scale(s, s);
  if (!reflect) { ctx.save(); ctx.fillStyle = dark ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.12)'; ctx.filter = 'blur(18px)'; ctx.beginPath(); ctx.ellipse(0, h / 2 + 18, w * .42, 22, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  draw(w, h);
  if (reflect) { ctx.save(); ctx.translate(0, h + 8); ctx.scale(1, -1); ctx.globalAlpha *= .18; draw(w, h); ctx.restore(); const g = ctx.createLinearGradient(0, h / 2, 0, h * 1.5); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, dark ? BR.dark : BR.bg); ctx.fillStyle = g; ctx.fillRect(-w, h / 2 + 4, w * 2, h); }
  if (sweep !== null && sweep > 0 && sweep < 1) { ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const sx = lerp(-w, w, sweep); const g = ctx.createLinearGradient(sx - 120, 0, sx + 120, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore(); }
  ctx.restore();
}
// device frames for screenshots: a laptop (lid + base) or a phone (kit's phone); draw(sx, sy, sw, sh) paints the screen
function brLaptop(x, y, w, draw, { dark = false } = {}) {
  const h = w * .62, sx = x - w / 2 + w * .035, sy = y - h / 2 + w * .035, sw = w * .93, sh = h - w * .07;
  ctx.save(); ctx.fillStyle = dark ? '#2b2b2e' : '#d9d9de'; rr(x - w / 2, y - h / 2, w, h, w * .03); ctx.fill();
  ctx.fillStyle = '#000'; rr(sx - 2, sy - 2, sw + 4, sh + 4, w * .012); ctx.fill();
  ctx.save(); rr(sx, sy, sw, sh, w * .01); ctx.clip(); draw?.(sx, sy, sw, sh); ctx.restore();
  ctx.fillStyle = dark ? '#3a3a3e' : '#c7c7cc'; rr(x - w * .58, y + h / 2, w * 1.16, w * .03, w * .015); ctx.fill();
  ctx.restore();
}
// spec tiles: big values with a small caption, counting up if numeric. items [[value, caption], ...]
function brSpecs(items, x, y, w, t, { a = 0, dark = false, size = 110, cols = null } = {}) {
  const n = cols ?? items.length, cw = w / n;
  items.forEach(([v, cap], i) => {
    const k = E.out(prog(t, a + i * .15, a + i * .15 + .6)), cx = x - w / 2 + cw * (i + .5), m = String(v).match(/^([^\d]*)([\d.]+)(.*)$/);
    const shown = m ? m[1] + (parseFloat(m[2]) * k).toFixed((m[2].split('.')[1] ?? '').length) + m[3] : v;
    brText(shown, cx, y, { size, dark, alpha: k, color: BR.specColor ?? null });
    brText(cap, cx, y + size * .75, { size: size * .24, weight: 400, font: BR.font, dark, color: brMuted(dark), alpha: k, tracking: 0, upper: false });
  });
}
// rounded feature tiles in a bento grid: cells [[x, y, w, h, title, sub, { fill, dark, draw }], ...]
function brBento(cells, t, { a = 0, stagger = .1 } = {}) {
  cells.forEach(([x, y, w, h, title, sub, o = {}], i) => {
    const k = E.out(prog(t, a + i * stagger, a + i * stagger + .5)), dark = o.dark ?? false;
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 30);
    // light tiles take the colour the current stage is not, so they never vanish into it
    ctx.fillStyle = o.fill ?? (dark ? '#1c1c1e' : BR.stage === 'alt' ? BR.bg : BR.surface ?? '#fff'); rr(x, y, w, h, BR.radius); ctx.fill();
    if (BR.divider && !dark) { ctx.strokeStyle = BR.divider; ctx.lineWidth = 1; rr(x, y, w, h, BR.radius); ctx.stroke(); }
    o.draw?.(x, y, w, h);
    ctx.restore();
    brText(title, x + 36, y + h - 88 + (1 - k) * 30, { size: 40, align: 'left', dark, alpha: k });
    if (sub) brText(sub, x + 36, y + h - 44 + (1 - k) * 30, { size: 24, weight: 400, font: BR.font, align: 'left', dark, color: brMuted(dark), alpha: k, tracking: 0, upper: false });
  });
}
// transitions: a crossfade to a colour, and a band that sweeps across in the accent (or a given colour)
function brFade(p, color = BR.bg) { flash(E.inOut(clamp(p)), color); }
function brWipe(p, color = BR.accent) { if (p <= 0 || p >= 1) return; const x = lerp(-W * .2, W * 1.2, E.inOut(p)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = color; ctx.fillRect(x - W * .2, 0, W * .2, H); ctx.restore(); }
// light streaks racing across the frame (speed, a lap, a launch): pure function of t
function brStreaks(t, { color = '#ffffff', n = 26, speed = 2.2, y0 = H * .25, y1 = H * .75, alpha = .8, seed = 12 } = {}) {
  const r = rnd(seed);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const y = lerp(y0, y1, r()), len = 180 + r() * 520, v = (.6 + r()) * speed * W, x = ((r() * W + t * v) % (W + len * 2)) - len, w = 1 + r() * 3;
    const g = ctx.createLinearGradient(x - len, 0, x, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, color);
    ctx.globalAlpha = alpha * (.3 + r() * .7); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x - len, y); ctx.lineTo(x, y); ctx.stroke();
  }
  ctx.restore();
}
// type that slams in from large, with an optional smear (pair with VIDEO.blur for real motion blur)
function brSlam(s, x, y, t, a, { size = 220, dark = false, color = null, from = 2.6, dur = .18 } = {}) {
  const k = E.out(prog(t, a, a + dur));
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); const sc = lerp(from, 1, k); ctx.scale(sc, sc);
  brText(s, 0, 0, { size, dark, color, alpha: clamp(k * 2) });
  ctx.restore();
}
// album-art style square: a gradient field with a big soft shape, the way content brings colour into a dark UI
function brArt(x, y, s, hue, t, { label = '', round = false } = {}) {
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); if (round) ctx.arc(0, 0, s / 2, 0, TAU); else ctx.roundRect(-s / 2, -s / 2, s, s, BR.radius); ctx.clip();
  const g = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2); g.addColorStop(0, `hsl(${hue},80%,55%)`); g.addColorStop(1, `hsl(${(hue + 60) % 360},75%,35%)`);
  ctx.fillStyle = g; ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.globalAlpha = .5; ctx.fillStyle = `hsl(${(hue + 180) % 360},90%,70%)`; ctx.beginPath(); ctx.arc(Math.sin(t + hue) * s * .15, Math.cos(t * .8 + hue) * s * .15, s * .32, 0, TAU); ctx.fill();
  ctx.restore();
  if (label) brText(label, x - s / 2, y + s / 2 + 30, { size: 26, weight: 700, font: BR.font, align: 'left', dark: true, tracking: 0, upper: false });
}
// a row of cards that slides and snaps one card per beat: cards [(x, y, size) => {}], step = seconds per snap
function brCarousel(cards, t, { y = H / 2, size = 300, gap = 36, step = .5, a = 0 } = {}) {
  const k = Math.max(0, t - a) / step, i = Math.floor(k), f = E.inOut(k - i), shift = (i + f) * (size + gap);
  cards.forEach((draw, j) => { const x = W * .18 + j * (size + gap) - shift; if (x > -size && x < W + size) draw(x, y, size); });
}
