'use strict';
// Sand art on a backlit light table. Load after kit.js and call sandSetup() from boot({ setup }).
// Per frame: draw the scene's silhouettes and captions into the layer returned by sandClear()
// (any colour; alpha = how much sand), then sandFrame(reveal, sweep) pours or sweeps it onto the table.
const SAND = { lit: '#f6c778', edge: '#8a5424', ink: '#3b2413', table: null, g: null, noise: null, grain: null };

function sandSetup() {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  SAND.g = c.getContext('2d', { willReadFrequently: true });
  // low-frequency noise (a tiny random image scaled up smoothly) shapes the pour and sweep edges
  const sw = Math.ceil(W / 24), sh = Math.ceil(H / 24), small = document.createElement('canvas');
  small.width = sw; small.height = sh;
  const sg = small.getContext('2d'), im = sg.createImageData(sw, sh), r = rnd(11);
  for (let i = 0; i < im.data.length; i += 4) { im.data[i] = im.data[i + 1] = im.data[i + 2] = r() * 255; im.data[i + 3] = 255; }
  sg.putImageData(im, 0, 0);
  const big = document.createElement('canvas'); big.width = W; big.height = H;
  const bg = big.getContext('2d', { willReadFrequently: true });
  bg.imageSmoothingQuality = 'high'; bg.drawImage(small, 0, 0, W, H);
  const lf = bg.getImageData(0, 0, W, H).data;
  SAND.noise = new Float32Array(W * H); SAND.grain = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) { SAND.noise[i] = lf[i * 4] / 255; SAND.grain[i] = r() - .5; }
  // the glowing table: warm centre, darker rim
  const t = document.createElement('canvas'); t.width = W; t.height = H;
  const tg = t.getContext('2d'), gr = tg.createRadialGradient(W / 2, H * .45, H * .1, W / 2, H / 2, Math.hypot(W, H) * .6);
  gr.addColorStop(0, SAND.lit); gr.addColorStop(1, SAND.edge);
  tg.fillStyle = gr; tg.fillRect(0, 0, W, H);
  SAND.table = t;
}

function sandClear() {
  SAND.g.setTransform(1, 0, 0, 1, 0, 0); SAND.g.globalAlpha = 1;
  SAND.g.clearRect(0, 0, W, H);
  return SAND.g;
}

// reveal 0..1: sand pours in, patchy at first. sweep 0..1: a hand pushes it off along dir = [dx, dy],
// leaving a ridge at the front. Both use the same noise so edges look like real sand.
function sandFrame(reveal = 1, sweep = 0, dir = [1, 0]) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(SAND.table, 0, 0); ctx.restore();
  const d = SAND.g.getImageData(0, 0, W, H).data, out = ctx.getImageData(0, 0, W, H), o = out.data;
  const ink = [1, 3, 5].map(k => parseInt(SAND.ink.substr(k, 2), 16));
  const n = SAND.noise, gr = SAND.grain, front = sweep * 1.5 - .25, mag = Math.hypot(dir[0], dir[1]) || 1;
  const dx = dir[0] / mag, dy = dir[1] / mag, off = (dx < 0 ? -dx : 0) + (dy < 0 ? -dy : 0);
  for (let y = 0, i = 0; y < H; y++) {
    for (let x = 0; x < W; x++, i++) {
      const j = i * 4;
      let a = d[j + 3] / 255;
      if (a > 0) a *= clamp((reveal * 1.3 - n[i]) * 5);
      if (sweep > 0) {
        const s = (x / W) * dx + (y / H) * dy + off + (n[i] - .5) * .18;
        if (s < front) a = 0;
        else a = Math.max(a, Math.exp(-(((s - front) / .025) ** 2)) * .75 * (sweep < 1 ? 1 : 0));
      }
      a = clamp(a * (.9 + gr[i] * .6));
      const lit = 1 + gr[i] * .06;
      o[j] = (o[j] * lit) * (1 - a) + ink[0] * a;
      o[j + 1] = (o[j + 1] * lit) * (1 - a) + ink[1] * a;
      o[j + 2] = (o[j + 2] * lit) * (1 - a) + ink[2] * a;
    }
  }
  ctx.putImageData(out, 0, 0);
}
