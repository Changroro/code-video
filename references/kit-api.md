# kit.js API

Global scripts. `index.html` loads rough.js → kit.js → (a mini set) → main.js in that order. `window.VIDEO = { w, h, fps, dur }` sets the canvas size and length.

## Globals
- `W, H, FPS, DUR`, `ctx` (2D context), `rc` (rough canvas), `T` (current second), `IMG` (images from boot), `BG`.
- `THEME = { ink, paper, dark, light, grid, gridDark }`: change it in main.js with `Object.assign(THEME, {...})`.

## Time and math
- `prog(t, a, b)`: progress through an interval, 0..1. `E.out / E.in / E.inOut / E.back`: easing.
- `lerp`, `clamp`, `mixHex(a, b, t)` (color interpolation), `hash(a, b)`, `rnd(seed)` (deterministic random), `typed(s, p)` (substring for a typing effect).
- `bez(a, c, b, n)` / `bezAt(a, c, b, t)`: quadratic Bézier.
- `camKeys(t, [[time, cx, cy, z], ...])`: keyframed camera.

## Hand-drawn
- `ro(id, opts, rate = 10)`: rough options. Each id gets its own shape, and the wobble changes `rate` times per second. Use rate 4–5 for background grids.
- `rc.line / rectangle / circle (diameter) / ellipse / polygon / linearPath / curve / arc`: rough.js itself.
- `sketch(pts, p, id, opts)`: draw a line up to p (a drawing-on animation). `arrow(pts, p, id, opts)`.
- `circlePts(cx, cy, rx, ry)`: points for a hand-drawn circle.
- `highlight(x, y, w, h, p, id, color)`: highlighter. Over printed text, set `ctx.globalCompositeOperation = 'multiply'`.
- `wave`, `radioWaves`, `shadow(x, y, w, dark)`.

## Text
- `text(s, x, y, { font, weight, size, color, align, base, rot, alpha, reveal, outline, ow, jit, maxW })`.
  - `reveal`: reveal from the left (0..1).
  - `outline`: an outline in the background color for readability over busy backgrounds.
  - `maxW`: shrink when the text is wider.
  - `jit`: hand-drawn wobble (false for numbers and HUD).
- `measure(s, font, size, weight)`.

## Camera and transitions
- `cam(z, cx, cy, rot, sx, sy)`: call after `ctx.save()` and close with `ctx.restore()`. World point (cx, cy) goes to the screen center at zoom z. The visible range is cx ± W/2/z.
- `shake(amp, id)` → [sx, sy]. `flash(a, color)`, `speedLines(amt, color)`, `zoomLines(amt, color, cx, cy)`, `inkBand(x0, x1, color)`.

## Backgrounds
- `paperBG()`, `darkBG()`: textured backgrounds built from THEME at boot (fixed to the screen, which compresses well).
- `grid(dark, step)`: hand-drawn grid like a chart or graph paper (world coordinates, call inside the camera).

## Sprites
- `drawPixels(rows, pal, x, y, s, { flip, sx, sy, rot, outline, alpha, swap })`: anchored at the bottom center. rows is an array of strings where '.' is empty; pal maps a character to a color or to (x, y) => color.
- `MINIS`, `drawMini(key, x, y, s, { blink, outline, flip, sx, sy, rot, alpha })`: the mini cast. Register with `Object.assign(MINIS, { key: { name, color, body, pal, rows } })`. `E` pixels switch to the `body` color while blinking, and `C` pixels blink by themselves. `minis-ai.js` is a ready-made AI set.
- `pixelImage(img, cx, cy, w, h, px)`: draw an image (such as a logo) as px-sized blocks. Raising px from 1 turns the logo into 8-bit step by step.

## Boot
```js
boot({
  scenes: [[start, end, fn], ...],        // fn(t) - t is seconds since the scene started
  images: { logo: 'assets/logo.png' },    // → IMG.logo
  fonts: [['PRE', 'Aa'], ['PIX', 'A']],   // @font-face name and sample characters
  noise: 6,                               // background noise (higher means larger files)
  setup: () => { /* pre-render offscreen canvases after fonts load */ },
});
```
`?t=12.3` previews one frame, and `?play` plays in real time.

## Render
- `node render.mjs stills 1.2 3.4 ...` → `stills/t<seconds>.png`
- `CRF=25 WORKERS=4 node render.mjs video out.mp4` → H.264, yuv420p, faststart. About 2–3 minutes and about 8 MB for 30 s at 1080p.
