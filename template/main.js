'use strict';
// Scene skeleton. Every scene gets local time t (seconds since the scene started).
function sHook(t) {
  ctx.fillStyle = '#f5f3ee'; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = Math.min(1, t / .6);
  ctx.fillStyle = '#2f2f2f'; ctx.font = '140px PRE'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('HEADLINE', W / 2, H / 2);
}

function sFinale(t) {
  ctx.fillStyle = '#191919'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f3f3ef'; ctx.font = '160px PRE'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Brand', W / 2, H / 2);
}

boot({
  scenes: [[0, 3, sHook], [3, VIDEO.dur, sFinale]],
  images: {},
  fonts: [['PRE', '가A']],
});
