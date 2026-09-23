'use strict';
// Scene skeleton. Every scene gets local time t (seconds since the scene started).
// Replace the scenes and keep the boot() contract. Patterns: references/storyboard.md.
Object.assign(THEME, { ink: '#2f2f2f', paper: '#f5f3ee', dark: '#191919', light: '#f3f3ef' });

function sHook(t) {
  paperBG();
  ctx.save(); cam(1 + t * .03, W / 2, H / 2);
  grid();
  sketch(circlePts(W / 2, H / 2, 300), prog(t, 0, .6), 101, { strokeWidth: 6 });
  ctx.restore();
  text('HEADLINE', W / 2, H / 2, { font: 'PRE', size: 140, reveal: E.out(prog(t, .3, .7)) });
  flash(prog(t, 2.8, 3), '#fff');
}

function sFinale(t) {
  paperBG();
  const k = E.back(prog(t, 0, .3));
  ctx.save(); ctx.translate(W / 2, H / 2 - 60); ctx.scale(k, k);
  text('Brand', 0, 0, { font: 'PRE', size: 160 });
  ctx.restore();
  text(typed('example.com', prog(t, .5, 1.2)), W / 2, H / 2 + 120, { font: 'PRE', size: 56 });
  flash(1 - prog(t, 0, .12), '#fff');
}

boot({
  scenes: [[0, 3, sHook], [3, VIDEO.dur, sFinale]],
  images: {},
  fonts: [['PRE', '가A'], ['HAND', '가'], ['PIX', 'A']],
  setup: () => {},
});
