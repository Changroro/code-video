# kit.js API

Global scripts. `index.html` loads rough.js → kit.js → (a mini set, one style module, or one look module) → main.js in that order. The look modules and their shared scene API are in [looks.md](looks.md). `window.VIDEO = { w, h, fps, dur, blur, shutter }` sets the canvas size, length, and optional motion blur.

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
- `useFonts([[family, 'assets/fonts/file.ttf'], ...])`: load font files at boot without `@font-face` (look modules pass `LOOK.fonts`).
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

## UI props and motion blur
- `rr(x, y, w, h, r)`: begins a rounded-rectangle path (then `ctx.fill()` / `ctx.stroke()`).
- `phone(x, y, h, draw, { body, rim, screen, shadow })`: a phone of height h centred at (x, y); `draw(sx, sy, sw, sh)` paints the screen, clipped. Returns the screen box.
- `cursor(x, y, press, color, s)`: a pointer with its tip at (x, y); `press` 0..1 squeezes it for a click.
- `window.VIDEO.blur = n`: each frame averages n subframes spread over `VIDEO.shutter` (default .5) of a frame, for real motion blur on whips and push cuts. It costs n times the render time; the beat format uses `{ fps: 60, blur: 3 }`.

## Video clips (beat format)
- Put footage in `assets/clips/<id>/0001.jpg ...` (see `references/styles/beat.md`) and register it with `boot({ clips: { id: { n: frameCount, fps: 30 } } })`.
- `clip(id, t, x, y, w, h, { alpha })`: draws the clip's frame at t seconds, cover-fit into the box. Frames load on demand; `renderFrame` redraws once they arrive, and a missing file stops the render.

## Style modules (credited looks and formats)
Load one after `kit.js`. Each exposes a colour/font object you can set from the research before boot, and draws the original's signature pieces. The guides say which piece fulfils which signature item.

### `handdrawn.js` (default look, [styles/handdrawn.md](styles/handdrawn.md))
`HD = { ink, paper, dark, light, accent, muted, tag, serif, script, pix, mono, sans }`.
- `hdPaper()`, `hdDark()`: plain paper and the dark card background. `horizon(y, id, { x0, x1, p, tufts })`, `tuft(x, y, id)`, `cloud(x, y, s, id)`.
- `worldTag('WORLD 1-2')`, `worldCard(world, title, p, { bg, accent })`.
- `introCard(t, { pre, name, accent, sub }, { size, y })`: the dark serif title card; the name types in and the accent part gets a hand underline.
- `countUp(to, p, { from, decimals, prefix, suffix })` → string. `serifStat(value, label, note, x, y, p, o)`.
- `hatchBars(items, { x, y, w, h, p, max, id })` with items `{ label, v, text, hi }`; returns the bar tops (to stand a mascot on).
- `hiScore(title, sub, rows, p, { hi, mini, record })`, `priceTag(x, y, oldV, newV, p, id)`, `docGrid(n, cols, done, p, { x, y, miss })`, `strikeList(lines, x, y, p)`.
- `paperTear(p, color, dir)`: torn-paper transition. `zzz(x, y, t)`, `burst(x, y, r, p, color, id)`.

### `motion.js` (brand motion graphics, [styles/motion.md](styles/motion.md))
`MO = { bg, ink, dim, accent, pain, cyan, font, mono }`.
- `moBG()`: the flat dark field.
- `icon(name, x, y, s, p, id, color, width)`: line icons from `MO_ICONS` (clock, book, eye, wallet, cash, camera, mic, check, faucet, bulb, chat, search, lock, chart, user, gear, star); add more as polylines in a 100-unit box.
- `scribble(x, y, w, h, p, id)`, `swoosh(x, y, w, p, id)`: hand-drawn emphasis on type.
- `meter(label, v, x, y, w, color)`: the frustration gauge.
- `lineBars(title, items, { x, y, w, h, p })`: hatched pain bars and one accent bar.
- `linePhone(x, y, h, p, id, draw)`, `askBubble(s, x, y, w, p, id)`, `replyBubble(s, x, y, w, p)`.
- `pills(items, cx, y, maxW, p, active, size)`, `ctaButton(label, x, y, t, clickAt, { note, url })`, `wordmark(name, x, y, size, p)`.

