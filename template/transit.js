'use strict';
// Look: transit map and station signage. Same scene API as every look module (see references/looks.md).
const LOOK = (() => {
  const C = { paper: '#f4f0e6', ink: '#1d1d22', muted: '#6f6a60', line: '#d9774f', line2: '#23408e', sign: '#1f2a44', signText: '#ffffff' };
  const T_ = (s, x, y, o = {}) => text(s, x, y, { font: 'PREB', size: 32, color: C.ink, jit: false, ...o });
  function paper() {
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.strokeStyle = 'rgba(29,29,34,.05)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }
  function track(pts, p, color, w = 24) {
    if (p <= 0) return;
    const q = polyPart(pts, clamp(p));
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
  }
  function along(pts, f) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(f) * L;
    for (let i = 1; i < pts.length; i++) { if (d <= segs[i - 1]) { const k = d / segs[i - 1]; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]; } d -= segs[i - 1]; }
    const n = pts.length; return [pts[n - 1][0], pts[n - 1][1], 0];
  }
  function dot(x, y, p, big = false) {
    if (p <= 0) return;
    const s = E.back(clamp(p * 1.5)), r = big ? 24 : 16;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = big ? 8 : 6;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function train(pts, f, color) {
    const [x, y, a] = along(pts, f);
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = color; ctx.strokeStyle = C.ink; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(-52, -22, 104, 44, 20); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; for (const wx of [-34, -10, 14]) { ctx.beginPath(); ctx.roundRect(wx, -10, 18, 15, 4); ctx.fill(); }
    ctx.restore();
  }
  // platform sign: dark board with a coloured strip
  function sign(x, y, w, h, p, color = C.line) {
    if (p <= 0) return;
    const s = E.out(clamp(p));
    ctx.save(); ctx.globalAlpha = s; ctx.translate(x, y + (1 - s) * 30);
    ctx.fillStyle = C.sign; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 18); ctx.fill();
    ctx.fillStyle = color; ctx.fillRect(-w / 2, -h / 2 + 18, w, 16);
    ctx.restore();
  }
  function logo(x, y, a = 1) {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.strokeStyle = C.line; ctx.lineWidth = 14;
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const an = i * TAU / 6; ctx.lineTo(Math.cos(an) * 42, Math.sin(an) * 42); } ctx.closePath(); ctx.stroke();
    ctx.fillStyle = C.line2; ctx.fillRect(-62, -11, 124, 22); ctx.restore();
  }
  const out = (t, d) => { if (t > d - .3) { const q = E.inOut(prog(t, d - .3, d)); ctx.save(); ctx.fillStyle = C.line2; ctx.fillRect(0, 0, W * q, H); ctx.restore(); } };
  const inn = t => { if (t < .3) { const q = E.inOut(prog(t, 0, .3)); ctx.save(); ctx.fillStyle = C.line2; ctx.fillRect(W * q, 0, W * (1 - q), H); ctx.restore(); } };

  return {
    colors: C,
    fonts: [['PREB', 'assets/fonts/Pretendard-Bold.otf'], ['PREK', 'assets/fonts/Pretendard-Black.otf'], ['PRER', 'assets/fonts/Pretendard-Regular.otf']],
    hook(t, d, lines) {
      paper();
      track([[0, 300], [W, 300]], prog(t, 0, .8), C.line, 18);
      sign(W / 2, 600, 1400, 120 + lines.length * 110, prog(t, .2, .6));
      lines.forEach((s, i) => T_(s, W / 2, 620 - (lines.length - 1) * 55 + i * 110, { font: 'PREK', size: 64, color: C.signText, alpha: prog(t, .5 + i * .6, .8 + i * .6), maxW: 1300 }));
      train([[0, 300], [W, 300]], prog(t, 0, d), C.line);
      out(t, d);
    },
    title(t, d, name, tagline) {
      paper(); inn(t);
      const line = [[120, 760], [W - 120, 760]];
      track(line, prog(t, .2, 1.2), C.line);
      dot(120, 760, prog(t, .2, .5), true); dot(W - 120, 760, prog(t, 1.1, 1.4), true);
      logo(W / 2, 250, prog(t, .3, .7));
      T_(name, W / 2, 420, { font: 'PREK', size: 96, alpha: prog(t, .5, .9), maxW: 1700 });
      T_(tagline, W / 2, 530, { font: 'PRER', size: 40, color: C.muted, alpha: prog(t, .9, 1.3), maxW: 1600 });
      train(line, E.inOut(prog(t, 1.2, d - .2)), C.line);
      out(t, d);
    },
    steps(t, d, items) {
      paper(); inn(t);
      const n = items.length, xs = items.map((_, i) => 220 + i * (W - 440) / Math.max(1, n - 1));
      const pts = [[120, 560], ...xs.map(x => [x, 560]), [W - 120, 560]];
      const p = prog(t, .3, d - .6);
      track(pts, p, C.line);
      items.forEach((s, i) => {
        const f = (xs[i] - 120) / (W - 240), on = prog(p, f - .02, f + .05);
        dot(xs[i], 560, on, true);
        T_(String(i + 1), xs[i], 460, { font: 'PREK', size: 40, color: C.line, alpha: on });
        T_(s, xs[i], 660, { font: 'PREB', size: 36, alpha: on, maxW: (W - 440) / Math.max(1, n - 1) - 20 });
      });
      if (p > 0 && p < 1) train(pts, p, C.line);
      out(t, d);
    },
    stat(t, d, value, label, note) {
      paper(); inn(t);
      const s = E.back(prog(t, .2, .8));
      ctx.save(); ctx.translate(W / 2, 430); ctx.scale(s, s);
      const w = Math.max(520, measure(value, 'PREK', 170) + 160);
      ctx.fillStyle = C.line; ctx.beginPath(); ctx.roundRect(-w / 2, -150, w, 300, 150); ctx.fill();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 10; ctx.stroke();
      ctx.restore();
      T_(value, W / 2, 440, { font: 'PREK', size: 170, color: '#fff', alpha: prog(t, .5, .8) });
      T_(label, W / 2, 700, { font: 'PREB', size: 48, alpha: prog(t, .9, 1.3), maxW: 1700 });
      if (note) T_(note, W / 2, 780, { font: 'PRER', size: 32, color: C.muted, alpha: prog(t, 1.3, 1.7), maxW: 1700 });
      out(t, d);
    },
    ending(t, d, e) {
      paper(); inn(t);
      sign(W / 2, 330, 1500, 260, prog(t, .2, .6), C.line2);
      T_('종착역', W / 2, 300, { font: 'PREB', size: 40, color: '#b9c3d9', alpha: prog(t, .5, .8) });
      if (e.cmd) T_(e.cmd, W / 2, 380, { font: 'PREB', size: 40, color: '#fff', alpha: prog(t, .6, 1), maxW: 1400 });
      const tk = prog(t, 1.0, 1.5);
      if (tk > 0 && e.url) {
        ctx.save(); ctx.globalAlpha = tk; ctx.fillStyle = '#fffdf7'; ctx.strokeStyle = C.ink; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(W / 2 - 520, 560, 1040, 150, 20); ctx.fill(); ctx.stroke();
        ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(W / 2 + 300, 575); ctx.lineTo(W / 2 + 300, 695); ctx.stroke(); ctx.restore();
        T_(e.url, W / 2 - 110, 635, { font: 'PREB', size: 34, alpha: tk, maxW: 780 });
        T_('TICKET', W / 2 + 410, 635, { font: 'PREK', size: 34, color: C.line, alpha: tk });
      }
      if (e.note) T_(e.note, W / 2, 820, { font: 'PRER', size: 30, color: C.muted, alpha: prog(t, 1.6, 2) });
      logo(W / 2, 940, prog(t, 1.8, 2.2));
    },
    // signature format: a route map. lines = [{ name, color, pts: [[x, y], ...], stations: [[x, y, label, side, sub], ...], at: [start, end] }]
    // hubs = [[x, y, label, sub, side]] for interchanges; side is 'up' | 'down' | 'left' | 'right'. Draws in scene time t.
    route(t, d, lines, hubs = [], title = '') {
      paper(); inn(t);
      if (title) { logo(110, 80, prog(t, .1, .5)); T_(title, 200, 80, { font: 'PREK', size: 48, align: 'left', alpha: prog(t, .1, .5) }); }
      const frac = (pts, x, y) => { let best = 0, bd = 1e9, acc = 0, L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let k = 0; k <= 20; k++) { const dd = Math.hypot(lerp(a[0], b[0], k / 20) - x, lerp(a[1], b[1], k / 20) - y); if (dd < bd) { bd = dd; best = acc + l * k / 20; } } acc += l; } return best / L; };
      const off = { up: [0, -50], down: [0, 54], left: [-36, 0], right: [36, 0] };
      for (const l of lines) {
        const p = prog(t, l.at[0], l.at[1]);
        track(l.pts, p, l.color);
        if (p > 0 && p < 1) train(l.pts, p, l.color);
        for (const [x, y, label, side = 'up', sub] of l.stations) {
          const f = frac(l.pts, x, y), q = prog(p, f - .08, f); dot(x, y, q);
          const o = off[side], align = side === 'left' ? 'right' : side === 'right' ? 'left' : 'center', a = clamp(q * 2 - .3);
          T_(label, x + o[0], y + o[1] - (sub && side !== 'down' ? 14 : 0), { size: 30, align, alpha: a });
          if (sub) T_(sub, x + o[0], y + o[1] + (side === 'down' ? 36 : 20), { font: 'PRER', size: 21, color: l.color, align, alpha: a });
        }
      }
      for (const [x, y, label, sub, side = 'down', at = 0] of hubs) {
        const q = prog(t, at, at + .5); if (q <= 0) continue;
        const s = E.back(clamp(q * 1.4));
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-30, -58, 60, 116, 30); ctx.fill(); ctx.stroke(); ctx.restore();
        const dy = side === 'up' ? -118 : 118;
        T_(label, x, y + dy, { font: 'PREK', size: 32, alpha: q });
        if (sub) T_(sub, x, y + dy + 38, { font: 'PRER', size: 22, color: C.muted, alpha: q });
      }
      out(t, d);
    },
  };
})();
