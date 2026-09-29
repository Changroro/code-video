'use strict';
// Render contract for render.mjs: renderFrame(f) must draw the same pixels for the same f.
const VIDEO = Object.assign({ w: 1920, h: 1080, fps: 30, dur: 30 }, window.VIDEO || {});
const W = VIDEO.w, H = VIDEO.h, FPS = VIDEO.fps, DUR = VIDEO.dur;
const cv = document.getElementById('c');
cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
let T = 0;
const IMG = {};

let SCENES = [];
function drawAt(t) {
  T = Math.min(Math.max(t, 0), DUR - 1e-6);
  const [a, , fn] = SCENES.find(([, b]) => T < b) ?? SCENES[SCENES.length - 1];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  ctx.save(); fn(T - a); ctx.restore();
}
// window.VIDEO.blur = n averages n subframes spread over VIDEO.shutter (default .5) of a frame: real motion blur, n times the render cost
const ACC = document.createElement('canvas');
async function renderFrame(f) {
  const n = VIDEO.blur | 0;
  if (n < 2) return drawAt(f / FPS);
  if (ACC.width !== W) { ACC.width = W; ACC.height = H; }
  const g = ACC.getContext('2d'), sh = VIDEO.shutter ?? .5;
  for (let i = 0; i < n; i++) {
    drawAt((f + (i / (n - 1) - .5) * sh) / FPS);
    g.globalAlpha = 1 / (i + 1); g.drawImage(cv, 0, 0);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(ACC, 0, 0);
}
// fonts: [[family, sampleText]]; images: {key: path}
async function boot({ scenes, images = {}, fonts = [], setup = null }) {
  SCENES = scenes;
  for (const [k, src] of Object.entries(images)) { const im = new Image(); im.src = src; await im.decode(); IMG[k] = im; }
  // load every declared face up front: a bold face loaded on first use would draw that frame in a fallback font
  await Promise.all([...document.fonts].map(f => f.load()));
  await Promise.all(fonts.map(([f, sample]) => document.fonts.load(`40px ${f}`, sample)));
  if (setup) await setup();
  window.READY = true;
  const q = new URLSearchParams(location.search);
  if (q.has('t')) renderFrame(Math.round(+q.get('t') * FPS));
  else if (q.has('play')) {
    const t0 = performance.now();
    const loop = () => { renderFrame(Math.floor((performance.now() - t0) / 1000 * FPS) % (FPS * DUR)); requestAnimationFrame(loop); };
    loop();
  }
}
