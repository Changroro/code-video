'use strict';
// Look: 16-bit arcade. Load after kit.js. Every look module exposes the same scene API (see references/looks.md):
// LOOK.hook(t, d, lines) · title(t, d, name, tagline) · steps(t, d, items) · stat(t, d, value, label, note) · ending(t, d, {cmd, url, note})
// t = seconds since the scene started, d = scene length. Set brand colours with Object.assign(LOOK.colors, {...}).
const LOOK = (() => {
  const P = 4;
  const C = { bg: '#10081f', sky1: '#1b0f3a', sky2: '#5a2a6e', ink: '#1a0f2e', gold: '#ffd23f', hot: '#ff6b6b', text: '#ffffff', soft: '#d9ccff', dim: '#8f7bd6', accent: '#e07a55', accent2: '#9fd4ff' };
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x / P) * P, Math.round(y / P) * P, Math.round(w / P) * P, Math.round(h / P) * P); };
  // Press Start 2P stays crisp at multiples of 8 px, Galmuri11 at multiples of 11 px
  const PX = (s, x, y, o = {}) => text(s, x, y, { font: 'PS2', size: 32, color: C.text, jit: false, ...o });
  const KO = (s, x, y, o = {}) => text(s, x, y, { font: 'GAL', size: 44, color: C.text, jit: false, ...o });
  const ascii = s => /^[\x20-\x7e]*$/.test(s);
  const any = (s, x, y, o = {}) => (ascii(s) ? PX(s, x, y, o) : KO(s, x, y, { ...o, size: Math.round((o.size || 32) * 1.375 / 11) * 11 }));
  const shadowed = (fn, s, x, y, o, d = 8) => { fn(s, x + d, y + d, { ...o, color: C.ink }); fn(s, x, y, o); };
  const blink = (hz = 2.5) => Math.floor(T * hz) % 2 === 0;
  const hero = () => ({
    rows: ['...OOOOOOOO.....', '...RRRRRRRRRR...', '...ORRRRRRRR.RR.', '...OEOOOOEO...R.', '...OEOOOOEO.....', 'OOOOOOOOOOOOOO..', 'SOOOOOOOOOOOOS..', '...OOOOOOOO.....', '...S.S..S.S.....', '...S.S..S.S.....'],
    pal: { O: C.accent, S: mixHex(C.accent, '#000000', .25), E: '#1f1a17', R: C.gold },
  });
  const SKY = (() => { const r = rnd(9); return Array.from({ length: 110 }, () => [r() * W, r() * H, r() < .2 ? 8 : 4, r() * 6]); })();
  const CITY = (() => { const r = rnd(4); const out = []; let x = 0; while (x < W) { const w = 80 + Math.floor(r() * 5) * 20, h = 160 + Math.floor(r() * 8) * 40; out.push([x, h, w, r()]); x += w + 8; } return out; })();
  function space(t, fall = 0) {
    R(0, 0, W, H, C.bg);
    for (const [x, y, s, ph] of SKY) if (Math.floor(T * 2 + ph) % 3) R(x, (y + t * fall * (s / 4)) % H, s, s, C.dim);
  }
  function city() {
    const g = ctx.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, C.sky1); g.addColorStop(1, C.sky2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 760);
    for (const [x, y, s, ph] of SKY) if (y < 560 && Math.floor(T * 2 + ph) % 3) R(x, y, s, s, '#fff4d6');
    for (const [x, h, w, lit] of CITY) {
      R(x, 760 - h, w, h, '#2a1846');
      for (let wy = 760 - h + 24; wy < 740; wy += 36) for (let wx = x + 16; wx < x + w - 16; wx += 28) if (hash(wx, wy) % 5 < 2 + lit * 2) R(wx, wy, 12, 16, '#ffcf6b');
    }
    R(0, 760, W, 320, '#3b2257');
    for (let y = 760; y < H; y += 48) for (let x = (y / 48 % 2) * 64; x < W; x += 128) R(x, y, 64, 48, '#442865');
    R(0, 756, W, 8, '#ffcf6b');
  }
  function crt() {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(0,0,0,.16)';
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
    const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  function box(x, y, w, h, border = C.gold) { R(x - 12, y - 12, w + 24, h + 24, C.ink); R(x - 4, y - 4, w + 8, h + 8, border); R(x, y, w, h, '#2a1846'); }
  const out = (t, d) => { if (t > d - .15) flash(prog(t, d - .15, d), '#fff'); };

  return {
    colors: C,
    fonts: [['GAL', 'assets/fonts/Galmuri11-Bold.ttf'], ['PS2', 'assets/fonts/PressStart2P-Regular.ttf']],
    hook(t, d, lines) {
      space(t, 40);
      if (blink()) PX('INSERT COIN', W / 2, 120, { size: 32, color: C.gold });
      lines.forEach((s, i) => {
        const a = prog(t, .3 + i * .9, .5 + i * .9); if (a <= 0) return;
        const last = i === lines.length - 1, [sx, sy] = shake(last && t < 1.6 + i * .9 ? 16 : 0, 3 + i);
        shadowed(any, s, W / 2 + sx, 440 + i * 150 + sy, { size: last ? 64 : 48, color: last ? C.gold : C.text, alpha: a, maxW: 1700 }, 8);
      });
      crt(); out(t, d);
    },
    title(t, d, name, tagline) {
      space(t, 60);
      const drop = E.back(prog(t, .05, .7));
      ctx.save(); ctx.translate(0, (1 - drop) * -500);
      const g = ctx.createLinearGradient(0, 330, 0, 450); g.addColorStop(0, '#ffe066'); g.addColorStop(.5, '#ff8a4c'); g.addColorStop(1, '#e0457b');
      shadowed(any, name, W / 2, 380, { size: 88, color: g, maxW: 1760 }, 10);
      ctx.restore();
      KO(tagline, W / 2, 540, { size: 44, color: C.soft, alpha: prog(t, .7, 1.1), maxW: 1700 });
      const h = hero(); drawPixels(h.rows, h.pal, W / 2, 800 - (Math.floor(T * 6) % 2) * P, 12, { outline: C.ink });
      if (t > 1.2 && blink()) PX('PRESS START', W / 2, 900, { size: 40, color: C.gold });
      crt(); out(t, d);
    },
    steps(t, d, items) {
      city();
      shadowed(PX, 'STAGE SELECT', W / 2, 110, { size: 56, color: C.gold }, 6);
      const n = items.length, xs = items.map((_, i) => 260 + i * (W - 520) / Math.max(1, n - 1)), ys = items.map((_, i) => (i % 2 ? 560 : 420));
      const per = (d - 1.2) / n;
      for (let i = 0; i < n - 1; i++) for (let k = 1; k < 10; k++) { const q = k / 10; if (prog(t, .2 + i * per, .2 + (i + .6) * per) > q) R(lerp(xs[i], xs[i + 1], q) - 6, lerp(ys[i], ys[i + 1], q) - 6, 12, 12, C.soft); }
      items.forEach((s, i) => {
        const at = .3 + i * per, on = t > at + per * .5;
        R(xs[i] - 44, ys[i] - 44, 88, 88, C.ink); R(xs[i] - 36, ys[i] - 36, 72, 72, on ? C.gold : '#5a4a8a');
        PX(String(i + 1), xs[i], ys[i] + 2, { size: 40, color: C.ink });
        const lw = Math.min(measure(s, 'GAL', 33) + 40, (W - 520) / Math.max(1, n - 1) - 10);
        R(xs[i] - lw / 2, ys[i] + 72, lw, 56, C.ink);
        KO(s, xs[i], ys[i] + 100, { size: 33, color: on ? C.text : C.dim, maxW: lw - 30 });
      });
      // hero hops from node to node
      const k = clamp(Math.floor((t - .3) / per), 0, n - 1), f = clamp(((t - .3) - k * per) / (per * .5));
      const a = Math.max(0, k - (f < 1 ? 1 : 0)), b = k, q = f < 1 && k > 0 ? E.inOut(f) : 1;
      const hx = lerp(xs[a], xs[b], q), hy = lerp(ys[a], ys[b], q) - 70 - Math.sin(q * Math.PI) * 120;
      const h = hero(); drawPixels(h.rows, h.pal, hx, hy, 7, { outline: C.ink });
      crt(); out(t, d);
    },
    stat(t, d, value, label, note) {
      space(t, 20);
      shadowed(PX, 'HIGH SCORE', W / 2, 220, { size: 64, color: C.hot }, 8);
      const settle = prog(t, .3, 1.4);
      const shown = [...value].map((ch, i) => (/[0-9]/.test(ch) && settle < 1 - i * .05 ? String(hash(Math.floor(T * 20), i) % 10) : ch)).join('');
      shadowed(any, shown, W / 2, 500, { size: 176, color: C.gold, maxW: 1700 }, 12);
      KO(label, W / 2, 700, { size: 44, alpha: prog(t, 1.2, 1.6), maxW: 1700 });
      if (note) KO(note, W / 2, 780, { size: 33, color: C.soft, alpha: prog(t, 1.6, 2), maxW: 1700 });
      crt(); out(t, d);
    },
    ending(t, d, e) {
      space(t, 30);
      shadowed(PX, 'GAME CLEAR', W / 2, 200, { size: 96, color: C.gold }, 10);
      const a = prog(t, .5, .9);
      if (a > 0) {
        box(200, 330, W - 400, 300);
        if (e.cmd) PX(typed(e.cmd, prog(t, .7, 2.2)), W / 2, 430, { size: 24, maxW: W - 480 });
        if (e.url) PX(e.url, W / 2, 530, { size: 24, color: C.accent2, alpha: prog(t, 2.2, 2.6), maxW: W - 480 });
      }
      if (e.note) KO(e.note, W / 2, 740, { size: 33, color: C.soft, alpha: prog(t, 2.4, 2.8), maxW: 1700 });
      if (t > 2.8 && blink()) PX('THANK YOU FOR PLAYING', W / 2, 880, { size: 32, color: C.gold });
      crt();
    },
    // signature format: one round of a versus match.
    // sides = [{name, color}, {name, color}]; r = {title, sub, a, b, win: 0 | 1 | 'draw'}; a/b are numbers or short strings
    versus(t, d, sides, r, n = 1) {
      city();
      const num = typeof r.a === 'number' && typeof r.b === 'number', top = num ? Math.max(r.a, r.b) * 1.15 || 1 : 1;
      const fill = E.out(prog(t, 1.4, 2.4));
      const clash = prog(t, 1.0, 1.35), back = prog(t, 1.35, 1.8);
      const [sx, sy] = shake(t > 1.35 && t < 1.7 ? 20 : 0, 7);
      ctx.save(); ctx.translate(Math.round(sx / P) * P, Math.round(sy / P) * P);
      sides.forEach((s, i) => {
        const h = hero(), pal = { ...h.pal, O: s.color, S: mixHex(s.color, '#000000', .25) };
        const x = i ? lerp(1400, 1060, E.in(clash)) + back * 120 : lerp(520, 860, E.in(clash)) - back * 120;
        const won = r.win === i && t > 2.4, jump = won ? Math.abs(Math.sin((t - 2.4) * 7)) * 80 : 0;
        const hit = t > 1.35 && t < 1.5 && r.win !== i;
        drawPixels(h.rows, hit ? Object.fromEntries(Object.keys(pal).map(k => [k, '#fff'])) : pal, x, 990 - jump - (Math.floor(T * 6) % 2) * P, 20, { outline: C.ink, flip: !!i });
      });
      if (clash > 0 && back < 1) for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4, rr = 20 + back * 90; R(960 + Math.cos(an) * rr, 850 + Math.sin(an) * rr, 14, 14, k % 2 ? C.gold : '#fff'); }
      ctx.restore();
      // bars: numbers fill in proportion, words fill completely
      sides.forEach((s, i) => {
        const v = num ? (i ? r.b : r.a) / top : 1, x = i ? W - 780 : 80, w = 700, fw = w * clamp(v) * fill;
        R(x - 8, 52, w + 16, 64, C.ink); R(x, 60, w, 48, '#3a2a55'); R(i ? x + w - fw : x, 60, fw, 48, s.color);
        any(s.name, i ? W - 80 : 80, 150, { size: 32, align: i ? 'right' : 'left', maxW: 600 });
        const val = i ? r.b : r.a;
        any(num ? String(Number.isInteger(r.a) && Number.isInteger(r.b) ? Math.round(val * fill) : Math.round(val * fill * 10) / 10) : String(val), i ? W - 780 : 780, 150, { size: 32, color: s.color, align: i ? 'left' : 'right', alpha: num ? 1 : fill, maxW: 400 });
      });
      R(W / 2 - 88, 40, 176, 104, C.ink); R(W / 2 - 80, 48, 160, 88, C.gold); PX(String(n), W / 2, 94, { size: 48, color: C.ink });
      const b = clamp(Math.min(prog(t, 0, .2), 1 - prog(t, .8, .95)));
      if (b > 0) { R(0, 330, W, 260 * b, 'rgba(16,8,31,.8)'); shadowed(PX, 'ROUND ' + n, W / 2, 420, { size: 96, color: C.gold, alpha: b }, 8); any(r.title, W / 2, 510, { size: 40, alpha: b, maxW: 1700 }); if (r.sub) KO(r.sub, W / 2, 570, { size: 33, color: C.soft, alpha: b, maxW: 1700 }); }
      if (t > .95 && t < 1.35) shadowed(PX, 'FIGHT!', W / 2, 460, { size: 120, color: C.hot }, 10);
      if (t > 2.4) {
        R(0, 330, W, 280, 'rgba(16,8,31,.72)');
        const label = r.win === 'draw' ? 'DRAW' : sides[r.win].name + ' WINS';
        shadowed(any, label, W / 2, 400, { size: 80, color: r.win === 'draw' ? '#fff' : sides[r.win].color, maxW: 1700 }, 8);
        any(`${r.a}  :  ${r.b}`, W / 2, 500, { size: 48, maxW: 1700 });
        any(r.title, W / 2, 570, { size: 32, color: C.soft, maxW: 1700 });
      }
      crt(); out(t, d);
    },
  };
})();
