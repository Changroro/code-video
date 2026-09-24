'use strict';
// Look: cyanotype blueprint. Same scene API as every look module (see references/looks.md).
const LOOK = (() => {
  const C = { blue: '#17508c', line: 'rgba(240,248,255,.95)', faint: 'rgba(240,248,255,.35)', hi: '#ffd166', dwg: 'PROMO-01' };
  const T_ = (s, x, y, o = {}) => text(s, x, y, { font: 'MONO', size: 30, color: C.line, jit: false, ...o });
  function ln(pts, p, w = 3, c = C.line, dash = null) {
    if (p <= 0) return;
    const q = polyPart(pts, clamp(p));
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
  }
  const rect = (x, y, w, h, p, lw = 3, c = C.line) => ln([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], p, lw, c);
  function head(x, y, a, c = C.line) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-18, -7); ctx.lineTo(-18, 7); ctx.closePath(); ctx.fill(); ctx.restore(); }
  function dimH(x0, x1, y, label, p, c = C.line) {
    if (p <= 0) return;
    ln([[x0, y - 50], [x0, y + 14]], p * 2, 1.5, c); ln([[x1, y - 50], [x1, y + 14]], p * 2, 1.5, c);
    const q = E.inOut(clamp(p * 1.5 - .3)); if (q <= 0) return;
    const m = (x0 + x1) / 2, a = m - (m - x0) * q, b = m + (x1 - m) * q;
    ln([[a, y], [b, y]], 1, 2, c); head(a, y, Math.PI, c); head(b, y, 0, c);
    if (label) { const lw = measure(label, 'MONOB', 30) + 30; ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = C.blue; ctx.fillRect(m - lw / 2, y - 22, lw, 44); ctx.restore(); T_(label, m, y, { font: 'MONOB', alpha: q, color: c }); }
  }
  function balloon(x, y, n, p) { if (p <= 0) return; ln(circlePts(x, y, 30, 30, 40), p, 3, C.hi); T_(String(n), x, y + 1, { font: 'MONOB', size: 30, color: C.hi, alpha: clamp(p * 2 - 1) }); }
  function sheet(t, title) {
    ctx.fillStyle = C.blue; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.lineWidth = 1;
    for (const [step, a] of [[20, .07], [100, .14]]) { ctx.strokeStyle = `rgba(240,248,255,${a})`; for (let x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
    ctx.restore();
    rect(40, 40, W - 80, H - 80, 1, 4); rect(56, 56, W - 112, H - 112, 1, 1.5, C.faint);
    // title block
    const x = W - 520, y = H - 200;
    rect(x, y, 460, 140, 1, 2.5); ln([[x, y + 50], [x + 460, y + 50]], 1, 1.5);
    T_('DWG  ' + C.dwg, x + 20, y + 26, { font: 'PLEX', size: 22, align: 'left' });
    T_(title, x + 20, y + 95, { size: 24, align: 'left', maxW: 420 });
  }
  const out = (t, d) => { if (t > d - .25) { const q = prog(t, d - .25, d); ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = C.blue; ctx.fillRect(0, 0, W, H); ctx.restore(); } };

  return {
    colors: C,
    fonts: [['MONO', 'assets/fonts/NanumGothicCoding-Regular.ttf'], ['MONOB', 'assets/fonts/NanumGothicCoding-Bold.ttf'], ['PLEX', 'assets/fonts/IBMPlexMono-Regular.ttf']],
    hook(t, d, lines) {
      sheet(t, 'NOTE');
      T_('NOTE', 120, 150, { font: 'PLEX', size: 26, align: 'left', color: C.faint });
      lines.forEach((s, i) => {
        const y = 380 + i * 170, a = prog(t, .2 + i * .8, .6 + i * .8);
        T_(s, 140, y, { font: 'MONOB', size: 76, align: 'left', reveal: a, color: i === lines.length - 1 ? C.hi : C.line, maxW: W - 400 });
        const w = Math.min(measure(s, 'MONOB', 76), W - 400);
        ln([[140, y + 60], [140 + w, y + 60]], prog(t, .5 + i * .8, 1 + i * .8), 2, C.faint, [14, 8]);
      });
      out(t, d);
    },
    title(t, d, name, tagline) {
      sheet(t, name);
      const w = Math.min(measure(name, 'MONOB', 110), W - 360);
      T_(name, W / 2, 420, { font: 'MONOB', size: 110, alpha: prog(t, .2, .7), maxW: W - 360 });
      rect(W / 2 - w / 2 - 40, 330, w + 80, 180, prog(t, .1, 1), 2, C.faint);
      dimH(W / 2 - w / 2 - 40, W / 2 + w / 2 + 40, 620, tagline, prog(t, .8, 1.8), C.hi);
      out(t, d);
    },
    steps(t, d, items) {
      sheet(t, 'PROCESS');
      const n = items.length, bw = Math.min(330, (W - 300) / n - 60), gap = (W - 240 - n * bw) / Math.max(1, n - 1);
      const per = (d - 1) / n;
      items.forEach((s, i) => {
        const x = 120 + i * (bw + gap), y = 440, p = prog(t, .2 + i * per, .2 + i * per + per * .8);
        rect(x, y, bw, 170, p, 3);
        T_(s, x + bw / 2, y + 85, { font: 'MONOB', size: 32, alpha: clamp(p * 2 - 1), maxW: bw - 30 });
        balloon(x + bw / 2, y - 90, i + 1, p);
        ln([[x + bw / 2, y - 60], [x + bw / 2, y]], p, 1.5, C.hi);
        if (i < n - 1) { const q = prog(t, .2 + (i + .8) * per, .2 + (i + 1) * per); ln([[x + bw + 10, y + 85], [x + bw + gap - 10, y + 85]], q, 3); if (q >= 1) head(x + bw + gap - 10, y + 85, 0); }
      });
      out(t, d);
    },
    stat(t, d, value, label, note) {
      sheet(t, 'SPEC');
      const w = Math.min(measure(value, 'MONOB', 220), W - 400);
      T_(value, W / 2, 440, { font: 'MONOB', size: 220, color: C.hi, alpha: prog(t, .2, .6), maxW: W - 400 });
      dimH(W / 2 - w / 2, W / 2 + w / 2, 640, label, prog(t, .7, 1.6));
      if (note) T_(note, W / 2, 760, { size: 30, color: C.faint, alpha: prog(t, 1.4, 1.8) });
      out(t, d);
    },
    ending(t, d, e) {
      sheet(t, 'RELEASE');
      if (e.cmd) { const w = Math.min(measure(e.cmd, 'MONOB', 40) + 80, W - 240); rect(W / 2 - w / 2, 330, w, 120, prog(t, .2, .9), 3); T_(e.cmd, W / 2, 390, { font: 'MONOB', size: 40, alpha: prog(t, .8, 1.1), maxW: W - 300 }); }
      if (e.url) T_(e.url, W / 2, 540, { font: 'MONOB', size: 40, color: C.hi, alpha: prog(t, 1.1, 1.4) });
      if (e.note) {
        const p = prog(t, 1.6, 2.1);
        if (p > 0) { ctx.save(); ctx.translate(360, 820); ctx.rotate(-.12); ctx.globalAlpha = p; ctx.strokeStyle = C.hi; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-230, -60, 460, 120, 16); ctx.stroke(); ctx.restore(); T_(e.note, 360, 820, { font: 'MONOB', size: 32, color: C.hi, alpha: p, maxW: 420, rot: -.12 }); }
      }
    },
    // signature format: an assembly drawing. parts = [{ name, spec, w }] joined left to right (w = relative width);
    // each part gets a numbered balloon and a dimension line carrying its spec. title fills the title block.
    spec(t, d, parts, title = 'ASSEMBLY', heading = '') {
      sheet(t, title);
      if (heading) T_(heading, 90, 110, { font: 'MONOB', size: 44, align: 'left', reveal: prog(t, .1, .8) });
      const total = parts.reduce((a, p) => a + (p.w || 1), 0), span = W - 360, y = 470, h = 150;
      let x = 180; const per = (d - 1.2) / parts.length;
      parts.forEach((pt, i) => {
        const w = span * (pt.w || 1) / total, p = prog(t, .3 + i * per, .3 + i * per + per * .8);
        rect(x + 6, y - h / 2, w - 12, h, p, 3);
        ln([[x + 20, y - h / 2 + 22], [x + w - 20, y - h / 2 + 22]], p, 1.2, C.faint);
        T_(pt.name, x + w / 2, y + 6, { font: 'MONOB', size: 30, alpha: clamp(p * 2 - 1), maxW: w - 40 });
        balloon(x + w / 2, y - h / 2 - 90, i + 1, p); ln([[x + w / 2, y - h / 2 - 60], [x + w / 2, y - h / 2]], p, 1.5, C.hi);
        dimH(x + 6, x + w - 6, y + h / 2 + 90 + (i % 2) * 70, pt.spec, prog(t, .3 + i * per + per * .5, .3 + (i + 1) * per + .3));
        x += w;
      });
      out(t, d);
    },
  };
})();
