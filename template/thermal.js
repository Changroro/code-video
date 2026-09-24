'use strict';
// Look: thermal receipt printer. Each scene prints a fresh slip that rises out of a printer and is torn off at the end.
// Same scene API as every look module (see references/looks.md). Works in 16:9 and 9:16.
const LOOK = (() => {
  const C = { table: '#2e5b5f', table2: '#3c7277', paper: '#f6f3ea', ink: '#2c3038', stamp: '#d23a3a', shop: 'PROMO PRINT' };
  // landscape frames get a bigger slip so the paper fills the screen
  const K = () => (W > H ? 1.3 : 1), PW = () => Math.min(820 * K(), W - 160), LH = 58;
  const px0 = () => (W - PW()) / 2, slot = () => H - 150;
  const txt = (s, x, y, o = {}) => text(s, x, y, { font: 'MONO', color: C.ink, jit: false, ...o, size: (o.size || 34) * K() });
  function table() {
    const g = ctx.createRadialGradient(W / 2, H * .45, 100, W / 2, H * .5, Math.max(W, H) * .8);
    g.addColorStop(0, C.table2); g.addColorStop(1, C.table); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function printer() {
    const y = slot() - 20, w = PW() + 220;
    ctx.save(); ctx.fillStyle = '#1d2024'; ctx.beginPath(); ctx.roundRect((W - w) / 2, y, w, 400, 44); ctx.fill();
    ctx.fillStyle = '#0c0d0f'; ctx.fillRect(px0() - 20, y + 26, PW() + 40, 22);
    ctx.fillStyle = Math.floor(T * 3) % 2 ? '#56f08c' : '#2f8a52'; ctx.beginPath(); ctx.arc((W + w) / 2 - 60, y + 100, 12, 0, TAU); ctx.fill();
    ctx.restore();
    txt(C.shop, (W - w) / 2 + 60, y + 100, { font: 'MONOB', size: 30, color: '#8d939b', align: 'left' });
  }
  // lines: [kind, a, b]; kinds: head, big, row, item, sep, dsep, center, small, barcode
  function slip(lines, t, d, stampText) {
    table();
    const at = []; { let s = .15; for (const l of lines) { at.push(s); s += l[0].includes('sep') ? .16 : l[0] === 'big' ? .45 : .3; } }
    const shown = i => clamp((t - at[i]) / .16);
    let fed = 50; lines.forEach((l, i) => { fed += (l[0] === 'big' ? LH * 1.8 : LH) * K() * shown(i); });
    const tear = prog(t, d - .45, d);
    const lift = E.in(tear) * (H + fed);
    const top = slot() - fed - lift, x0 = px0(), w = PW();
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; ctx.fillStyle = C.paper;
    ctx.beginPath(); ctx.moveTo(x0, top); for (let x = x0; x <= x0 + w; x += 20) ctx.lineTo(x, top + (x / 20 % 2 ? 10 : 0));
    const bot = tear > 0 ? slot() - lift : slot() + 30;
    ctx.lineTo(x0 + w, bot); if (tear > 0) for (let x = x0 + w; x >= x0; x -= 20) ctx.lineTo(x, bot - (x / 20 % 2 ? 10 : 0)); else ctx.lineTo(x0, bot);
    ctx.closePath(); ctx.fill(); ctx.restore();
    let y = top + 70 * K(), lastY = 0;
    const L = x0 + 40, Rr = x0 + w - 40;
    lines.forEach((l, i) => {
      const a = shown(i); if (a <= 0) return;
      const o = { alpha: a * .92 };
      const dash = eq => { ctx.save(); ctx.globalAlpha = a * .8; ctx.fillStyle = C.ink; for (let x = L; x < Rr; x += eq ? 18 : 26) { ctx.fillRect(x, y - (eq ? 4 : 1), 12, 3); if (eq) ctx.fillRect(x, y + 3, 12, 3); } ctx.restore(); };
      switch (l[0]) {
        case 'head': txt(l[1], W / 2, y, { ...o, font: 'MONOB', size: 46, maxW: w - 80 }); break;
        case 'big': y += LH * .4 * K(); txt(l[1], W / 2, y, { ...o, font: 'MONOB', size: 76, maxW: w - 80 }); y += LH * .4 * K(); break;
        case 'center': txt(l[1], W / 2, y, { ...o, size: 30, maxW: w - 80 }); break;
        case 'small': txt(l[1], W / 2, y, { ...o, size: 24, maxW: w - 80 }); break;
        case 'row': txt(l[1], L, y, { ...o, align: 'left', maxW: (w - 80) * .62 }); txt(l[2], Rr, y, { ...o, align: 'right', font: 'MONOB' }); break;
        case 'item': txt(`[${l[2] ? 'x' : ' '}] ${l[1]}`, L, y, { ...o, align: 'left', size: 36, maxW: w - 80 }); break;
        case 'sep': dash(false); break;
        case 'dsep': dash(true); break;
        case 'blank': break;
        case 'barcode': { const r = rnd(77); let x = L + 60; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.ink; while (x < Rr - 60) { const bw = 2 + Math.floor(r() * 4) * 2; ctx.fillRect(x, y - 24, bw, 48); x += bw + 3 + Math.floor(r() * 3) * 2; } ctx.restore(); break; }
      }
      lastY = y; y += LH * K();
    });
    printer();
    if (stampText) stamp(stampText, prog(t, at[at.length - 1] + .3, at[at.length - 1] + .7) * (1 - tear), W > H ? slot() - 200 : lastY - LH * .6);
  }
  function stamp(s, p, y) {
    if (p <= 0) return;
    const sc = 1.8 - .8 * E.out(clamp(p * 1.4)), w = Math.max(360, measure(s, 'STAMP', 58) + 90);
    // landscape: stamp beside the slip; portrait: over its lower part
    ctx.save(); ctx.translate(W > H ? W / 2 + PW() / 2 + 60 : W / 2, W > H ? y - 160 : y); ctx.rotate(-.12); ctx.scale(sc, sc); ctx.globalAlpha = clamp(p * 2) * .85;
    ctx.strokeStyle = C.stamp; ctx.lineWidth = 9; ctx.beginPath(); ctx.roundRect(-w / 2, -60, w, 120, 22); ctx.stroke();
    text(s, 0, 4, { font: 'STAMP', size: 58, color: C.stamp, jit: false });
    ctx.restore();
  }
  // wrap long commands onto several receipt lines at spaces
  const wrap = (s, n = 26) => { const out = []; let cur = ''; for (const w of s.split(' ')) { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } if (cur) out.push(cur); return out; };

  return {
    colors: C,
    date: null, // set a date string for the header, e.g. '2026.09.24'
    fonts: [['MONO', 'assets/fonts/NanumGothicCoding-Regular.ttf'], ['MONOB', 'assets/fonts/NanumGothicCoding-Bold.ttf'], ['STAMP', 'assets/fonts/BlackHanSans-Regular.ttf']],
    hook(t, d, lines) {
      slip([['center', '★ NOTICE ★'], ['sep'], ...lines.map(s => ['head', s]), ['sep']], t, d);
    },
    title(t, d, name, tagline) {
      slip([['center', this.date || C.shop], ['dsep'], ['big', name], ['center', tagline], ['dsep'], ['barcode']], t, d);
    },
    steps(t, d, items) {
      const done = i => t > .5 + i * ((d - 1.4) / items.length) + .6;
      slip([['center', 'ORDER'], ['sep'], ...items.map((s, i) => ['item', `${i + 1}. ${s}`, done(i)]), ['sep']], t, d);
    },
    stat(t, d, value, label, note) {
      slip([['center', 'TOTAL'], ['dsep'], ['big', value], ['center', label], ...(note ? [['small', note]] : []), ['dsep']], t, d);
    },
    ending(t, d, e) {
      const lines = [['center', '감사합니다'], ['sep']];
      if (e.cmd) wrap(e.cmd).forEach(s => lines.push(['small', s]));
      if (e.url) lines.push(['sep'], ['small', e.url]);
      lines.push(['barcode']);
      slip(lines, t, d + 10, e.note);
    },
    // signature format: a whole receipt. lines = [[kind, left, right], ...] with the kinds listed on slip();
    // pass keep = true to leave it on the table instead of tearing it off at the end.
    receipt(t, d, lines, stampText, keep = false) {
      slip(lines, t, keep ? d + 10 : d, stampText);
    },
  };
})();
