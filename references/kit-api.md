# kit.js API

Global scripts. `index.html` loads rough.js → kit.js → (a mini set, `sand.js` for the sand style) → main.js in that order. `window.VIDEO = { w, h, fps, dur }` sets the canvas size and length.

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
- `kwords(s, x, y, p, { font, weight, size, color, colors, align })`: words pop in one after another over p = 0..1. `colors` maps a word index to a colour.
- `typeOn(s, x, y, p, o)`: typewriter with a blinking cursor. Same options as `text`.
- `karaoke(syl, x, y, t, { font, weight, size, off, on, outline, align })`: one lyric line. `syl` is `[[text, start], ...]` and `t` uses the same clock as the start times; sung syllables turn `on`.
- `withCtx(g, fn)`: run the kit's 2D helpers (`text`, `drawPixels`, paths on `ctx`) against another context, such as an offscreen layer. rough.js (`rc`) always draws on the main canvas.

## Camera and transitions
- `cam(z, cx, cy, rot, sx, sy)`: call after `ctx.save()` and close with `ctx.restore()`. World point (cx, cy) goes to the screen center at zoom z. The visible range is cx ± W/2/z.
- `shake(amp, id)` → [sx, sy]. `flash(a, color)`, `speedLines(amt, color)`, `zoomLines(amt, color, cx, cy)`, `inkBand(x0, x1, color)`.
- `circleWipe(p, color, cx, cy)`: a circle grows from (cx, cy) until it covers the screen. `wipe(p, color, dir)`: a flat panel slides in from `'right' | 'left' | 'down' | 'up'`.
- `pin(x, y, p, color, s)`: a map pin drops in and sends out a ripple.

## Backgrounds
- `paperBG()`, `darkBG()`: textured backgrounds built from THEME at boot (fixed to the screen, which compresses well).
- `grid(dark, step)`: hand-drawn grid like a chart or graph paper (world coordinates, call inside the camera).

## Sprites
- `drawPixels(rows, pal, x, y, s, { flip, sx, sy, rot, outline, alpha, swap })`: anchored at the bottom center. rows is an array of strings where '.' is empty; pal maps a character to a color or to (x, y) => color.
- `MINIS`, `drawMini(key, x, y, s, { blink, outline, flip, sx, sy, rot, alpha })`: the mini cast. Register with `Object.assign(MINIS, { key: { name, color, body, pal, rows } })`. `E` pixels switch to the `body` color while blinking, and `C` pixels blink by themselves. `minis-ai.js` is a ready-made AI set.
- `pixelImage(img, cx, cy, w, h, px)`: draw an image (such as a logo) as px-sized blocks. Raising px from 1 turns the logo into 8-bit step by step.

## Video clips (beat style)
- Put footage in `assets/clips/<id>/0001.jpg ...` (see `references/styles/beat.md`) and register it with `boot({ clips: { id: { n: frameCount, fps: 30 } } })`.
- `clip(id, t, x, y, w, h, { alpha })`: draws the clip's frame at t seconds, cover-fit into the box. Frames load on demand; `renderFrame` redraws once they arrive, and a missing file stops the render.

## Sand (sand style, `sand.js`)
Load `sand.js` after `kit.js` and pass `setup: sandSetup` to `boot`.
- `SAND.lit`, `SAND.edge`: the glowing table from centre to rim. `SAND.ink`: the sand colour. Set them before `sandSetup` runs.
- `sandClear()` → an empty offscreen layer. Draw silhouettes and text into it (with `withCtx`); alpha is the sand density.
- `sandFrame(reveal, sweep, dir)`: composites the layer onto the table. `reveal` 0..1 pours the sand in patchily; `sweep` 0..1 pushes it off along `dir = [dx, dy]` with a ridge at the front.

## Boot
```js
boot({
  scenes: [[start, end, fn], ...],        // fn(t) - t is seconds since the scene started
  images: { logo: 'assets/logo.png' },    // → IMG.logo
  fonts: [['PRE', 'Aa'], ['PIX', 'A']],   // @font-face name and sample characters
  clips: { c1: { n: 240 } },              // optional footage frame sequences
  noise: 6,                               // background noise (higher means larger files)
  setup: () => { /* pre-render offscreen canvases after fonts load */ },
});
```
`?t=12.3` previews one frame, and `?play` plays in real time.

## Render
- `node render.mjs stills 1.2 3.4 ...` → `stills/t<seconds>.png`
- `CRF=25 WORKERS=4 node render.mjs video out.mp4` → H.264, yuv420p, faststart, at the size and fps in `window.VIDEO`. About 2–3 minutes and about 8 MB for 30 s at 1080p.
- If `audio.wav` exists in the work folder, the video gets an AAC track normalised to -14 LUFS.

## Sound
- `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`: synthesized music (pad, bass, arpeggio, drums by section energy) and effects (`whoosh`, `pop`, `click`, `chime`, `ping`, `thud`, `sand`, `wave`, `type`) at cue times. The schema is in the script's docstring. With `"song"` set, a licensed track replaces the synthesized music.
- `uv run --with librosa python <skill>/scripts/beats.py song.mp3 [offset] > beats.json`: BPM, beats, downbeats, and the drop, for cutting on the beat.
