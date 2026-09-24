'use strict';
// Look: green phosphor CRT terminal. Same scene API as every look module (see references/looks.md).
const LOOK = (() => {
  const C = { bg: '#031208', text: '#46ff8a', dim: 'rgba(70,255,138,.45)', accent: '#ffc24a', prompt: 'user@studio' };
  let FS = 38, LH = 56;
  const X0 = 150, Y0 = 150;
  function glow(s, x, y, color = C.text, size = FS, font = 'MONO', blur = 14, align = 'left') {
    if (!s) return;
    ctx.save(); ctx.font = `${size}px ${font}`; ctx.textBaseline = 'middle'; ctx.textAlign = align;
    ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.fillStyle = color; ctx.fillText(s, x, y);
    ctx.shadowBlur = 0; ctx.fillText(s, x, y); ctx.restore();
  }
  const mw = (s, size = FS, font = 'MONO') => measure(s, font, size);
  function cursor(x, y) { if (Math.floor(T * 2.4) % 2 === 0) { ctx.save(); ctx.shadowColor = C.text; ctx.shadowBlur = 14; ctx.fillStyle = C.text; ctx.fillRect(x + 2, y - FS * .5, FS * .55, FS); ctx.restore(); } }
  function prompt(y) { glow(C.prompt, X0, y, C.accent); glow(':~$', X0 + mw(C.prompt), y); return X0 + mw(C.prompt + ':~$ '); }
  // a command typed at 26 chars/s starting at `at`; returns the time typing ends
  function cmd(s, y, t, at) {
    const x = prompt(y), shown = typed(s, (t - at) * 26 / Math.max(1, [...s].length));
    glow(shown, x, y);
    if (shown.length < s.length || Math.floor(T * 2.4) % 2) cursor(x + mw(shown), y);
    return at + [...s].length / 26;
  }
  // 5x7 block font for banners (Latin, digits, a few symbols)
  const G = 'A:01110100011000111111100011000110001|B:11110100011000111110100011000111110|C:01111100001000010000100001000001111|D:11110100011000110001100011000111110|E:11111100001000011110100001000011111|F:11111100001000011110100001000010000|G:01111100001000010111100011000101111|H:10001100011000111111100011000110001|I:01110001000010000100001000010001110|J:00111000100001000010000101001001100|K:10001100101010011000101001001010001|L:10000100001000010000100001000011111|M:10001110111010110101100011000110001|N:10001110011010110011100011000110001|O:01110100011000110001100011000101110|P:11110100011000111110100001000010000|Q:01110100011000110001101011001001101|R:11110100011000111110101001001010001|S:01111100001000001110000010000111110|T:11111001000010000100001000010000100|U:10001100011000110001100011000101110|V:10001100011000110001100010101000100|W:10001100011000110101101011010101010|X:10001100010101000100010101000110001|Y:10001100010101000100001000010000100|Z:11111000010001000100010001000011111|0:01110100011001110101110011000101110|1:00100011000010000100001000010001110|2:01110100010000100010001000100011111|3:11110000010000101110000010000111110|4:00010001100101010010111110001000010|5:11111100001111000001000011000101110|6:01110100001000011110100011000101110|7:11111000010001000100010000100001000|8:01110100011000101110100011000101110|9:01110100011000101111000010000101110|-:00000000000000011111000000000000000|.:00000000000000000000000000110001100| :00000000000000000000000000000000000|/:00001000010001000100010001000010000|×:00000100010101000100010101000100000|+:00000001000010011111001000010000000';
  const GLYPH = Object.fromEntries(G.split('|').map(g => [g[0], g.slice(2)]));
  function banner(s, cx, y, maxW, p, color = C.text) {
    const up = s.toUpperCase();
    if (![...up].every(ch => GLYPH[ch])) { glow(s, cx - mw(s, 96, 'MONOB') / 2, y + 60, color, 96, 'MONOB', 22); return 140; }
    const c = Math.max(6, Math.min(28, Math.floor(maxW / (up.length * 6))));
    const x0 = cx - up.length * 6 * c / 2;
    ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 20; ctx.fillStyle = color;
    [...up].forEach((ch, i) => { const g = GLYPH[ch]; for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) if (g[r * 5 + k] === '1' && prog(p, (i * 7 + r) / (up.length * 7) * .8, (i * 7 + r) / (up.length * 7) * .8 + .2) > 0) ctx.fillRect(x0 + (i * 6 + k) * c, y + r * c, c - Math.max(2, c / 6), c - Math.max(2, c / 6)); });
    ctx.restore();
    return 7 * c;
  }
  function crt(t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
    const r = rnd(hash(Math.floor(T * 30), 3));
    ctx.fillStyle = `rgba(70,255,138,${.015 + r() * .02})`; ctx.fillRect(0, 0, W, H);
    const band = (T * 180) % (H + 200) - 100;
    const g = ctx.createLinearGradient(0, band - 80, 0, band + 80); g.addColorStop(0, 'rgba(70,255,138,0)'); g.addColorStop(.5, 'rgba(70,255,138,.05)'); g.addColorStop(1, 'rgba(70,255,138,0)');
    ctx.fillStyle = g; ctx.fillRect(0, band - 80, W, 160);
    const v = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.8)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.roundRect(24, 20, W - 48, H - 40, 90); ctx.fill('evenodd');
    ctx.restore();
  }
  const bg = () => { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); };
  // screen-clear between scenes: a quick roll of the picture
  const out = (t, d) => { if (t > d - .2) { const q = prog(t, d - .2, d); ctx.save(); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H * q); ctx.restore(); } };

  return {
    colors: C,
    fonts: [['MONO', 'assets/fonts/NanumGothicCoding-Regular.ttf'], ['MONOB', 'assets/fonts/NanumGothicCoding-Bold.ttf']],
    hook(t, d, lines) {
      bg();
      const on = prog(t, 0, .45);
      glow('BOOT ........................ ok', X0, Y0, C.dim, 30);
      lines.forEach((s, i) => { const a = .6 + i * 1.0; if (t < a) return; glow(typed(s, (t - a) * 18 / [...s].length), X0, 400 + i * 110, i === lines.length - 1 ? C.accent : C.text, 72, 'MONOB', 20); });
      cursor(X0, 400 + lines.length * 110);
      crt(t);
      if (on < 1) { ctx.save(); ctx.fillStyle = '#000'; const h = H * E.out(on) / 2; ctx.fillRect(0, 0, W, H / 2 - h); ctx.fillRect(0, H / 2 + h, W, H / 2 - h); ctx.restore(); }
      out(t, d);
    },
    title(t, d, name, tagline) {
      bg();
      const end = cmd('./intro', Y0, t, .1);
      const h = banner(name, W / 2, 330, W - 320, prog(t, end + .1, end + 1.3));
      if (t > end + 1.3) glow(tagline, W / 2, 330 + h + 110, C.accent, 52, 'MONOB', 16, 'center');
      crt(t); out(t, d);
    },
    steps(t, d, items) {
      bg();
      const end = cmd('make video', Y0, t, .1), per = (d - end - 1) / items.length;
      items.forEach((s, i) => {
        const a = end + .2 + i * per; if (t < a) return;
        const y = Y0 + 120 + i * 90, done = t > a + per * .7;
        glow(`[${i + 1}/${items.length}]`, X0, y, C.dim);
        glow(s, X0 + 180, y, C.text, 44, 'MONOB');
        glow(done ? '[ OK ]' : '[ .. ]', W - 360, y, done ? C.accent : C.dim);
      });
      // progress bar
      const p = clamp((t - end - .2) / (per * items.length));
      const y = Y0 + 150 + items.length * 90;
      ctx.save(); ctx.strokeStyle = C.text; ctx.lineWidth = 3; ctx.shadowColor = C.text; ctx.shadowBlur = 10; ctx.strokeRect(X0, y, W - 2 * X0 - 60, 40);
      ctx.fillStyle = C.text; for (let k = 0; k < Math.floor(p * 60); k++) ctx.fillRect(X0 + 8 + k * ((W - 2 * X0 - 76) / 60), y + 8, (W - 2 * X0 - 76) / 60 - 6, 24); ctx.restore();
      glow(Math.round(p * 100) + '%', W - X0 - 40, y + 20, C.accent, 34, 'MONO', 12, 'right');
      crt(t); out(t, d);
    },
    stat(t, d, value, label, note) {
      bg();
      const end = cmd('stats --summary', Y0, t, .1);
      const h = banner(value, W / 2, 330, W - 500, prog(t, end + .1, end + 1), C.accent);
      if (t > end + 1) glow(label, W / 2, 330 + h + 100, C.text, 50, 'MONOB', 16, 'center');
      if (note && t > end + 1.5) glow(note, W / 2, 330 + h + 180, C.dim, 34, 'MONO', 10, 'center');
      crt(t); out(t, d);
    },
    ending(t, d, e) {
      bg();
      let end = .1, y = Y0;
      if (e.cmd) { end = cmd(e.cmd, y, t, .1); y += LH * 2; }
      if (e.url && t > end + .3) glow(e.url, X0, y, C.accent, 40, 'MONOB');
      if (e.note && t > end + .8) glow(e.note, X0, y + LH * 1.5, C.dim, 32);
      if (t > end + 1.4) { const x = prompt(y + LH * 3.5); glow(typed('exit', (t - end - 1.4) * 8), x, y + LH * 3.5); }
      crt(t);
    },
    // signature format: a terminal session. entries = [[kind, text], ...]
    // kinds: cmd (typed at a prompt), out, ok (OK tag), wait (dim, with a spinner), note (amber), blank
    session(t, d, entries) {
      bg();
      const keep = [FS, LH]; [FS, LH] = [46, 68];
      const rows = Math.floor((H - Y0 - 120) / LH);
      let at = .2; const timed = entries.map(([k, s]) => { const a = at; at += k === 'cmd' ? [...s].length / 26 + .35 : k === 'blank' ? .1 : .45; return [a, k, s]; });
      const vis = timed.filter(([a]) => t >= a), start = Math.max(0, vis.length - rows);
      vis.slice(start).forEach(([a, k, s], i) => {
        const y = Y0 + i * LH;
        if (k === 'cmd') { const x = prompt(y), shown = typed(s, (t - a) * 26 / Math.max(1, [...s].length)); glow(shown, x, y); if (i === vis.length - 1 - start) cursor(x + mw(shown), y); }
        else if (k === 'ok') { glow('OK', X0, y, C.accent, FS, 'MONOB'); glow(s, X0 + 80, y); }
        else if (k === 'wait') { const done = vis.length - 1 - start > i; glow(done ? '·' : '|/-\\'[Math.floor(T * 12) % 4], X0, y, C.dim); glow(s, X0 + 80, y, C.dim); }
        else if (k === 'note') glow(s, X0, y, C.accent, FS, 'MONOB');
        else if (k === 'out') glow(s, X0, y);
      });
      [FS, LH] = keep;
      crt(t); out(t, d);
    },
  };
})();