### `sand.js` (sand art, [styles/sand.md](styles/sand.md))
Pass `setup: sandSetup` to `boot`. `SAND = { lit, edge, ink, serif, serifItalic, grainSize, tableGrain, edgeGrain }`; set colours before `sandSetup` runs.
- `sandClear()` → an empty offscreen layer. Draw silhouettes and text into it (with `withCtx`); alpha is the sand density.
- `sandFrame(reveal, sweep, dir, { scatter, wind, light })`: composites the layer onto the table. `reveal` 0..1 pours the sand in patchily; `sweep` 0..1 pushes it off along `dir = [dx, dy]`; `scatter` 0..1 breaks the picture into grains that blow away; `light` scales the table.
- `sandRays(g, cx, cy, p, { n, haze, sun })`: a sunburst carved into a haze of sand. `sandCut(g, fn)`: carve light out (moon, stars, windows). `sandYear(g, year, sub, { corner, size })`: the serif year and italic caption.

### `lyric.js` (lyric music video, [styles/lyric.md](styles/lyric.md))
`LY = { bg, grid, ink, dim, faint, card, accents, sans, mono }`.
- `lyFrame({ section, detail, title, progress, accent })`: the dark grid frame with the section label, title, progress line, and lyric hairline.
- `lyLine(syl, t)`, `lyWords(line, start, step)` → syllables on a beat grid.
- `lyNode(x, y, w, h, label, sub, p, { color, size, glow })`, `lyLink(pts, p, color)`, `probBars(x, y, w, rows, p, { color, title, sub })`, `codeBox(x, y, w, lines, p, { color, label })`, `bigValue(s, x, y, p, { color, size, label, boxed })`.
- `lyTitle(name, sub, about, song, p, { color, kind })`, `chorusColor(n)`.

### `beat.js` (beat-synced footage, [styles/beat.md](styles/beat.md))
`BT = { light, glow, dark, floor, ink, inkLight, dim, accent, ok, font, mono }`.
- `stageLight(t)`, `stageDark(glow)`.
- `beatWords([[word, time], …], x, y, t, o)`: words land on their beats; `'■'` is the masked accent block, and its box is returned.
- `appWindow(x, y, w, h, { title })` → content box, `field(x, y, w, s, p)`, `pillButton(label, x, y, { press })`.
- `clipWall(ids, t, { cols, rows, scan, winners, tags, caption })`, `carousel(ids, t, spin, { R, cardH, n })`, `phoneClip(id, t, x, y, h, { caption })`, `campaignPanel(x, y, t, { toggles, clickAt, flipAt, result })`.
- `scoreRows(rows, x, y, t, { label })`, `pushStat(value, label, t, { at })`, `ticker([[word, time], …], t, { sub })`.

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
- `CRF=25 WORKERS=4 node render.mjs video out.mp4` → H.264, yuv420p, faststart, at the size and fps in `window.VIDEO`. Frames are captured as JPEG (2–3× faster than PNG, visually identical after H.264); `CAPTURE=png` forces lossless capture. About 1–2 minutes and about 8 MB for 30 s at 1080p; more workers than 4 usually slows Chrome down.
- `QUERY=lang=ko node render.mjs …` appends `?lang=ko` to the page URL, for rendering two versions from one `main.js`.
- If `audio.wav` exists in the work folder, the video gets an AAC track normalised to -14 LUFS.

## Sound
- `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`: synthesized music (pad, bass, arpeggio, drums by section energy) and effects (`whoosh`, `pop`, `click`, `chime`, `ping`, `thud`, `sand`, `wave`, `type`) at cue times. The schema is in the script's docstring. With `"song"` set, a licensed track replaces the synthesized music.
- `uv run --with librosa python <skill>/scripts/beats.py song.mp3 [offset] > beats.json`: BPM, beats, downbeats, and the drop, for cutting on the beat.
